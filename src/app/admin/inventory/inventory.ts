import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InventoryService } from './inventory.service';
import { InventoryItem } from '../models/invemtory-item';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class Inventory implements OnInit {
  searchQuery: string = '';
  inventoryItems: InventoryItem[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.loadInventory();
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
}
