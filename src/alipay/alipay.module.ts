import { Module } from '@nestjs/common';
import { AlipayService } from './alipay.service';
import { AlipayController } from './alipay.controller';

@Module({
  providers: [AlipayService],
  controllers: [AlipayController],
})
export class AlipayModule {}
