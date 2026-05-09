export enum PaymentModel {
  Esewa = 1,
  Khalti = 2,
  Cash = 3,
  BankTransfer = 4,
}

export interface Payment {
  id?: number;
  bookingId?: number;
  paymentModelId: PaymentModel;
  paymentModelName?: string;
  totalAmount: number;
}
  