import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../order.service';
import { Order, OrderListRequest } from '../models/order.model';

@Component({
  selector: 'app-orders-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.css'
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = false;
  error: string | null = null;

  // Filter parameters
  fromDate: string = '';
  toDate: string = '';
  selectedStatus: string = '';
  
  statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(private orderService: OrderService) {
    // Set default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    this.toDate = today.toISOString().split('T')[0];
    this.fromDate = thirtyDaysAgo.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.error = null;

    const request: OrderListRequest = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      status: this.selectedStatus || undefined
    };

    this.orderService.getOrders(request).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
        console.error('Error loading orders:', err);
      }
    });
  }

  onFilterChange() {
    this.loadOrders();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  isOverdue(createdAt: string, status: string): boolean {
    if (status === 'completed' || status === 'cancelled') {
      return false;
    }
    
    const created = new Date(createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    
    return diffDays > 4;
  }

  markAsDone(order: Order, event: Event) {
    event.stopPropagation();
    
    this.orderService.markOrderAsDone(order.id).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
      },
      error: (err) => {
        console.error('Error marking order as done:', err);
        alert('Failed to update order status');
      }
    });
  }

  deleteOrder(order: Order, event: Event) {
    event.stopPropagation();
    
    if (confirm(`Are you sure you want to delete order ${order.orderCode}?`)) {
      this.orderService.deleteOrder(order.id).subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o.id !== order.id);
        },
        error: (err) => {
          console.error('Error deleting order:', err);
          alert('Failed to delete order');
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
}