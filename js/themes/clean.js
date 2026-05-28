/* eslint-disable */
(function () {
  window.THEMES = window.THEMES || {};

  /* "대본 스타일" — screenplay/script format: centered column, uppercase speaker labels */
  window.THEMES['script'] = {
    name: '대본 스타일',
    desc: '시나리오 형식, 중앙 정렬',
    themeClass: 'r20-theme-script',
    preview:
      '<div style="text-align:center;background:#fdfcfb;padding:6px">' +
      '<div style="font-size:9px;letter-spacing:.16em;text-transform:uppercase;' +
      'color:#bbb;margin-bottom:2px">오틸리</div>' +
      '<div style="font-size:11px">(3초만에 받는다.) 여보세요?</div>' +
      '<div style="font-size:10px;color:#aaa;font-style:italic;margin-top:5px">' +
      '문 뒤에서 발소리가 들립니다.</div></div>',
    defaults: {
      bg: '#fdfcfb',
      fg: '#2d2926',
      font: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Malgun Gothic', sans-serif",
      lh: '1.9',
      fs: '15',
    },
    css: [
      '.r20-theme-script.r20-log{max-width:640px}',
      '.r20-theme-script .r20-avatar-wrap{display:none}',
      /* All turns centered, consistent padding */
      '.r20-theme-script .r20-turn{text-align:center;padding:9px 16px}',
      /* Speaker label: spaced-out uppercase, muted color */
      '.r20-theme-script .r20-speaker{font-size:.78em;letter-spacing:.18em;',
      'text-transform:uppercase;color:#b0a89e;margin-bottom:1px;font-weight:600}',
      '.r20-theme-script .r20-line{text-indent:0}',
      /* Narration: compact, lighter gray italic */
      '.r20-theme-script .r20-narration{padding:4px 0}',
      '.r20-theme-script .r20-narration .r20-line{color:#aaa;font-style:italic}',
      /* Self-highlight: soft lavender tint, works without extra spacing */
      '.r20-theme-script .r20-self-hl{--r20-self-bg:#f5f0ff}',
      /* Roll results: inline badge, strip Roll20 colors, neutral dark header */
      '.r20-theme-script .r20-roll{display:inline-block;min-width:140px;',
      'border:1px solid #e5e5e5;border-radius:6px;overflow:hidden;margin:4px 0}',
      '.r20-theme-script .r20-roll *{background:transparent!important;color:inherit!important;',
      'font-family:inherit!important;border-color:#e5e5e5!important}',
      '.r20-theme-script .r20-roll table{border-collapse:collapse;font-size:.85em}',
      '.r20-theme-script .r20-roll td,.r20-theme-script .r20-roll th{',
      'padding:4px 10px;border:1px solid #e5e5e5!important;text-align:center;vertical-align:middle}',
      '.r20-theme-script .r20-roll tr:first-child>td,',
      '.r20-theme-script .r20-roll tr:first-child>th,',
      '.r20-theme-script .r20-roll thead td,',
      '.r20-theme-script .r20-roll thead th{',
      'background:#4a4a4a!important;color:#fff!important;font-weight:600;letter-spacing:.04em}',
    ].join(''),
  };
})();
