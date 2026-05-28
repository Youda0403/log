/* Design Panel & Theme System (CSS-variable driven) */
var currentThemeKey = 'r20-original';
var themeOverrides = {}; // keys: bg, fg, font, lh, fs

var RAW_KEY = 'raw';

function isCurrentRawMode() {
  return currentThemeKey === RAW_KEY;
}

function getActiveTheme() {
  if (isCurrentRawMode()) {
    /* Raw mode doesn't use a layout theme; fall back to first available for safety */
    return (window.THEMES && window.THEMES['r20-original']) ||
      (window.THEMES && window.THEMES[Object.keys(window.THEMES)[0]]) || {};
  }
  return (window.THEMES && window.THEMES[currentThemeKey]) ||
    (window.THEMES && window.THEMES['r20-original']) || {};
}

function getThemeClass() {
  if (isCurrentRawMode()) return '';
  return getActiveTheme().themeClass || '';
}

function buildStyleBlock() {
  if (isCurrentRawMode()) return '';
  var t = getActiveTheme();
  return '<style>' + window.R20_BASE_CSS + (t.css || '') + '</style>';
}

function getWrapperVars() {
  var t = getActiveTheme();
  var merged = Object.assign({}, t.defaults || {}, themeOverrides);
  return [
    '--r20-bg:' + (merged.bg || '#fff'),
    '--r20-fg:' + (merged.fg || '#111'),
    '--r20-font:' + (merged.font || 'system-ui,sans-serif'),
    '--r20-lh:' + (merged.lh || '1.8'),
    '--r20-fs:' + (merged.fs || '16') + 'px',
  ].join(';') + ';';
}

function initDesignPanel() {
  var panel = document.getElementById('designPanel');
  var toggleBtn = document.getElementById('designToggleBtn');

  toggleBtn.addEventListener('click', function () {
    var isOpen = panel.classList.toggle('open');
    toggleBtn.textContent = isOpen ? '디자인 패널 닫기 ▲' : '디자인 패널 열기 ▼';
  });

  renderThemeCards();
  renderOverridePanel();
}

function renderThemeCards() {
  var container = document.getElementById('themeCards');
  if (!container) return;
  container.innerHTML = '';

  /* ── Raw mode card (always first) ── */
  var rawCard = document.createElement('div');
  rawCard.className = 'theme-card' + (currentThemeKey === RAW_KEY ? ' selected' : '');
  rawCard.innerHTML =
    '<div class="theme-card-name">원본 모드</div>' +
    '<div class="theme-card-desc">롤20 형식 그대로 유지</div>' +
    '<div class="theme-card-preview" style="background:#f5f5f5;color:#333">' +
    '<div style="display:flex;gap:4px;align-items:flex-start;margin-bottom:3px">' +
    '<div style="width:14px;height:14px;border-radius:50%;background:#bbb;flex:0 0 14px;margin-top:1px"></div>' +
    '<div><b style="font-size:10px">플레이어</b><br><span style="font-size:9px">대사 내용</span></div></div>' +
    '<div style="font-size:9px;color:#888;background:#eee;padding:1px 4px;border-radius:2px">나레이션 설명</div>' +
    '</div>';
  rawCard.addEventListener('click', function () {
    currentThemeKey = RAW_KEY;
    themeOverrides = {};
    renderThemeCards();
    renderOverridePanel();
  });
  container.appendChild(rawCard);

  /* ── Layout theme cards ── */
  Object.keys(window.THEMES || {}).forEach(function (key) {
    var theme = window.THEMES[key];
    var d = theme.defaults || {};
    var card = document.createElement('div');
    card.className = 'theme-card' + (key === currentThemeKey ? ' selected' : '');

    var previewStyle = 'font-family:' + (d.font || 'system-ui') +
      ';background:' + (d.bg || '#fff') + ';color:' + (d.fg || '#111');

    card.innerHTML =
      '<div class="theme-card-name">' + escapeHTML(theme.name) + '</div>' +
      '<div class="theme-card-desc">' + escapeHTML(theme.desc) + '</div>' +
      '<div class="theme-card-preview" style="' + previewStyle + '">' + (theme.preview || '') + '</div>';

    card.addEventListener('click', function () {
      currentThemeKey = key;
      themeOverrides = {};
      renderThemeCards();
      renderOverridePanel();
    });
    container.appendChild(card);
  });
}

function renderOverridePanel() {
  var container = document.getElementById('overridePanel');
  if (!container) return;

  /* Raw mode has no theme variables to override */
  if (isCurrentRawMode()) {
    container.innerHTML =
      '<div style="font-size:13px;color:#888;padding:10px 0;border-top:1px solid #eee;margin-top:10px">' +
      '원본 모드에서는 세부 조정이 적용되지 않습니다. 다른 테마를 선택하면 폰트·색상 등을 조정할 수 있어요.' +
      '</div>';
    return;
  }

  var theme = getActiveTheme();
  var defaults = (theme && theme.defaults) || {};

  var fontOptions = [
    { value: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Malgun Gothic', sans-serif", label: '시스템 기본 (sans)' },
    { value: "'Nanum Myeongjo', 'Noto Serif KR', Georgia, serif", label: '나눔명조 (serif)' },
    { value: "'Malgun Gothic', sans-serif", label: '맑은 고딕' },
    { value: 'ui-monospace, monospace', label: '고정폭 (monospace)' },
  ];

  var fields = [
    { key: 'bg', label: '배경색', type: 'color' },
    { key: 'fg', label: '텍스트 색', type: 'color' },
    { key: 'font', label: '폰트', type: 'select', options: fontOptions },
    { key: 'lh', label: '줄간격', type: 'range', min: 1.4, max: 2.6, step: 0.1 },
    { key: 'fs', label: '글자 크기 (px)', type: 'range', min: 12, max: 24, step: 1 },
  ];

  var html = '<div class="override-panel">' +
    '<div style="font-size:13px;font-weight:bold;margin-bottom:10px">세부 조정 (변환/분할 다시 누르면 적용)</div>' +
    '<div class="override-grid">';

  fields.forEach(function (f) {
    var val = themeOverrides[f.key] !== undefined ? themeOverrides[f.key] : (defaults[f.key] || '');
    html += renderOverrideFieldHTML(f, val);
  });

  html += '</div>';
  html += '<button class="btn small" id="resetOverrideBtn" style="margin-top:10px">초기화</button>';
  html += '</div>';
  container.innerHTML = html;

  fields.forEach(function (f) {
    var el = document.getElementById('ov-' + f.key);
    if (!el) return;
    el.addEventListener('input', function () {
      themeOverrides[f.key] = el.value;
      if (f.type === 'range') {
        var lbl = document.getElementById('ovval-' + f.key);
        if (lbl) lbl.textContent = el.value;
      }
    });
  });

  var resetBtn = document.getElementById('resetOverrideBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      themeOverrides = {};
      renderOverridePanel();
    });
  }
}

function renderOverrideFieldHTML(field, val) {
  var inner = '';

  if (field.type === 'color') {
    inner = '<label for="ov-' + field.key + '">' + escapeHTML(field.label) + '</label>' +
            '<input type="color" id="ov-' + field.key + '" value="' + (val || '#ffffff') + '">';
  } else if (field.type === 'select') {
    var opts = field.options.map(function (o) {
      return '<option value="' + escapeAttr(o.value) + '"' + (val === o.value ? ' selected' : '') + '>' +
        escapeHTML(o.label) + '</option>';
    }).join('');
    inner = '<label for="ov-' + field.key + '">' + escapeHTML(field.label) + '</label>' +
            '<select id="ov-' + field.key + '">' + opts + '</select>';
  } else if (field.type === 'range') {
    inner = '<label>' + escapeHTML(field.label) + ' <span id="ovval-' + field.key + '">' + val + '</span></label>' +
            '<input type="range" id="ov-' + field.key + '"' +
            ' min="' + field.min + '" max="' + field.max + '" step="' + field.step + '" value="' + val + '">';
  }

  return '<div class="override-item">' + inner + '</div>';
}
