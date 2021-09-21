import { MailerOptions } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

import { Environments } from '../../@types';

const configService = new ConfigService<Record<Environments, any>>();

export const mailerConfig: MailerOptions = {
  // template: {
  //   dir: path.resolve(__dirname, '..', '..', 'templates'),
  //   adapter: new HandlebarsAdapter(),
  //   options: {
  //     extName: '.hbs',
  //     layoutsDir: path.resolve(__dirname, '..', '..', 'templates'),
  //   },
  // },
  transport: {
    host: configService.get('EMAIL_HOST'),
    port: configService.get('EMAIL_PORT'),
    secure: false,
    auth: {
      user: configService.get('EMAIL_USER'),
      pass: configService.get('EMAIL_PASSWORD'),
    },
  },
};
