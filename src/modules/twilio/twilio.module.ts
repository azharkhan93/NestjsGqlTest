import { Module } from '@nestjs/common';
import { ISmsGateway } from './domain/ports';
import { TwilioSmsGateway } from './infrastructure';

@Module({
  providers: [
    { provide: ISmsGateway, useClass: TwilioSmsGateway },
  ],
  exports: [ISmsGateway],
})
export class TwilioModule {}
