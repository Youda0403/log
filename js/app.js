/* Entry point — event binding & main convert flow */

window.addEventListener('DOMContentLoaded', function () {
  document.getElementById('clearBtn').addEventListener('click', function () {
    document.getElementById('pad').innerHTML = '';
  });

  document.getElementById('convertBtn').addEventListener('click', doConvert);

  document.getElementById('pdfAllBtn').addEventListener('click', function () {
    printPDF(-1);
  });

  document.getElementById('singleMode').addEventListener('change', function (e) {
    var chunkInput = document.getElementById('chunkSize');
    var chunkLabel = document.getElementById('chunkSizeLabel');
    chunkInput.disabled = e.target.checked;
    chunkLabel.style.opacity = e.target.checked ? '0.4' : '1';
  });

  initDesignPanel();
});

function doConvert() {
  var pad = document.getElementById('pad');
  var chunksBox = document.getElementById('chunks');
  var noteEl = document.getElementById('note');

  chunksBox.innerHTML = '';
  noteEl.textContent = '';

  if (!pad.innerHTML.trim()) {
    alert('내용을 붙여넣어 주세요!');
    return;
  }

  var scale = Math.max(50, Math.min(150, parseInt(document.getElementById('scale').value || '100', 10)));
  var chunkSize = Math.max(20000, Math.min(200000, parseInt(document.getElementById('chunkSize').value || '60000', 10)));
  var singleMode = document.getElementById('singleMode').checked;

  var wrapper = document.createElement('div');
  wrapper.innerHTML = pad.innerHTML;

  var turns = parseRoll20Log(wrapper);

  if (!turns.length) {
    alert('변환할 메시지를 찾지 못했어요.\nRoll20 채팅 로그를 그대로 붙여넣었는지 확인해 주세요.');
    return;
  }

  var parts = singleMode
    ? [buildOutputHTML(turns, scale)]
    : splitForChunks(turns, chunkSize, scale);
  var total = parts.length;

  parts.forEach(function (frag, idx) {
    chunksBox.appendChild(makeChunkCard(frag, idx, total));
  });

  var msgCount = turns.reduce(function (n, t) { return n + t.lines.length; }, 0);
  noteEl.textContent = '메시지 ' + msgCount + '줄을 ' + total + '개 덩어리로 변환했어요.' +
    (singleMode ? ' (통짜 모드)' : '') +
    ' 티스토리 HTML 모드에 순서대로 붙여넣으세요.';
}

function makeChunkCard(frag, idx, total) {
  var section = document.createElement('section');
  section.className = 'chunk';

  var header = document.createElement('div');
  header.className = 'chunk-hd';

  var label = document.createElement('div');
  label.className = 'chunk-label';
  label.textContent = '덩어리 ' + (idx + 1) + ' / ' + total;

  var tools = document.createElement('div');
  tools.className = 'tools';

  var btnPreview = makeBtn('미리보기', 'small');
  var btnDownload = makeBtn('파일 저장', 'small');
  var btnCopy = makeBtn('코드 복사', 'small');
  var btnPNG = makeBtn('PNG 선택 캡처', 'small');
  var btnPDF = makeBtn('PDF (이 덩어리)', 'small');

  tools.appendChild(btnPreview);
  tools.appendChild(btnDownload);
  tools.appendChild(btnCopy);
  tools.appendChild(btnPNG);
  tools.appendChild(btnPDF);

  header.appendChild(label);
  header.appendChild(tools);
  section.appendChild(header);

  var body = document.createElement('div');
  body.className = 'chunk-bd';

  var prev = document.createElement('div');
  prev.className = 'preview';
  prev.style.display = 'none';
  prev._finalHTML = frag;

  body.appendChild(prev);
  section.appendChild(body);

  btnPreview.addEventListener('click', function () {
    if (prev.style.display === 'block') {
      prev.style.display = 'none';
    } else {
      prev.style.display = 'block';
      if (!prev.innerHTML.trim()) prev.innerHTML = frag;
    }
  });

  btnDownload.addEventListener('click', function () {
    downloadHTMLChunk(frag, idx + 1);
  });

  btnCopy.addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(frag)
        .then(function () { alert('덩어리 ' + (idx + 1) + ' 복사 완료!'); })
        .catch(function () { fallbackCopy(frag, idx + 1); });
    } else {
      fallbackCopy(frag, idx + 1);
    }
  });

  btnPNG.addEventListener('click', function () {
    togglePickMode(prev, idx + 1, btnPNG);
  });

  btnPDF.addEventListener('click', function () {
    printPDF(idx);
  });

  return section;
}

function makeBtn(text, extraClass) {
  var btn = document.createElement('button');
  btn.className = 'btn' + (extraClass ? ' ' + extraClass : '');
  btn.textContent = text;
  return btn;
}

function fallbackCopy(text, num) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    alert('덩어리 ' + num + ' 복사 완료!');
  } catch (e) {
    alert('복사 실패. 파일 저장을 이용해 주세요.');
  }
  document.body.removeChild(ta);
}
