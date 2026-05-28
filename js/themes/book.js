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
      '.r20-theme-book.r20-log{max-width:700px;padding:36px 44px}',
      '.r20-theme-book .r20-avatar-wrap{display:none}',
      '.r20-theme-book .r20-turn{padding:10px 0;border-bottom:1px solid rgba(0,0,0,.06)}',
      '.r20-theme-book .r20-turn:last-child{border-bottom:none}',
      '.r20-theme-book .r20-speaker{font-variant:small-caps;letter-spacing:.06em;font-weight:bold;color:#6b4a32;margin-bottom:3px;font-size:.9em}',
      '.r20-theme-book .r20-line{text-indent:1em}',
      /* Prevent styled blocks (chapter headers, dividers) from auto-wrapping;
         overflow-x:auto already on .r20-line from base CSS handles wide content */
      '.r20-theme-book .r20-line > *{max-width:100%;white-space:normal}',
      /* Narration: centered serif italic, scene-break feel */
      '.r20-theme-book .r20-narration{border-bottom:none;text-align:center;',
      'margin:18px auto;max-width:88%}',
      '.r20-theme-book .r20-narration .r20-line{font-style:italic;text-indent:0;color:#6b645c}',
      /* Roll result tables themed to match book palette */
      '.r20-theme-book .r20-roll{margin:8px 0;border-radius:4px;',
      'border:1px solid rgba(107,74,50,.2)}',
      '.r20-theme-book .r20-roll table{width:100%;font-family:inherit;font-size:.88em}',
      '.r20-theme-book .r20-roll td,.r20-theme-book .r20-roll th{',
      'padding:5px 10px;border:1px solid rgba(107,74,50,.15);vertical-align:middle}',
      '.r20-theme-book .r20-roll tr:first-child td,',
      '.r20-theme-book .r20-roll thead td,',
      '.r20-theme-book .r20-roll thead th{',
      'background:#6b4a32!important;color:#faf8f2!important;font-weight:bold}',
    ].join(''),
  };
})();
