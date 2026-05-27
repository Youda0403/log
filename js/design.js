/* Design Panel & Theme System */
var currentThemeKey = 'r20-original';
var themeOverrides = {};

function getActiveTheme() {
  return (window.THEMES && window.THEMES[currentThemeKey]) || window.THEMES['r20-original'];
}

function getThemeCSS() {
  var theme = getActiveTheme();
  return theme.css || '';
}

function applyThemeToWrapper(wrapper) {
  var theme = getActiveTheme();
  if (theme && theme.applyDOM) {
    theme.applyDOM(wrapper, themeOverrides);
  }
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

  Object.keys(window.THEMES || {}).forEach(function (key) {
    var theme = window.THEMES[key];
    var card = document.createElement('div');
    card.className = 'theme-card' + (key === currentThemeKey ? ' selected' : '');

    var previewStyle = [
      'font-family:' + (theme.defaults && theme.defaults.fontFamily ? theme.defaults.fontFamily : 'system-ui'),
      'background:' + (theme.defaults && theme.defaults.bgColor ? theme.defaults.bgColor : '#fff'),
      'color:' + (theme.defaults && theme.defaults.textColor ? theme.defaults.textColor : '#111'),
    ].join(';');

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
  var theme = getActiveTheme();
  var defaults = (theme && theme.defaults) || {};
  var container = document.getElementById('overridePanel');
  if (!container) return;

  var fields = [
    { key: 'bgColor', label: '배경색', type: 'color' },
    { key: 'textColor', label: '텍스트 색', type: 'color' },
    {
      key: 'fontFamily', label: '폰트', type: 'select', options: [
        { value: 'system-ui, -apple-system, sans-serif', label: '시스템 기본' },
        { value: "'Nanum Myeongjo', 'Georgia', serif", label: '나눔명조 (한국어 serif)' },
        { value: "'Georgia', serif", label: 'Georgia (serif)' },
        { value: "ui-monospace, monospace", label: '고정폭 (monospace)' },
        { value: "'Malgun Gothic', sans-serif", label: '맑은 고딕' },
      ],
    },
    { key: 'lineHeight', label: '줄간격', type: 'range', min: 1.4, max: 2.6, step: 0.1 },
    { key: 'fontSize', label: '글자 크기 (px)', type: 'range', min: 12, max: 22, step: 1 },
  ];

  var html = '<div class="override-panel">' +
    '<div style="font-size:13px;font-weight:bold;margin-bottom:10px">세부 조정</div>' +
    '<div class="override-grid">';

  fields.forEach(function (f) {
    var val = themeOverrides[f.key] !== undefined ? themeOverrides[f.key] : (defaults[f.key] || '');
    html += renderOverrideFieldHTML(f, val);
  });

  html += '</div>';
  html += '<button class="btn small" id="resetOverrideBtn" style="margin-top:10px">초기화</button>';
  html += '</div>';
  container.innerHTML = html;

  // Bind
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
      return '<option value="' + escapeAttr(o.value) + '"' + (val === o.value ? ' selected' : '') + '>' + escapeHTML(o.label) + '</option>';
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

function escapeHTML(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return String(str || '').replace(/"/g, '&quot;');
}
