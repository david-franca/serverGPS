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
      host: ['18.119.135.252'],
      key: process.env.HOME + '/Downloads/AWSAPV.pem',
      ref: 'origin/master',
      repo: 'git@github.com:francinha02/serverGPS.git',
      path: '/teste/deploy',
      'pre-deploy-local': "echo 'This is a local executed command'",
      'post-deploy':
        'yarn && npx prisma migrate deploy && yarn build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
