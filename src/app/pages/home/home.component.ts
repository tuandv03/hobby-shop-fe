import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import {
  YugiohApiService,
  YgoCard,
  YgoSet,
} from "../../core/yugioh-api.service";

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="relative overflow-hidden">
      <div
        class="absolute inset-0 bg-ygo-grid bg-[length:var(--size,28px)_var(--size,28px)] opacity-40 dark:opacity-20 pointer-events-none"
        style="--size:28px"
      ></div>
      <div class="container mx-auto max-w-7xl px-4 pt-12 pb-10">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div class="inline-flex items-center gap-2 mb-4">
              <span class="badge">Shop Yu-Gi-Oh!</span>
              <span class="badge">Giao diện hiện đại</span>
            </div>
            <h1
              class="font-display text-4xl md:text-6xl font-bold leading-tight"
            >
              Yu-Gi-Oh! Card Shop
            </h1>
            <p class="mt-4 text-lg text-mutedForeground">
              Tìm kiếm, sưu tầm và mua các thẻ bài Yu-Gi-Oh! chính hãng. Chủ đề
              tối/ sáng, tối ưu trên mọi thiết bị.
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <a routerLink="/cards" class="btn btn-primary">Khám phá thẻ</a>
              <a routerLink="/sets" class="btn">Xem set mới</a>
            </div>
          </div>
          <div class="relative">
            <div class="grid grid-cols-3 gap-3">
              <ng-container *ngFor="let img of showcaseImages; let i = index">
                <img
                  [src]="img"
                  alt="Card"
                  class="rounded-lg border border-border shadow-md rotate-{{
                    i % 2 === 0 ? '-2' : '2'
                  }}"
                />
              </ng-container>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container mx-auto max-w-7xl px-4 py-10">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-display text-2xl md:text-3xl font-semibold">
          Card nổi bật
        </h2>
        <a
          routerLink="/cards"
          class="text-sm text-mutedForeground hover:text-foreground"
          >Xem tất cả →</a
        >
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center">
        <ng-container *ngIf="hotCards.length; else loadingCards">
          <a
            *ngFor="let c of hotCards"
            [routerLink]="['/cards', c.id]"
            class="card p-2 group w-[180px] md:w-[210px]"
          >
            <img
              [src]="c.card_images[0]?.image_url_small"
              [alt]="c.name"
              class="w-full aspect-[3/4] object-cover rounded-md border border-border"
            />
            <div class="mt-2 flex items-center justify-between">
              <h3
                class="text-sm font-medium group-hover:text-foreground truncate"
                title="{{ c.name }}"
              >
                {{ c.name }}
              </h3>
              <span
                class="badge"
                *ngIf="c.card_prices?.[0]?.tcgplayer_price as p"
                >&#36;{{ p }}</span
              >
            </div>
          </a>
        </ng-container>
        <ng-template #loadingCards>
          <div class="col-span-full text-center text-mutedForeground">
            Đang tải card nổi bật...
          </div>
        </ng-template>
      </div>
    </section>

    <section class="container mx-auto max-w-7xl px-4 pb-16">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-display text-2xl md:text-3xl font-semibold">
          Set mới phát hành
        </h2>
        <a
          routerLink="/sets"
          class="text-sm text-mutedForeground hover:text-foreground"
          >Xem tất cả →</a
        >
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ng-container *ngIf="latestSets.length; else loadingSets">
          <div *ngFor="let s of latestSets" class="card p-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold">{{ s.set_name }}</h3>
                <p class="text-sm text-mutedForeground">Mã: {{ s.set_code }}</p>
              </div>
              <span class="badge">{{ s.tcg_date | date: "MMM y" }}</span>
            </div>
          </div>
        </ng-container>
        <ng-template #loadingSets>
          <div class="col-span-full text-center text-mutedForeground">
            Đang tải set...
          </div>
        </ng-template>
      </div>
    </section>
  `,
})
export class HomePageComponent implements OnInit {
  private api = inject(YugiohApiService);
  hotCards: YgoCard[] = [];
  latestSets: YgoSet[] = [];
  showcaseImages = [
    "https://images.ygoprodeck.com/images/cards_small/89631139.jpg",
    "https://images.ygoprodeck.com/images/cards_small/46986414.jpg",
    "https://images.ygoprodeck.com/images/cards_small/38033121.jpg",
    "https://images.ygoprodeck.com/images/cards_small/53129443.jpg",
    "https://images.ygoprodeck.com/images/cards_small/65844845.jpg",
    "https://images.ygoprodeck.com/images/cards_small/74677422.jpg",
    "https://images.ygoprodeck.com/images/cards_small/14087893.jpg",
    "https://images.ygoprodeck.com/images/cards_small/30126992.jpg",
    "https://images.ygoprodeck.com/images/cards_small/44519536.jpg",
  ];

  ngOnInit(): void {
    this.api.getHotCards(8).subscribe((cards) => (this.hotCards = cards));
    this.api.getLatestSets(6).subscribe((sets) => (this.latestSets = sets));
  }
}
