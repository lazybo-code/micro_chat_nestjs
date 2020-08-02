import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AlipayService } from './alipay.service';

@ApiTags('支付宝')
@Controller('alipay')
export class AlipayController {
  constructor(private alipayService: AlipayService) {}

  @Get()
  async test() {
    return this.alipayService.payTest();
  }
}
