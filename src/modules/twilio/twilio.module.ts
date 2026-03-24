import { Module } from '@nestjs/common';
import { TwilioService } from './application/services/twilio.service';

@Module({
  providers: [TwilioService],
  exports: [TwilioService],
})
export class TwilioModule {}
