import { Card } from "../../shared/models/card.model";
import { Pagination } from "../../shared/models/pagination.model";


export interface CardListItem extends Card {
  inStock: boolean;   // 👈 thêm flag
}

export interface CardListResponse {
  items: CardListItem[];
  pagination: Pagination;
}