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
      user: 'ubuntu',
      host: ['davidfranca.tech'],
      key: process.env.HOME + '/Downloads/AWSAPV.pem',
      ref: 'origin/master',
      repo: 'git@github.com:francinha02/serverGPS.git',
      path: '/home/ubuntu/teste/deploy',
      'pre-deploy-local': "echo 'This is a local executed command'",
      'post-deploy':
        'yarn && docker-compose down && docker-compose up -d --build && npx prisma migrate deploy && yarn build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
