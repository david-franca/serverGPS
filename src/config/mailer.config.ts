import * as path from 'path';

import { MailerOptions } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

import { Environments } from '../interfaces';

const configService = new ConfigService<Record<Environments, any>>();

console.log(path.resolve(__dirname, '..', '..'));

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
