/* eslint-disable */
(function () {
  window.THEMES = window.THEMES || {};

  window.THEMES['clean'] = {
    name: '깔끔 버전',
    desc: '심플하고 모던한 미니멀 레이아웃',
    preview: '<span style="font-weight:600;font-size:11px;color:#6b7280;text-transform:uppercase">PLAYER NAME</span><br>메시지 내용이 여기에...<br><span style="color:#9ca3af;font-size:11px">─────────────</span>',
    defaults: {
      bgColor: '#ffffff',
      textColor: '#1a1a1a',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      lineHeight: '1.7',
      fontSize: '15',
    },
    css: [
      `.r20-log{max-width:760px;width:100%;margin:0 auto;font-family:system-ui,-apple-system,sans-serif;`,
      `background:#fff;line-height:1.7;font-size:15px;color:#1a1a1a;word-break:break-word;overflow-wrap:anywhere;}`,
      `.r20-log .message{padding:6px 0;border-bottom:1px solid #f3f4f6;}`,
      `.r20-log .by,.r20-log .message-name{font-weight:600;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;}`,
      `.r20-log .emote{color:#6b7280;}`,
      `.r20-log img[class*="avatar"],.r20-log img[class*="token"]{width:28px!important;height:28px!important;border-radius:50%;vertical-align:middle;}`,
    ].join(''),
    applyDOM(wrapper, overrides) {
      const o = Object.assign({}, this.defaults, overrides);
      wrapper.style.backgroundColor = o.bgColor;
      wrapper.style.color = o.textColor;
      wrapper.style.fontFamily = o.fontFamily;
      wrapper.style.lineHeight = o.lineHeight;
      wrapper.style.fontSize = o.fontSize + 'px';
      wrapper.style.maxWidth = '760px';
      wrapper.style.width = '100%';
      wrapper.style.margin = '0 auto';
      wrapper.style.wordBreak = 'break-word';
      wrapper.style.overflowWrap = 'anywhere';

      wrapper.querySelectorAll('.by, .message-name, [class*="username"]').forEach(function (el) {
        el.style.fontWeight = '600';
        el.style.fontSize = '12px';
        el.style.color = '#6b7280';
        el.style.textTransform = 'uppercase';
        el.style.letterSpacing = '0.05em';
      });
    },
  };
})();
