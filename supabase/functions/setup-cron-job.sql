select
  cron.schedule(
    'cleanup-old-alerts-daily',
    '0 0 * * *', -- Run at midnight every day
    $$
    select
      net.http_post(
          url:='https://ucdahnlndirmiecyptkt.supabase.co/functions/v1/cleanup-old-alerts',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
      ) as request_id;
    $$
  );