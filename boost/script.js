/* =========================================================
   KEYFS BOOST — AYARLAR
   Sadece bu bölümü düzenlemen yeterli.
   ========================================================= */
const CONFIG = {
  // Discord sunucu davet linkini buraya yapıştır:
  discord: "https://discord.gg/ORNEK",
  // Para birimi işareti
  currency: "₺",
};

/* Rank renkleri (değiştirmene gerek yok) */
const RANKS = {
  demir:  { name: "Demir",       color: "#8d8f99" },
  bronz:  { name: "Bronz",       color: "#c0814f" },
  gumus:  { name: "Gümüş",       color: "#c9d3dc" },
  altin:  { name: "Altın",       color: "#f2c14e" },
  platin: { name: "Platin",      color: "#3fc6c9" },
  elmas:  { name: "Elmas",       color: "#c77dff" },
  yucel:  { name: "Yücelik",     color: "#3ee08f" },
  immo:   { name: "Ölümsüzlük",  color: "#ff4d6d" },
};

/*  PAKETLER
    price: null  -> "Yakında" yazar. Fiyat girmek için sayı yaz: price: 750
    old:   (isteğe bağlı) üstü çizili eski fiyat
    type:  "tek" ya da "kombo"
    tag:   (isteğe bağlı) kartın köşesindeki etiket                     */
const PACKAGES = [
  { from: "demir",  to: "bronz",  type: "tek",   price: null },
  { from: "bronz",  to: "gumus",  type: "tek",   price: null },
  { from: "gumus",  to: "altin",  type: "tek",   price: null },
  { from: "altin",  to: "platin", type: "tek",   price: null },
  { from: "platin", to: "elmas",  type: "tek",   price: null },
  { from: "elmas",  to: "yucel",  type: "tek",   price: null },
  { from: "yucel",  to: "immo",   type: "tek",   price: null, tag: "Elit" },
  { from: "gumus",  to: "yucel",  type: "kombo", price: null, tag: "En Popüler" },
  { from: "gumus",  to: "immo",   type: "kombo", price: null, tag: "Full Paket" },
  { from: "altin",  to: "yucel",  type: "kombo", price: null },
  { from: "altin",  to: "immo",   type: "kombo", price: null },
  { from: "platin", to: "immo",   type: "kombo", price: null },
];

const FEATURES = {
  tek:   ["Radiant booster", "%100 hilesiz", "Discord'dan takip"],
  kombo: ["Radiant booster", "%100 hilesiz", "Discord'dan takip", "Kombo indirimi"],
};

/* ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const fmtPrice = (p) =>
  p == null ? "Yakında" : `${Number(p).toLocaleString("tr-TR")} ${CONFIG.currency}`;

const pkgName = (p) => `${RANKS[p.from].name} → ${RANKS[p.to].name} Boost`;

function emblem(key) {
  const r = RANKS[key];
  return `<span class="emblem" style="--rc:${r.color}">
      <svg><use href="#i-rank"/></svg><small>${r.name}</small></span>`;
}

function renderPackages() {
  const wrap = $("#packages");
  wrap.innerHTML = PACKAGES.map((p, i) => `
    <article class="pkg${p.tag ? " pkg--featured" : ""}" data-type="${p.type}"
             style="--from:${RANKS[p.from].color};--to:${RANKS[p.to].color}">
      ${p.tag ? `<span class="pkg__tag">${p.tag}</span>` : ""}
      <div class="pkg__ranks">
        ${emblem(p.from)}
        <svg class="pkg__arrow"><use href="#i-arrow"/></svg>
        ${emblem(p.to)}
      </div>
      <h3>${pkgName(p)}</h3>
      <ul class="pkg__feats">
        ${FEATURES[p.type].map((f) => `<li><svg><use href="#i-check"/></svg>${f}</li>`).join("")}
      </ul>
      <div class="pkg__price">
        ${p.old ? `<s>${fmtPrice(p.old)}</s>` : ""}
        <strong class="${p.price == null ? "soon" : ""}">${fmtPrice(p.price)}</strong>
      </div>
      <button class="btn btn--primary btn--block" data-order="${i}">Sipariş Ver</button>
    </article>`).join("");
}

/* ---------- Filtre ---------- */
function initFilters() {
  $$(".filter").forEach((btn) =>
    btn.addEventListener("click", () => {
      $$(".filter").forEach((b) => b.classList.toggle("is-active", b === btn));
      const f = btn.dataset.filter;
      $$(".pkg").forEach((card) => {
        card.hidden = f !== "all" && card.dataset.type !== f;
      });
    })
  );
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
let currentPkg = null;
const modal = $("#orderModal");
const check = $("#riskCheck");
const goBtn = $("#goDiscord");

function openModal(pkg) {
  currentPkg = pkg;
  $("#modalTitle").textContent = pkgName(pkg);
  $("#modalPrice").textContent = fmtPrice(pkg.price);
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
  document.addEventListener("click", (e) => {
    const orderBtn = e.target.closest("[data-order]");
    if (orderBtn) openModal(PACKAGES[orderBtn.dataset.order]);
    if (e.target.closest("[data-close]")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
  check.addEventListener("change", () => (goBtn.disabled = !check.checked));

  goBtn.addEventListener("click", async () => {
    if (!currentPkg) return;
    const text = `Sipariş: ${pkgName(currentPkg)} (${fmtPrice(currentPkg.price)})`;
    const ok = await copy(text);
    toast(ok ? "Paket adı kopyalandı! Discord'da ticket açıp yapıştır." : "Discord'da ticket açıp paket adını yaz.");
    window.open(CONFIG.discord, "_blank", "noopener");
    closeModal();
  });

  // Diğer Discord butonları
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
  const els = $$(".pkg, .feature, .step, .risk, .cta, .faq details");
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
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

renderPackages();
initFilters();
initOrders();
initNav();
initReveal();
$("#year").textContent = new Date().getFullYear();
