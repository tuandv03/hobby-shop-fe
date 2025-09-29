import { Card, CardSet, CardPrice, CardImage } from "../../shared/models/card.model";

export interface CardDetail extends Card {
  description: string;
  sets?: CardSet[];
  prices?: CardPrice[];
  images?: CardImage[];
}
