import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../order.service';
import { CreateOrderRequest, CreateOrderItem } from '../models/create-order.model';

@Component({
  selector: 'app-order-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-create.html',
  styleUrl: './order-create.css'
})
export class OrderCreateComponent implements OnInit {
  orderForm: FormGroup;
  loading = false;
  error: string | null = null;

  paymentMethods = [
    { value: 'cash', label: 'Tiền mặt' },
    { value: 'bank_transfer', label: 'Chuyển khoản' },
    { value: 'card', label: 'Thẻ tín dụng' }
  ];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router
  ) {
    this.orderForm = this.createForm();
  }

  ngOnInit() {
    // Add one empty item by default
    this.addOrderItem();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerEmail: ['', [Validators.email]],
      customerPhone: ['', [Validators.pattern(/^[0-9]{10,11}$/)]],
      shippingAddress: [''],
      paymentMethod: ['cash', Validators.required],
      isPaid: [false],
      notes: [''],
      items: this.fb.array([])
    });
  }

  get itemsFormArray(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  private createItemForm(): FormGroup {
    return this.fb.group({
      cardId: ['', Validators.required],
      cardName: ['', [Validators.required, Validators.minLength(2)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      rarity: [''],
      setCode: ['']
    });
  }

  addOrderItem() {
    this.itemsFormArray.push(this.createItemForm());
  }

  removeOrderItem(index: number) {
    if (this.itemsFormArray.length > 1) {
      this.itemsFormArray.removeAt(index);
    }
  }

  calculateItemTotal(index: number): number {
    const item = this.itemsFormArray.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const price = item.get('price')?.value || 0;
    return quantity * price;
  }

  calculateGrandTotal(): number {
    let total = 0;
    for (let i = 0; i < this.itemsFormArray.length; i++) {
      total += this.calculateItemTotal(i);
    }
    return total;
  }

  getTotalCardCount(): number {
    let count = 0;
    for (let i = 0; i < this.itemsFormArray.length; i++) {
      const item = this.itemsFormArray.at(i);
      count += item.get('quantity')?.value || 0;
    }
    return count;
  }

  onSubmit() {
    if (this.orderForm.valid && this.itemsFormArray.length > 0) {
      this.loading = true;
      this.error = null;

      const formValue = this.orderForm.value;
      const createRequest: CreateOrderRequest = {
        customerName: formValue.customerName,
        customerEmail: formValue.customerEmail || undefined,
        customerPhone: formValue.customerPhone || undefined,
        shippingAddress: formValue.shippingAddress || undefined,
        paymentMethod: formValue.paymentMethod,
        isPaid: formValue.isPaid,
        notes: formValue.notes || undefined,
        items: formValue.items
      };

      this.orderService.createOrder(createRequest).subscribe({
        next: (order) => {
          console.log('Order created successfully:', order);
          this.router.navigate(['/orders', order.id]);
        },
        error: (err) => {
          this.error = 'Failed to create order. Please try again.';
          this.loading = false;
          console.error('Error creating order:', err);
        }
      });
    } else {
      this.markFormGroupTouched();
      this.error = 'Please fill in all required fields correctly.';
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.orderForm.controls).forEach(key => {
      const control = this.orderForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach(item => {
          Object.keys((item as FormGroup).controls).forEach(itemKey => {
            (item as FormGroup).get(itemKey)?.markAsTouched();
          });
        });
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.orderForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isItemFieldInvalid(index: number, fieldName: string): boolean {
    const field = this.itemsFormArray.at(index).get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.orderForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['pattern']) return 'Please enter a valid phone number';
    }
    return '';
  }

  getItemFieldError(index: number, fieldName: string): string {
    const field = this.itemsFormArray.at(index).get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  cancel() {
    this.router.navigate(['/orders']);
  }
}