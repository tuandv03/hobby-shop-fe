import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { SelectButtonModule } from "primeng/selectbutton";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import {
  YgoCardPrintVersion,
  YgoSet,
  YugiohApiService,
} from "../../core/yugioh-api.service";

type ViewMode = "grid" | "table";
type SortOption = "code" | "name" | "rarity" | "price";

@Component({
  standalone: true,
  selector: "app-set-browser",
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    SelectModule,
    SelectButtonModule,
    SkeletonModule,
    TableModule,
    TagModule,
  ],
  templateUrl: "./set-browser.html",
  styleUrls: ["./set-browser.css"],
})
export class SetBrowserComponent implements OnInit {
  private api = inject(YugiohApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  sets: YgoSet[] = [];
  cards: YgoCardPrintVersion[] = [];
  selectedSetCode = "";
  viewMode: ViewMode = "grid";
  sortBy: SortOption = "code";
  readonly pageSize = 18;
  currentPage = 1;
  loadingSets = false;
  loadingCards = false;
  error = "";
  readonly sortOptions = [
    { label: "Code", value: "code" },
    { label: "Name", value: "name" },
    { label: "Rarity", value: "rarity" },
    { label: "Giá tiền", value: "price" },
  ];
  readonly viewModeOptions = [
    { label: "Grid", value: "grid" },
    { label: "Table", value: "table" },
  ];

  get selectedSet(): YgoSet | undefined {
    return this.sets.find((set) => set.set_code === this.selectedSetCode);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.sortedCards.length / this.pageSize));
  }

  get sortedCards(): YgoCardPrintVersion[] {
    return [...this.cards].sort((a, b) => {
      switch (this.sortBy) {
        case "name":
          return this.compareText(a.card_name, b.card_name);
        case "rarity":
          return this.compareText(a.set_rarity, b.set_rarity);
        case "price":
          return this.getSetPrice(a) - this.getSetPrice(b);
        case "code":
        default:
          return this.compareText(a.set_code, b.set_code);
      }
    });
  }

  get pagedCards(): YgoCardPrintVersion[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedCards.slice(start, start + this.pageSize);
  }

  get pageStart(): number {
    if (!this.cards.length) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get pageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.cards.length);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  ngOnInit(): void {
    this.loadSets();
  }

  loadSets(): void {
    this.loadingSets = true;
    this.error = "";

    this.api.getSets().subscribe({
      next: (sets) => {
        this.sets = sets;
        this.loadingSets = false;

        const routeSetCode = this.route.snapshot.paramMap.get("setCode");
        const initialSet =
          this.sets.find((set) => set.set_code === routeSetCode) ??
          this.sets[0];

        if (initialSet) {
          this.selectedSetCode = initialSet.set_code;
          this.loadCardsForSelectedSet(false);
        }
      },
      error: () => {
        this.loadingSets = false;
        this.sets = [];
        this.cards = [];
        this.error = "Không tải được danh sách set.";
      },
    });
  }

  onSetChange(): void {
    this.loadCardsForSelectedSet(true);
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
  }

  onSortChange(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(page, 1), this.totalPages);
  }

  openCard(cardId: number): void {
    this.router.navigate(["/cards", cardId]);
  }

  private loadCardsForSelectedSet(updateUrl: boolean): void {
    const set = this.selectedSet;
    if (!set) {
      this.cards = [];
      this.currentPage = 1;
      return;
    }

    if (updateUrl) {
      this.router.navigate(["/sets", set.set_code]);
    }

    this.loadingCards = true;
    this.error = "";

    this.api.getCardsBySet(set, { num: 200 }).subscribe({
      next: (cards) => {
        this.cards = cards;
        this.currentPage = 1;
        this.loadingCards = false;
      },
      error: () => {
        this.cards = [];
        this.loadingCards = false;
        this.error = "Không tải được danh sách card trong set.";
      },
    });
  }

  private compareText(a = "", b = ""): number {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  }

  private getSetPrice(card: YgoCardPrintVersion): number {
    return Number.parseFloat((card.set_price || "0").replace(/[^0-9.]/g, "")) || 0;
  }
}
