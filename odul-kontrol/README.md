# 🎮 Kick Ödül → Oyun Tuşu

İzleyiciler Kick'te **kanal puanıyla** ödül aldığında, bilgisayarında ayarladığın tuşlara basar.

| Ödül (örnek) | Oyun | Ne yapar |
|---|---|---|
| Silahı At | Valorant | `G` basar |
| Bıçağa Geç | Valorant | `3` basar |
| Ters Direksiyon | GTA 5 | 20 sn boyunca **A'ya basınca D**, D'ye basınca A gider |
| Sağa Kır | GTA 5 | `D`'yi 3 sn basılı tutar |
| Zıpla Zıpla | GTA 5 | 5 kez `Boşluk` |
| Arabadan İn | GTA 5 | `S` 1 sn, sonra `F` |

## Kurulum (Windows)

1. [Python](https://www.python.org/downloads/) kur (kurarken **"Add Python to PATH"** kutusunu işaretle).
2. Kick'te **Yaratıcı Paneli → Kanal Puanları / Ödüller** kısmından ödülleri oluştur.
   Adları `ayarlar.json`'daki `"odul"` alanlarıyla **aynı** olmalı (büyük/küçük harf önemli değil).
3. `baslat.bat`'a çift tıkla. İlk açılışta gerekli paketi kendisi kurar.
4. Bazı oyunlar (özellikle GTA 5) tuşları ancak program **yönetici olarak** çalışırsa alır:
   `baslat.bat` → sağ tık → *Yönetici olarak çalıştır*.

## Kullanım

- Konsola ödül adını yazıp Enter'a basarsan **puan harcamadan dener** (ör. `Silahı At`). `liste` tüm ödülleri gösterir.
- **F8** = acil durdur / tekrar aç (konsola `dur` yazmak da olur).
- Her ödül sadece `"oyun"` alanındaki pencere öndeyken çalışır; oyun kapalıyken yanlışlıkla Discord'a vs. tuş basmaz.
- `"bekleme"` = aynı ödülün tekrar çalışabilmesi için gereken saniye.
- Önce `baslat.bat --deneme` ile çalıştırırsan hiçbir tuşa basmaz, sadece ne yapacağını yazar.

## Kendi ödülünü eklemek

`ayarlar.json` içinde `"oduller"` listesine yeni blok ekle:

```json
{
  "odul": "Nişan Al",
  "oyun": "VALORANT",
  "bekleme": 30,
  "eylemler": [ { "tip": "basili_tut", "tus": "sag_tik", "sure": 2 } ]
}
```

Eylem tipleri (`eylemler` sırayla çalışır):

| tip | alanlar | açıklama |
|---|---|---|
| `bas` | `tus`, `tekrar`, `ara` | tuşa bas-bırak (`tekrar` kez, aralarda `ara` sn) |
| `basili_tut` | `tus`, `sure` | tuşu `sure` sn basılı tut |
| `bekle` | `sure` | bekle |
| `tus_degistir` | `harita`, `sure` | `sure` sn boyunca tuşları değiştir, ör. `{"a":"d","d":"a"}` |

Tuş adları: `a`–`z`, `0`–`9`, `f1`–`f12`, `bosluk`, `enter`, `esc`, `tab`, `shift`, `ctrl`, `alt`,
`yukari`, `asagi`, `sol`, `sag`, `sol_tik`, `sag_tik`, `orta_tik`.

## Sorun giderme

- **"Sohbet odası numarası otomatik bulunamadı"** → tarayıcıda
  `https://kick.com/api/v2/channels/erenkeyfsss` aç; `"chatroom":{"id": ...}` sayısını
  `ayarlar.json` → `chatroom_id`'ye, en baştaki `"id"` sayısını `channel_id`'ye yaz.
- **Ödül alındı ama hiçbir şey olmadı** → `baslat.bat --hata-ayikla` ile aç, ödül al;
  ekrana düşen olayın adını ve ödül adını kontrol et.
- **Tuş konsolda çalışıyor ama oyunda değil** → yönetici olarak çalıştır, oyunu pencereli-tam ekran yap.

## ⚠️ Valorant uyarısı

Valorant'ın anti-hilesi (Vanguard) yazılımla gönderilen tuşları **engelleyebilir veya şüpheli bulabilir**;
Riot'un kuralları üçüncü parti otomasyona karşı katı. Yani Valorant'ta hiç çalışmayabilir ve
küçük de olsa hesap riski var — önce yan hesapta / Antrenman modunda dene. GTA 5 hikâye modunda
sorun yok; FiveM sunucularında sunucunun kurallarına bak.

Kick, ödül oyun kapalıyken atlandığında puanı otomatik iade etmez; gerekirse ödülleri Kick panelinden
duraklat ya da elle iade et.
