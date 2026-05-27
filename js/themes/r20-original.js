/* eslint-disable */
(function () {
  window.THEMES = window.THEMES || {};

  window.THEMES['r20-original'] = {
    name: '롤20 원본',
    desc: '채팅창 느낌 (아바타 + 이름)',
    themeClass: 'r20-theme-r20',
    preview:
      '<div style="display:flex;gap:6px"><div style="width:18px;height:18px;border-radius:50%;background:#cbd5e1;flex:0 0 18px"></div>' +
      '<div><b>오틸리</b><br>여보세요?</div></div>',
    defaults: {
      bg: '#ffffff',
      fg: '#333333',
      font: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Malgun Gothic', sans-serif",
      lh: '1.8',
      fs: '16',
    },
    css: [
      '.r20-theme-r20 .r20-turn{display:flex;gap:10px;align-items:flex-start;padding:9px 2px;border-top:1px solid rgba(0,0,0,.05)}',
      '.r20-theme-r20 .r20-turn:first-child{border-top:none}',
      '.r20-theme-r20 .r20-avatar-wrap{flex:0 0 38px}',
      '.r20-theme-r20 .r20-body{flex:1 1 auto;min-width:0}',
      '.r20-theme-r20 .r20-narration{padding-left:48px}',
      '.r20-theme-r20 .r20-speaker{font-weight:bold;margin-bottom:2px}',
      '.r20-theme-r20 .r20-narration .r20-line{opacity:.92}',
    ].join(''),
  };
})();
