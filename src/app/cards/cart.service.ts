import { Injectable, computed, signal } from "@angular/core";

export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  qty: number;
}

const LS_KEY = "ygo_cart_v1";

@Injectable({ providedIn: "root" })
export class CartService {
  private itemsSig = signal<CartItem[]>(this.read());
  readonly items = this.itemsSig.asReadonly();
  readonly count = computed(() =>
    this.itemsSig().reduce((a, b) => a + b.qty, 0),
  );
  readonly total = computed(() =>
    this.itemsSig().reduce((a, b) => a + b.price * b.qty, 0),
  );

  add(item: CartItem) {
    const items = [...this.itemsSig()];
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0)
      items[idx] = { ...items[idx], qty: items[idx].qty + item.qty };
    else items.push(item);
    this.itemsSig.set(items);
    this.write(items);
  }

  remove(id: number) {
    const items = this.itemsSig().filter((i) => i.id !== id);
    this.itemsSig.set(items);
    this.write(items);
  }

  clear() {
    this.itemsSig.set([]);
    this.write([]);
  }

  private read(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    } catch {
      return [];
    }
  }
  private write(items: CartItem[]) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {}
  }
}
