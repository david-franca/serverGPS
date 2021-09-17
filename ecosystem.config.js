module.exports = {
  apps: [
    {
      name: 'server',
      script: './dist/src/main.js',
      watch: true,
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],

  deploy: {
    production: {
      user: process.env.EC2_USERNAME,
      host: [process.env.EC2_HOST],
      key: process.env.HOME + '/Downloads/AWSAPV.pem',
      ref: 'origin/master',
      repo: process.env.EC2_REPO,
      path: '/home/ubuntu/teste/deploy',
      'post-deploy':
        'yarn && docker-compose down && docker-compose up -d --build --remove-orphans && npx prisma migrate deploy && yarn build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'touch .env && cp .env.example .env',
    },
  },
};
