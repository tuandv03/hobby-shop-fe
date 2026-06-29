import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { BaseService } from "../../core/base-service.service";
import {
  MyInventoryApiItem,
  MyInventoryItem,
  MyInventorySearchParams,
} from "../models/my-inventory.model";

@Injectable({ providedIn: "root" })
export class MyInventoryService extends BaseService {
  getMyInventory(params: MyInventorySearchParams = {}): Observable<MyInventoryItem[]> {
    // TODO: [Gia dinh] Confirm exact endpoint and response DTO with backend.
    // This uses the existing inventory endpoint and normalizes both current nested
    // admin inventory DTO and a future flat card inventory DTO.
    return this.get<MyInventoryApiItem[]>("inventory", params).pipe(
      map((items) => items.map((item) => this.toInventoryItem(item))),
    );
  }

  private toInventoryItem(item: MyInventoryApiItem): MyInventoryItem {
    const card = item.card;
    const firstSet = card?.card_sets?.[0];

    return {
      cardId: item.cardId ?? item.card_id ?? card?.id ?? item.id,
      cardName: item.cardName ?? item.card_name ?? item.name ?? card?.name ?? "Unknown card",
      setCode: item.setCode ?? item.set_code ?? card?.set_code ?? firstSet?.set_code ?? "N/A",
      rarity:
        item.setRarity ??
        item.set_rarity ??
        item.rarity ??
        card?.set_rarity ??
        card?.rarity ??
        firstSet?.set_rarity ??
        "Unknown",
      stockQuantity: item.stockQuantity ?? item.quantity ?? item.stock ?? 0,
      reservedQuantity: item.reserved ?? 0,
      imageUrl: item.imageUrl ?? item.image_url_small ?? card?.card_images?.[0]?.image_url_small,
    };
  }
}
