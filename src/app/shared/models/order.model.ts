export interface Order {
  id: number;
  customerName: string;
  customerEmail?: string;
  customerFb?: string;
  customerPhone: string;
  shippingAddress: string;
  status: "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled";
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  cardId: number;
  cardCode: string;
  name: string;
  rarity?: string;
  qty: number;
  price: number;
  image?: string;
}
