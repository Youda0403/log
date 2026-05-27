/* eslint-disable */
(function () {
  window.THEMES = window.THEMES || {};

  window.THEMES['book'] = {
    name: '책 스타일',
    desc: '소설책 느낌 (Serif, 들여쓰기)',
    themeClass: 'r20-theme-book',
    preview:
      '<div style="font-family:Georgia,serif;background:#faf8f2;padding:6px;border-radius:4px">' +
      '<span style="font-variant:small-caps;font-weight:bold;color:#6b4a32">오틸리</span><br>' +
      '<span style="display:block;text-indent:.8em">여보세요?</span>' +
      '<span style="display:block;font-style:italic;text-indent:.8em;opacity:.8">― 나레이션 ―</span></div>',
    defaults: {
      bg: '#faf8f2',
      fg: '#2c2723',
      font: "'Nanum Myeongjo', 'Noto Serif KR', Georgia, serif",
      lh: '2.0',
      fs: '17',
    },
    css: [
      '.r20-theme-book.r20-log{max-width:700px;padding:40px 44px}',
      '.r20-theme-book .r20-avatar-wrap{display:none}',
      '.r20-theme-book .r20-turn{padding:9px 0}',
      '.r20-theme-book .r20-speaker{font-variant:small-caps;letter-spacing:.06em;font-weight:bold;color:#6b4a32;margin-bottom:2px}',
      '.r20-theme-book .r20-line{text-indent:1em}',
      '.r20-theme-book .r20-narration .r20-line{font-style:italic;text-indent:1em;opacity:.85}',
    ].join(''),
  };
})();
