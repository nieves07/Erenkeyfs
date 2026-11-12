# 🦉 OwlRank EloBoost — Valorant Elo Boost Sitesi

Mor/gece temalı, baykuş logolu tek sayfalık boost sitesi.
Canlı adres: https://nieves07.github.io/Erenkeyfs/boost/

## Boost hesaplayıcı

Müşteri sırasıyla şunları seçer:
1. Şu anki rankı + kademesi (Demir 1 – Ölümsüzlük 3)
2. Hedef rankı + kademesi (Radyant dahil; mevcut ranktan düşükler kapalı)
3. Booster (veya "Fark etmez")

Sağdaki özet kutusu kademe sayısını ve toplam fiyatı gösterir.
Sipariş Ver → risk onayı → özet panoya kopyalanır → Discord açılır.

## Düzenleme (hepsi `script.js` en üstünde)

```js
const CONFIG = { discord: "https://discord.gg/ORNEK", currency: "₺" };
```

**Fiyatlar** — her rankta 1 kademe atlamanın fiyatı:

```js
const PRICES = { demir: 50, bronz: 70, gumus: 100, altin: 150, platin: 200, elmas: 300, yucel: 450, immo: 700 };
```

Örnek: Gümüş 3 → Altın 2 = 1×gumus + 1×altin. Herhangi bir fiyat `null` ise
toplam yerine "Discord'da belirlenir" yazar.

**Boosterlar**:

```js
{ name: "Ahmet", tag: "Radiant · Düellocu", photo: "assets/boosters/ahmet.png", extra: 10 },
```

- `photo` (isteğe bağlı): resim yoksa ismin baş harfleri gösterilir
- `extra` (isteğe bağlı): bu booster için ek ücret yüzdesi
- İlk satırdaki "Fark etmez" seçeneğini silme

## Yerelde görme

```bash
cd boost && python -m http.server 8080
```
