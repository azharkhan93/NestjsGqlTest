import { Module } from '@nestjs/common';
import { TwilioService } from './application/services/twilio.service';
import { TwilioResolver } from './presentation/graphql/resolvers/twilio.resolver';

@Module({
  providers: [TwilioService, TwilioResolver],
  exports: [TwilioService],
})
export class TwilioModule {}
