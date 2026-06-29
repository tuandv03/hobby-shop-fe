export interface MyInventorySearchParams {
  search?: string;
  setCode?: string;
  rarity?: string;
}

export interface MyInventoryApiCardSet {
  set_code?: string;
  set_rarity?: string;
}

export interface MyInventoryApiCardImage {
  image_url_small?: string;
}

export interface MyInventoryApiCard {
  id?: number;
  name?: string;
  rarity?: string;
  set_code?: string;
  set_rarity?: string;
  card_sets?: MyInventoryApiCardSet[];
  card_images?: MyInventoryApiCardImage[];
}

export interface MyInventoryApiItem {
  id?: number;
  card_id?: number;
  cardId?: number;
  card_name?: string;
  cardName?: string;
  name?: string;
  set_code?: string;
  setCode?: string;
  rarity?: string;
  set_rarity?: string;
  setRarity?: string;
  stock?: number;
  quantity?: number;
  stockQuantity?: number;
  reserved?: number;
  image_url_small?: string;
  imageUrl?: string;
  card?: MyInventoryApiCard;
}

export interface MyInventoryItem {
  cardId?: number;
  cardName: string;
  setCode: string;
  rarity: string;
  stockQuantity: number;
  reservedQuantity: number;
  imageUrl?: string;
}
