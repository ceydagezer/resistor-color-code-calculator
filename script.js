// Kısayollar
const $ = (id) => document.getElementById(id);
const band = (n) => $(`band${n}`);

const state = { mode: 4, lang: "tr" }; // mode: 4 | 5 | 6 — lang: tr | en

const selects = {
  d1: $("d1"),
  d2: $("d2"),
  d3: $("d3"),
  multiplier: $("multiplier"),
  tolerance: $("tolerance"),
  tempco: $("tempco"),
};

const wrappers = {
  d3: $("d3-wrap"),
  tempco: $("tempco-wrap"),
};

const out = {
  valueText: $("valueText"),
  rangeText: $("rangeText"),
  calcText: $("calcText"),
  tempcoLine: $("tempcoLine"),
  tempcoText: $("tempcoText"),
};

// ---- Renk adları (dil bazlı) ----
const COLOR_NAMES = {
  tr: { black:"Siyah", brown:"Kahverengi", red:"Kırmızı", orange:"Turuncu", yellow:"Sarı", green:"Yeşil", blue:"Mavi", violet:"Mor", gray:"Gri", white:"Beyaz", gold:"Altın", silver:"Gümüş", none:"(Yok)" },
  en: { black:"Black", brown:"Brown", red:"Red", orange:"Orange", yellow:"Yellow", green:"Green", blue:"Blue", violet:"Violet", gray:"Gray", white:"White", gold:"Gold", silver:"Silver", none:"(None)" },
};

// ---- Arayüz metinleri (dil bazlı) ----
const TXT = {
  tr: {
    headerNote: "Elektronik atölyesi",
    themeToLight: "Açık temaya geç",
    themeToDark: "Koyu temaya geç",
    introEyebrow: "RENK KODU HESAPLAYICI",
    introTitleHtml: "Direncini <em>oku.</em>",
    introSubtitle: "Bant renklerini seç, direnç değerini ve tolerans aralığını saniyeler içinde gör. Ya da elindeki değeri yaz, en yakın bant kombinasyonunu biz bulalım.",
    bandSupport: "bant desteği",
    liveEyebrow: "CANLI ÖNİZLEME",
    liveTitle: "Direnç profili",
    live: "canlı",
    tab4: "4 Bantlı", tab5: "5 Bantlı", tab6: "6 Bantlı",
    randomize: "🎲 Rastgele",
    randomizeTitle: "Rastgele bant renkleri seç",
    previewHint: "Bant renkleri seçime göre anında değişir.",
    bandGuideTitle: "Bu dirençteki bantlar",
    stepEyebrow: "ADIM 01",
    stepTitle: "Renkleri seç",
    reverseLabel: "Ters arama — değerden bantlara",
    reversePlaceholder: "Örn. 4.7",
    reverseFind: "Bul",
    reverseInvalid: "Lütfen geçerli, sıfırdan büyük bir değer girin.",
    reverseExact: (v) => `Tam eşleşme bulundu: ${v}.`,
    reverseClosest: (v, e) => `En yakın standart değer: ${v} (fark: %${e}).`,
    d1: "1. Basamak", d2: "2. Basamak", d3: "3. Basamak",
    multiplier: "Çarpan", tolerance: "Tolerans", tempco: "Sıcaklık Katsayısı (ppm/°C)",
    resultKicker: "HESAPLANAN DEĞER",
    copy: "Kopyala", copied: "Kopyalandı", copyFailed: "Kopyalanamadı",
    resistanceValue: "Direnç Değeri:", toleranceRange: "Tolerans Aralığı:", tempcoLabel: "Sıcaklık Katsayısı:",
    calcLabel: "Hesaplama:",
    legendTitle: "Renk Kodu Tablosu",
    legendCol1: "Renk", legendCol2: "Basamak", legendCol3: "Çarpan", legendCol4: "Tolerans",
    footerNote: "6. bant sıcaklık katsayısını gösterir; direnç değerine eklenmez.",
  },
  en: {
    headerNote: "Electronics workshop",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    introEyebrow: "COLOR CODE CALCULATOR",
    introTitleHtml: "Read your <em>resistor.</em>",
    introSubtitle: "Pick the band colors and see the resistance value and tolerance range instantly. Or type the value you have and we'll find the closest band combination.",
    bandSupport: "band support",
    liveEyebrow: "LIVE PREVIEW",
    liveTitle: "Resistor profile",
    live: "live",
    tab4: "4-Band", tab5: "5-Band", tab6: "6-Band",
    randomize: "🎲 Randomize",
    randomizeTitle: "Pick random band colors",
    previewHint: "Band colors update instantly as you choose.",
    bandGuideTitle: "Bands on this resistor",
    stepEyebrow: "STEP 01",
    stepTitle: "Choose the colors",
    reverseLabel: "Reverse lookup — value to bands",
    reversePlaceholder: "e.g. 4.7",
    reverseFind: "Find",
    reverseInvalid: "Please enter a valid value greater than zero.",
    reverseExact: (v) => `Exact match found: ${v}.`,
    reverseClosest: (v, e) => `Closest standard value: ${v} (off by ${e}%).`,
    d1: "1st Digit", d2: "2nd Digit", d3: "3rd Digit",
    multiplier: "Multiplier", tolerance: "Tolerance", tempco: "Temp. Coefficient (ppm/°C)",
    resultKicker: "CALCULATED VALUE",
    copy: "Copy", copied: "Copied", copyFailed: "Copy failed",
    resistanceValue: "Resistance Value:", toleranceRange: "Tolerance Range:", tempcoLabel: "Temp. Coefficient:",
    calcLabel: "Calculation:",
    legendTitle: "Color Code Chart",
    legendCol1: "Color", legendCol2: "Digit", legendCol3: "Multiplier", legendCol4: "Tolerance",
    footerNote: "The 6th band shows the temperature coefficient; it is not part of the resistance value.",
  },
};

// Sabit renk kodu tablosu (evrensel, dilden bağımsız değerler)
const LEGEND_ROWS = [
  { color: "black",  digit: "0", mult: "×1",    tol: "—" },
  { color: "brown",  digit: "1", mult: "×10",   tol: "±1%" },
  { color: "red",    digit: "2", mult: "×100",  tol: "±2%" },
  { color: "orange", digit: "3", mult: "×1k",   tol: "—" },
  { color: "yellow", digit: "4", mult: "×10k",  tol: "—" },
  { color: "green",  digit: "5", mult: "×100k", tol: "±0.5%" },
  { color: "blue",   digit: "6", mult: "×1M",   tol: "±0.25%" },
  { color: "violet", digit: "7", mult: "×10M",  tol: "±0.1%" },
  { color: "gray",   digit: "8", mult: "×100M", tol: "±0.05%" },
  { color: "white",  digit: "9", mult: "×1G",   tol: "—" },
  { color: "gold",   digit: "—", mult: "×0.1",  tol: "±5%" },
  { color: "silver", digit: "—", mult: "×0.01", tol: "±10%" },
  { color: "none",   digit: "—", mult: "—",     tol: "±20%" },
];

// Bantları boyama + erişilebilir ipucu
function setBandColor(bandIndex, cssToken, title) {
  const el = band(bandIndex);
  el.className = `band band-${bandIndex}`; // sıfırla
  el.classList.add(`color-${cssToken}`);
  if (title) el.title = title;
}

// Kullanıcı dostu birim
function formatOhms(ohms) {
  if (ohms >= 1e9) return (ohms/1e9).toFixed(2).replace(/\.00$/,"") + " GΩ";
  if (ohms >= 1e6) return (ohms/1e6).toFixed(2).replace(/\.00$/,"") + " MΩ";
  if (ohms >= 1e3) return (ohms/1e3).toFixed(2).replace(/\.00$/,"") + " kΩ";
  return `${Number(ohms.toFixed(2))} Ω`;
}

// Bantları konumlandır (mode'a göre yüzdeler)
function positionBands() {
  const res = $("resistor");
  // Yüzdeler gövdenin düz (boyun) kısmına sabitlenir (~%27.6–%72.4 arası),
  // böylece bantlar kavisli uç kısımlarına taşmaz.
  const percByMode = {
    4: [33, 41, 49, 65],                  // 1,2, çarpan, [boşluk], tolerans
    5: [32, 39, 46, 53, 66],              // 1,2,3, çarpan, [boşluk], tolerans
    6: [31, 37, 43, 49, 59, 67],          // 1,2,3, çarpan, [boşluk], tolerans, [boşluk], tempco
  };
  const active = percByMode[state.mode];
  // Hepsini önce gizle
  for (let i=1;i<=6;i++){ band(i).style.display = "none"; }
  // Kullanılacaklar:
  active.forEach((p, idx) => {
    const el = band(idx+1);
    el.style.display = "block";
    el.style.left = `calc(${p}% - var(--band-half))`;
  });

  // Görselde core zaten var
  res.dataset.mode = state.mode;
}

// Hesaplama ve görsele yansıtma
function calculateAndRender() {
  const t = TXT[state.lang];
  const d1 = Number(selects.d1.value);
  const d2 = Number(selects.d2.value);
  const mult = Number(selects.multiplier.value);
  const tol = Number(selects.tolerance.value);

  const d1Opt = selects.d1.selectedOptions[0];
  const d2Opt = selects.d2.selectedOptions[0];
  const multOpt = selects.multiplier.selectedOptions[0];
  const tolOpt = selects.tolerance.selectedOptions[0];

  // Bant renklerini uygula
  setBandColor(1, d1Opt.dataset.color, `${t.d1}: ${d1Opt.value} (${COLOR_NAMES[state.lang][d1Opt.dataset.color]})`);
  setBandColor(2, d2Opt.dataset.color, `${t.d2}: ${d2Opt.value} (${COLOR_NAMES[state.lang][d2Opt.dataset.color]})`);

  let baseDigits = 0;
  let digitsLabel = "";

  if (state.mode === 4) {
    // (10*d1 + d2)
    baseDigits = 10 * d1 + d2;
    digitsLabel = `${d1}${d2}`;
    setBandColor(3, multOpt.dataset.color, `${t.multiplier}: ${multOpt.dataset.shorthand} (${COLOR_NAMES[state.lang][multOpt.dataset.color]})`);
    setBandColor(4, tolOpt.dataset.color, `${t.tolerance}: ${tolOpt.dataset.shorthand} (${COLOR_NAMES[state.lang][tolOpt.dataset.color]})`);
  } else {
    const d3Opt = selects.d3.selectedOptions[0];
    const d3 = Number(selects.d3.value);
    setBandColor(3, d3Opt.dataset.color, `${t.d3}: ${d3Opt.value} (${COLOR_NAMES[state.lang][d3Opt.dataset.color]})`);
    setBandColor(4, multOpt.dataset.color, `${t.multiplier}: ${multOpt.dataset.shorthand} (${COLOR_NAMES[state.lang][multOpt.dataset.color]})`);
    setBandColor(5, tolOpt.dataset.color, `${t.tolerance}: ${tolOpt.dataset.shorthand} (${COLOR_NAMES[state.lang][tolOpt.dataset.color]})`);

    // (100*d1 + 10*d2 + d3)
    baseDigits = 100 * d1 + 10 * d2 + d3;
    digitsLabel = `${d1}${d2}${d3}`;

    if (state.mode === 6) {
      const tempcoOpt = selects.tempco.selectedOptions[0];
      const tempcoTitle = tempcoOpt.value === "-"
        ? `${t.tempco}: —`
        : `${t.tempco}: ${COLOR_NAMES[state.lang][tempcoOpt.dataset.color]} (${tempcoOpt.dataset.ppm} ppm/°C)`;
      setBandColor(6, tempcoOpt.dataset.color, tempcoTitle);
    }
  }

  const base = baseDigits * mult;
  const min = base * (1 - tol/100);
  const max = base * (1 + tol/100);

  out.valueText.textContent = `${formatOhms(base)} ± ${tol}%`;
  out.rangeText.textContent = `${formatOhms(min)} – ${formatOhms(max)}`;
  out.calcText.textContent = `${digitsLabel} ${multOpt.dataset.shorthand} = ${formatOhms(base)}`;
  renderBandGuide();

  // 6 bantta sıcaklık katsayısını göster
  if (state.mode === 6) {
    out.tempcoLine.style.display = "";
    out.tempcoText.textContent = selects.tempco.value === "-" ? "—" : selects.tempco.value;
  } else {
    out.tempcoLine.style.display = "none";
  }
}

function renderBandGuide() {
  const guide = $("bandGuideItems");
  if (!guide) return;
  const t = TXT[state.lang];
  const roles = roleByMode[state.mode] || [];
  const labels = state.mode === 4
    ? [t.d1, t.d2, t.multiplier, t.tolerance]
    : state.mode === 5
      ? [t.d1, t.d2, t.d3, t.multiplier, t.tolerance]
      : [t.d1, t.d2, t.d3, t.multiplier, t.tolerance, t.tempco];

  guide.innerHTML = roles.map((role, index) => {
    const option = selects[role].selectedOptions[0];
    const color = option.dataset.color;
    return `<div class="guide-item"><span class="guide-swatch color-${color}"></span><span class="guide-index">${index + 1}</span><span class="guide-label"><strong>${labels[index]}</strong><small>${COLOR_NAMES[state.lang][color]}</small></span></div>`;
  }).join("");
  $("guideMode").textContent = `${state.mode} ${state.lang === "tr" ? "BANT" : "BANDS"}`;
}

// Sekme (tab) değişimi
function setMode(newMode) {
  state.mode = newMode;

  // Sekme görünümü
  document.querySelectorAll(".tab").forEach(btn=>{
    const active = Number(btn.dataset.mode) === newMode;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });

  // Form alanlarını görünürlük
  wrappers.d3.classList.toggle("hidden", newMode === 4);
  wrappers.tempco.classList.toggle("hidden", newMode !== 6);

  // Bantları konumlandır + hesapla
  positionBands();
  calculateAndRender();
  clearReverseNote();
  closeBandPicker();
}

// Olaylar
Object.values(selects).forEach(sel => sel.addEventListener("change", calculateAndRender));
document.querySelectorAll(".tab").forEach(btn=>{
  btn.addEventListener("click", ()=> setMode(Number(btn.dataset.mode)));
});

// ---- Tema (açık/koyu) ----
const themeToggle = $("themeToggle");
function applyThemeIcon() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const t = TXT[state.lang];
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-label", isDark ? t.themeToLight : t.themeToDark);
}
themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("ohmline-theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("ohmline-theme", "dark");
  }
  applyThemeIcon();
});

// ---- Rastgele bantlar ----
function pickRandomOption(select) {
  const idx = Math.floor(Math.random() * select.options.length);
  select.selectedIndex = idx;
}
$("randomizeBtn").addEventListener("click", () => {
  pickRandomOption(selects.d1);
  pickRandomOption(selects.d2);
  if (state.mode !== 4) pickRandomOption(selects.d3);
  pickRandomOption(selects.multiplier);
  pickRandomOption(selects.tolerance);
  if (state.mode === 6) pickRandomOption(selects.tempco);
  calculateAndRender();
  clearReverseNote();
});

// ---- Ters arama: değerden bantlara ----
const reverseNote = $("reverseNote");
function clearReverseNote() {
  reverseNote.textContent = "";
  reverseNote.classList.remove("warn");
}

// Verilen ohm değerine en yakın standart bant kombinasyonunu bulur.
function valueToBands(targetOhms, digitCount) {
  const minExp = -2, maxExp = 9; // ×0.01 .. ×1G
  let exponent = Math.floor(Math.log10(targetOhms)) - (digitCount - 1);
  exponent = Math.min(maxExp, Math.max(minExp, exponent));

  let base = Math.round(targetOhms / Math.pow(10, exponent));
  const maxBase = Math.pow(10, digitCount) - 1;
  const minBase = Math.pow(10, digitCount - 1);

  // Taşma olduysa bir üst ondalığa geç (aralık izin veriyorsa)
  if (base > maxBase && exponent < maxExp) {
    exponent += 1;
    base = Math.round(targetOhms / Math.pow(10, exponent));
  }
  base = Math.min(maxBase, Math.max(minBase, base));

  const approxValue = base * Math.pow(10, exponent);
  const errorPct = Math.abs(approxValue - targetOhms) / targetOhms * 100;
  const digits = String(base).padStart(digitCount, "0").split("").map(Number);

  return { digits, exponent, approxValue, errorPct };
}

function applyReverseLookup() {
  const t = TXT[state.lang];
  const rawValue = parseFloat($("targetValue").value);
  const unit = Number($("targetUnit").value);

  if (!isFinite(rawValue) || rawValue <= 0) {
    reverseNote.textContent = t.reverseInvalid;
    reverseNote.classList.add("warn");
    return;
  }

  const targetOhms = rawValue * unit;
  const digitCount = state.mode === 4 ? 2 : 3;
  const { digits, exponent, approxValue, errorPct } = valueToBands(targetOhms, digitCount);

  selects.d1.value = String(digits[0]);
  selects.d2.value = String(digits[1]);
  if (digitCount === 3) selects.d3.value = String(digits[2]);
  selects.multiplier.value = String(Math.pow(10, exponent));

  calculateAndRender();

  const approxLabel = formatOhms(approxValue);
  if (errorPct < 0.01) {
    reverseNote.textContent = t.reverseExact(approxLabel);
    reverseNote.classList.remove("warn");
  } else {
    reverseNote.textContent = t.reverseClosest(approxLabel, errorPct.toFixed(2));
    reverseNote.classList.add("warn");
  }
}

$("reverseBtn").addEventListener("click", applyReverseLookup);
$("targetValue").addEventListener("keydown", (e) => {
  if (e.key === "Enter") applyReverseLookup();
});

// ---- Değeri kopyala ----
const copyBtn = $("copyBtn");
copyBtn.addEventListener("click", async () => {
  const t = TXT[state.lang];
  const text = out.valueText.textContent;
  let ok = true;
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    ok = false;
  }
  copyBtn.textContent = ok ? t.copied : t.copyFailed;
  copyBtn.classList.toggle("copied", ok);
  setTimeout(() => {
    copyBtn.textContent = t.copy;
    copyBtn.classList.remove("copied");
  }, 1400);
});

// ---- Renk kodu tablosu ----
function renderLegend(lang) {
  const body = $("legendBody");
  body.innerHTML = "";
  LEGEND_ROWS.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="swatch color-${row.color}"></span>${COLOR_NAMES[lang][row.color]}</td>
      <td>${row.digit}</td>
      <td>${row.mult}</td>
      <td>${row.tol}</td>
    `;
    body.appendChild(tr);
  });
}

// ---- Seçim kutularını dile göre yeniden etiketle ----
function relabelDigitSelect(select, lang) {
  Array.from(select.options).forEach(opt => {
    opt.textContent = `${opt.value} - ${COLOR_NAMES[lang][opt.dataset.color]}`;
  });
}
function relabelShorthandSelect(select, lang) {
  Array.from(select.options).forEach(opt => {
    opt.textContent = `${opt.dataset.shorthand} - ${COLOR_NAMES[lang][opt.dataset.color]}`;
  });
}
function relabelTempcoSelect(select, lang) {
  Array.from(select.options).forEach(opt => {
    if (opt.value === "-") { opt.textContent = "—"; return; }
    opt.textContent = `${COLOR_NAMES[lang][opt.dataset.color]} — ${opt.dataset.ppm}`;
  });
}

// ---- Dil değişimi ----
function applyLanguage(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem("ohmline-lang", lang);

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const val = TXT[lang][key];
    if (typeof val === "string") el.innerHTML = val;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = TXT[lang][el.dataset.i18nPlaceholder];
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    el.title = TXT[lang][el.dataset.i18nTitle];
  });

  relabelDigitSelect(selects.d1, lang);
  relabelDigitSelect(selects.d2, lang);
  relabelDigitSelect(selects.d3, lang);
  relabelShorthandSelect(selects.multiplier, lang);
  relabelShorthandSelect(selects.tolerance, lang);
  relabelTempcoSelect(selects.tempco, lang);

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  renderLegend(lang);
  applyThemeIcon();
  calculateAndRender();
  if (typeof closeBandPicker === "function") closeBandPicker();
}

document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
});

// ---- Banda dokunarak renk seçme ----
const roleByMode = {
  4: ["d1", "d2", "multiplier", "tolerance"],
  5: ["d1", "d2", "d3", "multiplier", "tolerance"],
  6: ["d1", "d2", "d3", "multiplier", "tolerance", "tempco"],
};

const bandPicker = $("bandPicker");
const resistorStage = document.querySelector(".resistor-stage");
let activeBandEl = null;

function closeBandPicker() {
  bandPicker.hidden = true;
  bandPicker.innerHTML = "";
  activeBandEl = null;
}

function openBandPicker(bandIndex, bandEl) {
  const role = roleByMode[state.mode][bandIndex - 1];
  if (!role) return;
  const select = selects[role];

  bandPicker.innerHTML = "";
  Array.from(select.options).forEach(opt => {
    const swatch = document.createElement("button");
    swatch.type = "button";
    swatch.className = `picker-swatch color-${opt.dataset.color}`;
    swatch.title = opt.textContent;
    swatch.setAttribute("aria-label", opt.textContent);
    if (opt.value === select.value) swatch.classList.add("selected");
    swatch.addEventListener("click", (e) => {
      e.stopPropagation();
      select.value = opt.value;
      calculateAndRender();
      closeBandPicker();
      bandEl.focus();
    });
    bandPicker.appendChild(swatch);
  });

  const stageRect = resistorStage.getBoundingClientRect();
  const bandRect = bandEl.getBoundingClientRect();
  bandPicker.style.left = `${bandRect.left - stageRect.left + bandRect.width / 2}px`;
  bandPicker.style.top = `${bandRect.top - stageRect.top}px`;
  bandPicker.hidden = false;
  activeBandEl = bandEl;
}

for (let i = 1; i <= 6; i++) {
  const el = band(i);
  el.addEventListener("click", () => {
    if (el.style.display === "none") return;
    if (activeBandEl === el) { closeBandPicker(); return; }
    openBandPicker(i, el);
  });
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (el.style.display === "none") return;
      if (activeBandEl === el) { closeBandPicker(); return; }
      openBandPicker(i, el);
    } else if (e.key === "Escape") {
      closeBandPicker();
    }
  });
}

document.addEventListener("click", (e) => {
  if (!bandPicker.hidden && !bandPicker.contains(e.target) && e.target !== activeBandEl) {
    closeBandPicker();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeBandPicker();
});
window.addEventListener("resize", closeBandPicker);

// İlk kurulum
const savedLang = localStorage.getItem("ohmline-lang") || "tr";
positionBands();
applyLanguage(savedLang);
