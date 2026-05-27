/* Download helpers: HTML file, PDF, PNG pick-mode */

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
  // chunkIndex: -1 = all, N = specific chunk (0-based)
  var chunks = document.querySelectorAll('.chunk');
  var previewsOpened = [];

  chunks.forEach(function (ch, i) {
    if (chunkIndex !== -1 && i !== chunkIndex) {
      ch.classList.add('print-hidden');
      return;
    }
    // Ensure preview is visible and filled
    var prev = ch.querySelector('.preview');
    if (prev && prev.style.display !== 'block') {
      prev.style.display = 'block';
      if (!prev.innerHTML.trim() && prev._finalHTML) {
        prev.innerHTML = prev._finalHTML;
      }
      previewsOpened.push(prev);
    }
  });

  window.print();

  // Restore state after print dialog closes
  chunks.forEach(function (ch) { ch.classList.remove('print-hidden'); });
  previewsOpened.forEach(function (prev) { prev.style.display = 'none'; });
}

// ─── PNG Pick Mode ────────────────────────────────

var _pickState = {
  active: false,
  cleanup: null,
  btn: null,  // tracks which button is currently in pick mode
};

function togglePickMode(previewEl, chunkIndex, btn) {
  if (_pickState.active) {
    var wasOwnBtn = (_pickState.btn === btn);
    _deactivatePickMode();
    if (wasOwnBtn) return;  // same button → just deactivate
    // different chunk's button → deactivate old, activate new
  }

  if (typeof html2canvas === 'undefined') {
    alert('html2canvas 라이브러리를 불러오지 못했습니다. 네트워크 연결을 확인해 주세요.');
    return;
  }

  // Open preview if closed
  if (previewEl.style.display !== 'block') {
    previewEl.style.display = 'block';
    if (!previewEl.innerHTML.trim() && previewEl._finalHTML) {
      previewEl.innerHTML = previewEl._finalHTML;
    }
  }

  _activatePickMode(previewEl, chunkIndex, btn);
}

function _activatePickMode(previewEl, chunkIndex, btn) {
  _pickState.active = true;
  btn.textContent = '선택 중... (클릭으로 캡처 / 다시 누르면 종료)';
  btn.classList.add('danger');

  var chunkBd = previewEl.closest('.chunk-bd');
  if (chunkBd) chunkBd.classList.add('pick-mode-active');

  var handler = function (e) {
    e.preventDefault();
    e.stopPropagation();

    var target = e.target;
    btn.textContent = '캡처 중...';

    html2canvas(target, { useCORS: true, scale: 2, logging: false })
      .then(function (canvas) {
        var url = canvas.toDataURL('image/png');
        var a = document.createElement('a');
        a.href = url;
        a.download = 'r20-pick-' + chunkIndex + '-' + Date.now() + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        btn.textContent = '선택 중... (클릭으로 캡처 / 다시 누르면 종료)';
      })
      .catch(function (err) {
        alert('캡처 실패: ' + err.message);
        btn.textContent = '선택 중... (클릭으로 캡처 / 다시 누르면 종료)';
      });
  };

  previewEl.addEventListener('click', handler, true);

  _pickState.btn = btn;
  _pickState.cleanup = function () {
    previewEl.removeEventListener('click', handler, true);
    if (chunkBd) chunkBd.classList.remove('pick-mode-active');
    _pickState.active = false;
    _pickState.btn = null;
    _pickState.cleanup = null;
  };
}

function _deactivatePickMode() {
  var prevBtn = _pickState.btn;
  if (_pickState.cleanup) _pickState.cleanup();
  if (prevBtn) {
    prevBtn.textContent = 'PNG 선택 캡처';
    prevBtn.classList.remove('danger');
  }
}
