// Ideally executed as cron-job.

import dotenv from 'dotenv';
import { EJSON } from 'bson';
import { S3Helper } from '../helpers/s3';
import { DbHelper } from '../helpers/db';
import { dateString } from '../helpers/date';
import config from '../config';
import mail from '../helpers/mail';
import { getErrorMessage } from '../helpers/try-catch-error';

dotenv.config();

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

  const dbHelper = new DbHelper();

  try {
    const s3Helper = new S3Helper();

    const bucketName = `${dateString()}-${config.dbBackupBucketPrefix}`;

    await s3Helper.createBucket(bucketName);

    if (!process.env.DATABASE_NAME) {
      throw new Error('Aborting. DATABASE_NAME is not defined in env.');
    }

    const collections = await dbHelper.getCollections(process.env.DATABASE_NAME);
    let collectionBackupCount = 0;

    if (!collections) {
      throw new Error('Aborting. No collections found in db.');
    }

    for (const collection of collections) {
      const {
        collectionName,
      } = collection;

      if (!collectionName.startsWith('system.')) {
        collectionBackupCount++;
        /* eslint-disable no-await-in-loop */
        const results = await dbHelper.getContentOfCollection(collection);

        const params = {
          Body: EJSON.stringify(results),
          Bucket: bucketName,
          Key: `${collectionName}.json`,
        };

        await s3Helper.addObject(params);
        /* eslint-enable no-await-in-loop */
      }
    }

    const mailMessage = `Successfully backed up ${collectionBackupCount} colletions from MongoDb to OVH S3`;

    await mail(
      '-->> Backup done: DB on OVH to OVH S3',
      mailMessage,
      false,
    );

    console.log(mailMessage);

  } catch (error) {
    await mail(
      '--> Backup failure: DB on OVH to OVH S3',
      getErrorMessage(error),
      true,
    );

    console.log(error);
  } finally {
    dbHelper.getClient()
      ?.close();
  }
};

export default main;

main();
