import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InventoryService } from './inventory.service';
import { InventoryItem } from '../models/invemtory-item';
import { YugiohApiService, YgoSet } from '../../core/yugioh-api.service';
import { CardsService } from '../../cards/card.service';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class Inventory implements OnInit {
  private readonly syncStateKey = 'ygo.sync.lastTcgDate.en';

  searchQuery: string = '';
  inventoryItems: InventoryItem[] = [];
  loading: boolean = false;
  error: string | null = null;
  syncing: boolean = false;
  syncMessage: string | null = null;
  syncError: string | null = null;
  syncLanguage: 'en' = 'en';
  lastTcgDate: string | null = null;
  newestSets: YgoSet[] = [];

  constructor(
    private inventoryService: InventoryService,
    private yugiohApiService: YugiohApiService,
    private cardsService: CardsService,
  ) {}

  ngOnInit() {
    this.lastTcgDate = this.getStoredLastTcgDate();
    this.loadSyncState();
    this.loadInventory();
  }

  loadSyncState() {
    this.cardsService.getSyncState(this.syncLanguage).pipe(
      catchError(() => of({ lastTcgDate: this.lastTcgDate || undefined })),
    ).subscribe((state) => {
      if (!state?.lastTcgDate) return;
      this.lastTcgDate = state.lastTcgDate;
      this.setStoredLastTcgDate(state.lastTcgDate);
    });
  }

  loadInventory() {
    this.loading = true;
    this.error = null;
    
    this.inventoryService.getAllInventory().subscribe({
      next: (items) => {
        this.inventoryItems = items;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load inventory';
        this.loading = false;
        console.error('Error loading inventory:', err);
      }
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.error = null;
      
      this.inventoryService.searchInventory(this.searchQuery).subscribe({
        next: (items) => {
          this.inventoryItems = items;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Search failed';
          this.loading = false;
          console.error('Error searching inventory:', err);
        }
      });
    } else {
      this.loadInventory();
    }
  }

  onSearchInputChange() {
    if (!this.searchQuery.trim()) {
      this.loadInventory();
    }
  }

  checkNewestSets() {
    this.syncMessage = null;
    this.syncError = null;

    this.yugiohApiService
      .getNewSetsSince(this.lastTcgDate || undefined, 10)
      .subscribe({
        next: (sets) => {
          this.newestSets = sets;
          this.syncMessage = sets.length
            ? `Found ${sets.length} new set(s).`
            : 'No new sets found.';
        },
        error: () => {
          this.syncError = 'Failed to check latest sets from YGO API.';
        },
      });
  }

  syncCardsFromNewestSets() {
    this.syncing = true;
    this.syncMessage = null;
    this.syncError = null;

    this.yugiohApiService
      .getCardPrintsFromNewSets({
        lastTcgDate: this.lastTcgDate || undefined,
        setLimit: 20,
        language: this.syncLanguage,
      })
      .subscribe({
        next: (prints) => {
          if (!prints.length) {
            this.syncing = false;
            this.syncMessage = 'No new card prints to sync.';
            this.newestSets = [];
            return;
          }

          const newestDate = this.pickNewestDate(prints.map((p) => p.tcg_date));
          const setCount = new Set(prints.map((p) => p.set_code)).size;

          this.cardsService
            .syncCardPrints({ language: this.syncLanguage, prints })
            .subscribe({
              next: (res) => {
                this.syncing = false;
                this.syncMessage = `Synced ${prints.length} print(s) from ${setCount} set(s). Inserted: ${res?.inserted ?? 0}, Updated: ${res?.updated ?? 0}.`;

                if (newestDate) {
                  this.lastTcgDate = newestDate;
                  this.setStoredLastTcgDate(newestDate);
                  this.cardsService.updateSyncState(newestDate, this.syncLanguage).subscribe({ error: () => {} });
                }

                this.newestSets = [];
                this.loadInventory();
              },
              error: () => {
                this.syncing = false;
                this.syncError = 'Failed to save synced card prints to backend.';
              },
            });
        },
        error: () => {
          this.syncing = false;
          this.syncError = 'Failed to load cards from newest sets.';
        },
      });
  }

  private pickNewestDate(values: Array<string | undefined>): string | null {
    const valid = values
      .filter((v): v is string => !!v)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return valid[0] || null;
  }

  private getStoredLastTcgDate(): string | null {
    try {
      return localStorage.getItem(this.syncStateKey);
    } catch {
      return null;
    }
  }

  private setStoredLastTcgDate(value: string): void {
    try {
      localStorage.setItem(this.syncStateKey, value);
    } catch {
      // Ignore storage errors silently and keep running with in-memory state.
    }
  }
}
