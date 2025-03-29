import inquirer from 'inquirer';
import boxen from 'boxen';
import type { Bucket } from '@aws-sdk/client-s3';

export const inquirerAskForProceed = async (message: string): Promise<boolean> => {
  console.log(boxen(message, {
    padding: 1,
  }));

  const answerNo = 'No';
  const answers = await inquirer.prompt([
    {
      choices: [
        answerNo,
        'Yes',
      ],
      message: 'Are you sure you want to continue?',
      name: 'proceed',
      type: 'list',
    },
  ]);

  return answers.proceed !== answerNo;
};

export const inquirerAskBucketToRestore = async (buckets: (Bucket | undefined)[]): Promise<string> => {

  const answers = await inquirer.prompt([
    {
      choices: buckets.map((bucket) => (bucket?.Name
        ? bucket.Name
        : ''
      )),
      message: 'Select the backup which should be restored.',
      name: 'bucket',
      type: 'list',
    },
  ]);

  return answers.bucket;
};
