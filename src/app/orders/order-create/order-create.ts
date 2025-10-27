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
    { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng' },
    { value: 'card', label: 'Thẻ tín dụng/ghi nợ' }
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
      customerPhone: ['', [Validators.required]],
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
      setCode: ['', [Validators.required, Validators.minLength(2)]],
      cardName: ['', [Validators.required, Validators.minLength(2)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      rarity: ['']
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

  private validatePhoneNumber(phone: string): boolean {
    if (!phone) return false; // Phone is must have
    
    // Remove all spaces, dashes, and dots
    const cleanPhone = phone.replace(/[\s\-\.]/g, '');
    
    // Vietnamese phone number patterns:
    // Mobile: 03x, 05x, 07x, 08x, 09x (10 digits total)
    // Landline: 02x (10-11 digits total)
    const vietnamesePhonePattern = /^(0[3|5|7|8|9][0-9]{8}|02[0-9]{8,9})$/;
    
    return vietnamesePhonePattern.test(cleanPhone);
  }

  onSubmit() {
    if (this.orderForm.valid && this.itemsFormArray.length > 0) {
      // Additional phone number validation
      const formValue = this.orderForm.value;
      if (formValue.customerPhone && !this.validatePhoneNumber(formValue.customerPhone)) {
        this.error = 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10-11 chữ số).';
        return;
      }

      this.loading = true;
      this.error = null;
      const createRequest: CreateOrderRequest = {
        customerName: formValue.customerName,
        customerPhone: formValue.customerPhone,
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
        error: (err: any) => {
          this.error = 'Không thể tạo đơn hàng. Vui lòng thử lại.';
          this.loading = false;
          console.error('Error creating order:', err);
        }
      });
    } else {
      this.markFormGroupTouched();
      this.error = 'Vui lòng điền đầy đủ và chính xác các thông tin bắt buộc.';
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
      if (field.errors['required']) return `${this.getVietnameseFieldName(fieldName)} là bắt buộc`;
      if (field.errors['minlength']) return `${this.getVietnameseFieldName(fieldName)} quá ngắn`;
      if (field.errors['pattern']) return 'Vui lòng nhập số điện thoại Việt Nam hợp lệ (bắt đầu bằng 03, 05, 07, 08, 09 hoặc 02)';
    }
    return '';
  }

  getItemFieldError(index: number, fieldName: string): string {
    const field = this.itemsFormArray.at(index).get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.getVietnameseItemFieldName(fieldName)} là bắt buộc`;
      if (field.errors['min']) return `${this.getVietnameseItemFieldName(fieldName)} phải lớn hơn 0`;
      if (field.errors['minlength']) return `${this.getVietnameseItemFieldName(fieldName)} quá ngắn`;
    }
    return '';
  }

  private getVietnameseFieldName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      'customerName': 'Tên khách hàng',
      'customerPhone': 'Số điện thoại',
      'paymentMethod': 'Phương thức thanh toán'
    };
    return fieldNames[fieldName] || fieldName;
  }

  private getVietnameseItemFieldName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      'setCode': 'Mã bộ thẻ',
      'cardName': 'Tên thẻ',
      'quantity': 'Số lượng',
      'price': 'Giá'
    };
    return fieldNames[fieldName] || fieldName;
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