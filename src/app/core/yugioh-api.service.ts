import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from "../../environments/environment";

export interface YgoCardPrice {
  tcgplayer_price: string;
  ebay_price: string;
  amazon_price: string;
  cardmarket_price: string;
}
export interface YgoCardImage {
  id?: number;
  image_url: string;
  image_url_small: string;
}
export interface YgoCardSet {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code: string;
  set_price?: string;
}
export interface YgoCard {
  id: number;
  name: string;
  type: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  card_sets?: YgoCardSet[];
  card_images: YgoCardImage[];
  card_prices: YgoCardPrice[];
}
export interface YgoSet {
  set_name: string;
  set_code: string;
  num_of_cards: number;
  tcg_date?: string;
}

@Injectable({ providedIn: "root" })
export class YugiohApiService {
  private http = inject(HttpClient);
  private base = environment.ygoApiBase ?? "https://db.ygoprodeck.com/api/v7";

  getHotCards(limit = 8): Observable<YgoCard[]> {
    const params = new HttpParams()
      .set("format", "tcg")
      .set("num", 120)
      .set("offset", 0);
    return this.http
      .get<{ data: YgoCard[] }>(`${this.base}/cardinfo.php`, { params })
      .pipe(
        map((res) => res.data || []),
        map((cards) =>
          cards
            .map((c) => ({
              ...c,
              _price: parseFloat(c.card_prices?.[0]?.tcgplayer_price || "0"),
            }))
            .sort((a: any, b: any) => b._price - a._price)
            .slice(0, limit),
        ),
      );
  }

  getLatestSets(limit = 6): Observable<YgoSet[]> {
    return this.http.get<YgoSet[]>(`${this.base}/cardsets.php`).pipe(
      map((sets) => (sets || []).filter((s) => !!s.tcg_date)),
      map((sets) =>
        sets
          .sort(
            (a, b) =>
              new Date(b.tcg_date || 0).getTime() -
              new Date(a.tcg_date || 0).getTime(),
          )
          .slice(0, limit),
      ),
    );
  }

  searchCards(opts: {
    name?: string;
    code?: string;
    type?: string;
    num?: number;
    offset?: number;
  }): Observable<YgoCard[]> {
    let params = new HttpParams();
    if (opts.name) params = params.set("fname", opts.name);
    if (opts.code) {
      if (/^\d{6,}$/.test(opts.code)) params = params.set("id", opts.code);
      else params = params.set("setcode", opts.code);
    }
    if (opts.type) params = params.set("type", opts.type);
    if (opts.num !== undefined) params = params.set("num", opts.num);
    if (opts.offset !== undefined) params = params.set("offset", opts.offset);
    return this.http
      .get<{ data: YgoCard[] }>(`${this.base}/cardinfo.php`, { params })
      .pipe(map((r) => r.data || []));
  }
}
