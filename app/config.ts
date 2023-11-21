export const PORT = process.env.PORT || 8000;
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const BATCH_JOB_SIZE = parseInt(process.env.BATCH_JOB_SIZE as string, 10) || 10;
export const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '* * * * *'; // default schedule - every minute
