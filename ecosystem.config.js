module.exports = {
  apps: [
    {
      name: 'nest-tdd',
      script: './dist/src/main.js',
      watch: '.',
      instances: 0,
      autorestart: true,
      watch: true,
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      max_memory_restart: '1G',
      exec_mode: 'cluster',
      log_type: 'json',
      merge_logs: true,
      wait_ready: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
      env: {
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_DATABASE: process.env.DB_DATABASE,

        MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD,
        MYSQL_DATABASE: process.env.MYSQL_DATABASE,
        MYSQL_USER: process.env.MYSQL_USER,
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
        MYSQL_TCP_PORT: process.env.MYSQL_TCP_PORT,

        JWT_SECRET: process.env.JWT_SECRET,
      },
    },
  ],
};
