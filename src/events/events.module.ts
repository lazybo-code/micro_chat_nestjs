import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TokenUtil } from '../utils/token.util';

@Module({
  imports: [TokenUtil],
  providers: [EventsGateway, TokenUtil],
})
export class EventsModule {}
