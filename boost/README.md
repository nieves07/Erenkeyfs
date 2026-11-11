# 🦉 KEYFS Boost — Valorant Elo Boost Sitesi

Mor/gece temalı, KEYFS logolu tek sayfalık boost sitesi.

## Düzenleme (sadece `script.js` en üstü)

```js
const CONFIG = {
  discord: "https://discord.gg/ORNEK",   // ← Discord davet linkin
  currency: "₺",
};
```

Fiyatlar `PACKAGES` listesinde. `price: null` → "Yakında" yazar. Fiyat yazmak için:

```js
{ from: "gumus", to: "yucel", type: "kombo", price: 1500, old: 1800, tag: "En Popüler" },
```

- `old` (isteğe bağlı): üstü çizili eski fiyat
- `tag` (isteğe bağlı): kartın köşesindeki etiket
- Rank anahtarları: `demir, bronz, gumus, altin, platin, elmas, yucel, immo`

## Sipariş akışı

Sipariş Ver → risk onay penceresi (kutucuk işaretlenmeden devam edilemez) →
paket adı panoya kopyalanır → Discord sunucusu yeni sekmede açılır.

## Yerelde görme

```bash
cd boost && python -m http.server 8080
```
