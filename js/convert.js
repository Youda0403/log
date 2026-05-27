/* Core conversion logic */

var HIDDEN_PHRASE = 'this message has been hidden';

function isBlueishBg(colorStr) {
  if (!colorStr) return false;
  var m = colorStr.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return false;
  var r = +m[1], g = +m[2], b = +m[3];
  // Light-blue condition: blue channel dominates, not near white
  return b > r && b > g && b > 80 && !(r > 230 && g > 230 && b > 230);
}

function removeHiddenMessages(wrapper) {
  // TreeWalker: find all text nodes that contain the hidden phrase
  var walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT, null, false);
  var toProcess = [];
  var node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue && node.nodeValue.toLowerCase().includes(HIDDEN_PHRASE)) {
      toProcess.push(node);
    }
  }

  toProcess.forEach(function (textNode) {
    // Walk ancestors to find a message container element
    var el = textNode.parentElement;
    var container = null;
    while (el && el !== wrapper) {
      var cls = (el.className || '').toLowerCase();
      var tag = el.tagName || '';
      if (cls.includes('message') || cls.includes('chat') || tag === 'LI') {
        container = el;
        break;
      }
      el = el.parentElement;
    }
    if (container && container !== wrapper) {
      container.remove();
    } else {
      // Fallback: blank the text node
      textNode.nodeValue = '';
    }
  });
}

function processDOM(wrapper, opts) {
  var scale = opts.scale || 100;
  var removeBlueBg = opts.removeBlueBg || false;
  var removeAllBg = opts.removeAllBg || false;

  // 1. Remove hidden messages (improved TreeWalker approach)
  removeHiddenMessages(wrapper);

  // 2. Anchor underline removal (preserve color and href)
  wrapper.querySelectorAll('a').forEach(function (el) {
    el.style.textDecoration = 'none';
  });

  // 3. Remove inline <style> tags from pasted content
  wrapper.querySelectorAll('style').forEach(function (el) { el.remove(); });

  // 4. Images responsive
  wrapper.querySelectorAll('img').forEach(function (el) {
    var wAttr = parseInt(el.getAttribute('width') || '0', 10);
    var hAttr = parseInt(el.getAttribute('height') || '0', 10);
    el.removeAttribute('width');
    el.removeAttribute('height');
    el.style.maxWidth = '100%';
    el.style.height = 'auto';
    var cls = (el.className || '').toLowerCase();
    if ((wAttr && wAttr <= 64) || (hAttr && hAttr <= 64) ||
        cls.includes('avatar') || cls.includes('icon') || cls.includes('token')) {
      var size = wAttr || hAttr || 36;
      el.style.width = size + 'px';
      el.style.height = 'auto';
      el.style.maxWidth = size + 'px';
    }
  });

  // 5. Video / iframe responsive
  wrapper.querySelectorAll('video, iframe').forEach(function (el) {
    el.removeAttribute('width');
    el.removeAttribute('height');
    el.style.maxWidth = '100%';
    el.style.height = 'auto';
  });

  // 6. HR normalize
  wrapper.querySelectorAll('hr').forEach(function (hr) {
    hr.style.border = 'none';
    hr.style.height = '1px';
    hr.style.background = '#e5e7eb';
    hr.style.margin = '8px 0';
  });

  // 7. Table responsive
  wrapper.querySelectorAll('table').forEach(function (table) {
    table.style.maxWidth = '100%';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
  });
  wrapper.querySelectorAll('td, th').forEach(function (cell) {
    cell.style.border = '1px solid #e5e7eb';
    if (!cell.style.padding) cell.style.padding = '4px';
    cell.style.wordBreak = 'break-word';
    cell.style.overflowWrap = 'anywhere';
  });

  // 8. Dice/roll result scale
  wrapper.querySelectorAll('[class*="dice"], [class*="roll"], [class*="result"]').forEach(function (el) {
    el.style.transformOrigin = 'top left';
    el.style.transform = 'scale(' + (scale / 100) + ')';
  });

  // 9. Blue background removal (self-dialogue)
  if (removeBlueBg || removeAllBg) {
    wrapper.querySelectorAll('[style]').forEach(function (el) {
      var bg = el.style.backgroundColor;
      var bgShort = el.style.background;
      if (removeAllBg) {
        if (bg) el.style.removeProperty('background-color');
        // Only remove background shorthand if it doesn't contain url() (would nuke background images)
        if (bgShort && !bgShort.includes('url(')) el.style.removeProperty('background');
      } else {
        if (bg && isBlueishBg(bg)) el.style.removeProperty('background-color');
        if (bgShort && !bgShort.includes('url(') && isBlueishBg(bgShort)) el.style.removeProperty('background');
      }
    });
  }
}

function buildOutputHTML(innerHtml) {
  // Create wrapper div
  var outerDiv = document.createElement('div');
  outerDiv.className = 'r20-log';
  outerDiv.innerHTML = innerHtml;

  // Apply theme DOM transforms (inline styles on outerDiv + known elements)
  if (typeof applyThemeToWrapper === 'function') {
    applyThemeToWrapper(outerDiv);
  }

  // Collect theme CSS for <style> injection
  var themeCSS = typeof getThemeCSS === 'function' ? getThemeCSS() : '';

  var parts = [];
  if (themeCSS && themeCSS.trim()) {
    parts.push('<style>' + themeCSS + '</style>');
  }
  parts.push(outerDiv.outerHTML);
  return parts.join('\n');
}

function splitHTML(str, size) {
  var chunks = [];
  var pos = 0;
  while (pos < str.length) {
    chunks.push(str.slice(pos, pos + size));
    pos += size;
  }
  return chunks;
}
