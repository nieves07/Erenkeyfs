/* =========================================================
   OWLRANK ELOBOOST — AYARLAR
   Sadece bu bölümü düzenlemen yeterli.
   ========================================================= */
const CONFIG = {
  // Discord sunucu davet linkini buraya yapıştır:
  discord: "https://discord.gg/ORNEK",
  // Para birimi işareti
  currency: "₺",
};

/*  KAMPANYA BANDI — sitenin en üstündeki duyuru şeridi.
    active: false yaparsan band gizlenir.
    code:   (isteğe bağlı) banttaki butona basınca bu kod otomatik uygulanır.
            Kodun aşağıdaki CODES listesinde olması gerekir.                 */
const CAMPAIGN = {
  active: true,
  tr: "Sezon sonuna özel tüm boostlarda %10 indirim!",
  en: "End-of-season deal: 10% off all boosts!",
  code: "OWL10",
};

/*  İNDİRİM KODLARI — "KOD": indirim yüzdesi
    Büyük/küçük harf fark etmez. Kod eklemek/silmek için satır ekle/sil.    */
const CODES = {
  OWL10: 10,
  // YAYIN15: 15,
};

/*  FİYATLAR — her rankta 1 kademe atlamanın fiyatı.
    Örnek: gumus: 120  ->  Gümüş 1→2, 2→3 ve 3→Altın 1 her biri 120 ₺.
    null bırakırsan toplam yerine "Discord'da belirlenir" yazar.            */
const PRICES = {
  demir:  null,
  bronz:  null,
  gumus:  null,
  altin:  null,
  platin: null,
  elmas:  null,
  yucel:  null,
  immo:   null,   // Ölümsüzlük 1→2, 2→3 ve 3→Radyant
};

/*  BOOSTERLAR — ilerde gerçek booster'ları buraya yazacağız.
    name:  görünen isim
    tag / tag_en: ismin altındaki kısa yazı (Türkçe / İngilizce)
    photo: (isteğe bağlı) "assets/boosters/isim.png" gibi bir resim yolu
    extra: (isteğe bağlı) bu booster için ek ücret yüzdesi, örn. 10 = %10  */
const BOOSTERS = [
  { name: "Fark etmez", name_en: "Any booster", tag: "İlk müsait Radiant booster", tag_en: "First available Radiant booster", any: true },
  { name: "Booster 1", tag: "Radiant · Düellocu", tag_en: "Radiant · Duelist", photo: null, extra: 0 },
  { name: "Booster 2", tag: "Radiant · Kontrol Uzmanı", tag_en: "Radiant · Controller", photo: null, extra: 0 },
  { name: "Booster 3", tag: "Radiant · Gözcü", tag_en: "Radiant · Initiator", photo: null, extra: 0 },
];

/*  EKSTRA SEÇENEKLER — percent: fiyata eklenecek yüzde (0 = ücretsiz)
    Birden fazla seçilirse yüzdeler toplanır.                               */
const EXTRAS = [
  { name: "Duo Boost", desc: "Hesabını vermezsin, booster'la birlikte oynarsın. Daha düşük risk.",
    desc_en: "Keep your account — play together with the booster. Lower risk.", percent: 100, tag: "Önerilen", tag_en: "Recommended" },
  { name: "Öncelikli Sipariş", name_en: "Priority Order", desc: "Siparişin sıranın en önüne alınır, daha hızlı biter.",
    desc_en: "Your order jumps to the front of the queue and finishes faster.", percent: 25 },
  { name: "Ajan Seçimi", name_en: "Agent Selection", desc: "Booster'ın hangi ajanlarla oynayacağını sen belirlersin.",
    desc_en: "You choose which agents the booster plays.", percent: 15 },
  { name: "Canlı Yayın", name_en: "Live Stream", desc: "Maçları canlı yayından izleyebilirsin.",
    desc_en: "Watch your matches live on stream.", percent: 75 },
  { name: "Çevrimdışı Mod", name_en: "Offline Mode", desc: "Booster arkadaş listende çevrimdışı görünür.",
    desc_en: "The booster appears offline on your friends list.", percent: 0 },
];

/*  MÜŞTERİ YORUMLARI — gerçek yorumları buraya yaz.
    sample: true olanlar "Örnek" etiketiyle görünür; gerçek yorumu girince sample satırını sil.
    rating: 1-5 arası yıldız                                              */
const REVIEWS = [
  { name: "Müşteri Adı", order: "Gümüş 2 → Altın 3", rating: 5, text: "Gerçek müşteri yorumu buraya gelecek. Discord'daki yorumlardan birini buraya kopyala.", sample: true },
  { name: "Müşteri Adı", order: "Platin 1 → Elmas 1", rating: 5, text: "Gerçek müşteri yorumu buraya gelecek. Discord'daki yorumlardan birini buraya kopyala.", sample: true },
  { name: "Müşteri Adı", order: "Elmas 3 → Yücelik 2", rating: 5, text: "Gerçek müşteri yorumu buraya gelecek. Discord'daki yorumlardan birini buraya kopyala.", sample: true },
];

/* ========================================================= */

/* Arayüz metinleri (iki dil) */
const STR = {
  tr: {
    division: "Kademe", radiantSingle: "Radyant kademesizdir", steps: (n) => `${n} kademe`,
    tbd: "Discord'da belirlenir", tbdModal: "Fiyat Discord'da belirlenir", free: "Ücretsiz", none: "Yok",
    sample: "Örnek", sampleText: "Gerçek müşteri yorumu buraya gelecek.", sampleName: "Müşteri Adı",
    stars: (n) => `${n} yıldız`, booster: "Booster", extras: "Ekstralar",
    orderTitle: "OwlRank EloBoost Siparişi", orderRank: "Rank", orderPrice: "Fiyat", orderCode: "İndirim kodu", tbdShort: "Belirlenecek",
    copied: "Sipariş özeti kopyalandı! Discord'da ticket açıp yapıştır.", notCopied: "Discord'da ticket açıp sipariş bilgilerini yaz.",
    codeOk: (c, p) => `${c} uygulandı: %${p} indirim`, codeBad: "Bu indirim kodu geçerli değil.", codeEmpty: "Bir indirim kodu yaz.",
    codeRemove: "Kodu kaldır", discPending: (p) => `%${p} (fiyatla birlikte)`, promoBtn: (c) => `Kod: ${c} — Uygula`,
    promoApplied: (c) => `${c} kodu uygulandı!`,
  },
  en: {
    division: "Division", radiantSingle: "Radiant has no divisions", steps: (n) => `${n} division${n > 1 ? "s" : ""}`,
    tbd: "Quoted on Discord", tbdModal: "Price quoted on Discord", free: "Free", none: "None",
    sample: "Sample", sampleText: "A real customer review will go here.", sampleName: "Customer Name",
    stars: (n) => `${n} stars`, booster: "Booster", extras: "Extras",
    orderTitle: "OwlRank EloBoost Order", orderRank: "Rank", orderPrice: "Price", orderCode: "Discount code", tbdShort: "To be quoted",
    copied: "Order summary copied! Open a ticket on Discord and paste it.", notCopied: "Open a ticket on Discord and write your order details.",
    codeOk: (c, p) => `${c} applied: ${p}% off`, codeBad: "This discount code isn't valid.", codeEmpty: "Enter a discount code.",
    codeRemove: "Remove code", discPending: (p) => `${p}% (applied to price)`, promoBtn: (c) => `Code: ${c} — Apply`,
    promoApplied: (c) => `Code ${c} applied!`,
  },
};

/* Rank sırası ve renkleri (değiştirmene gerek yok) */
const RANKS = [
  { key: "demir",   name: "Demir",      en: "Iron",      color: "#8d8f99" },
  { key: "bronz",   name: "Bronz",      en: "Bronze",    color: "#c0814f" },
  { key: "gumus",   name: "Gümüş",      en: "Silver",    color: "#c9d3dc" },
  { key: "altin",   name: "Altın",      en: "Gold",      color: "#f2c14e" },
  { key: "platin",  name: "Platin",     en: "Platinum",  color: "#3fc6c9" },
  { key: "elmas",   name: "Elmas",      en: "Diamond",   color: "#c77dff" },
  { key: "yucel",   name: "Yücelik",    en: "Ascendant", color: "#3ee08f" },
  { key: "immo",    name: "Ölümsüzlük", en: "Immortal",  color: "#ff4d6d" },
  { key: "radyant", name: "Radyant",    en: "Radiant",   color: "#ffe39a", single: true },
];
const RADIANT_LEVEL = 24; // 8 rank × 3 kademe

/* Resmi rank simgeleri (valorant-api.com). Yüklenemezse sade simge görünür. */
const RANK_ICON = (level) =>
  `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${3 + level}/largeicon.png`;

/* ---------- Dil ---------- */
let lang = "tr";
const S = () => STR[lang];
const L = (obj, field = "name") => (lang === "en" && obj[`${field}_en`]) || obj[field]; // config alanı çevirisi
const pct = (n) => (lang === "en" ? `${n}%` : `%${n}`);
const rankName = (r) => (lang === "en" ? r.en : r.name);

/* Seviye: Demir 1 = 0, Demir 2 = 1 ... Ölümsüzlük 3 = 23, Radyant = 24 */
const level = (rankIdx, div) => (RANKS[rankIdx].single ? RADIANT_LEVEL : rankIdx * 3 + (div - 1));
const fromLevel = (lv) => (lv >= RADIANT_LEVEL ? { r: 8, d: 1 } : { r: Math.floor(lv / 3), d: (lv % 3) + 1 });
const levelName = (lv) => {
  const { r, d } = fromLevel(lv);
  return RANKS[r].single ? rankName(RANKS[r]) : `${rankName(RANKS[r])} ${d}`;
};

const state = { from: level(2, 1), to: level(3, 1), booster: 0, extras: new Set(), code: null };

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = (n) => `${Math.round(n).toLocaleString(lang === "en" ? "en-US" : "tr-TR")} ${CONFIG.currency}`;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  sset(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
};

function icon(lv, color, size = 56) {
  return `<img src="${RANK_ICON(lv)}" alt="" width="${size}" height="${size}" loading="lazy" style="--rc:${color}"
    onerror="this.outerHTML='<svg class=&quot;rank-fb&quot; style=&quot;color:${color}&quot;><use href=&quot;#i-rank&quot;/></svg>'">`;
}

/* ---------- Fiyat ---------- */
const discountPct = () => (state.code ? CODES[state.code] : 0);

function basePrice() {
  let total = 0;
  for (let lv = state.from; lv < state.to; lv++) {
    const p = PRICES[RANKS[fromLevel(lv).r].key];
    if (p == null) return null;
    total += p;
  }
  let pct = BOOSTERS[state.booster].extra || 0;
  state.extras.forEach((i) => (pct += EXTRAS[i].percent));
  return total * (1 + pct / 100);
}
function calcPrice() {
  const b = basePrice();
  return b == null ? null : b * (1 - discountPct() / 100);
}

/* ---------- Çizim ---------- */
function renderRankGrid(el, side) {
  const list = side === "from" ? RANKS.filter((r) => !r.single) : RANKS;
  const cur = fromLevel(state[side]);
  el.innerHTML = list
    .map((r, i) => {
      // Hedefte, tamamı mevcut rankın altında kalan ranklar kapalı
      const maxLv = r.single ? RADIANT_LEVEL : i * 3 + 2;
      const disabled = side === "to" && maxLv <= state.from;
      const lv = r.single ? RADIANT_LEVEL : i * 3;
      return `<button class="rank-btn${cur.r === i ? " is-active" : ""}" role="radio"
          aria-checked="${cur.r === i}" data-rank="${i}" ${disabled ? "disabled" : ""}
          style="--rc:${r.color}">${icon(lv, r.color)}<span>${rankName(r)}</span></button>`;
    })
    .join("");
}

function renderDivs(el, side) {
  const cur = fromLevel(state[side]);
  if (RANKS[cur.r].single) {
    el.innerHTML = `<span class="divs__single">${S().radiantSingle}</span>`;
    return;
  }
  el.innerHTML =
    `<span class="divs__label">${S().division}</span>` +
    [1, 2, 3]
      .map((d) => {
        const lv = level(cur.r, d);
        const disabled = (side === "to" && lv <= state.from) || (side === "from" && lv >= RADIANT_LEVEL);
        return `<button class="div-btn${cur.d === d ? " is-active" : ""}" role="radio" aria-checked="${cur.d === d}"
          data-div="${d}" ${disabled ? "disabled" : ""}>${d}</button>`;
      })
      .join("");
}

function renderBoosters() {
  $("#boosters").innerHTML = BOOSTERS.map((b, i) => {
    const initials = b.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const avatar = b.any
      ? `<span class="booster__avatar booster__avatar--any"><svg><use href="#i-dice"/></svg></span>`
      : b.photo
        ? `<img class="booster__avatar" src="${b.photo}" alt="" width="52" height="52">`
        : `<span class="booster__avatar">${initials}</span>`;
    return `<button class="booster${state.booster === i ? " is-active" : ""}" role="radio"
        aria-checked="${state.booster === i}" data-booster="${i}">
        ${avatar}
        <span class="booster__info"><strong>${L(b)}</strong><small>${L(b, "tag") || ""}</small></span>
        ${b.extra ? `<span class="booster__extra">+${pct(b.extra)}</span>` : ""}
        <span class="booster__check"><svg><use href="#i-check"/></svg></span>
      </button>`;
  }).join("");
}

function renderExtras() {
  $("#extras").innerHTML = EXTRAS.map((x, i) => {
    const on = state.extras.has(i);
    const tag = L(x, "tag");
    return `<button class="extra${on ? " is-active" : ""}" role="checkbox" aria-checked="${on}" data-extra="${i}">
        <span class="extra__box"><svg><use href="#i-check"/></svg></span>
        <span class="extra__info">
          <strong>${L(x)}${tag ? ` <em>${tag}</em>` : ""}</strong>
          <small>${L(x, "desc")}</small>
        </span>
        <span class="extra__pct">${x.percent ? `+${pct(x.percent)}` : S().free}</span>
      </button>`;
  }).join("");
}

const extrasText = () =>
  state.extras.size ? [...state.extras].sort((a, b) => a - b).map((i) => L(EXTRAS[i])).join(", ") : S().none;

function renderReviews() {
  const star = (on) => `<svg class="${on ? "on" : ""}"><use href="#i-star"/></svg>`;
  $("#reviews").innerHTML = REVIEWS.map((r) => {
    const name = r.sample ? S().sampleName : r.name;
    const text = r.sample ? S().sampleText : r.text;
    return `
    <figure class="review${r.sample ? " review--sample" : ""}">
      ${r.sample ? `<span class="review__sample">${S().sample}</span>` : ""}
      <div class="review__stars" aria-label="${S().stars(r.rating)}">${[1, 2, 3, 4, 5].map((n) => star(n <= r.rating)).join("")}</div>
      <blockquote>${text}</blockquote>
      <figcaption>
        <span class="review__avatar">${name.trim()[0].toUpperCase()}</span>
        <span><strong>${name}</strong><small>${r.order}</small></span>
      </figcaption>
    </figure>`;
  }).join("");
}

function renderSummary() {
  const f = fromLevel(state.from), t = fromLevel(state.to);
  $("#sumFrom").innerHTML = `${icon(state.from, RANKS[f.r].color, 72)}<span>${levelName(state.from)}</span>`;
  $("#sumTo").innerHTML = `${icon(state.to, RANKS[t.r].color, 72)}<span>${levelName(state.to)}</span>`;
  $("#sumSteps").textContent = S().steps(state.to - state.from);
  $("#sumBooster").textContent = L(BOOSTERS[state.booster]);
  $("#sumExtras").textContent = extrasText();

  const base = basePrice();
  const p = calcPrice();
  const d = discountPct();

  // İndirim satırı
  $("#sumDiscRow").hidden = !d;
  if (d) {
    const amount = base == null ? S().discPending(d) : `−${money(base - p)} (${pct(d)})`;
    $("#sumDisc").innerHTML = `${amount} <button type="button" class="coupon__remove" id="couponRemove" aria-label="${S().codeRemove}">×</button>`;
  }

  const el = $("#sumPrice");
  el.textContent = p == null ? S().tbd : money(p);
  el.classList.toggle("soon", p == null);
  const old = $("#sumOld");
  old.hidden = !(d && base != null);
  if (!old.hidden) old.textContent = money(base);
}

function render() {
  renderRankGrid($("#fromRanks"), "from");
  renderDivs($("#fromDivs"), "from");
  renderRankGrid($("#toRanks"), "to");
  renderDivs($("#toDivs"), "to");
  renderBoosters();
  renderExtras();
  renderSummary();
}

/* ---------- Seçimler ---------- */
function fixTarget() {
  if (state.to <= state.from) state.to = Math.min(state.from + 1, RADIANT_LEVEL);
}

function initCalc() {
  const bind = (id, side) =>
    $(id).addEventListener("click", (e) => {
      const btn = e.target.closest("button:not(:disabled)");
      if (!btn) return;
      const cur = fromLevel(state[side]);
      if (btn.dataset.rank != null) {
        const r = +btn.dataset.rank;
        if (RANKS[r].single) state[side] = RADIANT_LEVEL;
        else {
          // Aynı kademeyi koru; hedefte geçersizse geçerli ilk kademeye kay
          let lv = level(r, cur.d);
          if (side === "to" && lv <= state.from) lv = state.from + 1;
          state[side] = lv;
        }
      } else if (btn.dataset.div != null) {
        state[side] = level(cur.r, +btn.dataset.div);
      }
      if (side === "from") fixTarget();
      render();
    });
  bind("#fromRanks", "from");
  bind("#fromDivs", "from");
  bind("#toRanks", "to");
  bind("#toDivs", "to");
  $("#boosters").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-booster]");
    if (!btn) return;
    state.booster = +btn.dataset.booster;
    render();
  });
  $("#extras").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-extra]");
    if (!btn) return;
    const i = +btn.dataset.extra;
    state.extras.has(i) ? state.extras.delete(i) : state.extras.add(i);
    render();
  });
}

/* ---------- İndirim kodu ---------- */
function findCode(input) {
  const key = Object.keys(CODES).find((k) => k.toUpperCase() === input.trim().toUpperCase());
  return key || null;
}

function setCouponMsg(text, ok) {
  const m = $("#couponMsg");
  m.textContent = text;
  m.className = `coupon__msg${text ? (ok ? " is-ok" : " is-bad") : ""}`;
}

function applyCode(input, { silent = false } = {}) {
  if (!input.trim()) { setCouponMsg(S().codeEmpty, false); return false; }
  const key = findCode(input);
  if (!key) { setCouponMsg(S().codeBad, false); return false; }
  state.code = key;
  $("#couponInput").value = key;
  if (!silent) setCouponMsg(S().codeOk(key, CODES[key]), true);
  renderSummary();
  return true;
}

function initCoupon() {
  $("#couponForm").addEventListener("submit", (e) => {
    e.preventDefault();
    applyCode($("#couponInput").value);
  });
  // Kaldır butonu özet içinde yeniden çiziliyor; olayı üstte yakala
  $(".summary").addEventListener("click", (e) => {
    if (!e.target.closest("#couponRemove")) return;
    state.code = null;
    $("#couponInput").value = "";
    setCouponMsg("", true);
    renderSummary();
  });
}

/* ---------- Kampanya bandı ---------- */
function renderPromo() {
  const el = $("#promo");
  if (!CAMPAIGN.active || store.sget("promoClosed") === "1") { el.hidden = true; return; }
  el.hidden = false;
  $("#promoText").textContent = CAMPAIGN[lang] || CAMPAIGN.tr;
  const btn = $("#promoCode");
  const valid = CAMPAIGN.code && findCode(CAMPAIGN.code);
  btn.hidden = !valid;
  if (valid) btn.textContent = S().promoBtn(valid);
}

function initPromo() {
  $("#promoClose").addEventListener("click", () => {
    store.sset("promoClosed", "1");
    $("#promo").hidden = true;
  });
  $("#promoCode").addEventListener("click", () => {
    if (applyCode(CAMPAIGN.code)) toast(S().promoApplied(state.code));
    document.querySelector(".summary").scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* ---------- Dil değiştirme ---------- */
function applyLang(next) {
  lang = next === "en" ? "en" : "tr";
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach((el) => {
    if (el.dataset.tr == null) el.dataset.tr = el.innerHTML;
    const en = I18N_EN[el.dataset.i18n];
    el.innerHTML = lang === "en" && en != null ? en : el.dataset.tr;
  });
  $$("[data-i18n-aria]").forEach((el) => {
    if (el.dataset.trAria == null) el.dataset.trAria = el.getAttribute("aria-label") || "";
    const en = I18N_EN[el.dataset.i18nAria];
    el.setAttribute("aria-label", lang === "en" && en != null ? en : el.dataset.trAria);
  });
  $$("[data-i18n-ph]").forEach((el) => {
    if (el.dataset.trPh == null) el.dataset.trPh = el.placeholder;
    const en = I18N_EN[el.dataset.i18nPh];
    el.placeholder = lang === "en" && en != null ? en : el.dataset.trPh;
  });
  document.title = I18N_META[lang].title;
  $('meta[name="description"]').setAttribute("content", I18N_META[lang].desc);
  $$("[data-lang]").forEach((b) => {
    const on = b.dataset.lang === lang;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on);
  });
  setCouponMsg("", true);
  render();
  renderReviews();
  renderPromo();
}

function initLang() {
  const saved = store.get("lang");
  const browser = (navigator.language || "tr").toLowerCase().startsWith("tr") ? "tr" : "en";
  $$("[data-lang]").forEach((b) =>
    b.addEventListener("click", () => {
      store.set("lang", b.dataset.lang);
      applyLang(b.dataset.lang);
    })
  );
  applyLang(saved || browser);
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-show"), 3200);
}

/* ---------- Sipariş penceresi ---------- */
const modal = $("#orderModal");
const check = $("#riskCheck");
const goBtn = $("#goDiscord");

function orderText() {
  const p = calcPrice();
  const lines = [
    S().orderTitle,
    `${S().orderRank}: ${levelName(state.from)} → ${levelName(state.to)} (${S().steps(state.to - state.from)})`,
    `${S().booster}: ${L(BOOSTERS[state.booster])}`,
    `${S().extras}: ${extrasText()}`,
  ];
  if (state.code) lines.push(`${S().orderCode}: ${state.code} (${pct(CODES[state.code])})`);
  lines.push(`${S().orderPrice}: ${p == null ? S().tbdShort : money(p)}`);
  return lines.join("\n");
}

function openModal() {
  $("#modalTitle").textContent = `${levelName(state.from)} → ${levelName(state.to)}`;
  const parts = [`${S().booster}: ${L(BOOSTERS[state.booster])}`, `${S().extras}: ${extrasText()}`];
  if (state.code) parts.push(`${S().orderCode}: ${state.code}`);
  $("#modalDetail").textContent = parts.join(" · ");
  const p = calcPrice();
  $("#modalPrice").textContent = p == null ? S().tbdModal : money(p);
  check.checked = false;
  goBtn.disabled = true;
  modal.hidden = false;
  document.body.classList.add("no-scroll");
  check.focus();
}
function closeModal() {
  modal.hidden = true;
  document.body.classList.remove("no-scroll");
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function initOrders() {
  $("#orderBtn").addEventListener("click", openModal);
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
  check.addEventListener("change", () => (goBtn.disabled = !check.checked));

  goBtn.addEventListener("click", async () => {
    const ok = await copy(orderText());
    toast(ok ? S().copied : S().notCopied);
    window.open(CONFIG.discord, "_blank", "noopener");
    closeModal();
  });

  $$("[data-discord]").forEach((a) => {
    a.href = CONFIG.discord;
    a.target = "_blank";
    a.rel = "noopener";
  });
}

/* ---------- Mobil menü ---------- */
function initNav() {
  const burger = $("#burger");
  const links = $("#navLinks");
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("a", links).forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    })
  );
  const nav = $(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 10);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Kaydırınca beliren öğeler ---------- */
function initReveal() {
  const els = $$(".calc__block, .summary, .review, .feature, .step, .risk, .cta, .faq details");
  if (!("IntersectionObserver" in window)) return;
  els.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      }),
    { threshold: 0.08 }
  );
  els.forEach((el) => io.observe(el));
}

initLang();      // dili uygular ve her şeyi çizer
initCalc();
initCoupon();
initPromo();
initOrders();
initNav();
initReveal();
$("#year").textContent = new Date().getFullYear();
