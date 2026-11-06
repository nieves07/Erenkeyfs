# 🦉 Erenkeyfsss — Link Hub

Kick yayınını ve tüm sosyal medya hesaplarını tek sayfada toplayan Linktree tarzı site.
Tema: **gece moru + altın vurgu**, baykuş mascot'ı.

## Dosyalar

| Dosya | Görevi |
|---|---|
| `index.html` | Sayfa yapısı, SVG ikonlar ve baykuş mascot'ı |
| `style.css` | Mor/gece teması, kartlar, animasyonlar |
| `script.js` | Canlı yayın durumu, kopyalama, bildirimler |
| `assets/` | Profil fotoğrafı ve banner |

## Yerelde görme

```powershell
python -m http.server 8080
# tarayıcıda: http://127.0.0.1:8080
```

## Düzenleme

Tüm linkler `index.html` içindeki `<a class="card" ...>` bloklarında.
Discord davet linki için `script.js` içindeki `CONFIG.discord` alanına adresi yapıştırın:

```js
discord: "https://discord.gg/ornek",
```

## Özellikler

- Kick API'sinden **canlı yayın durumu** (oyun, izleyici sayısı, takipçi sayısı)
- E-posta tek tıkla panoya kopyalama
- Fareyle parlayan kartlar, dönen avatar halkası, animasyonlu orbs
- Mobil uyumlu, `prefers-reduced-motion` destekli
