import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { CardDetail } from '../models/card-detail.model';
import { CardImage, CardSet } from '../../shared/models/card.model';
import { CardsService } from '../card.service';

@Component({
  selector: 'app-card-detail',
  imports: [CommonModule, ButtonModule, SkeletonModule, TagModule],
  templateUrl: './card-detail.html',
  styleUrl: './card-detail.scss'
})
export class CardDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cardsService = inject(CardsService);
  cardId: string | null = null;
  cardDetail: CardDetail | null = null;
  isLoading = true;
  error: string | null = null;

  get availableSets(): CardSet[] {
    if (!this.cardDetail) return [];
    return this.cardDetail.sets?.length
      ? this.cardDetail.sets
      : this.cardDetail.card_sets ?? [];
  }

  ngOnInit() {
    this.cardId = this.route.snapshot.paramMap.get('id');
    if (this.cardId) {
      this.loadCardDetail(this.cardId);
    } else {
      this.error = 'Card ID not found';
      this.isLoading = false;
    }
  }

  private loadCardDetail(id: string) {
    this.isLoading = true;
    this.error = null;
    
    this.cardsService.getCardDetailById(id).subscribe({
      next: (cardDetail) => {
        this.cardDetail = cardDetail;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading card detail:', err);
        this.error = 'Failed to load card details. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  openImageModal(image: CardImage) {
    // TODO: Implement image modal functionality
    console.log('Opening image modal for:', image);
  }
}
