import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { YugiohApiService, YgoCard } from "../../core/yugioh-api.service";
import { CartService } from "../cart.service";

@Component({
  standalone: true,
  selector: "app-cards-list",
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./cards-list.html",
  styleUrls: ["./cards-list.css"],
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
  rarities: string[] = [
    "Common",
    "Rare",
    "Super Rare",
    "Ultra Rare",
    "Starlight Rare",
    "Quarter Century Rare"
  ];

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

  onCardClick(id: number) {
    console.log('Card clicked:', id);
    console.log('Navigating to:', `/cards/${id}`);
  }
}
