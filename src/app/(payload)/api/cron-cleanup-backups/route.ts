import type { NextRequest } from 'next/server';
import cleanupBackups from '@/backup-restore/cron-jobs/backups-cleanup';

export const GET = async (request: NextRequest): Promise<Response> => {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  await cleanupBackups();

  return new Response('Cleanup backups done.');
};
