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
