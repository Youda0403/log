/* Core: Roll20 log parsing + semantic re-rendering */

var HIDDEN_PHRASE = 'this message has been hidden';

/* Base CSS injected into every themed output */
window.R20_BASE_CSS = [
  '.r20-log{width:100%;margin:0 auto;max-width:760px;box-sizing:border-box;',
  'background:var(--r20-bg);color:var(--r20-fg);font-family:var(--r20-font);',
  'line-height:var(--r20-lh);font-size:var(--r20-fs);',
  'word-break:break-word;overflow-wrap:break-word}',
  '.r20-log *{box-sizing:border-box}',
  '.r20-log a{text-decoration:none}',
  /* position:relative → turn is the containing block for abs-positioned children */
  '.r20-turn{margin:0;position:relative}',
  /* flow-root → contains floats, prevents overlap bleed */
  '.r20-lines{display:flow-root}',
  /* .25em between paragraphs within a turn; overflow-x:auto for wide styled blocks */
  '.r20-line{margin:0 0 .25em;overflow-x:auto}',
  '.r20-line:last-child{margin-bottom:0}',
  '.r20-line img{max-width:100%;height:auto}',
  '.r20-avatar{width:36px;height:36px;border-radius:50%;object-fit:cover;display:block}',
  /* Roll results: scroll horizontally, clear trailing whitespace */
  '.r20-roll{overflow-x:auto}',
  '.r20-roll table{max-width:100%;border-collapse:collapse}',
  '.r20-roll > :last-child{margin-bottom:0!important;padding-bottom:0!important}',
  /* Self-highlight: background tint only — themes control all spacing/padding */
  '.self-hl .r20-turn[data-self="true"]{background:var(--r20-self-bg,#eef3fc);border-radius:8px}',
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

/* Extract content of a single .message div — strip only Roll20's structural chrome */
function extractLine(msg) {
  var clone = msg.cloneNode(true);

  /* Remove Roll20's structural header children */
  Array.prototype.slice.call(clone.children).forEach(function (c) {
    if (c.classList && (c.classList.contains('spacer') ||
        c.classList.contains('avatar') ||
        c.classList.contains('by'))) {
      c.remove();
    }
  });

  /* Reset absolute/fixed positioning on remaining top-level children.
     Absolute elements are taken out of flow and cause adjacent turns to overlap.
     Changing to relative keeps them in flow while preserving their visual styling. */
  Array.prototype.slice.call(clone.children).forEach(function (c) {
    if (c.style) {
      var pos = c.style.position;
      if (pos === 'absolute' || pos === 'fixed') {
        c.style.setProperty('position', 'relative');
      }
    }
  });

  var hasTable = !!clone.querySelector('table');

  /*
   * Only strip box-sizing (Roll20 injects it on every element).
   * Everything else — player colors, backgrounds, layout divs — is preserved.
   */
  clone.querySelectorAll('[style]').forEach(function (e) {
    e.style.removeProperty('box-sizing');
    /* Remove the attribute entirely if now empty */
    var s = e.getAttribute('style');
    if (s !== null && !s.trim()) e.removeAttribute('style');
  });

  /* Remove iframe/embed dimension attrs so they don't overflow */
  clone.querySelectorAll('img,video,iframe').forEach(function (el) {
    el.removeAttribute('width');
    el.removeAttribute('height');
    if (!el.style.maxWidth) el.style.maxWidth = '100%';
  });

  var html = clone.innerHTML.replace(/^(?:\s|&nbsp;)+/, '').trim();
  return { html: html, isRoll: hasTable };
}

/* Remove hidden-message turns from wrapper */
function removeHidden(root) {
  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  var toRemove = [];
  var node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue && node.nodeValue.toLowerCase().indexOf(HIDDEN_PHRASE) !== -1) {
      toRemove.push(node);
    }
  }
  toRemove.forEach(function (tn) {
    var el = tn.parentElement;
    var container = null;
    while (el && el !== root) {
      if (el.classList && (el.classList.contains('message') || el.classList.contains('chat'))) {
        container = el;
        break;
      }
      el = el.parentElement;
    }
    if (container) container.remove();
    else tn.nodeValue = '';
  });
}

/* Parse pasted Roll20 HTML into normalized speaker turns */
function parseRoll20Log(root) {
  removeHidden(root);

  var messages = root.querySelectorAll('.message');
  if (!messages.length) return null; /* signal: not recognized */

  var turns = [];
  var current = null;

  Array.prototype.forEach.call(messages, function (msg) {
    var byEl = directChildByClass(msg, 'by');
    var avatarEl = directChildByClass(msg, 'avatar');
    var hasHeader = !!(byEl || avatarEl);

    /* /desc and /emote are standalone narration blocks — never merge them
       into the previous speaker's turn, even when they carry no header */
    var isDesc = msg.classList.contains('desc') || msg.classList.contains('emote');

    if (isDesc && !byEl) {
      current = {
        speaker: '', avatarUrl: '', isSelf: false,
        isNarration: true, lines: [],
      };
      turns.push(current);
      current.lines.push(extractLine(msg));
      return;
    }

    if (hasHeader) {
      var rawName = byEl ? byEl.textContent : '';
      var name = rawName.replace(/\s*[:：]\s*$/, '').trim();
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

/* Render turns into clean semantic HTML */
function renderTurnsHTML(turns, scale) {
  var scaleStyle = (scale && scale !== 100)
    ? ' style="transform:scale(' + (scale / 100) + ');transform-origin:top left"'
    : '';

  return turns.map(function (t) {
    var cls = 'r20-turn' + (t.isNarration ? ' r20-narration' : '');
    var selfAttr = t.isSelf ? ' data-self="true"' : '';
    var out = '<div class="' + cls + '"' + selfAttr + '>';

    if (!t.isNarration) {
      out += '<div class="r20-avatar-wrap">';
      if (t.avatarUrl) {
        out += '<img class="r20-avatar" crossorigin="anonymous" src="' +
          t.avatarUrl.replace(/"/g, '&quot;') + '" alt="" loading="lazy">';
      }
      out += '</div>';
    }

    out += '<div class="r20-body">';
    if (!t.isNarration && t.speaker) {
      out += '<div class="r20-speaker">' +
        t.speaker.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') +
        '</div>';
    }
    out += '<div class="r20-lines">';
    t.lines.forEach(function (l) {
      if (!l.html || !l.html.trim()) return;
      if (l.isRoll) {
        out += '<div class="r20-line r20-roll"' + scaleStyle + '>' + l.html + '</div>';
      } else {
        out += '<div class="r20-line">' + l.html + '</div>';
      }
    });
    out += '</div></div></div>';
    return out;
  }).join('');
}

/* Assemble a self-contained output block (style + wrapper) */
function buildOutputHTML(turns, scale, selfHighlight) {
  var styleBlock = buildStyleBlock();          // design.js
  var vars = getWrapperVars();                 // design.js
  var cls = 'r20-log ' + getThemeClass() + (selfHighlight ? ' self-hl' : '');
  var inner = renderTurnsHTML(turns, scale);
  return styleBlock + '\n<div class="' + cls + '" style="' + vars + '">' + inner + '</div>';
}

/* Split turns into size-bounded chunks (each a complete output block) */
function splitForChunks(turns, size, scale, selfHighlight) {
  var groups = [], cur = [], curLen = 0;
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
  return groups.map(function (g) { return buildOutputHTML(g, scale, selfHighlight); });
}

/* ──────────────────────────────────────────────────────────────
   RAW MODE — keep Roll20 HTML structure, just clean it up
   (same approach as v4 but as a function)
   ────────────────────────────────────────────────────────────── */
function convertRaw(root, scale) {
  removeHidden(root);

  root.querySelectorAll('a').forEach(function (el) {
    el.style.textDecoration = 'none';
  });

  root.querySelectorAll('style').forEach(function (el) { el.remove(); });

  root.querySelectorAll('img').forEach(function (el) {
    var w = parseInt(el.getAttribute('width') || '0', 10);
    var h = parseInt(el.getAttribute('height') || '0', 10);
    el.removeAttribute('width'); el.removeAttribute('height');
    el.style.maxWidth = '100%'; el.style.height = 'auto';
    var cls = (el.className || '').toLowerCase();
    if ((w && w <= 64) || (h && h <= 64) || cls.indexOf('avatar') !== -1 || cls.indexOf('token') !== -1) {
      el.style.width = (w || h || 36) + 'px';
      el.style.maxWidth = (w || h || 36) + 'px';
    }
  });

  root.querySelectorAll('video,iframe').forEach(function (el) {
    el.removeAttribute('width'); el.removeAttribute('height');
    el.style.maxWidth = '100%'; el.style.height = 'auto';
  });

  root.querySelectorAll('hr').forEach(function (hr) {
    hr.style.border = 'none'; hr.style.height = '1px';
    hr.style.background = '#e5e7eb'; hr.style.margin = '8px 0';
  });

  root.querySelectorAll('table').forEach(function (t) {
    t.style.maxWidth = '100%'; t.style.width = '100%';
    t.style.borderCollapse = 'collapse';
  });
  root.querySelectorAll('td,th').forEach(function (c) {
    if (!c.style.border) c.style.border = '1px solid #e5e7eb';
    if (!c.style.padding) c.style.padding = '4px';
    c.style.wordBreak = 'break-word'; c.style.overflowWrap = 'anywhere';
  });

  root.querySelectorAll('[class*="dice"],[class*="roll"],[class*="result"]').forEach(function (el) {
    el.style.transformOrigin = 'top left';
    el.style.transform = 'scale(' + (scale / 100) + ')';
  });

  var base = 'max-width:760px;width:100%;margin:0 auto;line-height:1.8;' +
             'font-size:16px;word-break:break-word;overflow-wrap:anywhere';
  return '<div class="r20-raw" style="' + base + '">' + root.innerHTML + '</div>';
}
