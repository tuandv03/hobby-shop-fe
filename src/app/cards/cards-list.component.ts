import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { YugiohApiService, YgoCard } from "../core/yugioh-api.service";
import { CartService } from "./cart.service";

@Component({
  standalone: true,
  selector: "app-cards-list",
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto max-w-7xl px-4 py-8">
      <h1 class="font-display text-3xl font-semibold mb-4">Danh sách Card</h1>
      <form
        (ngSubmit)="search()"
        class="card p-4 mb-6 grid md:grid-cols-5 gap-3"
      >
        <input
          [(ngModel)]="name"
          name="name"
          type="text"
          placeholder="Tìm theo tên (VD: Blue-Eyes)"
          class="w-full rounded-md border border-border bg-background px-3 py-2"
        />
        <input
          [(ngModel)]="code"
          name="code"
          type="text"
          placeholder="Mã thẻ hoặc setcode (VD: 89631139 hoặc SDK-001)"
          class="w-full rounded-md border border-border bg-background px-3 py-2"
        />
        <select
          [(ngModel)]="type"
          name="type"
          class="w-full rounded-md border border-border bg-background px-3 py-2"
        >
          <option value="">Tất cả loại</option>
          <option value="Spell Card">Spell Card</option>
          <option value="Trap Card">Trap Card</option>
          <option value="XYZ Monster">XYZ Monster</option>
          <option value="Link Monster">Link Monster</option>
        </select>
        <select
          [(ngModel)]="rarity"
          name="rarity"
          class="w-full rounded-md border border-border bg-background px-3 py-2"
        >
          <option value="">Tất cả độ hiếm</option>
          <option value="Common">Common</option>
          <option value="Rare">Rare</option>
          <option value="Super Rare">Super Rare</option>
          <option value="Ultra Rare">Ultra Rare</option>
          <option value="Starlight Rare">Starlight Rare</option>
          <option value="Quarter Century">Quarter Century Rare</option>
        </select>
        <button class="btn btn-primary w-full md:w-auto">Tìm kiếm</button>
      </form>

      <div *ngIf="loading" class="text-mutedForeground">Đang tải...</div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center">
        <div *ngFor="let c of cards" class="card p-2 w-[180px] md:w-[210px]">
          <img
            [src]="c.card_images?.[0]?.image_url_small"
            [alt]="c.name"
            class="w-full aspect-[3/4] object-cover rounded-md border border-border"
          />
          <div class="mt-2">
            <h3 class="text-sm font-medium truncate" title="{{ c.name }}">
              {{ c.name }}
            </h3>
            <div class="flex items-center justify-between mt-2">
              <span
                class="badge"
                *ngIf="c.card_prices?.[0]?.tcgplayer_price as p"
                >&#36;{{ p }}</span
              >
              <div class="flex items-center gap-2">
                <button
                  class="btn-icon"
                  title="Thêm vào giỏ"
                  (click)="addToCart(c)"
                >
                  🛒
                </button>
                <button
                  class="btn-icon"
                  [class.opacity-50]="isWished(c.id)"
                  title="Yêu thích"
                  (click)="toggleWish(c.id)"
                >
                  ❤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !cards.length" class="text-mutedForeground">
        Không tìm thấy kết quả. Hãy thử từ khóa khác.
      </div>
    </div>
  `,
})
export class CardsListComponent implements OnInit {
  private api = inject(YugiohApiService);
  private cart = inject(CartService);
  private router = inject(Router);

  name = "";
  code = "";
  type = "";
  rarity = "";
  cards: YgoCard[] = [];
  loading = false;
  private wishlist = new Set<number>();

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.loading = true;
    this.api
      .searchCards({
        name: this.name || undefined,
        code: this.code || undefined,
        type: this.type || undefined,
        num: 48,
        offset: 0,
      })
      .subscribe({
        next: (cards) => {
          this.cards = this.applyRarity(cards);
          this.loading = false;
        },
        error: () => {
          this.cards = [];
          this.loading = false;
        },
      });
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
    const price = parseFloat(c.card_prices?.[0]?.tcgplayer_price || "0");
    this.cart.add({
      id: c.id,
      name: c.name,
      image: c.card_images?.[0]?.image_url_small || "",
      price,
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
