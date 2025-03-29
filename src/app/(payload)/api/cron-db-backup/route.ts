import type { NextRequest } from 'next/server';
import dbBackup from '@/backup-restore/cron-jobs/blob-backup';

export const GET = async (request: NextRequest): Promise<Response> => {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  await dbBackup();

  return new Response('DB backup done.');
};
