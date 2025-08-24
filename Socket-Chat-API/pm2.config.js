module.exports = {
    apps: [
      {
        name: 'Chat-Sockets-api',
        script: 'app.js',  // Replace with your actual main script file
        instances: 'max',
        exec_mode: 'cluster',
        watch: true,
        ignore_watch: ['node_modules', 'logs'],
        max_memory_restart: '1G',
        env: {
          PORT: 6543
        }
      },

    ],
  };
  