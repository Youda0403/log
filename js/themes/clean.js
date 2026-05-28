/* eslint-disable */
(function () {
  window.THEMES = window.THEMES || {};

  window.THEMES['clean'] = {
    name: '깔끔 버전',
    desc: '미니멀 (작은 이름표 + 구분선)',
    themeClass: 'r20-theme-clean',
    preview:
      '<div style="padding:4px">' +
      '<div style="font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#9aa0a8">오틸리</div>' +
      '<div style="font-size:11px">여보세요?</div>' +
      '<div style="border-bottom:1px solid #eef0f2;margin:5px 0"></div>' +
      '<div style="font-size:10px;color:#9aa0a8;font-style:italic">나레이션 텍스트</div></div>',
    defaults: {
      bg: '#ffffff',
      fg: '#23272f',
      font: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Malgun Gothic', sans-serif",
      lh: '1.75',
      fs: '15',
    },
    css: [
      '.r20-theme-clean.r20-log{max-width:720px}',
      '.r20-theme-clean .r20-avatar-wrap{display:none}',
      '.r20-theme-clean .r20-turn{padding:12px 0;border-bottom:1px solid #eef0f2}',
      '.r20-theme-clean .r20-turn:last-child{border-bottom:none}',
      '.r20-theme-clean .r20-speaker{font-size:.72em;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:#9aa0a8;margin-bottom:5px}',
      /* Narration: grey italic, no top rule so it flows with content */
      '.r20-theme-clean .r20-narration{border-bottom:none;padding:4px 0 4px 10px;border-left:2px solid #e5e7eb}',
      '.r20-theme-clean .r20-narration .r20-line{color:#7b818a;font-style:italic}',
    ].join(''),
  };
})();
