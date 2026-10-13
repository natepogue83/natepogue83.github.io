// Draws the page from SITE and WORK in work.js. Content lives in work.js; this file is layout only.
(function () {
  var S = window.SITE || {}, W = window.WORK || [];
  var SECTIONS = [["experiments", "Experiments"], ["other", "Other work"]];

  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function link(l) {
    return l.url
      ? '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>"
      : '<span class="soon" title="Not published yet">' + esc(l.label) + " (coming soon)</span>";
  }
  // Featured work first within its section, then the order in work.js.
  function inSection(id) {
    var a = W.filter(function (w) { return w.section === id; });
    return a.filter(function (w) { return w.featured; }).concat(a.filter(function (w) { return !w.featured; }));
  }
  var present = SECTIONS.filter(function (s) { return inSection(s[0]).length; });

  function navLinks() {
    return present.map(function (s) {
      return '<a href="#' + s[0] + '">' + s[1] + '<span class="n">' + inSection(s[0]).length + "</span></a>";
    }).join("") + (S.next ? '<a href="#next">What’s next</a>' : "") + (S.why ? '<a href="#why">Why I do this</a>' : "");
  }

  document.title = (S.name || "Portfolio") + " · Portfolio";
  // Image folder relative to this script, so the tailored page under for/<job>/ finds the same files.
  var me = document.querySelector('script[src$="render.js"]');
  var IMG = me ? me.getAttribute("src").replace(/render\.js$/, "") + "images/" : "images/";
  var contacts = (S.contact || []).filter(function (c) { return c.url; }).map(function (c) {
    var ext = c.url.indexOf("mailto:") === 0 ? "" : ' target="_blank" rel="noopener"';
    return '<li><a href="' + esc(c.url) + '"' + ext + ">" + esc(c.label) + "</a></li>";
  }).join("");
  document.getElementById("side").innerHTML =
    '<div class="hero-text">' +
    '<p class="eyebrow">Portfolio</p>' +
    "<h1>" + esc(S.name) + "</h1>" +
    '<p class="role">' + esc(S.role) + "</p>" +
    '<p class="intro">' + esc(S.intro) + "</p>" +
    '<ul class="contact">' + contacts + "</ul></div>" +
    '<div class="collage" aria-hidden="true">' +
    ["wobblins-study-night.jpg", "lootworks.jpg", "wobblins-2d-village.jpg"].map(function (f, i) {
      return '<img class="c' + i + '" src="' + IMG + f + '" alt="">';
    }).join("") + "</div>" +
    (S.about ? '<div class="about"><h2 class="label">About</h2><p>' + esc(S.about) + "</p></div>" : "");
  document.getElementById("navtop").innerHTML = '<a class="mark" href="#top">' + esc(S.name) + "</a>" + '<div class="nav nav-links">' + navLinks() + "</div>";


  // 95% Wilson interval for k of n, as fractions.
  function wilson(k, n) {
    var z = 1.96, p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d,
        h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d;
    return [Math.max(0, c - h), Math.min(1, c + h)];
  }
  function niceStep(x) {
    var s = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
    for (var i = 0; i < s.length; i++) if (s[i] >= x) return s[i];
    return s[s.length - 1];
  }
  // c = { groups: [a, b], rows: [[name, a, b], ...], n: denominator (optional), unit, caption }
  function chart(c) {
    var n = c.n;
    var top = Math.max.apply(null, c.rows.map(function (r) {
      return Math.max(n ? wilson(r[1], n)[1] * n : r[1], n ? wilson(r[2], n)[1] * n : r[2]);
    }));
    var step = niceStep(top / 3), max = Math.max(step, Math.ceil(top / step) * step);
    if (n && max > n) max = n;
    var ticks = [];
    for (var t = 0; t <= max; t += step) ticks.push(t);
    if (ticks[ticks.length - 1] !== max) ticks.push(max);
    var pos = function (v) {
      return "calc(var(--lab) + var(--vgap) + (100% - var(--lab) - var(--vgap) - var(--val) - 0.5rem) * " + (v / max).toFixed(4) + ")";
    };
    var grid = ticks.map(function (t) {
      return '<i class="gridline' + (t === 0 ? " zero" : "") + '" style="left:' + pos(t) + '"></i>';
    }).join("");
    var rows = c.rows.map(function (r, ri) {
      var pair = [r[1], r[2]].map(function (v, i) {
        var ci = n ? wilson(v, n) : null;
        var lo = ci ? Math.min(1, ci[0] * n / max) : 0, hi = ci ? Math.min(1, ci[1] * n / max) : 0;
        var label = v + (n ? " · " + Math.round(100 * v / n) + "%" : "");
        return '<div class="bar s' + i + (v === 0 ? " zero" : "") + '" style="--i:' + (ri * 2 + i) + '">' +
          '<div class="track"><b style="width:' + (100 * Math.min(1, v / max)).toFixed(2) + '%"></b>' +
          (ci ? '<i class="ci" style="left:' + (100 * lo).toFixed(2) + "%;width:" + (100 * (hi - lo)).toFixed(2) + '%"></i>' : "") +
          '</div><span class="val">' + label + "</span></div>";
      }).join("");
      return '<div class="bar-row"><span class="name">' + esc(r[0]) + '</span><div class="pair">' + pair + "</div></div>";
    }).join("");
    var axis = ticks.map(function (t) { return '<span style="left:' + (100 * t / max).toFixed(2) + '%">' + t + "</span>"; }).join("");
    return '<figure class="chart"><div class="chart-head"><div class="legend">' +
      '<span><i style="background:var(--mem)"></i>' + esc(c.groups[0]) + "</span>" +
      '<span><i style="background:var(--doc)"></i>' + esc(c.groups[1]) + "</span></div>" +
      (n ? '<span class="unit">of ' + n + " " + esc(c.unit || "") + "</span>" : "") + "</div>" +
      '<div class="bars">' + grid + rows + "</div>" +
      '<div class="axis"><span></span><div>' + axis + "</div></div>" +
      "<figcaption>" + esc(c.caption) + "</figcaption></figure>";
  }

  function list(items) {
    return "<ul>" + items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
  }
  // One tidy toggle per block. The first one (findings) is open on featured work.
  function toggle(title, inner, open) {
    return '<details class="more"' + (open ? " open" : "") + '><summary><span>' + esc(title) + '</span><i aria-hidden="true"></i></summary><div class="more-body">' + inner + "</div></details>";
  }
  function blocks(w) {
    var out = [];
    if (w.findings && w.findings.length) out.push(toggle("What it found", list(w.findings), w.featured));
    if (w.method && w.method.length) out.push(toggle("How it was done", list(w.method), false));
    if (w.limits) out.push(toggle("Limits", "<p>" + esc(w.limits) + "</p>", false));
    if (w.prior) out.push(toggle("Prior work", "<p>" + esc(w.prior) + "</p>", false));
    return out.length ? '<div class="toggles">' + out.join("") + "</div>" : "";
  }
  function linksOf(w) {
    return w.links && w.links.length
      ? '<ul class="links">' + w.links.map(function (l) { return "<li>" + link(l) + "</li>"; }).join("") + "</ul>"
      : "";
  }
  function tagsOf(w) {
    return w.tags && w.tags.length
      ? '<ul class="tags" aria-label="Tags">' + w.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>"
      : "";
  }
  function media(w, cls) {
    if (!(w.images && w.images.length)) return "";
    return '<figure class="media ' + (cls || "") + (w.images.length > 1 ? " multi" : "") + '">' + w.images.map(function (im, i) {
      return '<img src="' + esc(im.src) + '" alt="' + esc(im.alt) + '"' + (cls === "thumb" ? ' loading="lazy"' : "") + ">";
    }).join("") + "</figure>";
  }
  function meta(w) {
    return '<div class="entry-meta"><span class="kind">' + esc(w.kind) + '</span><span class="date">' + esc(w.date) + "</span>" +
      (w.featured ? '<span class="flag">Featured</span>' : "") + "</div>";
  }
  function entry(w) {
    if (w.section === "other") return compactEntry(w);
    var facts = w.facts && w.facts.length
      ? '<dl class="facts">' + w.facts.map(function (f) { return '<div class="chip"><dt>' + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd></div>"; }).join("") + "</dl>"
      : "";
    var vis = media(w, "cover") || (w.chart ? '<div class="media chart-wrap">' + chart(w.chart) + "</div>" : "");
    var foot = linksOf(w) || tagsOf(w) ? '<div class="entry-foot">' + linksOf(w) + tagsOf(w) + "</div>" : "";
    return '<article class="entry card reveal' + (w.featured ? " featured" : "") + '" id="' + esc(w.id) + '">' +
      (w.images && w.images.length ? vis : "") +
      '<div class="entry-head">' + meta(w) + "<h3>" + esc(w.title) + "</h3>" + '<p class="payoff">' + esc(w.payoff) + "</p></div>" +
      (w.images && w.images.length ? "" : vis) + facts + blocks(w) + foot + "</article>";
  }
  function compactEntry(w) {
    var foot = linksOf(w) || tagsOf(w) ? '<div class="entry-foot">' + linksOf(w) + tagsOf(w) + "</div>" : "";
    var m = media(w, "thumb");
    return '<article class="entry compact card reveal' + (m ? " has-media" : "") + '" id="' + esc(w.id) + '">' + m +
      '<div class="compact-body">' + meta(w) + "<h3>" + esc(w.title) + "</h3>" +
      '<p class="payoff">' + esc(w.payoff) + "</p>" + foot + "</div></article>";
  }

  var num = 0;
  function head(title, extra) {
    num++;
    return '<div class="sec-head"><span class="sec-num" aria-hidden="true">' + (num < 10 ? "0" : "") + num + "</span><h2>" + title + "</h2>" + (extra || "") + "</div>";
  }
  document.getElementById("main").innerHTML =
    present.map(function (s) {
      var items = inSection(s[0]);
      return '<section class="sec sec-' + s[0] + '" id="' + s[0] + '">' + head(s[1], '<span class="n">' + items.length + "</span>") +
        '<div class="grid grid-' + s[0] + '">' + items.map(entry).join("") + "</div></section>";
    }).join("") +
    (S.next
      ? '<section class="sec next band reveal" id="next">' + head(esc(S.next.label)) +
        (S.next.title ? "<h3>" + esc(S.next.title) + "</h3>" : "") + "<p>" + esc(S.next.text) + "</p></section>"
      : "") +
    (S.why ? '<section class="sec why reveal" id="why">' + head("Why I do this") + "<p>" + esc(S.why) + "</p></section>" : "") +
    "<footer>© " + new Date().getFullYear() + " · Numbers on this page come from each project's saved results and run logs. Links marked coming soon are not public yet.</footer>";

  // Reveal cards as they scroll in, unless the viewer prefers reduced motion.
  (function () {
    var ok = window.matchMedia && window.matchMedia("(prefers-reduced-motion: no-preference)").matches && "IntersectionObserver" in window;
    if (!ok) return;
    var els = document.querySelectorAll(".reveal");
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(els, function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) return;
      el.classList.add("pre"); io.observe(el);
    });
  })();

  // Highlight the section in view in both navs.
  var targets = Array.prototype.slice.call(document.querySelectorAll("#main > section"));
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a:not(.mark)"));
  var ticking = false, lastId = "";
  function spy() {
    ticking = false;
    if (!targets.length) return;
    var y = window.scrollY + window.innerHeight * 0.3, cur = targets[0];
    targets.forEach(function (s) { if (s.getBoundingClientRect().top + window.scrollY <= y) cur = s; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) cur = targets[targets.length - 1];
    if (cur.id === lastId) return;
    lastId = cur.id;
    links.forEach(function (a) { a.setAttribute("aria-current", a.getAttribute("href") === "#" + cur.id ? "true" : "false"); });
    var top = document.querySelector('.nav-links a[aria-current="true"]');
    if (top && top.parentNode.scrollWidth > top.parentNode.clientWidth) {
      top.parentNode.scrollTo({ left: Math.max(0, top.offsetLeft - 16), behavior: "smooth" });
    }
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
  window.addEventListener("resize", spy);
  spy();

  // Deep links: #experiments scrolls to a section, #isnad opens that entry's findings and scrolls to it.
  function goHash(e) {
    var id = (location.hash || "").slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    var d = el.querySelector("details.more");
    if (d) d.open = true;
    el.scrollIntoView(e ? true : { block: "start", behavior: "instant" });
  }
  goHash();
  window.addEventListener("hashchange", goHash);

  // Draw the bars in when the chart comes on screen, unless the viewer prefers reduced motion.
  var motion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  var bars = Array.prototype.slice.call(document.querySelectorAll(".bars"));
  if (motion && bars.length) {
    bars.forEach(function (b) { b.classList.add("anim"); });
    var reveal = function (b) {
      requestAnimationFrame(function () { requestAnimationFrame(function () { b.classList.add("in"); }); });
    };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.25 });
      bars.forEach(function (b) { io.observe(b); });
    } else {
      bars.forEach(reveal);
    }
  }
})();
