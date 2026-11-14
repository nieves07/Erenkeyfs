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
- `maxTo` / `minTo`: booster'ın boost yaptığı hedef rank aralığı (ör. `maxTo: "platin"`,
  `minTo: "elmas"`). Aralık dışındaki hedeflerde booster soluk görünür, seçilemez.
- `SPLIT_AFTER = "platin"`: Platin'i aşan siparişler ikiye bölünür (Platin 3'e kadar /
  sonrası) ve müşteri her parça için booster'ını ayrı seçer.
- `HIGH_FEE = 25`: Platin 3 sonrası (ClorNe) kısmına eklenen yüzde; sitede belirgin uyarıyla
  gösterilir. `0` yaparsan kalkar.
- İlk satırdaki "Fark etmez" seçeneğini silme

**Ekstra seçenekler** — `percent` fiyata eklenecek yüzde (0 = ücretsiz):

```js
{ name: "Öncelikli Sipariş", desc: "...", percent: 25, tag: "Şu an en popüler" },
```

**Müşteri yorumları** — gerçek yorumları `REVIEWS` listesine yaz, `sample: true` satırını sil
(o satır kartta "Örnek" etiketi gösterir):

```js
{ name: "Ali", order: "Gümüş 2 → Altın 3", rating: 5, text: "Çok hızlıydı, teşekkürler!" },
```

**Kampanya bandı** — sitenin en üstündeki şerit:

```js
const CAMPAIGN = { active: true, tr: "Sezon sonuna özel %10 indirim!", en: "10% off!", code: "OWL10" };
```

`active: false` bandı gizler. `code` banttaki butona basınca otomatik uygulanır.

**İndirim kodları** — `"KOD": yüzde` (büyük/küçük harf fark etmez):

```js
const CODES = { OWL10: 10, YAYIN15: 15 };
```

**Sadakat indirimi** — çok kademe atlayana otomatik indirim (indirim koduyla toplanır):

```js
const LOYALTY = [ { min: 6, percent: 5 }, { min: 12, percent: 10 } ];   // kapatmak için: []
```

**Sipariş galerisi** — görselleri `boost/assets/galeri/` klasörüne koy, `GALLERY` listesine yaz,
`sample: true` satırlarını sil:

```js
{ before: "assets/galeri/ali-once.png", after: "assets/galeri/ali-sonra.png", caption: "Gümüş 2 → Altın 3" },
```

Görsele tıklanınca büyük hali açılır.

## Dil (TR / EN)

Menüdeki TR/EN düğmesiyle değişir; seçim tarayıcıda hatırlanır. İlk ziyarette tarayıcı
dili Türkçe değilse İngilizce açılır. Türkçe metinler `index.html` içinde, İngilizceleri
`i18n.js` dosyasında. Ayarlardaki `name_en`, `desc_en`, `tag_en` alanları İngilizce karşılıklardır.

## Yerelde görme

```bash
cd boost && python -m http.server 8080
```
