import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardDetail } from '../models/card-detail.model';
import { CardImage } from '../../shared/models/card.model';
import { CardsService } from '../card.service';

@Component({
  selector: 'app-card-detail',
  imports: [CommonModule],
  templateUrl: './card-detail.html',
  styleUrl: './card-detail.css'
})
export class CardDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cardsService = inject(CardsService);
  cardId: string | null = null;
  cardDetail: CardDetail | null = null;
  isLoading = true;
  error: string | null = null;

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
        
        // Fallback to mock data for demonstration
        this.loadMockData();
      }
    });
  }

  private loadMockData() {
    // Mock data for demonstration when API fails
    this.cardDetail = {
      id: 1,
      name: 'Blue-Eyes White Dragon',
      type: 'Monster',
      desc: 'Basic card description',
      description: 'This legendary dragon is a powerful engine of destruction. Virtually invincible, very few have faced this awesome creature and lived to tell the tale.',
      atk: 3000,
      def: 2500,
      level: 8,
      race: 'Dragon',
      attribute: 'LIGHT',
      archetype: 'Blue-Eyes',
      sets: [
        {
          set_name: 'Legend of Blue Eyes White Dragon',
          set_code: 'LOB-001',
          set_rarity: 'Ultra Rare',
          set_price: '$50.00'
        }
      ],
      prices: [
        {
          cardmarket_price: '$45.00',
          tcgplayer_price: '$48.00',
          ebay_price: '$50.00',
          amazon_price: '$52.00',
          coolstuffinc_price: '$47.00'
        }
      ],
      images: [
        {
          id: 1,
          image_url: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
          image_url_small: 'https://images.ygoprodeck.com/images/cards_small/89631139.jpg',
          image_url_cropped: 'https://images.ygoprodeck.com/images/cards_cropped/89631139.jpg'
        }
      ]
    };
    this.isLoading = false;
    this.error = null;
  }

  openImageModal(image: CardImage) {
    // TODO: Implement image modal functionality
    console.log('Opening image modal for:', image);
  }
}
