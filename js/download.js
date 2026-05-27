/* Download helpers: HTML file, PDF, PNG range capture */

function downloadHTMLChunk(html, index) {
  var full = [
    '<!DOCTYPE html>',
    '<html lang="ko">',
    '<head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>롤20 로그 ' + index + '</title>',
    '</head>',
    '<body style="margin:16px">',
    html,
    '</body></html>',
  ].join('\n');

  var blob = new Blob([full], { type: 'text/html;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'r20-log-' + index + '.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function printPDF(chunkIndex) {
  var chunks = document.querySelectorAll('.chunk');
  var previewsOpened = [];

  chunks.forEach(function (ch, i) {
    if (chunkIndex !== -1 && i !== chunkIndex) {
      ch.classList.add('print-hidden');
      return;
    }
    var prev = ch.querySelector('.preview');
    if (prev && prev.style.display !== 'block') {
      prev.style.display = 'block';
      if (!prev.innerHTML.trim() && prev._finalHTML) prev.innerHTML = prev._finalHTML;
      previewsOpened.push(prev);
    }
  });

  window.print();

  chunks.forEach(function (ch) { ch.classList.remove('print-hidden'); });
  previewsOpened.forEach(function (prev) { prev.style.display = 'none'; });
}

/* ─── PNG range capture (click start → click end) ───────────── */

var _pick = {
  active: false,
  start: null,
  logEl: null,
  previewEl: null,
  chunkIndex: 0,
  btn: null,
  handler: null,
};

function togglePickMode(previewEl, chunkIndex, btn) {
  if (_pick.active) {
    var same = (_pick.btn === btn);
    _exitPick();
    if (same) return; // toggling the same chunk's button off
  }

  if (typeof html2canvas === 'undefined') {
    alert('이미지 변환 라이브러리(html2canvas)를 불러오지 못했습니다. 네트워크 연결을 확인해 주세요.');
    return;
  }

  // Ensure preview open
  if (previewEl.style.display !== 'block') {
    previewEl.style.display = 'block';
    if (!previewEl.innerHTML.trim() && previewEl._finalHTML) {
      previewEl.innerHTML = previewEl._finalHTML;
    }
  }

  var logEl = previewEl.querySelector('.r20-log') || previewEl;
  _enterPick(previewEl, logEl, chunkIndex, btn);
}

function _enterPick(previewEl, logEl, chunkIndex, btn) {
  _pick.active = true;
  _pick.start = null;
  _pick.logEl = logEl;
  _pick.previewEl = previewEl;
  _pick.chunkIndex = chunkIndex;
  _pick.btn = btn;

  btn.textContent = '① 시작 메시지를 클릭';
  btn.classList.add('danger');
  previewEl.closest('.chunk-bd').classList.add('pick-mode-active');

  _pick.handler = function (e) {
    var turn = e.target.closest ? e.target.closest('.r20-turn') : null;
    if (!turn || !logEl.contains(turn)) return;
    e.preventDefault();
    e.stopPropagation();

    if (!_pick.start) {
      _pick.start = turn;
      _highlight(turn, true);
      btn.textContent = '② 끝 메시지를 클릭';
    } else {
      _highlight(turn, true);
      var start = _pick.start;
      var end = turn;
      btn.textContent = '캡처 중...';
      _captureRange(logEl, start, end, chunkIndex, function () {
        _exitPick();
      });
    }
  };

  previewEl.addEventListener('click', _pick.handler, true);
}

function _highlight(turn, on) {
  turn.style.outline = on ? '2px solid #4f46e5' : '';
  turn.style.outlineOffset = on ? '2px' : '';
}

function _clearHighlights(logEl) {
  if (!logEl) return;
  logEl.querySelectorAll('.r20-turn').forEach(function (t) {
    t.style.outline = '';
    t.style.outlineOffset = '';
  });
}

function _exitPick() {
  if (_pick.previewEl && _pick.handler) {
    _pick.previewEl.removeEventListener('click', _pick.handler, true);
    var bd = _pick.previewEl.closest('.chunk-bd');
    if (bd) bd.classList.remove('pick-mode-active');
  }
  _clearHighlights(_pick.logEl);
  if (_pick.btn) {
    _pick.btn.textContent = 'PNG 선택 캡처';
    _pick.btn.classList.remove('danger');
  }
  _pick.active = false;
  _pick.start = null;
  _pick.logEl = null;
  _pick.previewEl = null;
  _pick.btn = null;
  _pick.handler = null;
}

function _captureRange(logEl, startTurn, endTurn, chunkIndex, done) {
  var turns = Array.prototype.slice.call(logEl.querySelectorAll('.r20-turn'));
  var i = turns.indexOf(startTurn);
  var j = turns.indexOf(endTurn);
  if (i < 0 || j < 0) { done(); return; }
  if (i > j) { var tmp = i; i = j; j = tmp; }

  // Build an offscreen clone with the same classes/vars so CSS applies
  var temp = document.createElement('div');
  temp.className = logEl.className;
  temp.setAttribute('style', logEl.getAttribute('style') || '');
  temp.style.position = 'fixed';
  temp.style.left = '-99999px';
  temp.style.top = '0';
  temp.style.width = logEl.offsetWidth + 'px';

  for (var k = i; k <= j; k++) {
    var clone = turns[k].cloneNode(true);
    clone.style.outline = '';
    clone.style.outlineOffset = '';
    temp.appendChild(clone);
  }
  document.body.appendChild(temp);

  var bg = getComputedStyle(logEl).backgroundColor;

  html2canvas(temp, { useCORS: true, scale: 2, backgroundColor: bg, logging: false })
    .then(function (canvas) {
      var a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'r20-' + chunkIndex + '-' + Date.now() + '.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch(function (err) {
      alert('캡처 실패: ' + (err && err.message ? err.message : err));
    })
    .then(function () {
      if (temp.parentNode) temp.parentNode.removeChild(temp);
      done();
    });
}
