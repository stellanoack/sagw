// Ideally executed as cron-job.

// todo:
// - log deleted buckets

import { S3Helper } from '../helpers/s3';
import config from '../config';
import { sortBucketsNewestFirst } from '../helpers/date';
import mail from '../helpers/mail';
import { getErrorMessage } from '../helpers/try-catch-error';
import type { Bucket } from '@aws-sdk/client-s3';

const cleanUpBucketsWithPrefix = async (prefix: string, allBuckets: [(Bucket | undefined)?], s3Helper: S3Helper): Promise<[string?]> => {

  // If run as cron-job on vercel, make sure that only cron-jobs can execute
  // the script.
  /*
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  */

  const buckets = allBuckets.filter((bucket) => bucket?.Name?.indexOf(prefix) !== -1);
  const bucketsSorted = sortBucketsNewestFirst(buckets);
  const bucketsToDelete = JSON.parse(JSON.stringify(bucketsSorted))
    .splice(config.keepAmountOfBackups, bucketsSorted.length - config.keepAmountOfBackups);

  const promises = [];

  for (const bucketToDelete of bucketsToDelete) {
    promises.push(s3Helper.deleteBucket(bucketToDelete.Name));
  }

  await Promise.all(promises);

  if (bucketsToDelete.length === 0) {
    return [];
  }

  return [bucketsToDelete.map((bucket: Bucket) => bucket.Name)];
};

const main = async (): Promise<void> => {
  try {
    const s3Helper = new S3Helper();
    const buckets = await s3Helper.getAllBuckets();

    const deletedBlobBuckets = await cleanUpBucketsWithPrefix(config.blobBackupBucketPrefix, buckets, s3Helper);
    const deletedDbBuckets = await cleanUpBucketsWithPrefix(config.dbBackupBucketPrefix, buckets, s3Helper);

    const mailMessage = `Deleted ${deletedBlobBuckets.length} blob buckets and ${deletedDbBuckets.length} db buckets.<br><br>Deleted blob buckets: ${deletedBlobBuckets.join('<br>')}<br><br>Deleted db buckets: ${deletedDbBuckets.join('<br>')}`;

    await mail(
      '--> Backups cleanup success',
      mailMessage,
      false,
    );

    console.log('--> Backups cleanup done');

  } catch (error) {
    await mail(
      '--> Backups cleanup failure',
      getErrorMessage(error),
      true,
    );

    console.log(error);
  }
};

export default main;

main();
