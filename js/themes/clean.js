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
      '.r20-theme-script{--r20-accent:#6b6b6b;--r20-rc-line:#e5e5e5;--r20-self-bg:#f5f0ff}',
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
      /* Roll card: soft rounded box — visually grouped, clearly belongs to the speaker */
      '.r20-theme-script .r20-rollcard{border-left:none;display:inline-block;',
      'background:rgba(45,41,38,.07);border-radius:8px;',
      'padding:10px 20px;text-align:center;max-width:90%;margin:4px 0}',
      '.r20-theme-script .r20-rc-title{margin-bottom:6px;color:#8a7c6e}',
      '.r20-theme-script .r20-rc-rows{display:inline-block;text-align:left}',
      '.r20-theme-script .r20-rc-label{padding-right:14px}',
    ].join(''),
  };
})();
