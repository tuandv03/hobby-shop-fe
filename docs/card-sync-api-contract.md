# Card Print Sync API Contract

This document defines the backend contract used by the frontend incremental sync flow:

1. Check newest sets from YGO API
2. Pull cards by each new set
3. Normalize card print versions by set + rarity + language
4. Send batch payload to backend
5. Persist sync cursor (`lastTcgDate`) for next run

Default language is English (`en`).

## 1) Get Sync State

- Method: `GET`
- Path: `/cards/sync/state`
- Query:
  - `language` (optional, default `en`)

### Request

```http
GET /cards/sync/state?language=en
```

### 200 Response

```json
{
  "lastTcgDate": "2026-03-27",
  "language": "en"
}
```

### Notes

- If no state exists yet, backend can return:
  - `200` with `{ "language": "en" }`, or
  - `404` with a clear message.
- Frontend currently handles missing state and can fallback to local storage.

## 2) Update Sync State

- Method: `POST`
- Path: `/cards/sync/state`

### Request Body

```json
{
  "lastTcgDate": "2026-04-10",
  "language": "en"
}
```

### 200 Response

```json
{
  "lastTcgDate": "2026-04-10",
  "language": "en"
}
```

### Validation

- `lastTcgDate`: required, ISO date format (`YYYY-MM-DD`)
- `language`: optional, enum: `en`, `fr`, `de`, `it`, `pt`

## 3) Sync Card Prints Batch

- Method: `POST`
- Path: `/cards/sync/prints`

### Request Body

```json
{
  "language": "en",
  "prints": [
    {
      "card_id": 46986414,
      "card_name": "Blue-Eyes White Dragon",
      "language": "en",
      "set_name": "Legend of Blue Eyes White Dragon",
      "set_code": "LOB-001",
      "set_rarity": "Ultra Rare",
      "set_rarity_code": "(UR)",
      "set_price": "35.00",
      "image_url_small": "https://images.ygoprodeck.com/images/cards_small/89631139.jpg",
      "type": "Normal Monster",
      "tcg_date": "2002-03-08"
    }
  ]
}
```

### 200 Response

```json
{
  "inserted": 120,
  "updated": 18,
  "skipped": 0
}
```

### Validation

- `language`: optional, default `en`
- `prints`: required array, can be empty but usually backend should return `400` for empty payload to avoid accidental sync calls
- Suggested required fields per print:
  - `card_id`
  - `card_name`
  - `language`
  - `set_name`
  - `set_code`
  - `set_rarity`

## Data Modeling Recommendation

Use uniqueness per card print version:

- Unique key: `(card_id, set_code, set_rarity, language)`

Reason:

- One card can appear in many sets
- One set can contain many rarities for the same card
- Same print can exist across different languages

## Idempotency Recommendation

- Endpoint `/cards/sync/prints` should support idempotent upsert behavior.
- If the same payload is submitted multiple times, records should not duplicate.

## Error Shape Recommendation

Use a consistent structure:

```json
{
  "error": "Validation failed",
  "details": [
    "prints[3].set_code is required"
  ]
}
```

## Frontend Integration Points

Frontend currently calls:

- `GET /cards/sync/state?language=en`
- `POST /cards/sync/prints`
- `POST /cards/sync/state`

Related frontend files:

- `src/app/cards/card.service.ts`
- `src/app/admin/inventory/inventory.ts`
- `src/app/core/yugioh-api.service.ts`
