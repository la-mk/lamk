export enum PaymentMethodNames {
  CREDIT_CARD = "creditCard",
  PAY_ON_DELIVERY = "payOnDelivery",
}

export enum PaymentProcessors {
  HALKBANK = "halkbank",
}

export enum TransactionStatus {
  APPROVED = "approved",
  DECLINED = "declined",
  ERROR = "error",
}

export interface PaymentMethod {
  name: PaymentMethodNames;
  processor?: PaymentProcessors;
  clientId?: string;
  clientKey?: string;
  clientUsername?: string;
  clientPassword?: string;
}
