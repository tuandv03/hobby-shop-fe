import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { PaginatorModule, PaginatorState } from "primeng/paginator";
import { SkeletonModule } from "primeng/skeleton";
import { TagModule } from "primeng/tag";
import { YugiohApiService, YgoCard } from "../../core/yugioh-api.service";
import { CartService } from "../cart.service";

@Component({
  standalone: true,
  selector: "app-cards-list",
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    PaginatorModule,
    SkeletonModule,
    TagModule,
  ],
  templateUrl: "./cards-list.html",
  styleUrl: "./cards-list.scss",
})
export class CardsListComponent implements OnInit {
  private api = inject(YugiohApiService);
  private cart = inject(CartService);

  name = "";
  code = "";
  type = "";
  rarity = "";
  cards: YgoCard[] = [];
  loading = false;
  showFilters = true;
  first = 0;
  pageSize = 12;
  totalRecords = 0;
  readonly pageSizeOptions = [12, 24, 48];
  readonly skeletonItems = Array.from({ length: 12 }, (_, i) => i);
  private wishlist = new Set<number>();
  rarities: string[] = [
    "Common",
    "Rare",
    "Super Rare",
    "Ultra Rare",
    "Starlight Rare",
    "Quarter Century Rare",
  ];

  ngOnInit(): void {
    this.search();
  }

  search(resetPage = true) {
    if (resetPage) {
      this.first = 0;
    }

    this.loading = true;
    this.api
      .searchCardsPage({
        name: this.name || undefined,
        code: this.code || undefined,
        type: this.type || undefined,
        num: this.pageSize,
        offset: this.first,
      })
      .subscribe({
        next: (result) => {
          this.cards = this.applyRarity(result.data);
          this.totalRecords =
            result.meta?.total_rows ??
            this.first + this.cards.length + (result.meta?.rows_remaining ?? 0);
          this.loading = false;
        },
        error: () => {
          this.cards = [];
          this.totalRecords = 0;
          this.loading = false;
        },
      });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.pageSize = event.rows ?? this.pageSize;
    this.search(false);
  }

  private applyRarity(cards: YgoCard[]): YgoCard[] {
    const r = (this.rarity || "").toLowerCase();
    if (!r) return cards;
    return cards.filter((c: any) =>
      c.card_sets?.some((s: any) =>
        (s.set_rarity || "").toLowerCase().includes(r),
      ),
    );
  }

  addToCart(c: YgoCard) {
    this.cart.add({
      id: c.id,
      name: c.name,
      image: c.card_images?.[0]?.image_url_small || "",
      price: 0,
      qty: 1,
    });
  }

  toggleWish(id: number) {
    if (this.wishlist.has(id)) this.wishlist.delete(id);
    else this.wishlist.add(id);
  }

  isWished(id: number) {
    return this.wishlist.has(id);
  }
}
