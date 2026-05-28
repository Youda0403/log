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
      /* Narration: italic, no indent for speaker, more muted */
      '.r20-theme-book .r20-narration .r20-line{font-style:italic;text-indent:1em;color:#5a5450;opacity:.9}',
      '.r20-theme-book .r20-narration{padding:8px 0 8px 18px;border-left:2px solid #d0c8be}',
    ].join(''),
  };
})();
