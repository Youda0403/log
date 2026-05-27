/* Core: Roll20 log parsing + semantic re-rendering */

var HIDDEN_PHRASE = 'this message has been hidden';

/* Base CSS injected into every output (scoped under .r20-log) */
window.R20_BASE_CSS = [
  '.r20-log{width:100%;margin:0 auto;max-width:760px;box-sizing:border-box;',
  'background:var(--r20-bg);color:var(--r20-fg);font-family:var(--r20-font);',
  'line-height:var(--r20-lh);font-size:var(--r20-fs);',
  'word-break:break-word;overflow-wrap:anywhere}',
  '.r20-log *{box-sizing:border-box}',
  '.r20-line{margin:0 0 .45em}',
  '.r20-line:last-child{margin-bottom:0}',
  '.r20-line em{font-style:italic}',
  '.r20-line a{color:inherit;text-decoration:underline}',
  '.r20-line img{max-width:100%;height:auto}',
  '.r20-avatar{width:38px;height:38px;border-radius:50%;object-fit:cover;display:block}',
  '.r20-roll{overflow-x:auto}',
  '.r20-roll table{max-width:100%}',
].join('');

function escapeHTML(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
}

function directChildByClass(el, cls) {
  var found = null;
  Array.prototype.forEach.call(el.children, function (c) {
    if (!found && c.classList && c.classList.contains(cls)) found = c;
  });
  return found;
}

/* Extract the spoken content of a single .message div (header stripped) */
function extractLine(msg) {
  var clone = msg.cloneNode(true);
  Array.prototype.slice.call(clone.children).forEach(function (c) {
    if (c.classList && (c.classList.contains('spacer') ||
        c.classList.contains('avatar') || c.classList.contains('by'))) {
      c.remove();
    }
  });

  var hasTable = !!clone.querySelector('table');

  if (!hasTable) {
    // Strip Roll20's inline styles so the theme controls appearance
    clone.querySelectorAll('[style]').forEach(function (e) { e.removeAttribute('style'); });
  }

  var html = clone.innerHTML.replace(/^(?:\s|&nbsp;)+/, '').trim();
  return { html: html, isRoll: hasTable };
}

/* Parse a wrapper containing pasted Roll20 chat into normalized turns */
function parseRoll20Log(root) {
  var messages = root.querySelectorAll('.message');
  var turns = [];
  var current = null;

  Array.prototype.forEach.call(messages, function (msg) {
    var text = (msg.textContent || '').trim().toLowerCase();
    if (text.indexOf(HIDDEN_PHRASE) !== -1) return; // skip hidden

    var byEl = directChildByClass(msg, 'by');
    var avatarEl = directChildByClass(msg, 'avatar');
    var hasHeader = !!(byEl || avatarEl);

    if (hasHeader) {
      var name = byEl ? byEl.textContent.replace(/\s*[:：]\s*$/, '').trim() : '';
      var img = avatarEl ? avatarEl.querySelector('img') : null;
      var avatarUrl = img ? (img.getAttribute('src') || '') : '';

      current = {
        speaker: name,
        avatarUrl: avatarUrl,
        isSelf: msg.classList.contains('you'),
        isNarration: !name,
        lines: [],
      };
      turns.push(current);
      current.lines.push(extractLine(msg));
    } else {
      if (!current) {
        current = { speaker: '', avatarUrl: '', isSelf: false, isNarration: true, lines: [] };
        turns.push(current);
      }
      current.lines.push(extractLine(msg));
    }
  });

  return turns;
}

/* Render normalized turns into clean semantic HTML */
function renderTurnsHTML(turns, scale) {
  var scaleStyle = '';
  if (scale && scale !== 100) {
    scaleStyle = ' style="transform:scale(' + (scale / 100) + ');transform-origin:top left"';
  }

  return turns.map(function (t) {
    var cls = 'r20-turn' + (t.isNarration ? ' r20-narration' : '');
    var selfAttr = t.isSelf ? ' data-self="true"' : '';
    var html = '<div class="' + cls + '"' + selfAttr + '>';

    if (!t.isNarration) {
      html += '<div class="r20-avatar-wrap">';
      if (t.avatarUrl) {
        html += '<img class="r20-avatar" crossorigin="anonymous" src="' +
          escapeAttr(t.avatarUrl) + '" alt="">';
      }
      html += '</div>';
    }

    html += '<div class="r20-body">';
    if (!t.isNarration && t.speaker) {
      html += '<div class="r20-speaker">' + escapeHTML(t.speaker) + '</div>';
    }
    html += '<div class="r20-lines">';

    t.lines.forEach(function (l) {
      if (!l.html) return;
      if (l.isRoll) {
        html += '<div class="r20-line r20-roll"' + scaleStyle + '>' + l.html + '</div>';
      } else {
        html += '<div class="r20-line">' + l.html + '</div>';
      }
    });

    html += '</div></div></div>';
    return html;
  }).join('');
}

/* Full standalone output: <style> + wrapper(with CSS vars) + content */
function buildOutputHTML(turns, scale) {
  var styleBlock = buildStyleBlock();        // design.js
  var vars = getWrapperVars();               // design.js
  var cls = 'r20-log ' + getThemeClass();    // design.js
  var inner = renderTurnsHTML(turns, scale);
  return styleBlock + '\n<div class="' + cls + '" style="' + vars + '">' + inner + '</div>';
}

/* Split turns into chunks (each rendered as a self-contained block) */
function splitForChunks(turns, size, scale) {
  var groups = [];
  var cur = [];
  var curLen = 0;

  turns.forEach(function (t) {
    var h = renderTurnsHTML([t], scale);
    if (curLen + h.length > size && cur.length) {
      groups.push(cur);
      cur = [];
      curLen = 0;
    }
    cur.push(t);
    curLen += h.length;
  });
  if (cur.length) groups.push(cur);

  return groups.map(function (g) { return buildOutputHTML(g, scale); });
}
