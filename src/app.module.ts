import { Module } from '@nestjs/common';

import { imports } from './imports/app.imports';
import { providers } from './providers/app.providers';

@Module({ imports, providers })
export class AppModule {}
