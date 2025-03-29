// Ideally executed as cron-job.

import { Readable } from 'node:stream';
import { ReadableStream } from 'node:stream/web';
import * as blobHelpers from '../helpers/blob';
import { S3Helper } from '../helpers/s3';
import { dateString } from '../helpers/date';
import config from '../config';
import mail from '../helpers/mail';
import { getErrorMessage } from '../helpers/try-catch-error';

const main = async (): Promise<void> => {

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

  try {
    const s3Helper = new S3Helper();
    const bucketName = `${dateString()}-${config.blobBackupBucketPrefix}`;

    const blobs = await blobHelpers.getAllBlobs();

    await s3Helper.createBucket(bucketName);

    await Promise.all(blobs.map(async (blob) => {
      if (blob) {
        const res = await fetch(blob.url);
        const params = {
          Body: Readable.fromWeb(res.body as ReadableStream),
          Bucket: bucketName,
          Key: blob.pathname,
        };

        if (res.body) {
          await s3Helper.addObject(params);
        }
      }
    }));

    // integrity check
    const bucketItemsCount = await s3Helper.listObjectsOfBucket(bucketName);

    if (bucketItemsCount.length !== blobs.length) {
      throw new Error(`Blob Backup failure during integrity check. Vercel blob has ${blobs.length} objects, but the backup contains ${bucketItemsCount.length}`);
    }

    const mailMessage = `Successfully backed up ${blobs.length} items from Vercel Blob to OVH S3`;

    await mail(
      '--> Backup done: Vercel Blob data to OVH S3',
      mailMessage,
      false,
    );

    console.log(mailMessage);

  } catch (error) {
    await mail(
      '--> Backup failure: Vercel Blob data to OVH S3',
      getErrorMessage(error),
      true,
    );

    console.log(error);
  }
};

export default main;

main();
