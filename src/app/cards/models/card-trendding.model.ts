import { Card } from "../../shared/models/card.model";

export interface TrendingCard {
  card: Card;
  soldLast7Days: number;
  viewCount: number;
}
