import { Card } from "../../shared/models/card.model";

export interface InventoryItem {
  card: Card;
  stock: number;
  reserved: number;
  updatedAt: string;
}
