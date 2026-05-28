/* eslint-disable */
(function () {
  window.THEMES = window.THEMES || {};

  window.THEMES['book'] = {
    name: '책 스타일',
    desc: 'Serif 폰트, 소설책 느낌',
    themeClass: 'r20-theme-book',
    preview:
      '<div style="font-family:Georgia,serif;background:#faf8f2;padding:8px;border-radius:4px">' +
      '<span style="font-variant:small-caps;font-weight:bold;color:#6b4a32;font-size:11px">오틸리</span><br>' +
      '<span style="display:block;text-indent:.8em;font-size:11px">(3초만에 받는다.) 여보세요?</span>' +
      '<span style="display:block;font-style:italic;font-size:10px;color:#888;margin-top:4px">— 나레이션은 이탤릭으로 —</span></div>',
    defaults: {
      bg: '#faf8f2',
      fg: '#2c2723',
      font: "'Nanum Myeongjo', 'Noto Serif KR', Georgia, serif",
      lh: '2.0',
      fs: '17',
    },
    css: [
      /* Wider content area to prevent styled blocks (chapter headers) from auto-wrapping */
      '.r20-theme-book.r20-log{max-width:760px;padding:24px 28px}',
      '.r20-theme-book .r20-avatar-wrap{display:none}',
      /* Consistent padding on all turns; use border-bottom only on dialogue turns */
      '.r20-theme-book .r20-turn{padding:10px 0;border-bottom:1px solid rgba(0,0,0,.06)}',
      '.r20-theme-book .r20-turn:last-child{border-bottom:none}',
      '.r20-theme-book .r20-speaker{font-variant:small-caps;letter-spacing:.06em;',
      'font-weight:bold;color:#6b4a32;margin-bottom:2px;font-size:.9em}',
      '.r20-theme-book .r20-line{text-indent:1em}',
      /* Prevent styled blocks from line-breaking: max-width constrains, overflow-x:auto scrolls */
      '.r20-theme-book .r20-line > *{max-width:100%}',
      /* Narration: compact padding, centered italic, no divider */
      '.r20-theme-book .r20-narration{padding:5px 0;border-bottom:none;',
      'text-align:center;max-width:88%;margin-left:auto;margin-right:auto}',
      '.r20-theme-book .r20-narration .r20-line{font-style:italic;text-indent:0;color:#6b645c}',
      /* Roll results: strip Roll20 colors completely, replace with parchment-toned card */
      '.r20-theme-book .r20-roll *{background:transparent!important;color:inherit!important;',
      'font-family:inherit!important;border-color:rgba(107,74,50,.15)!important}',
      '.r20-theme-book .r20-roll{border:1px solid rgba(107,74,50,.3);border-radius:3px;',
      'overflow:hidden;margin:8px 0}',
      '.r20-theme-book .r20-roll table{width:100%;border-collapse:collapse;',
      'font-family:inherit;font-size:.88em}',
      '.r20-theme-book .r20-roll td,.r20-theme-book .r20-roll th{',
      'padding:5px 12px;border:1px solid rgba(107,74,50,.12)!important;vertical-align:middle}',
      '.r20-theme-book .r20-roll tr:first-child>td,',
      '.r20-theme-book .r20-roll tr:first-child>th,',
      '.r20-theme-book .r20-roll thead td,',
      '.r20-theme-book .r20-roll thead th{',
      'background:#6b4a32!important;color:#faf8f2!important;font-weight:bold}',
    ].join(''),
  };
})();
