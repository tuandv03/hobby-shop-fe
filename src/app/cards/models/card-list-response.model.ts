import { Pagination } from "../../shared/models/pagination.model";

export interface CardListItem {
  id: number;
  name: string;
  type?: string;
  imageUrlSmall?: string;
  setRarity?: string;
  setPrice?: number;
}

export interface CardSearchSuggestion {
  originalQuery: string;
  suggestedQuery: string;
}

export interface CardListResponse {
  items: CardListItem[];
  pagination: Pagination;
  suggestion?: CardSearchSuggestion;
}
