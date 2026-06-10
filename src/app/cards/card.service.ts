import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseService } from "../core/base-service.service";
import { CardDetail } from "./models/card-detail.model";

export interface Card {
  id: number;
  name: string;
  type: string;
}

export interface CardPrintPayload {
  card_id: number;
  card_name: string;
  language: string;
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code?: string;
  set_price?: string;
  image_url_small?: string;
  type?: string;
  tcg_date?: string;
}

export interface SyncCardPrintsRequest {
  language: string;
  prints: CardPrintPayload[];
}

export interface SyncCardPrintsResponse {
  inserted?: number;
  updated?: number;
  skipped?: number;
}

export interface CardSyncState {
  lastTcgDate?: string;
  language?: string;
}

@Injectable({ providedIn: "root" })
export class CardsService extends BaseService {
  getCards(filter: any): Observable<Card[]> {
    return this.get<Card[]>("cards", filter);
  }

  getCardDetailById(id: string | number): Observable<CardDetail> {
    return this.get<CardDetail>(`cards/${id}`);
  }

  syncCardPrints(payload: SyncCardPrintsRequest): Observable<SyncCardPrintsResponse> {
    return this.post<SyncCardPrintsResponse>("cards/sync/prints", payload);
  }

  getSyncState(language = "en"): Observable<CardSyncState> {
    return this.get<CardSyncState>("cards/sync/state", { language });
  }

  updateSyncState(lastTcgDate: string, language = "en"): Observable<CardSyncState> {
    return this.post<CardSyncState>("cards/sync/state", { lastTcgDate, language });
  }
}
