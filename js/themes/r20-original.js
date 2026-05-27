/* eslint-disable */
(function () {
  window.THEMES = window.THEMES || {};

  window.THEMES['r20-original'] = {
    name: '롤20 원본',
    desc: '채팅창 스타일 최대한 보존',
    preview: '<b>GM</b>: 던전 입구에 도착했다.<br><span style="color:#555">🎲 Perception → 14</span>',
    defaults: {
      bgColor: '#ffffff',
      textColor: '#111111',
      fontFamily: 'system-ui, sans-serif',
      lineHeight: '1.8',
      fontSize: '16',
    },
    css: `.r20-log{max-width:760px;width:100%;margin:0 auto;line-height:1.8;font-size:16px;word-break:break-word;overflow-wrap:anywhere;}`,
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
    },
  };
})();
