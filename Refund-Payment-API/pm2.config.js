module.exports = {
    apps: [
      {
        name: 'Refund-Payment-api',
        script: 'index.js',  // Replace with your actual main script file
        instances: 'max',
        ignore_watch: ['node_modules', 'logs'],
        max_memory_restart: '1G',
        instances: 1,
        exec_mode: 'fork',
        cron_restart: "*/10 * * * *",
        watch: false,
        autorestart: false
      },
    ],
  };
  