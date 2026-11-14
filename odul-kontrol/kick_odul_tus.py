"""
Kick Kanal Puanı -> Oyun Tuşu
=============================

İzleyiciler Kick'te kanal puanıyla bir ödül aldığında, bu program
bilgisayarında ayarlanmış tuşlara basar.
Örnek: "Silahı At" -> G, "Bıçağa Geç" -> 3, "Ters Direksiyon" -> A ile D yer değiştirir.

Çalıştırma:   python kick_odul_tus.py
Seçenekler:   --deneme   tuşlara basmaz, sadece ne yapacağını yazar
              --hata-ayikla   Kick'ten gelen tüm olayları ekrana yazar

Program açıkken konsola ödül adını yazıp Enter'a basarsan o ödülü
puan harcamadan deneyebilirsin. Duraklatmak için varsayılan F8.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
import threading
import time
import unicodedata
import urllib.request
from pathlib import Path

BURASI = Path(__file__).resolve().parent
AYAR_DOSYASI = BURASI / "ayarlar.json"

# Kick'in sohbet için kullandığı herkese açık Pusher sunucusu
PUSHER_URL = (
    "wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679"
    "?protocol=7&client=js&version=8.4.0&flash=false"
)

WINDOWS = sys.platform == "win32"
DENEME = False
HATA_AYIKLA = False
DURAKLATILDI = threading.Event()  # set ise ödüller çalışmaz


def yaz(*parcalar):
    print(time.strftime("[%H:%M:%S]"), *parcalar, flush=True)


# --------------------------------------------------------------------------
# Tuş tablosu: ad -> (sanal tuş kodu, genişletilmiş mi)
# --------------------------------------------------------------------------
TUSLAR: dict[str, tuple[int, bool]] = {}
for _c in "abcdefghijklmnopqrstuvwxyz":
    TUSLAR[_c] = (ord(_c.upper()), False)
for _d in "0123456789":
    TUSLAR[_d] = (ord(_d), False)
for _i in range(1, 13):
    TUSLAR[f"f{_i}"] = (0x6F + _i, False)
TUSLAR.update({
    "bosluk": (0x20, False), "space": (0x20, False),
    "enter": (0x0D, False), "esc": (0x1B, False), "tab": (0x09, False),
    "shift": (0x10, False), "ctrl": (0x11, False), "alt": (0x12, False),
    "capslock": (0x14, False), "backspace": (0x08, False),
    "yukari": (0x26, True), "asagi": (0x28, True),
    "sol": (0x25, True), "sag": (0x27, True),
    "insert": (0x2D, True), "delete": (0x2E, True),
    "home": (0x24, True), "end": (0x23, True),
    "pageup": (0x21, True), "pagedown": (0x22, True),
})
FARE = {"sol_tik", "sag_tik", "orta_tik"}


def tus_bilgisi(ad: str) -> tuple[int, bool]:
    ad = ad.strip().lower()
    if ad not in TUSLAR:
        raise ValueError(f"Bilinmeyen tuş: '{ad}'")
    return TUSLAR[ad]


# --------------------------------------------------------------------------
# Windows girdi gönderme (oyunlar için tarama kodu / scancode kullanır)
# --------------------------------------------------------------------------
if WINDOWS:
    import ctypes
    from ctypes import wintypes

    user32 = ctypes.WinDLL("user32", use_last_error=True)
    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    ULONG_PTR = ctypes.c_size_t
    LRESULT = ctypes.c_ssize_t

    class KEYBDINPUT(ctypes.Structure):
        _fields_ = [("wVk", wintypes.WORD), ("wScan", wintypes.WORD),
                    ("dwFlags", wintypes.DWORD), ("time", wintypes.DWORD),
                    ("dwExtraInfo", ULONG_PTR)]

    class MOUSEINPUT(ctypes.Structure):
        _fields_ = [("dx", wintypes.LONG), ("dy", wintypes.LONG),
                    ("mouseData", wintypes.DWORD), ("dwFlags", wintypes.DWORD),
                    ("time", wintypes.DWORD), ("dwExtraInfo", ULONG_PTR)]

    class HARDWAREINPUT(ctypes.Structure):
        _fields_ = [("uMsg", wintypes.DWORD), ("wParamL", wintypes.WORD),
                    ("wParamH", wintypes.WORD)]

    class _GIRDI(ctypes.Union):
        _fields_ = [("mi", MOUSEINPUT), ("ki", KEYBDINPUT), ("hi", HARDWAREINPUT)]

    class INPUT(ctypes.Structure):
        _fields_ = [("type", wintypes.DWORD), ("u", _GIRDI)]

    class KBDLLHOOKSTRUCT(ctypes.Structure):
        _fields_ = [("vkCode", wintypes.DWORD), ("scanCode", wintypes.DWORD),
                    ("flags", wintypes.DWORD), ("time", wintypes.DWORD),
                    ("dwExtraInfo", ULONG_PTR)]

    HOOKPROC = ctypes.WINFUNCTYPE(LRESULT, ctypes.c_int, wintypes.WPARAM, wintypes.LPARAM)

    user32.SendInput.argtypes = [wintypes.UINT, ctypes.POINTER(INPUT), ctypes.c_int]
    user32.SendInput.restype = wintypes.UINT
    user32.MapVirtualKeyW.argtypes = [wintypes.UINT, wintypes.UINT]
    user32.MapVirtualKeyW.restype = wintypes.UINT
    user32.SetWindowsHookExW.argtypes = [ctypes.c_int, HOOKPROC, wintypes.HINSTANCE, wintypes.DWORD]
    user32.SetWindowsHookExW.restype = wintypes.HHOOK
    user32.CallNextHookEx.argtypes = [wintypes.HHOOK, ctypes.c_int, wintypes.WPARAM, wintypes.LPARAM]
    user32.CallNextHookEx.restype = LRESULT
    user32.GetMessageW.argtypes = [ctypes.POINTER(wintypes.MSG), wintypes.HWND, wintypes.UINT, wintypes.UINT]
    user32.GetForegroundWindow.restype = wintypes.HWND
    user32.GetWindowTextW.argtypes = [wintypes.HWND, wintypes.LPWSTR, ctypes.c_int]
    kernel32.GetModuleHandleW.argtypes = [wintypes.LPCWSTR]
    kernel32.GetModuleHandleW.restype = wintypes.HMODULE

    INPUT_MOUSE, INPUT_KEYBOARD = 0, 1
    KEYEVENTF_EXTENDEDKEY, KEYEVENTF_KEYUP, KEYEVENTF_SCANCODE = 0x1, 0x2, 0x8
    FARE_BAYRAK = {
        "sol_tik": (0x0002, 0x0004),
        "sag_tik": (0x0008, 0x0010),
        "orta_tik": (0x0020, 0x0040),
    }

    def _gonder(girdi: INPUT):
        user32.SendInput(1, ctypes.byref(girdi), ctypes.sizeof(INPUT))

    def _tus_olayi(vk: int, genis: bool, birak: bool):
        scan = user32.MapVirtualKeyW(vk, 0)
        bayrak = KEYEVENTF_SCANCODE
        if genis:
            bayrak |= KEYEVENTF_EXTENDEDKEY
        if birak:
            bayrak |= KEYEVENTF_KEYUP
        g = INPUT(type=INPUT_KEYBOARD)
        g.u.ki = KEYBDINPUT(wVk=0, wScan=scan, dwFlags=bayrak, time=0, dwExtraInfo=0)
        _gonder(g)

    def _fare_olayi(ad: str, birak: bool):
        g = INPUT(type=INPUT_MOUSE)
        g.u.mi = MOUSEINPUT(0, 0, 0, FARE_BAYRAK[ad][1 if birak else 0], 0, 0)
        _gonder(g)

    def on_plandaki_pencere() -> str:
        hwnd = user32.GetForegroundWindow()
        tampon = ctypes.create_unicode_buffer(512)
        user32.GetWindowTextW(hwnd, tampon, 512)
        return tampon.value


def tus_indir(ad: str):
    if DENEME or not WINDOWS:
        return
    if ad in FARE:
        _fare_olayi(ad, False)
    else:
        _tus_olayi(*tus_bilgisi(ad), birak=False)


def tus_birak(ad: str):
    if DENEME or not WINDOWS:
        return
    if ad in FARE:
        _fare_olayi(ad, True)
    else:
        _tus_olayi(*tus_bilgisi(ad), birak=True)


if not WINDOWS:
    def on_plandaki_pencere() -> str:  # noqa: F811 - Windows dışında deneme için
        return ""


# --------------------------------------------------------------------------
# Klavye kancası: tuş değiştirme (A -> D gibi) ve duraklatma tuşu
# --------------------------------------------------------------------------
class KlavyeKancasi:
    def __init__(self, duraklat_tusu: str | None):
        self.kilit = threading.Lock()
        self.haritalar: dict[int, str] = {}  # gerçek vk -> basılacak tuş adı
        self.duraklat_vk = tus_bilgisi(duraklat_tusu)[0] if duraklat_tusu else None
        self._proc = None

    def baslat(self):
        if not WINDOWS:
            return
        threading.Thread(target=self._dongu, daemon=True).start()

    def _dongu(self):
        WM_KEYDOWN, WM_KEYUP, WM_SYSKEYDOWN, WM_SYSKEYUP = 0x100, 0x101, 0x104, 0x105
        LLKHF_INJECTED = 0x10

        def isle(n_code, w_param, l_param):
            if n_code == 0:
                kb = ctypes.cast(l_param, ctypes.POINTER(KBDLLHOOKSTRUCT)).contents
                if not (kb.flags & LLKHF_INJECTED):  # programın kendi bastıklarını yok say
                    asagi = w_param in (WM_KEYDOWN, WM_SYSKEYDOWN)
                    yukari = w_param in (WM_KEYUP, WM_SYSKEYUP)
                    if asagi and kb.vkCode == self.duraklat_vk:
                        duraklat_degistir()
                    with self.kilit:
                        hedef = self.haritalar.get(kb.vkCode)
                    if hedef and (asagi or yukari):
                        (tus_indir if asagi else tus_birak)(hedef)
                        return 1  # asıl tuşu oyuna gönderme
            return user32.CallNextHookEx(None, n_code, w_param, l_param)

        self._proc = HOOKPROC(isle)
        kanca = user32.SetWindowsHookExW(13, self._proc, kernel32.GetModuleHandleW(None), 0)
        if not kanca:
            yaz("UYARI: Klavye kancası kurulamadı, tuş değiştirme çalışmayacak.")
            return
        mesaj = wintypes.MSG()
        while user32.GetMessageW(ctypes.byref(mesaj), None, 0, 0) != 0:
            pass

    def degistir(self, harita: dict[str, str], sure: float):
        vk_harita = {tus_bilgisi(k)[0]: v.lower() for k, v in harita.items()}
        for v in vk_harita.values():
            tus_bilgisi(v)  # geçerli mi kontrol
        # o an basılı olan tuşlar takılı kalmasın
        for k in harita:
            tus_birak(k)
        with self.kilit:
            self.haritalar.update(vk_harita)
        time.sleep(sure)
        with self.kilit:
            for vk in vk_harita:
                self.haritalar.pop(vk, None)
        for v in vk_harita.values():
            tus_birak(v)


KANCA: KlavyeKancasi | None = None


def duraklat_degistir():
    if DURAKLATILDI.is_set():
        DURAKLATILDI.clear()
        yaz("▶  Ödüller TEKRAR AÇIK")
    else:
        DURAKLATILDI.set()
        yaz("⏸  Ödüller DURAKLATILDI (tekrar açmak için duraklatma tuşuna bas)")


# --------------------------------------------------------------------------
# Eylemler
# --------------------------------------------------------------------------
def eylemi_calistir(e: dict):
    tip = e.get("tip", "bas")
    if tip == "bas":
        tus = e["tus"].lower()
        for _ in range(int(e.get("tekrar", 1))):
            tus_indir(tus)
            time.sleep(float(e.get("basma_suresi", 0.05)))
            tus_birak(tus)
            time.sleep(float(e.get("ara", 0.08)))
    elif tip == "basili_tut":
        tus = e["tus"].lower()
        tus_indir(tus)
        time.sleep(float(e.get("sure", 1)))
        tus_birak(tus)
    elif tip == "bekle":
        time.sleep(float(e.get("sure", 0.5)))
    elif tip == "tus_degistir":
        if KANCA:
            KANCA.degistir(e["harita"], float(e.get("sure", 10)))
    else:
        yaz(f"UYARI: Bilinmeyen eylem tipi '{tip}'")


def eylem_metni(e: dict) -> str:
    tip = e.get("tip", "bas")
    if tip == "bas":
        t = int(e.get("tekrar", 1))
        return f"{e['tus'].upper()} bas" + (f" x{t}" if t > 1 else "")
    if tip == "basili_tut":
        return f"{e['tus'].upper()} {e.get('sure', 1)} sn basılı tut"
    if tip == "bekle":
        return f"{e.get('sure', 0.5)} sn bekle"
    if tip == "tus_degistir":
        h = ", ".join(f"{k.upper()}→{v.upper()}" for k, v in e["harita"].items())
        return f"{e.get('sure', 10)} sn boyunca {h}"
    return tip


# --------------------------------------------------------------------------
# Ödül yöneticisi
# --------------------------------------------------------------------------
def normalle(metin: str) -> str:
    metin = metin.replace("İ", "i").replace("I", "ı").lower()
    metin = metin.replace("ı", "i")
    metin = unicodedata.normalize("NFKD", metin)
    metin = "".join(c for c in metin if not unicodedata.combining(c))
    return " ".join(metin.split())


class OdulYoneticisi:
    def __init__(self, ayarlar: dict):
        self.oduller = {}
        for o in ayarlar.get("oduller", []):
            for e in o.get("eylemler", []):
                for t in [e.get("tus")] + list(e.get("harita", {}).keys()) + list(e.get("harita", {}).values()):
                    if t and t.lower() not in FARE:
                        tus_bilgisi(t)  # yazım hatası varsa başta yakala
            self.oduller[normalle(o["odul"])] = o
        self.son_calisma: dict[str, float] = {}
        self.calisanlar: set[str] = set()
        self.kilit = threading.Lock()

    def tetikle(self, odul_adi: str, kullanici: str = "konsol"):
        anahtar = normalle(odul_adi)
        odul = self.oduller.get(anahtar)
        if not odul:
            yaz(f"• '{odul_adi}' ({kullanici}) — ayarlarda yok, yok sayıldı")
            return
        if DURAKLATILDI.is_set():
            yaz(f"⏸ '{odul['odul']}' ({kullanici}) — duraklatıldığı için atlandı")
            return
        oyun = odul.get("oyun")
        if oyun and WINDOWS and not DENEME:
            pencere = on_plandaki_pencere()
            if normalle(oyun) not in normalle(pencere):
                yaz(f"✗ '{odul['odul']}' ({kullanici}) — oyun açık değil "
                    f"(aranan: '{oyun}', şu an: '{pencere or '-'}')")
                return
        with self.kilit:
            simdi = time.monotonic()
            bekleme = float(odul.get("bekleme", 0))
            kalan = bekleme - (simdi - self.son_calisma.get(anahtar, -1e9))
            if kalan > 0:
                yaz(f"⌛ '{odul['odul']}' ({kullanici}) — bekleme süresinde, {kalan:.0f} sn kaldı")
                return
            if anahtar in self.calisanlar:
                yaz(f"⌛ '{odul['odul']}' ({kullanici}) — hâlâ çalışıyor, atlandı")
                return
            self.son_calisma[anahtar] = simdi
            self.calisanlar.add(anahtar)

        adimlar = " → ".join(eylem_metni(e) for e in odul.get("eylemler", []))
        yaz(f"🎁 {kullanici}: '{odul['odul']}'  [{adimlar}]" + ("  (deneme modu)" if DENEME else ""))

        def calis():
            try:
                for e in odul.get("eylemler", []):
                    eylemi_calistir(e)
            except Exception as hata:
                yaz(f"HATA ('{odul['odul']}'): {hata}")
            finally:
                with self.kilit:
                    self.calisanlar.discard(anahtar)

        threading.Thread(target=calis, daemon=True).start()


# --------------------------------------------------------------------------
# Kick bağlantısı
# --------------------------------------------------------------------------
def kanal_bilgisi_al(kanal: str) -> tuple[int | None, int | None]:
    """Kanalın sohbet odası ve kanal numarasını Kick'ten çekmeyi dener."""
    url = f"https://kick.com/api/v2/channels/{kanal}"
    veri = None
    try:
        istek = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                          "(KHTML, like Gecko) Chrome/130.0 Safari/537.36",
            "Accept": "application/json",
        })
        with urllib.request.urlopen(istek, timeout=10) as yanit:
            veri = json.load(yanit)
    except Exception:
        try:
            import cloudscraper  # isteğe bağlı: Cloudflare engelini aşmak için
            veri = cloudscraper.create_scraper().get(url, timeout=15).json()
        except Exception:
            veri = None
    if not veri:
        return None, None
    return (veri.get("chatroom") or {}).get("id"), veri.get("id")


def odul_verisini_coz(ham) -> tuple[str | None, str]:
    """Farklı olay biçimlerinden ödül adını ve kullanıcıyı çıkarır."""
    if isinstance(ham, str):
        try:
            ham = json.loads(ham)
        except json.JSONDecodeError:
            return None, "?"
    if not isinstance(ham, dict):
        return None, "?"
    odul = ham.get("reward") if isinstance(ham.get("reward"), dict) else {}
    baslik = ham.get("reward_title") or odul.get("title") or ham.get("title")
    kullanici = (
        ham.get("username")
        or (ham.get("redeemer") or {}).get("username")
        or (ham.get("user") or {}).get("username")
        or "?"
    )
    return baslik, kullanici


async def kick_dinle(chatroom_id: int, channel_id: int | None, yonetici: OdulYoneticisi):
    import websockets

    kanallar = [f"chatrooms.{chatroom_id}.v2", f"chatroom_{chatroom_id}"]
    if channel_id:
        kanallar += [f"channel.{channel_id}", f"channel_{channel_id}"]

    bekleme = 2
    while True:
        try:
            async with websockets.connect(PUSHER_URL, ping_interval=None) as ws:
                for k in kanallar:
                    await ws.send(json.dumps({"event": "pusher:subscribe",
                                              "data": {"auth": "", "channel": k}}))
                yaz("✓ Kick'e bağlandı, ödüller dinleniyor...")
                bekleme = 2
                async for mesaj in ws:
                    olay = json.loads(mesaj)
                    ad = olay.get("event", "")
                    if ad == "pusher:ping":
                        await ws.send(json.dumps({"event": "pusher:pong", "data": {}}))
                        continue
                    if HATA_AYIKLA and not ad.startswith("pusher"):
                        yaz("OLAY:", ad, str(olay.get("data"))[:300])
                    if "reward" in ad.lower() or "redeem" in ad.lower():
                        baslik, kullanici = odul_verisini_coz(olay.get("data"))
                        if baslik:
                            yonetici.tetikle(baslik, kullanici)
        except Exception as hata:
            yaz(f"Bağlantı koptu ({hata.__class__.__name__}), {bekleme} sn sonra tekrar...")
            await asyncio.sleep(bekleme)
            bekleme = min(bekleme * 2, 30)


def konsol_dinle(yonetici: OdulYoneticisi):
    while True:
        try:
            satir = input().strip()
        except EOFError:
            return
        if not satir:
            continue
        if satir.lower() in ("liste", "list"):
            for o in yonetici.oduller.values():
                yaz(f"  - {o['odul']}")
            continue
        if satir.lower() in ("dur", "duraklat"):
            duraklat_degistir()
            continue
        yonetici.tetikle(satir, "konsol")


# --------------------------------------------------------------------------
def main():
    global DENEME, HATA_AYIKLA, KANCA
    p = argparse.ArgumentParser(description="Kick kanal puanı ödüllerini oyun tuşlarına bağlar.")
    p.add_argument("--deneme", action="store_true", help="tuşlara basma, sadece yaz")
    p.add_argument("--hata-ayikla", action="store_true", help="gelen tüm Kick olaylarını yaz")
    p.add_argument("--ayarlar", default=str(AYAR_DOSYASI))
    a = p.parse_args()
    DENEME, HATA_AYIKLA = a.deneme, a.hata_ayikla

    if WINDOWS:
        os.system("")  # Windows konsolunda renk/emoji desteği
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass
    else:
        yaz("UYARI: Bu program tuş basmak için Windows gerektirir; şu an sadece deneme modunda çalışır.")

    with open(a.ayarlar, encoding="utf-8") as f:
        ayarlar = json.load(f)

    yonetici = OdulYoneticisi(ayarlar)
    KANCA = KlavyeKancasi(ayarlar.get("duraklat_tusu"))
    KANCA.baslat()

    kanal = ayarlar.get("kanal", "")
    chatroom_id, channel_id = ayarlar.get("chatroom_id"), ayarlar.get("channel_id")
    if not chatroom_id:
        yaz(f"Kanal bilgisi alınıyor: {kanal}")
        chatroom_id, bulunan_kanal = kanal_bilgisi_al(kanal)
        channel_id = channel_id or bulunan_kanal

    yaz("=" * 56)
    yaz(f"Kanal: {kanal}   |   Ödül sayısı: {len(yonetici.oduller)}"
        + ("   |   DENEME MODU" if DENEME else ""))
    if ayarlar.get("duraklat_tusu"):
        yaz(f"Duraklat/aç: {ayarlar['duraklat_tusu'].upper()}  (ya da konsola 'dur' yaz)")
    yaz("Denemek için ödül adını yazıp Enter'a bas. 'liste' = tüm ödüller.")
    yaz("=" * 56)

    threading.Thread(target=konsol_dinle, args=(yonetici,), daemon=True).start()

    if not chatroom_id:
        yaz("✗ Sohbet odası numarası otomatik bulunamadı (Kick engelliyor olabilir).")
        yaz(f"  Tarayıcıda şunu aç: https://kick.com/api/v2/channels/{kanal}")
        yaz('  "chatroom":{"id": SAYI ...} kısmındaki sayıyı ayarlar.json -> "chatroom_id" alanına,')
        yaz('  en baştaki "id" sayısını da "channel_id" alanına yaz ve programı yeniden başlat.')
        yaz("  Şimdilik sadece konsoldan deneme yapabilirsin.")
        try:
            while True:
                time.sleep(3600)
        except KeyboardInterrupt:
            return

    try:
        asyncio.run(kick_dinle(int(chatroom_id), int(channel_id) if channel_id else None, yonetici))
    except KeyboardInterrupt:
        yaz("Kapatıldı.")


if __name__ == "__main__":
    main()
