import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { concatMap, from, map, Observable, of, reduce } from "rxjs";
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

export interface YgoSearchMeta {
  total_rows?: number;
  rows_remaining?: number;
  current_rows?: number;
  current_page?: number;
  pages_remaining?: number;
  next_page?: string;
}

export interface YgoCardSearchResult {
  data: YgoCard[];
  meta?: YgoSearchMeta;
}

export interface YgoCardPrintVersion {
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
    return this.getSets().pipe(
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

  getNewSetsSince(lastTcgDate?: string, limit = 20): Observable<YgoSet[]> {
    return this.getLatestSets(500).pipe(
      map((sets) => {
        if (!lastTcgDate) return sets.slice(0, limit);
        const last = new Date(lastTcgDate).getTime();
        return sets
          .filter((s) => new Date(s.tcg_date || 0).getTime() > last)
          .slice(0, limit);
      }),
    );
  }

  getCardsBySet(
    set: Pick<YgoSet, "set_name" | "set_code" | "tcg_date">,
    opts?: { language?: "en" | "fr" | "de" | "it" | "pt"; num?: number; offset?: number },
  ): Observable<YgoCardPrintVersion[]> {
    const language = opts?.language ?? "en";
    const num = opts?.num ?? 200;
    const offset = opts?.offset ?? 0;

    let params = new HttpParams()
      .set("cardset", set.set_name)
      .set("sort", "new")
      .set("num", num)
      .set("offset", offset);

    if (language !== "en") {
      params = params.set("language", language);
    }

    return this.http
      .get<{ data: YgoCard[] }>(`${this.base}/cardinfo.php`, { params })
      .pipe(
        map((r) => r.data || []),
        map((cards) => this.toCardPrintVersions(cards, set, language)),
      );
  }

  getSets(): Observable<YgoSet[]> {
    return this.http.get<YgoSet[]>(`${this.base}/cardsets.php`).pipe(
      map((sets) =>
        (sets || []).sort((a, b) => {
          const byDate =
            new Date(b.tcg_date || 0).getTime() -
            new Date(a.tcg_date || 0).getTime();
          if (byDate) return byDate;
          return a.set_name.localeCompare(b.set_name);
        }),
      ),
    );
  }

  getCardPrintsFromNewSets(opts?: {
    lastTcgDate?: string;
    setLimit?: number;
    language?: "en" | "fr" | "de" | "it" | "pt";
  }): Observable<YgoCardPrintVersion[]> {
    const setLimit = opts?.setLimit ?? 20;
    const language = opts?.language ?? "en";

    return this.getNewSetsSince(opts?.lastTcgDate, setLimit).pipe(
      concatMap((sets) => {
        if (!sets.length) return of([] as YgoCardPrintVersion[]);
        return from(sets).pipe(
          concatMap((set) => this.getCardsBySet(set, { language })),
          reduce(
            (all, current) => {
              all.push(...current);
              return all;
            },
            [] as YgoCardPrintVersion[],
          ),
        );
      }),
      map((prints) => {
        const uniq = new Map<string, YgoCardPrintVersion>();
        for (const p of prints) {
          const key = `${p.card_id}|${p.set_code}|${p.set_rarity}|${p.language}`;
          if (!uniq.has(key)) uniq.set(key, p);
        }
        return Array.from(uniq.values());
      }),
    );
  }

  searchCards(opts: {
    name?: string;
    code?: string;
    type?: string;
    num?: number;
    offset?: number;
  }): Observable<YgoCard[]> {
    return this.searchCardsPage(opts).pipe(map((r) => r.data));
  }

  searchCardsPage(opts: {
    name?: string;
    code?: string;
    type?: string;
    num?: number;
    offset?: number;
  }): Observable<YgoCardSearchResult> {
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
      .get<YgoCardSearchResult>(`${this.base}/cardinfo.php`, { params })
      .pipe(map((r) => ({ data: r.data || [], meta: r.meta })));
  }

  private toCardPrintVersions(
    cards: YgoCard[],
    set: Pick<YgoSet, "set_name" | "set_code" | "tcg_date">,
    language: string,
  ): YgoCardPrintVersion[] {
    return cards.flatMap((c) => {
      const matchingSets = (c.card_sets || []).filter((s) => {
        const bySetName = (s.set_name || "").toLowerCase() === set.set_name.toLowerCase();
        const bySetCodePrefix = (s.set_code || "").toUpperCase().startsWith((set.set_code || "").toUpperCase());
        return bySetName || bySetCodePrefix;
      });

      return matchingSets.map((s) => ({
        card_id: c.id,
        card_name: c.name,
        language,
        set_name: s.set_name,
        set_code: s.set_code,
        set_rarity: s.set_rarity,
        set_rarity_code: s.set_rarity_code,
        set_price: s.set_price,
        image_url_small: c.card_images?.[0]?.image_url_small,
        type: c.type,
        tcg_date: set.tcg_date,
      }));
    });
  }
}
