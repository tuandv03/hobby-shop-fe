export interface Order {
  id: string;
  orderCode: string;
  cardCount: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  shippingAddress?: string;
  paymentMethod?: string;
}

export interface OrderItem {
  id: string;
  setCode: string;
  cardName: string;
  quantity: number;
  price: number;
  rarity?: string;
}

export interface OrderListRequest {
  fromDate?: string;
  toDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}