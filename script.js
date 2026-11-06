/* =========================================================
   ERENNKEYFSSS — Link Hub etkileşimleri
   ========================================================= */

/* ---------- AYARLAR (buradan düzenleyebilirsin) ---------- */
const CONFIG = {
  kickSlug: "erenkeyfsss",

  // Discord davet linkini buraya yapıştır, ör:
  // discord: "https://discord.gg/ornek"
  discord: "",

  pollInterval: 60_000,   // canlı durum kontrol sıklığı
};

const API_URL = `https://kick.com/api/v2/channels/${CONFIG.kickSlug}`;

/* ---------- Küçük yardımcılar ---------- */
const $ = (sel) => document.querySelector(sel);

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* Kick API'si tarayıcıdan doğrudan CORS'a izin vermiyor,
   bu yüzden önce direkt dener, olmazsa herkese açık
   CORS köprülerine başvurur, o da olmazsa sessizce düşer. */
const FETCH_ROUTES = [
  (url) => url,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

async function fetchJSON(url, timeout = 4500) {
  for (const route of FETCH_ROUTES) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeout);
      const res = await fetch(route(url), { signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) continue;
      const data = await res.json();
      if (data && typeof data === "object") return data;
    } catch {
      /* sıradaki yolu dene */
    }
  }
  return null;
}

/* ---------- Canlı yayın durumu ---------- */
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(String(value).replace(" ", "T"));
  if (isNaN(d)) return "";
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function formatDuration(ms) {
  if (!ms || ms < 60_000) return "";
  const minutes = Math.round(ms / 60_000);
  if (minutes < 60) return `${minutes} dk`;
  return `${Math.floor(minutes / 60)} sa ${minutes % 60} dk`;
}

/* YAYIN BÖLÜMÜ
   - yayındaysa: Kick player iframe
   - değilse: son yayın (VOD) kartı — başlık, tarih, süre, izlenme
   - veri yoksa: banner'lı sade kart */
function renderStream(channel, videos) {
  const section = $("#stream");
  const frame = $("#streamFrame");
  const caption = $("#streamCaption");
  const kickUrl = `https://kick.com/${CONFIG.kickSlug}`;

  const stream = channel && channel.livestream;
  const isLive = Boolean(stream && stream.is_live);

  if (isLive) {
    // Önemli: aynı canlı durumda iframe'i yeniden yazma — yoksa
    // kullanıcı durdursa bile yayın 60 sn'lik kontrolde yeniden başlar.
    if (section.dataset.state !== "live" || !frame.querySelector("iframe")) {
      section.dataset.state = "live";
      frame.dataset.rendered = "live";
      frame.innerHTML = `
        <span class="stream__tag"><i></i>CANLI</span>
        <iframe src="https://player.kick.com/${CONFIG.kickSlug}?muted=true"
                title="Erenkeyfsss canlı yayını"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowfullscreen loading="lazy"></iframe>`;
    }

    const game = stream.categories && stream.categories[0] && stream.categories[0].name;
    const viewers = stream.viewer_count;
    const parts = [];
    if (stream.session_title) parts.push(escapeHTML(stream.session_title));
    if (game) parts.push(escapeHTML(game));
    if (typeof viewers === "number") parts.push(`${viewers} izleyici`);

    caption.hidden = parts.length === 0;
    caption.innerHTML = parts.join(" &nbsp;·&nbsp; ");
    return;
  }

  const last = Array.isArray(videos) ? videos.find((v) => !v.is_live) : null;

  if (last) {
    const alreadyVod = section.dataset.state === "vod" && frame.querySelector(".vod");
    section.dataset.state = "vod";
    if (!alreadyVod) {
      const thumb = last.thumbnail && last.thumbnail.src;
      const meta = [formatDate(last.created_at), formatDuration(last.duration),
                    typeof last.views === "number" ? `${last.views} izlenme` : ""]
                   .filter(Boolean).join(" · ");

      frame.innerHTML = `
        <a class="vod" href="${kickUrl}/videos" target="_blank" rel="noopener" aria-label="Son yayını izle">
          ${thumb ? `<img class="vod__thumb" src="${escapeHTML(thumb)}" alt="" loading="lazy">` : ""}
          <span class="vod__play" aria-hidden="true">▶</span>
          <span class="vod__body">
            <span class="vod__label">SON YAYIN</span>
            <span class="vod__title">${escapeHTML(last.session_title || "Yayın")}</span>
            <span class="vod__meta">${escapeHTML(meta)}</span>
          </span>
        </a>`;
    }
    caption.hidden = true;
    return;
  }

  if (section.dataset.state !== "fallback" || !frame.querySelector(".stream__fallback")) {
    section.dataset.state = "fallback";
    frame.innerHTML = `
      <div class="stream__fallback">
        <span>Şu an yayında değil 🦉</span>
        <em>Takip et, yayın açınca haberin olsun</em>
        <a href="${kickUrl}" target="_blank" rel="noopener">KICK'E GİT →</a>
      </div>`;
  }
  caption.hidden = true;
}
function renderLive(data) {
  const badge = $("#liveBadge");
  const dot = $("#statusDot");
  const text = badge.querySelector(".live__text");
  const kickSub = document.querySelector(".card--kick .card__sub");

  if (!data) {
    // Durum bilinmiyor: sessiz, yanıltıcı olmayan bir hale geç
    badge.dataset.state = "unknown";
    text.textContent = "Yayın durumu şu an doğrulanamıyor";
    dot.dataset.state = "unknown";
    return;
  }

  const stream = data.livestream;
  const isLive = Boolean(stream && stream.is_live);
  const followers = data.followers_count;

  if (isLive) {
    badge.dataset.state = "live";
    dot.dataset.state = "live";

    const title = (stream.session_title || "").trim();
    const game = stream.categories?.[0]?.name;
    const viewers = stream.viewer_count;

    let detail = [];
    if (game) detail.push(game);
    if (typeof viewers === "number") detail.push(`${viewers} izleyici`);
    if (detail.length) text.textContent = `Şu an yayında · ${detail.join(" · ")}`;
    else text.textContent = "Şu an yayında! 🦉";

    badge.title = title; // tam yayın başlığı üzerine gelince
  } else {
    badge.dataset.state = "offline";
    dot.dataset.state = "offline";
    text.textContent = "Şu an yayında değil · Takip et";
  }

  if (kickSub && typeof followers === "number") {
    kickSub.textContent = `kick.com/${CONFIG.kickSlug} · ${followers} takipçi`;
  }
}

async function checkLive() {
  const [channel, videos] = await Promise.all([
    fetchJSON(API_URL),
    fetchJSON(`${API_URL}/videos`),
  ]);
  renderLive(channel);
  renderStream(channel, videos);
}

/* ---------- Bağlantılar ---------- */
function setupDiscord() {
  const card = $("#discordCard");
  if (!card) return;

  if (CONFIG.discord) {
    card.href = CONFIG.discord;
    card.target = "_blank";
    card.rel = "noopener";
  } else {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Discord davet linki henüz eklenmedi 🦉");
    });
  }
}

function setupCopyMail() {
  const btn = $("#copyMail");
  const mail = btn.querySelector(".card__sub").textContent.trim();
  const label = btn.querySelector(".card__go--copy");

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(mail);
    } catch {
      // Eski tarayıcılar için yedek yöntem
      const ta = document.createElement("textarea");
      ta.value = mail;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }

    btn.classList.add("copied");
    label.textContent = "KOPYALANDI ✓";
    showToast("E-posta panoya kopyalandı ✓");

    setTimeout(() => {
      btn.classList.remove("copied");
      label.textContent = "KOPYALA";
    }, 2000);
  });
}

/* ---------- Küçük rötuşlar ---------- */
function setupPage() {
  // Karta fare yaklaşınca hafif derinlik hissi
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });
  });
}

/* ---------- Başlat ---------- */
setupPage();
setupDiscord();
setupCopyMail();
checkLive();
setInterval(checkLive, CONFIG.pollInterval);
