import { Component, OnInit, inject } from "@angular/core";
import {
  YugiohApiService,
  YgoCard,
  YgoSet,
} from "../../core/yugioh-api.service";

@Component({
  selector: "app-home-page",
  standalone: false,
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
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
