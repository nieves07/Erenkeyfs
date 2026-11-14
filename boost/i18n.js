/* =========================================================
   İNGİLİZCE ÇEVİRİLER
   Türkçe metinler index.html içinde duruyor; burada sadece
   İngilizce karşılıkları var. Anahtar = data-i18n değeri.
   ========================================================= */
const I18N_EN = {
  // Menü
  "nav.boost": "Boost Calculator",
  "nav.how": "How It Works",
  "nav.risk": "Risks",
  "nav.reviews": "Reviews",
  "nav.faq": "FAQ",
  "nav.gallery": "Gallery",
  "cta.order": "Order Now",
  "menu": "Open menu",
  "close": "Close",

  // Giriş
  "hero.pill": "Radiant booster team online",
  "hero.title": 'Leave your rank to <span class="grad">Radiant</span> hands.',
  "hero.lead": "All boosts are done by <strong>Radiant-level players</strong>, <strong>100% cheat-free</strong> and completely by hand. No third-party software, macros or bots — ever.",
  "hero.risk": "Read the Risks",
  "badge.cheat": "Cheat-free",
  "badge.radiant": "Radiant Boosters",
  "badge.discord": "Discord Support",

  // Uyarı bandı
  "warn.text": "<strong>Important:</strong> Elo boosting is <strong>prohibited</strong> by Riot Games' Terms of Service and <strong>carries a ban risk</strong> for your account, even when done without cheats. Please read before ordering.",
  "warn.more": "Details →",

  // Hesaplayıcı
  "calc.title": "Pick your rank, set your goal",
  "calc.sub": "Select your current rank and the rank you want to reach, and choose a booster if you like. Hit <strong>Order Now</strong> and open a ticket on Discord.",
  "calc.from": "Your current rank",
  "calc.to": "Your target rank",
  "calc.booster": "Choose your booster",
  "calc.extras": "Extra options",
  "calc.optional": "optional",
  "calc.boosterHint": "based on your target rank",
  "sum.title": "Order Summary",
  "sum.steps": "Divisions",
  "sum.extras": "Extras",
  "sum.discount": "Discount",
  "sum.loyalty": "Loyalty discount",
  "sum.high": "Diamond+ fee",
  "sum.total": "Total",
  "sum.note": "100% cheat-free · Radiant booster · Tracked on Discord",
  "coupon.ph": "Discount code",
  "coupon.apply": "Apply",

  // Neden biz
  "why.eyebrow": "Why OwlRank?",
  "why.title": "No cheats, no luck — just aim",
  "why.1t": "100% Cheat-free",
  "why.1p": "No wallhacks, aimbots, macros or any third-party programs, ever. Every match is a real player doing real work.",
  "why.2t": "Radiant Team",
  "why.2p": "Boosts are only done by experienced players who have reached Radiant.",
  "why.3t": "Transparent Process",
  "why.3p": "Track your order's progress through your Discord ticket. We're upfront about the risks, too.",
  "why.4t": "Live Support",
  "why.4p": "Problems, questions, special requests — talk directly to the team on our Discord server.",

  // Yorumlar
  "rev.title": "What our customers say",
  "rev.sub": "Customer reviews from our Discord server.",

  // Galeri
  "gal.title": "Completed orders",
  "gal.sub": "Our customers' ranks before and after the boost.",

  // Nasıl çalışır
  "how.eyebrow": "How It Works",
  "how.title": "Your new rank in 4 steps",
  "how.1t": "Pick your rank",
  "how.1p": "Choose your current rank, target rank and booster.",
  "how.2t": "Accept the risks",
  "how.2p": "Read and accept the ban risk and the rules.",
  "how.3t": "Go to Discord",
  "how.3p": "Open a ticket on our server, paste your order summary and discuss the details.",
  "how.4t": "Get your rank",
  "how.4p": "Your Radiant booster finishes the job — enjoy your new rank.",

  // Riskler
  "risk.eyebrow": "Let's be honest",
  "risk.title": "Elo boosting is prohibited and carries a ban risk",
  "risk.lead": "Even though our service is cheat-free, elo boosting has risks. We don't want you to order without knowing them.",
  "risk.1": "<strong>It's against Riot's rules.</strong> Riot Games' Terms of Service explicitly prohibit sharing your account and having someone else climb ranks for you (boosting).",
  "risk.2": "<strong>The ban risk is real.</strong> Riot can detect boosted accounts. Consequences can include a warning, rank/MMR reset, competitive ban, or a temporary or <strong>permanent account suspension</strong>.",
  "risk.3": "<strong>Cheat-free doesn't mean risk-free.</strong> Not using cheats prevents Vanguard cheat bans, but account sharing and boost detection are a separate matter.",
  "risk.4": "<strong>Detection methods can change.</strong> Logins from a different location, sudden changes in playstyle and player reports can draw attention.",
  "risk.5": "<strong>The decision and responsibility are yours.</strong> You order by accepting these risks. We advise against using an account you can't afford to lose.",
  "risk.foot": "OwlRank EloBoost is not affiliated with or endorsed by Riot Games.",

  // SSS
  "faq.title": "Frequently asked questions",
  "faq.1q": "Are cheats used during the boost?",
  "faq.1a": "No. All matches are played completely by hand by Radiant-level players. No cheats, macros or third-party software are used.",
  "faq.2q": "Can my account get banned?",
  "faq.2a": 'Yes, that risk exists. Elo boosting is against Riot\'s rules and your account may be penalized if it\'s detected. This risk can\'t be reduced to zero; see the <a href="#risk">Risks</a> section for details.',
  "faq.3q": "How do I place an order?",
  "faq.3a": "Choose your rank, target rank and booster, hit <strong>Order Now</strong> and accept the risks. Your order summary is copied automatically and you're sent to our Discord server. Just open a ticket and paste the summary.",
  "faq.4q": "How long does a boost take?",
  "faq.4a": "It depends on the number of divisions and booster availability. Our team will give you an estimate when you open a ticket.",
  "faq.5q": "Do I have to choose a booster?",
  "faq.5a": 'No. If you pick "Any booster", your order goes to the first available booster for your target rank. SERKNOXX and ummut handle everything up to Platinum, ClorNe handles the rest. For example, in a Silver to Immortal order, SERKNOXX or ummut play up to Platinum 3 and ClorNe plays from Platinum 3 onward; you can pick a booster for each part. <strong>The Diamond and above part costs more.</strong>',
  "faq.6q": "What is duo boost?",
  "faq.6a": "With duo boost you don't share your account with anyone; the booster plays on your team. Because of Valorant's rank disparity rules, the booster joins from an account that matches your rank. With no account sharing, the risk is lower — but not zero.",
  "faq.8q": "Are there discounts on big orders?",
  "faq.8a": "Yes! The more divisions you climb, the less you pay. The loyalty discount is applied automatically in the order summary and can be combined with discount codes.",
  "faq.7q": "How do I use a discount code?",
  "faq.7a": "Type your code in the <strong>Discount code</strong> box in the order summary and press <strong>Apply</strong>. The discount is applied to the total and included in the order summary copied to Discord.",

  // CTA / footer
  "cta.title": "Got a question? Come to Discord.",
  "cta.sub": "Special requests, duo boost or just a question — our team is on Discord.",
  "cta.join": "Join our Discord Server",
  "footer": "OwlRank EloBoost. This site is not affiliated with Riot Games.",

  // Sipariş penceresi
  "modal.eyebrow": "Order",
  "modal.warn": "Elo boosting is prohibited by Riot Games' rules. Even without cheats, your account may receive a <strong>warning, rank reset or ban</strong>.",
  "modal.check": "I have read, understood and accept the risks.",
  "modal.go": "Go to Discord & Order",
  "modal.hint": "Your order summary will be copied — paste it when you open a ticket on Discord.",
};

/* Sayfa başlığı ve açıklaması */
const I18N_META = {
  tr: {
    title: "OwlRank EloBoost — Valorant Elo Boost",
    desc: "Radiant oyuncular tarafından, hilesiz ve tamamen el emeğiyle Valorant elo boost. Rankını ve hedefini seç, booster'ını belirle.",
  },
  en: {
    title: "OwlRank EloBoost — Valorant Elo Boost",
    desc: "Cheat-free, hand-played Valorant elo boost by Radiant players. Pick your rank and goal, choose your booster.",
  },
};
