import { Injectable } from '@nestjs/common';
import AlipaySdk from 'alipay-sdk';
import AlipayFormData from 'alipay-sdk/lib/form';

@Injectable()
export class AlipayService {
  private alipaySdk: AlipaySdk = null;

  constructor() {
    // this.alipaySdk = new AlipaySdk({
    //   appId: '',
    //   privateKey: ``,
    //   alipayPublicKey: ``,
    // });
  }

  async payTest() {
    const formData = new AlipayFormData();
    formData.addField('notifyUrl', 'http://www.com/notify');
    formData.addField('bizContent', {
      outTradeNo: '1111',
      productCode: 'FAST_INSTANT_TRADE_PAY',
      totalAmount: '0.01',
      subject: '商品',
      body: '商品详情',
    });
    return await this.alipaySdk.exec(
      'alipay.trade.page.pay',
      {},
      {
        formData,
      },
    );
  }
}
