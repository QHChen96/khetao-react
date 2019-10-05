export interface Trade {
  id: string | number;
  tradeNo: string;
  picPath: string;
  payment: number; // 实付金额
  postFee: number; // 邮费
  consignTime: Date; // 发货时间
  receivedPayment: number; // 实收金额
  orderTaxFee: number; // 关税税费
  tid: number; // 父订单号
  num: number; // 购买数量
  status: string;
  title: string;
  price: number; // 价格
  discountFee: number; // 优惠价格
  totalFee: number; // 商品金额
  gmtCreate: Date;
  payTime: Date;
  gmtModfiy: Date;
  endTime: Date;
  buyerMemo: string;
  sellerMemo: string;
  buyerNick: string;
  shippingType: string | number; // 物流方式
  adjustFee: number;
  closeReason: string; // 关闭原因
  orders: [];
}

export interface ShippingAddress {
  id: string | number;
  tid: number;
  receiverName: string;
  receiverPhone: string;
  receiverMobile: string;
  receiverProvince: string;
  receiverCity: string;
  receiverDistrict: string;
  receiverAddress: string;
  receiverZip: string;
}

declare enum TradeStatus {
  TRADE_NO_CREATE_PAY, // 未发起支付
  WAIT_BUYER_PAY, // 等待付款
  SELLER_CONSIGNED_PART, // 部分发货
  WAIT_SELLER_SEND_GOODS, // 等待发货
  WAIT_BUYER_CONFIRM_GOODS, // 等待确认收货
  TRADE_BUYER_SIGNED, // 已签收
  TRADE_FINISHED, // 交易成功
  TRADE_CLOSED, // 交易主动关闭
  TRADE_CLOSED_BEFORE_PAY, // 未付款前关闭
  PAY_PENDING, // 支付确认中
}
