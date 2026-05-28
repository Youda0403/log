/* eslint-disable */
(function () {
  window.THEMES = window.THEMES || {};

  window.THEMES['r20-original'] = {
    name: '롤20 원본',
    desc: '채팅창 느낌 (아바타 + 이름)',
    themeClass: 'r20-theme-r20',
    preview:
      '<div style="display:flex;gap:6px;align-items:flex-start">' +
      '<div style="width:18px;height:18px;border-radius:50%;background:#cbd5e1;flex:0 0 18px;margin-top:2px"></div>' +
      '<div><b style="font-size:11px">오틸리</b><br><span style="font-size:11px">(3초만에 받는다.) 여보세요?</span></div></div>' +
      '<div style="font-size:11px;color:#555;margin-top:4px;padding-left:4px">나레이션 텍스트입니다.</div>',
    defaults: {
      bg: '#ffffff',
      fg: '#333333',
      font: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Malgun Gothic', sans-serif",
      lh: '1.8',
      fs: '16',
    },
    css: [
      /* Named speaker turn: flex row with avatar */
      '.r20-theme-r20 .r20-turn{display:flex;gap:10px;align-items:flex-start;',
      'padding:10px 4px 10px;border-top:1px solid #ebebeb}',
      '.r20-theme-r20 .r20-turn:first-child{border-top:none}',
      '.r20-theme-r20 .r20-avatar-wrap{flex:0 0 36px;padding-top:2px}',
      '.r20-theme-r20 .r20-body{flex:1 1 auto;min-width:0}',
      '.r20-theme-r20 .r20-speaker{font-weight:bold;font-size:.9em;margin-bottom:3px}',
      /* Narration: no avatar column, muted color, italic */
      '.r20-theme-r20 .r20-narration{display:block;padding:6px 4px 6px 6px;',
      'border-left:3px solid #e0e0e0}',
      '.r20-theme-r20 .r20-narration .r20-line{color:#555;font-style:italic}',
    ].join(''),
  };
})();
