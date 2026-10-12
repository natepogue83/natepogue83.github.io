// Draws the page from SITE and WORK in work.js. You shouldn't need to edit this file.
(function () {
  var S = window.SITE || {}, W = window.WORK || [];
  var SECTIONS = [["experiments", "Experiments"], ["research", "Research"], ["builds", "Builds"], ["games", "Games"]];

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
  document.getElementById("side").innerHTML =
    '<div class="id">' +
    (S.photo ? '<img class="photo" src="' + esc(S.photo) + '" alt="' + esc(S.name) + '">' : "") +
    "<div><h1>" + esc(S.name) + '</h1><p class="role">' + esc(S.role) + "</p></div></div>" +
    '<p class="intro">' + esc(S.intro) + "</p>" +
    '<nav class="nav nav-side" aria-label="Sections">' + navLinks() + "</nav>" +
    '<ul class="contact">' + (S.contact || []).filter(function (c) { return c.url; }).map(function (c) {
      var ext = c.url.indexOf("mailto:") === 0 ? "" : ' target="_blank" rel="noopener"';
      return '<li><a href="' + esc(c.url) + '"' + ext + ">" + esc(c.label) + "</a></li>";
    }).join("") + "</ul>";
  document.getElementById("navtop").innerHTML = navLinks();

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
      '<span><i style="background:var(--accent)"></i>' + esc(c.groups[1]) + "</span></div>" +
      (n ? '<span class="unit">of ' + n + " " + esc(c.unit || "") + "</span>" : "") + "</div>" +
      '<div class="bars">' + grid + rows + "</div>" +
      '<div class="axis"><span></span><div>' + axis + "</div></div>" +
      "<figcaption>" + esc(c.caption) + "</figcaption></figure>";
  }

  function list(title, items) {
    return items && items.length
      ? '<div class="block"><h4>' + esc(title) + "</h4><ul>" + items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul></div>"
      : "";
  }
  function para(title, text) {
    return text ? '<div class="block"><h4>' + esc(title) + "</h4><p>" + esc(text) + "</p></div>" : "";
  }
  function entry(w) {
    var facts = w.facts && w.facts.length
      ? '<dl class="facts">' + w.facts.map(function (f) { return "<div><dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd></div>"; }).join("") + "</dl>"
      : "";
    var imgs = w.images && w.images.length
      ? '<figure class="gallery">' + w.images.map(function (im) {
          return '<img src="' + esc(im.src) + '" alt="' + esc(im.alt) + '" loading="lazy">';
        }).join("") + "</figure>"
      : "";
    var body = list("What it found", w.findings) + list("How it was done", w.method) + para("Limits", w.limits) + para("Prior work", w.prior);
    var more = body
      ? '<details class="more"' + (w.featured ? " open" : "") + '><summary>Findings and method</summary><div class="more-body">' + body + "</div></details>"
      : "";
    var links = w.links && w.links.length
      ? '<ul class="links">' + w.links.map(function (l) { return "<li>" + link(l) + "</li>"; }).join("") + "</ul>"
      : "";
    var tags = w.tags && w.tags.length
      ? '<div class="tags">' + w.tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>"
      : "";
    var foot = links || tags ? '<div class="entry-foot">' + links + tags + "</div>" : "";
    return '<article class="entry" id="' + esc(w.id) + '">' +
      '<div class="entry-meta"><span class="kind">' + esc(w.kind) + '</span><span class="date">' + esc(w.date) + "</span></div>" +
      "<h3>" + esc(w.title) + "</h3>" +
      '<p class="payoff">' + esc(w.payoff) + "</p>" +
      facts + (w.chart ? chart(w.chart) : "") + imgs + more + foot +
      "</article>";
  }

  document.getElementById("main").innerHTML =
    present.map(function (s) {
      var items = inSection(s[0]);
      return '<section class="sec" id="' + s[0] + '"><div class="sec-head"><h2>' + s[1] + '</h2><span class="n">' + items.length + "</span></div>" +
        items.map(entry).join("") + "</section>";
    }).join("") +
    (S.next
      ? '<section class="sec next" id="next"><div class="sec-head"><h2>' + esc(S.next.label) + "</h2></div>" +
        (S.next.title ? "<h3>" + esc(S.next.title) + "</h3>" : "") + "<p>" + esc(S.next.text) + "</p></section>"
      : "") +
    (S.why ? '<section class="sec next" id="why"><div class="sec-head"><h2>Why I do this</h2></div><p>' + esc(S.why) + "</p></section>" : "") +
    "<footer>© " + new Date().getFullYear() + " · Numbers on this page come from each project's saved results and run logs. Links marked coming soon are not public yet.</footer>";

  // Highlight the section in view in both navs.
  var targets = Array.prototype.slice.call(document.querySelectorAll("#main > section"));
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
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
    var top = document.querySelector('.nav-top a[aria-current="true"]');
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
