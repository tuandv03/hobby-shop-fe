export interface CreateOrderRequest {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'card';
  isPaid: boolean;
  notes?: string;
  items: CreateOrderItem[];
}

export interface CreateOrderItem {
  cardId: number;
  cardName: string;
  quantity: number;
  price: number;
  rarity?: string;
  setCode?: string;
}