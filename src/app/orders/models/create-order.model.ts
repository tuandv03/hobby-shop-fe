export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  shippingAddress?: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'card';
  isPaid: boolean;
  notes?: string;
  items: CreateOrderItem[];
}

export interface CreateOrderItem {
  setCode: string;
  cardName: string;
  quantity: number;
  price: number;
  rarity?: string;
}