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
type SortOption = "code" | "name" | "rarity" | "category";

interface SetCardDisplayRow {
  cardId: number;
  cardName: string;
  setCode: string;
  rarities: string[];
  category: string;
  imageUrlSmall?: string;
}

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
    { label: "Category", value: "category" },
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

  get groupedCards(): SetCardDisplayRow[] {
    const grouped = new Map<string, SetCardDisplayRow>();

    for (const card of this.cards) {
      const key = `${card.card_id}|${card.set_code}`;
      const current = grouped.get(key);

      if (current) {
        if (card.set_rarity && !current.rarities.includes(card.set_rarity)) {
          current.rarities.push(card.set_rarity);
        }
        continue;
      }

      grouped.set(key, {
        cardId: card.card_id,
        cardName: card.card_name,
        setCode: card.set_code,
        rarities: card.set_rarity ? [card.set_rarity] : ["Unknown"],
        category: card.type || "-",
        imageUrlSmall: card.image_url_small,
      });
    }

    return Array.from(grouped.values());
  }

  get sortedCards(): SetCardDisplayRow[] {
    return [...this.groupedCards].sort((a, b) => {
      switch (this.sortBy) {
        case "name":
          return this.compareText(a.cardName, b.cardName);
        case "rarity":
          return this.compareText(a.rarities.join(" "), b.rarities.join(" "));
        case "category":
          return this.compareText(a.category, b.category);
        case "code":
        default:
          return this.compareText(a.setCode, b.setCode);
      }
    });
  }

  get pagedCards(): SetCardDisplayRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedCards.slice(start, start + this.pageSize);
  }

  get pageStart(): number {
    if (!this.groupedCards.length) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get pageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.groupedCards.length);
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
}
