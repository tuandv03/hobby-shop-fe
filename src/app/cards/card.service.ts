import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseService } from "../core/base-service.service";
import { CardDetail } from "./models/card-detail.model";

export interface Card {
  id: number;
  name: string;
  type: string;
}

@Injectable({ providedIn: "root" })
export class CardsService extends BaseService {
  getCards(filter: any): Observable<Card[]> {
    return this.get<Card[]>("cards", filter);
  }

  getCardDetailById(id: string | number): Observable<CardDetail> {
    return this.get<CardDetail>(`cards/${id}`);
  }
}
