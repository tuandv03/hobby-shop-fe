import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CartService } from "../cart.service";
import { MyInventoryItem } from "../models/my-inventory.model";
import { MyInventoryService } from "./my-inventory.service";

type ViewMode = "grid" | "table";

interface MyInventoryTableItem {
  cardId?: number;
  cardName: string;
  setCode: string;
  rarities: string[];
  stockQuantity: number;
  reservedQuantity: number;
}

@Component({
  standalone: true,
  selector: "app-my-inventory",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    SkeletonModule,
    TableModule,
    TagModule,
  ],
  templateUrl: "./my-inventory.html",
  styleUrl: "./my-inventory.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyInventoryComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly inventoryService = inject(MyInventoryService);
  private readonly cart = inject(CartService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly filterForm = this.fb.group({
    search: [""],
    setCode: [""],
    rarity: [""],
  });
  readonly skeletonItems = Array.from({ length: 8 }, (_, index) => index);

  items: MyInventoryItem[] = [];
  viewMode: ViewMode = "grid";
  loading = false;
  error = "";

  ngOnInit(): void {
    this.loadInventory();
  }

  get totalStock(): number {
    return this.items.reduce((total, item) => total + item.stockQuantity, 0);
  }

  get tableItems(): MyInventoryTableItem[] {
    const grouped = new Map<string, MyInventoryTableItem>();

    for (const item of this.items) {
      const key = `${item.cardId ?? "card"}|${item.setCode}`;
      const current = grouped.get(key);

      if (current) {
        if (item.rarity && !current.rarities.includes(item.rarity)) {
          current.rarities.push(item.rarity);
        }
        current.stockQuantity += item.stockQuantity;
        current.reservedQuantity += item.reservedQuantity;
        continue;
      }

      grouped.set(key, {
        cardId: item.cardId,
        cardName: item.cardName,
        setCode: item.setCode,
        rarities: item.rarity ? [item.rarity] : ["Unknown"],
        stockQuantity: item.stockQuantity,
        reservedQuantity: item.reservedQuantity,
      });
    }

    return Array.from(grouped.values());
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
  }

  search(): void {
    this.loadInventory();
  }

  reset(): void {
    this.filterForm.reset();
    this.loadInventory();
  }

  addToCart(item: MyInventoryItem): void {
    this.cart.add({
      id: item.cardId ?? 0,
      name: item.cardName,
      image: item.imageUrl ?? "",
      price: 0,
      qty: 1,
    });
  }

  trackByInventoryItem(index: number, item: MyInventoryItem): string {
    return `${item.cardId ?? "card"}-${item.setCode}-${item.rarity}-${index}`;
  }

  private loadInventory(): void {
    const formValue = this.filterForm.getRawValue();

    this.loading = true;
    this.error = "";
    this.cdr.markForCheck();

    this.inventoryService
      .getMyInventory({
        search: formValue.search.trim() || undefined,
        setCode: formValue.setCode.trim() || undefined,
        rarity: formValue.rarity.trim() || undefined,
      })
      .subscribe({
        next: (items) => {
          this.items = items;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.items = [];
          this.loading = false;
          this.error = "Khong tai duoc inventory. Vui long thu lai.";
          this.cdr.markForCheck();
        },
      });
  }
}
