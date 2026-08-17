import { Module } from '@nestjs/common';
import { ISmsGateway } from './domain/ports';
import { ApiTxtSmsGateway } from './infrastructure';

@Module({
  providers: [{ provide: ISmsGateway, useClass: ApiTxtSmsGateway }],
  exports: [ISmsGateway],
})
export class SmsModule {}
