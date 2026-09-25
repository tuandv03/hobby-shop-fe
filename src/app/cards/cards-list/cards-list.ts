import { CommonModule } from "@angular/common";
import { Component, DestroyRef, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ButtonModule } from "primeng/button";
import { PaginatorModule, PaginatorState } from "primeng/paginator";
import { SkeletonModule } from "primeng/skeleton";
import { TagModule } from "primeng/tag";
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  of,
  switchMap,
  tap,
} from "rxjs";
import { CartService } from "../cart.service";
import { CardsService } from "../card.service";
import {
  CardListItem,
  CardListResponse,
  CardSearchSuggestion,
} from "../models/card-list-response.model";
import { CardRequest } from "../models/card-request.model";

@Component({
  standalone: true,
  selector: "app-cards-list",
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  private readonly cardsService = inject(CardsService);
  private readonly cart = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchRequests = new Subject<boolean>();

  readonly filterForm = new FormGroup({
    name: new FormControl("", { nonNullable: true }),
    code: new FormControl("", { nonNullable: true }),
    type: new FormControl("", { nonNullable: true }),
    rarity: new FormControl("", { nonNullable: true }),
  });

  cards: CardListItem[] = [];
  suggestion?: CardSearchSuggestion;
  error?: string;
  loading = false;
  showFilters = true;
  first = 0;
  pageSize = 12;
  totalRecords = 0;
  readonly pageSizeOptions = [12, 24, 48];
  readonly skeletonItems = Array.from({ length: 12 }, (_, i) => i);
  private readonly wishlist = new Set<number>();
  readonly rarities = [
    "Common",
    "Rare",
    "Super Rare",
    "Ultra Rare",
    "Starlight Rare",
    "Quarter Century Rare",
  ];

  ngOnInit(): void {
    const nameChanges = this.filterForm.controls.name.valueChanges.pipe(
      map((name) => name.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      map(() => true),
    );

    merge(of(true), nameChanges, this.searchRequests)
      .pipe(
        tap((resetPage) => {
          if (resetPage) this.first = 0;
          this.loading = true;
          this.error = undefined;
          this.suggestion = undefined;
        }),
        map(() => this.buildRequest()),
        switchMap((request) =>
          this.cardsService.getCards(request).pipe(
            catchError(() => {
              this.error = "Unable to load cards. Please try again.";
              return of<CardListResponse>({
                items: [],
                pagination: {
                  page: request.page ?? 1,
                  size: request.pageSize ?? this.pageSize,
                  total: 0,
                },
              });
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.cards = result.items;
        this.totalRecords = result.pagination.total;
        this.suggestion = result.suggestion;
        this.loading = false;
      });
  }

  search(resetPage = true): void {
    this.searchRequests.next(resetPage);
  }

  applySuggestion(): void {
    if (!this.suggestion) return;
    this.filterForm.controls.name.setValue(this.suggestion.suggestedQuery);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.pageSize = event.rows ?? this.pageSize;
    this.search(false);
  }

  addToCart(card: CardListItem): void {
    this.cart.add({
      id: card.id,
      name: card.name,
      image: card.imageUrlSmall || "",
      price: card.setPrice ?? 0,
      qty: 1,
    });
  }

  toggleWish(id: number): void {
    if (this.wishlist.has(id)) this.wishlist.delete(id);
    else this.wishlist.add(id);
  }

  isWished(id: number): boolean {
    return this.wishlist.has(id);
  }

  private buildRequest(): CardRequest {
    const filters = this.filterForm.getRawValue();
    return {
      name: filters.name.trim() || undefined,
      code: filters.code.trim() || undefined,
      type: filters.type || undefined,
      rarity: filters.rarity || undefined,
      page: Math.floor(this.first / this.pageSize) + 1,
      pageSize: this.pageSize,
    };
  }
}
