/* eslint-disable */
(function () {
  window.THEMES = window.THEMES || {};

  window.THEMES['book'] = {
    name: '책 스타일',
    desc: 'Serif 폰트, 소설책 느낌',
    preview: '<span style="font-variant:small-caps;font-weight:bold;color:#4a3728">Arwen</span><br><span style="font-style:italic;color:#555">— 나레이션은 이탤릭으로 —</span><br>대화 텍스트는 들여쓰기.',
    defaults: {
      bgColor: '#faf8f2',
      textColor: '#2c2c2c',
      fontFamily: "'Nanum Myeongjo', 'Georgia', serif",
      lineHeight: '2.1',
      fontSize: '16',
    },
    css: [
      `.r20-log{max-width:680px;width:100%;margin:0 auto;font-family:'Nanum Myeongjo','Georgia',serif;`,
      `background:#faf8f2;padding:32px;line-height:2.1;font-size:16px;color:#2c2c2c;`,
      `word-break:break-word;overflow-wrap:anywhere;}`,
      `.r20-log .by,.r20-log .message-name,[class*="username"]{font-variant:small-caps;font-weight:bold;color:#4a3728;letter-spacing:.04em;}`,
      `.r20-log .emote,[class*="emote"]{font-style:italic;color:#5a5a5a;}`,
      `.r20-log .content,.r20-log .message-text{text-indent:1em;}`,
    ].join(''),
    applyDOM(wrapper, overrides) {
      const o = Object.assign({}, this.defaults, overrides);
      wrapper.style.backgroundColor = o.bgColor;
      wrapper.style.color = o.textColor;
      wrapper.style.fontFamily = o.fontFamily;
      wrapper.style.lineHeight = o.lineHeight;
      wrapper.style.fontSize = o.fontSize + 'px';
      wrapper.style.maxWidth = '680px';
      wrapper.style.width = '100%';
      wrapper.style.margin = '0 auto';
      wrapper.style.padding = '32px';
      wrapper.style.wordBreak = 'break-word';
      wrapper.style.overflowWrap = 'anywhere';

      wrapper.querySelectorAll('.by, .message-name, [class*="username"]').forEach(function (el) {
        el.style.fontVariant = 'small-caps';
        el.style.fontWeight = 'bold';
        el.style.color = '#4a3728';
        el.style.letterSpacing = '0.04em';
      });
      wrapper.querySelectorAll('.emote, [class*="emote"]').forEach(function (el) {
        el.style.fontStyle = 'italic';
        el.style.color = '#5a5a5a';
      });
    },
  };
})();
