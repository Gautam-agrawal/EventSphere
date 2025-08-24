module.exports = {
    apps: [
      {
        name: 'retrieve-all-events-api',
        script: 'index.js',  // Replace with your actual main script file
        instances: 'max',
        exec_mode: 'cluster',
        watch: true,
        ignore_watch: ['node_modules', 'logs'],
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'prod',  // Adjust as needed ('dev', 'production', etc.)
          VERSION: '1',
          APP_NAME: 'retrieve-all-events-api',
          APP_PORT: 6003,
          LOG_LEVEL: 'debug',
          SSL_CERT_PATH: 'mongodb-atlas-ssl-cert.pem',
          DB_CONNECTION_STRING: 'mongodb+srv://ems-db.ehsz9n7.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority',
        },
      },
    ],
  };
  