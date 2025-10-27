import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseService } from '../core/base-service.service';
import { Order, OrderDetail, OrderListRequest } from './models/order.model';
import { CreateOrderRequest } from './models/create-order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService {

  // Mock data for testing
  private mockOrders: Order[] = [
    {
      id: '1',
      orderCode: 'ORD-2024-001',
      cardCount: 15,
      totalAmount: 2500000,
      status: 'pending',
      notes: 'Khách hàng yêu cầu giao hàng nhanh',
      createdAt: '2024-10-15T08:30:00Z',
      updatedAt: '2024-10-15T08:30:00Z',
      customerId: 'CUS001',
      customerName: 'Nguyễn Văn A',
        customerPhone: '0394213869'
    },
    {
      id: '2', 
      orderCode: 'ORD-2024-002',
      cardCount: 8,
      totalAmount: 1200000,
      status: 'processing',
      notes: 'Đã thanh toán qua chuyển khoản',
      createdAt: '2024-10-18T14:15:00Z',
      updatedAt: '2024-10-19T09:20:00Z',
      customerId: 'CUS002',
      customerName: 'Trần Thị B',
        customerPhone: '0394213870'
    },
    {
      id: '3',
      orderCode: 'ORD-2024-003', 
      cardCount: 25,
      totalAmount: 4800000,
      status: 'completed',
      notes: 'Đơn hàng VIP - ưu tiên xử lý',
      createdAt: '2024-10-20T16:45:00Z',
      updatedAt: '2024-10-21T10:30:00Z',
      customerId: 'CUS003',
      customerName: 'Lê Minh C',
        customerPhone: '0394213866'
    },
    {
      id: '4',
      orderCode: 'ORD-2024-004',
      cardCount: 3,
      totalAmount: 850000,
      status: 'pending',
      notes: 'Khách hàng hỏi về tình trạng thẻ',
      createdAt: '2024-10-10T11:20:00Z', // Overdue order (>4 days)
      updatedAt: '2024-10-10T11:20:00Z',
      customerId: 'CUS004',
      customerName: 'Phạm Thị D',
        customerPhone: '0394213866'
    },
    {
      id: '5',
      orderCode: 'ORD-2024-005',
      cardCount: 12,
      totalAmount: 3200000,
      status: 'cancelled',
      notes: 'Khách hàng hủy do thay đổi ý định',
      createdAt: '2024-10-22T13:30:00Z',
      updatedAt: '2024-10-22T15:45:00Z',
      customerId: 'CUS005',
      customerName: 'Hoàng Văn E',
        customerPhone: '0394213867'
    },
    {
      id: '6',
      orderCode: 'ORD-2024-006',
      cardCount: 7,
      totalAmount: 1850000,
      status: 'processing',
      notes: 'Cần kiểm tra kỹ chất lượng thẻ',
      createdAt: '2024-10-21T09:15:00Z',
      updatedAt: '2024-10-21T14:20:00Z',
      customerName: 'Guest Customer'
    },
    {
      id: '7',
      orderCode: 'ORD-2024-007',
      cardCount: 20,
      totalAmount: 5500000,
      status: 'pending',
      notes: '',
      createdAt: '2024-10-08T16:00:00Z', // Another overdue order
      updatedAt: '2024-10-08T16:00:00Z',
      customerId: 'CUS007',
      customerName: 'Đặng Thị F',
        customerPhone: '0394213868'
    }
  ];

  private mockOrderDetails: { [key: string]: OrderDetail } = {
    '1': {
      ...this.mockOrders[0],
      items: [
        {
          id: 'item1',
          setCode: 'LOB-001',
          cardName: 'Blue-Eyes White Dragon',
          quantity: 3,
          price: 500000,
          rarity: 'Ultra Rare'
        },
        {
          id: 'item2',
          setCode: 'SDY-006',
          cardName: 'Dark Magician',
          quantity: 2,
          price: 750000,
          rarity: 'Secret Rare'
        },
        {
          id: 'item3',
          setCode: 'LOB-070',
          cardName: 'Red-Eyes Black Dragon',
          quantity: 1,
          price: 400000,
          rarity: 'Super Rare'
        }
      ],
      shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
      paymentMethod: 'Chuyển khoản ngân hàng'
    },
    '2': {
      ...this.mockOrders[1],
      items: [
        {
          id: 'item4',
          setCode: 'LOB-124',
          cardName: 'Exodia the Forbidden One',
          quantity: 1,
          price: 1200000,
          rarity: 'Secret Rare'
        }
      ],
      shippingAddress: '456 Đường XYZ, Quận 3, TP.HCM',
      paymentMethod: 'Tiền mặt'
    }
  };

  getOrders(request?: OrderListRequest): Observable<Order[]> {
    // Call real backend API
    const params = this.buildOrderParams(request);
    return this.get<Order[]>('orders', params);
    
    // Fallback to mock data for testing (can be removed later)
    // return of(this.mockOrders).pipe(delay(800));
  }

  getOrderById(id: string): Observable<OrderDetail> {
    // Call real backend API
    return this.get<OrderDetail>(`orders/${id}`);
    
    // Fallback to mock data for testing (can be removed later)
    /*
    const orderDetail = this.mockOrderDetails[id];
    if (orderDetail) {
      return of(orderDetail).pipe(delay(500));
    } else {
      // If no detail, create basic detail from order list
      const order = this.mockOrders.find(o => o.id === id);
      if (order) {
        const basicDetail: OrderDetail = {
          ...order,
          items: [
            {
              id: `item_${id}`,
              cardId: 1000 + parseInt(id),
              cardName: 'Sample Card',
              quantity: order.cardCount,
              price: Math.floor(order.totalAmount / order.cardCount),
              rarity: 'Common'
            }
          ]
        };
        return of(basicDetail).pipe(delay(500));
      }
    }
    throw new Error('Order not found');
    */
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    // Call real backend API
    return this.put<Order>(`orders/${id}/status`, { status });
    
    // Fallback to mock data for testing (can be removed later)
    /*
    const order = this.mockOrders.find(o => o.id === id);
    if (order) {
      order.status = status as any;
      order.updatedAt = new Date().toISOString();
      return of(order).pipe(delay(300));
    }
    throw new Error('Order not found');
    */
  }

  deleteOrder(id: string): Observable<void> {
    // Call real backend API
    return this.delete<void>(`orders/${id}`);
    
    // Fallback to mock data for testing (can be removed later)
    /*
    const index = this.mockOrders.findIndex(o => o.id === id);
    if (index !== -1) {
      this.mockOrders.splice(index, 1);
      return of(void 0).pipe(delay(300));
    }
    throw new Error('Order not found');
    */
  }

  markOrderAsDone(id: string): Observable<Order> {
    return this.updateOrderStatus(id, 'completed');
  }

  private buildOrderParams(request?: OrderListRequest): any {
    if (!request) {
      // Default: last 30 days
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 30);
      
      return {
        fromDate: fromDate.toISOString().split('T')[0],
        toDate: toDate.toISOString().split('T')[0],
        limit: 50
      };
    }

    return {
      fromDate: request.fromDate,
      toDate: request.toDate,
      status: request.status,
      page: request.page || 1,
      limit: request.limit || 50
    };
  }

  createOrder(request: CreateOrderRequest): Observable<Order> {
    // Call real backend API
    return this.post<Order>('orders', request);
    
    // Original mock code (commented out):
    /*
    // Generate new mock order
    const newOrder: Order = {
      id: String(this.mockOrders.length + 1),
      orderCode: `ORD-2024-${String(this.mockOrders.length + 1).padStart(3, '0')}`,
      cardCount: request.items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: request.items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
      status: request.isPaid ? 'processing' : 'pending',
      notes: request.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerId: `CUS${String(this.mockOrders.length + 1).padStart(3, '0')}`,
      customerName: request.customerName,
        customerPhone: request.  customerPhone
    };

    // Add to mock data
    this.mockOrders.unshift(newOrder);

    // Create detail entry
    const newOrderDetail: OrderDetail = {
      ...newOrder,
      items: request.items.map((item, index) => ({
        id: `item_${newOrder.id}_${index}`,
        ...item
      })),
      shippingAddress: request.shippingAddress,
      paymentMethod: this.getPaymentMethodLabel(request.paymentMethod)
    };
    
    this.mockOrderDetails[newOrder.id] = newOrderDetail;

    return of(newOrder).pipe(delay(1000));
    */
  }

  private getPaymentMethodLabel(method: string): string {
    switch (method) {
      case 'cash': return 'Tiền mặt';
      case 'bank_transfer': return 'Chuyển khoản';
      case 'card': return 'Thẻ tín dụng';
      default: return method;
    }
  }
}