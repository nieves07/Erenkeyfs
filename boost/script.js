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
    tag:   ismin altındaki kısa yazı (rank, rol vb.)
    photo: (isteğe bağlı) "assets/boosters/isim.png" gibi bir resim yolu
    extra: (isteğe bağlı) bu booster için ek ücret yüzdesi, örn. 10 = %10  */
const BOOSTERS = [
  { name: "Fark etmez", tag: "İlk müsait Radiant booster", any: true },
  { name: "Booster 1", tag: "Radiant · Düellocu", photo: null, extra: 0 },
  { name: "Booster 2", tag: "Radiant · Kontrol Uzmanı", photo: null, extra: 0 },
  { name: "Booster 3", tag: "Radiant · Gözcü", photo: null, extra: 0 },
];

/*  EKSTRA SEÇENEKLER — percent: fiyata eklenecek yüzde (0 = ücretsiz)  */
const EXTRAS = [
  { name: "Duo Boost", desc: "Hesabını vermezsin, booster'la birlikte oynarsın. Daha düşük risk.", percent: 50, tag: "Önerilen" },
  { name: "Öncelikli Sipariş", desc: "Siparişin sıranın en önüne alınır, daha hızlı biter.", percent: 25 },
  { name: "Ajan Seçimi", desc: "Booster'ın hangi ajanlarla oynayacağını sen belirlersin.", percent: 15 },
  { name: "Canlı Yayın", desc: "Maçları canlı yayından izleyebilirsin.", percent: 20 },
  { name: "Çevrimdışı Mod", desc: "Booster arkadaş listende çevrimdışı görünür.", percent: 0 },
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

/* Rank sırası ve renkleri (değiştirmene gerek yok) */
const RANKS = [
  { key: "demir",  name: "Demir",      color: "#8d8f99" },
  { key: "bronz",  name: "Bronz",      color: "#c0814f" },
  { key: "gumus",  name: "Gümüş",      color: "#c9d3dc" },
  { key: "altin",  name: "Altın",      color: "#f2c14e" },
  { key: "platin", name: "Platin",     color: "#3fc6c9" },
  { key: "elmas",  name: "Elmas",      color: "#c77dff" },
  { key: "yucel",  name: "Yücelik",    color: "#3ee08f" },
  { key: "immo",   name: "Ölümsüzlük", color: "#ff4d6d" },
  { key: "radyant", name: "Radyant",   color: "#ffe39a", single: true },
];
const RADIANT_LEVEL = 24; // 8 rank × 3 kademe

/* Resmi rank simgeleri (valorant-api.com). Yüklenemezse sade simge görünür. */
const RANK_ICON = (level) =>
  `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${3 + level}/largeicon.png`;

/* Seviye: Demir 1 = 0, Demir 2 = 1 ... Ölümsüzlük 3 = 23, Radyant = 24 */
const level = (rankIdx, div) => (RANKS[rankIdx].single ? RADIANT_LEVEL : rankIdx * 3 + (div - 1));
const fromLevel = (lv) => (lv >= RADIANT_LEVEL ? { r: 8, d: 1 } : { r: Math.floor(lv / 3), d: (lv % 3) + 1 });
const levelName = (lv) => {
  const { r, d } = fromLevel(lv);
  return RANKS[r].single ? RANKS[r].name : `${RANKS[r].name} ${d}`;
};

const state = { from: level(2, 1), to: level(3, 1), booster: 0, extras: new Set() };

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = (n) => `${Math.round(n).toLocaleString("tr-TR")} ${CONFIG.currency}`;

function icon(lv, color, size = 56) {
  return `<img src="${RANK_ICON(lv)}" alt="" width="${size}" height="${size}" loading="lazy" style="--rc:${color}"
    onerror="this.outerHTML='<svg class=&quot;rank-fb&quot; style=&quot;color:${color}&quot;><use href=&quot;#i-rank&quot;/></svg>'">`;
}

/* ---------- Fiyat ---------- */
function calcPrice() {
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
          style="--rc:${r.color}">${icon(lv, r.color)}<span>${r.name}</span></button>`;
    })
    .join("");
}

function renderDivs(el, side) {
  const cur = fromLevel(state[side]);
  if (RANKS[cur.r].single) {
    el.innerHTML = `<span class="divs__single">Radyant kademesizdir</span>`;
    return;
  }
  el.innerHTML =
    `<span class="divs__label">Kademe</span>` +
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
        <span class="booster__info"><strong>${b.name}</strong><small>${b.tag || ""}</small></span>
        ${b.extra ? `<span class="booster__extra">+%${b.extra}</span>` : ""}
        <span class="booster__check"><svg><use href="#i-check"/></svg></span>
      </button>`;
  }).join("");
}

function renderExtras() {
  $("#extras").innerHTML = EXTRAS.map((x, i) => {
    const on = state.extras.has(i);
    return `<button class="extra${on ? " is-active" : ""}" role="checkbox" aria-checked="${on}" data-extra="${i}">
        <span class="extra__box"><svg><use href="#i-check"/></svg></span>
        <span class="extra__info">
          <strong>${x.name}${x.tag ? ` <em>${x.tag}</em>` : ""}</strong>
          <small>${x.desc}</small>
        </span>
        <span class="extra__pct">${x.percent ? `+%${x.percent}` : "Ücretsiz"}</span>
      </button>`;
  }).join("");
}

const extrasText = () =>
  state.extras.size ? [...state.extras].sort().map((i) => EXTRAS[i].name).join(", ") : "Yok";

function renderReviews() {
  const star = (on) => `<svg class="${on ? "on" : ""}"><use href="#i-star"/></svg>`;
  $("#reviews").innerHTML = REVIEWS.map((r) => `
    <figure class="review${r.sample ? " review--sample" : ""}">
      ${r.sample ? `<span class="review__sample">Örnek</span>` : ""}
      <div class="review__stars" aria-label="${r.rating} yıldız">${[1, 2, 3, 4, 5].map((n) => star(n <= r.rating)).join("")}</div>
      <blockquote>${r.text}</blockquote>
      <figcaption>
        <span class="review__avatar">${r.name.trim()[0].toUpperCase()}</span>
        <span><strong>${r.name}</strong><small>${r.order}</small></span>
      </figcaption>
    </figure>`).join("");
}

function renderSummary() {
  const f = fromLevel(state.from), t = fromLevel(state.to);
  $("#sumFrom").innerHTML = `${icon(state.from, RANKS[f.r].color, 72)}<span>${levelName(state.from)}</span>`;
  $("#sumTo").innerHTML = `${icon(state.to, RANKS[t.r].color, 72)}<span>${levelName(state.to)}</span>`;
  $("#sumSteps").textContent = `${state.to - state.from} kademe`;
  $("#sumBooster").textContent = BOOSTERS[state.booster].name;
  $("#sumExtras").textContent = extrasText();
  const p = calcPrice();
  const el = $("#sumPrice");
  el.textContent = p == null ? "Discord'da belirlenir" : money(p);
  el.classList.toggle("soon", p == null);
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
  return [
    "OwlRank EloBoost Siparişi",
    `Rank: ${levelName(state.from)} → ${levelName(state.to)} (${state.to - state.from} kademe)`,
    `Booster: ${BOOSTERS[state.booster].name}`,
    `Ekstralar: ${extrasText()}`,
    `Fiyat: ${p == null ? "Belirlenecek" : money(p)}`,
  ].join("\n");
}

function openModal() {
  $("#modalTitle").textContent = `${levelName(state.from)} → ${levelName(state.to)}`;
  $("#modalDetail").textContent = `Booster: ${BOOSTERS[state.booster].name} · Ekstralar: ${extrasText()}`;
  const p = calcPrice();
  $("#modalPrice").textContent = p == null ? "Fiyat Discord'da belirlenir" : money(p);
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
    toast(ok ? "Sipariş özeti kopyalandı! Discord'da ticket açıp yapıştır." : "Discord'da ticket açıp sipariş bilgilerini yaz.");
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

render();
renderReviews();
initCalc();
initOrders();
initNav();
initReveal();
$("#year").textContent = new Date().getFullYear();
