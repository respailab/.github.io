!(function (n) {
  "function" == typeof define && define.amd ? define(n) : n();
})(function () {
  "use strict";
  // Copyright 2018 The Distill Template Authors
  function n(n, t) {
    (n.title = t.title),
      t.published &&
        (t.published instanceof Date
          ? (n.publishedDate = t.published)
          : t.published.constructor === String &&
            (n.publishedDate = new Date(t.published))),
      t.publishedDate &&
        (t.publishedDate instanceof Date
          ? (n.publishedDate = t.publishedDate)
          : t.publishedDate.constructor === String
            ? (n.publishedDate = new Date(t.publishedDate))
            : console.error(
                "Don't know what to do with published date: " + t.publishedDate,
              )),
      (n.description = t.description),
      (n.authors = t.authors.map((n) => new Nr(n))),
      (n.katex = t.katex),
      (n.password = t.password),
      t.doi && (n.doi = t.doi);
  }
  // Copyright 2018 The Distill Template Authors
  function t(n = document) {
    const t = new Set(),
      e = n.querySelectorAll("d-cite");
    for (const n of e) {
      const e = (n.getAttribute("key") || n.getAttribute("bibtex-key"))
        .split(",")
        .map((n) => n.trim());
      for (const n of e) t.add(n);
    }
    return [...t];
  }
  function e(n, t, e, i) {
    if (null == n.author) return "";
    var r = n.author.split(" and ");
    let o = r.map((n) => {
      if (-1 != (n = n.trim()).indexOf(","))
        var e = n.split(",")[0].trim(),
          i = n.split(",")[1];
      else if (-1 != n.indexOf(" "))
        (e = n.split(" ").slice(-1)[0].trim()),
          (i = n.split(" ").slice(0, -1).join(" "));
      else e = n.trim();
      var r = "";
      return (
        i != undefined &&
          (r =
            (r = i
              .trim()
              .split(" ")
              .map((n) => n.trim()[0])).join(".") + "."),
        t.replace("${F}", i).replace("${L}", e).replace("${I}", r).trim()
      );
    });
    if (r.length > 1) {
      var a = o.slice(0, r.length - 1).join(e);
      return (a += (i || e) + o[r.length - 1]);
    }
    return o[0];
  }
  function i(n) {
    var t = n.journal || n.booktitle || "";
    if ("volume" in n) {
      var e = n.issue || n.number;
      (e = e != undefined ? "(" + e + ")" : ""), (t += ", Vol " + n.volume + e);
    }
    return (
      "pages" in n && (t += ", pp. " + n.pages),
      "" != t && (t += ". "),
      "publisher" in n && "." != (t += n.publisher)[t.length - 1] && (t += "."),
      t
    );
  }
  function r(n) {
    if ("url" in n) {
      var t = n.url,
        e = /arxiv\.org\/abs\/([0-9\.]*)/.exec(t);
      if (
        (null != e && (t = `http://arxiv.org/pdf/${e[1]}.pdf`),
        ".pdf" == t.slice(-4))
      )
        var i = "PDF";
      else if (".html" == t.slice(-5)) i = "HTML";
      return ` &ensp;<a href="${t}">[${i || "link"}]</a>`;
    }
    return "";
  }
  function o(n, t) {
    return "doi" in n
      ? `${t ? "<br>" : ""} <a href="https://doi.org/${n.doi}" style="text-decoration:inherit;">DOI: ${n.doi}</a>`
      : "";
  }
  function a(n) {
    return '<span class="title">' + n.title + "</span> ";
  }
  function s(n) {
    if (n) {
      var t = a(n);
      return (
        (t += r(n) + "<br>"),
        n.author &&
          ((t += e(n, "${L}, ${I}", ", ", " and ")),
          (n.year || n.date) && (t += ", ")),
        n.year || n.date ? (t += (n.year || n.date) + ". ") : (t += ". "),
        (t += i(n)),
        (t += o(n))
      );
    }
    return "?";
  }
  function l(n) {
    if (n) {
      var t = "";
      (t += "<strong>" + n.title + "</strong>"), (t += r(n)), (t += "<br>");
      var a = e(n, "${I} ${L}", ", ") + ".",
        s = i(n).trim() + " " + n.year + ". " + o(n, !0);
      return (
        (a + s).length < Math.min(40, n.title.length)
          ? (t += a + " " + s)
          : (t += a + "<br>" + s),
        t
      );
    }
    return "?";
  }
  function u() {
    return -1 !== ["interactive", "complete"].indexOf(document.readyState);
  }
  // Copyright 2018 The Distill Template Authors
  function c(n) {
    for (let t of n.authors) {
      const n = Boolean(t.affiliation),
        e = Boolean(t.affiliations);
      if (n)
        if (e)
          console.warn(
            `Author ${t.author} has both old-style ("affiliation" & "affiliationURL") and new style ("affiliations") affiliation information!`,
          );
        else {
          let n = { name: t.affiliation };
          t.affiliationURL && (n.url = t.affiliationURL),
            (t.affiliations = [n]);
        }
    }
    return n;
  }
  function d(n) {
    const t = n.firstElementChild;
    if (t) {
      if ("json" == t.getAttribute("type").split("/")[1]) {
        const n = t.textContent;
        return c(JSON.parse(n));
      }
      console.error(
        "Distill only supports JSON frontmatter tags anymore; no more YAML.",
      );
    } else
      console.error(
        "You added a frontmatter tag but did not provide a script tag with front matter data in it. Please take a look at our templates.",
      );
    return {};
  }
  // Copyright 2018 The Distill Template Authors
  function h(n, t) {
    const e = n.body;
    if (!e.querySelector("d-article"))
      return void console.warn(
        "No d-article tag found; skipping adding optional components!",
      );
    let i = n.querySelector("d-byline");
    i ||
      (t.authors
        ? (i = n.createElement("d-byline"))
        : console.warn(
            "No authors found in front matter; please add them before submission!",
          ));
    let r = n.querySelector("d-title");
    r || ((r = n.createElement("d-title")), e.insertBefore(r, i));
    let o = r.querySelector("h1");
    o ||
      (((o = n.createElement("h1")).textContent = t.title),
      r.insertBefore(o, r.firstChild));
    const a = "undefined" != typeof t.password;
    let s = e.querySelector("d-interstitial");
    if (a && !s) {
      const i = "undefined" != typeof window,
        r = i && window.location.hostname.includes("localhost");
      (i && r) ||
        (((s = n.createElement("d-interstitial")).password = t.password),
        e.insertBefore(s, e.firstChild));
    } else !a && s && s.parentElement.removeChild(this);
    let l = n.querySelector("d-appendix");
    l || ((l = n.createElement("d-appendix")), n.body.appendChild(l));
    let u = n.querySelector("d-footnote-list");
    u || ((u = n.createElement("d-footnote-list")), l.appendChild(u));
    let c = n.querySelector("d-citation-list");
    c || ((c = n.createElement("d-citation-list")), l.appendChild(c));
  }
  // Copyright 2018 The Distill Template Authors
  function p(n) {
    const t = "distill-prerendered-styles";
    if (!n.getElementById(t)) {
      const e = n.createElement("style");
      (e.id = t), (e.type = "text/css");
      const i = n.createTextNode(Kr);
      e.appendChild(i);
      const r = n.head.querySelector("script");
      n.head.insertBefore(e, r);
    }
  }
  // Copyright 2018 The Distill Template Authors
  function f(n, t) {
    console.debug("Runlevel 0: Polyfill required: " + n.name);
    const e = document.createElement("script");
    (e.src = n.url),
      (e.async = !1),
      t &&
        (e.onload = function () {
          t(n);
        }),
      (e.onerror = function () {
        new Error("Runlevel 0: Polyfills failed to load script " + n.name);
      }),
      document.head.appendChild(e);
  }
  // Copyright 2018 The Distill Template Authors
  function g(n) {
    return `${n} {\n      grid-column: left / text;\n    }\n  `;
  }
  // Copyright 2018 The Distill Template Authors
  function m(n, t) {
    return n((t = { exports: {} }), t.exports), t.exports;
  }
  // Copyright 2018 The Distill Template Authors
  function b(n) {
    return n
      .replace(/[\t\n ]+/g, " ")
      .replace(/{\\["^`.'acu~Hvs]( )?([a-zA-Z])}/g, (n, t, e) => e)
      .replace(/{\\([a-zA-Z])}/g, (n, t) => t);
  }
  function y(n) {
    const t = new Map(),
      e = oo.toJSON(n);
    for (const n of e) {
      for (const [t, e] of Object.entries(n.entryTags))
        n.entryTags[t.toLowerCase()] = b(e);
      (n.entryTags.type = n.entryType), t.set(n.citationKey, n.entryTags);
    }
    return t;
  }
  function v(n) {
    return `@article{${n.slug},\n  author = {${n.bibtexAuthors}},\n  title = {${n.title}},\n  journal = {${n.journal.title}},\n  year = {${n.publishedYear}},\n  note = {${n.url}},\n  doi = {${n.doi}}\n}`;
  }
  // Copyright 2018 The Distill Template Authors
  // Copyright 2018 The Distill Template Authors
  function w(n) {
    return `\n  <div class="byline grid">\n    <div class="authors-affiliations grid">\n      <h3>Authors</h3>\n      <h3>Affiliations</h3>\n      ${n.authors.map((n) => `\n        <p class="author">\n          ${n.personalURL ? `\n            <a class="name" href="${n.personalURL}">${n.name}</a>` : `\n            <span class="name">${n.name}</span>`}\n        </p>\n        <p class="affiliation">\n        ${n.affiliations.map((n) => (n.url ? `<a class="affiliation" href="${n.url}">${n.name}</a>` : `<span class="affiliation">${n.name}</span>`)).join(", ")}\n        </p>\n      `).join("")}\n    </div>\n    <div>\n      <h3>Published</h3>\n      ${n.publishedDate ? `\n        <p>${n.publishedMonth} ${n.publishedDay}, ${n.publishedYear}</p> ` : "\n        <p><em>Not published yet.</em></p>"}\n    </div>\n  </div>\n`;
  }
  function x(n, t, e = document) {
    if (t.size > 0) {
      n.style.display = "";
      let i = n.querySelector(".references");
      if (i) i.innerHTML = "";
      else {
        const t = e.createElement("style");
        (t.innerHTML = co), n.appendChild(t);
        const r = e.createElement("h3");
        (r.id = "references"),
          (r.textContent = "References"),
          n.appendChild(r),
          ((i = e.createElement("ol")).id = "references-list"),
          (i.className = "references"),
          n.appendChild(i);
      }
      for (const [n, r] of t) {
        const t = e.createElement("li");
        (t.id = n), (t.innerHTML = s(r)), i.appendChild(t);
      }
    } else n.style.display = "none";
  }
  function k(n, t) {
    let e =
      '\n  <style>\n\n  d-toc {\n    contain: layout style;\n    display: block;\n  }\n\n  d-toc ul {\n    padding-left: 0;\n  }\n\n  d-toc ul > ul {\n    padding-left: 24px;\n  }\n\n  d-toc a {\n    border-bottom: none;\n    text-decoration: none;\n  }\n\n  </style>\n  <nav role="navigation" class="table-of-contents"></nav>\n  <h2>Table of contents</h2>\n  <ul>';
    for (const n of t) {
      const t = "D-TITLE" == n.parentElement.tagName,
        i = n.getAttribute("no-toc");
      if (t || i) continue;
      const r = n.textContent;
      let o =
        '<li><a href="' + ("#" + n.getAttribute("id")) + '">' + r + "</a></li>";
      "H3" == n.tagName ? (o = "<ul>" + o + "</ul>") : (o += "<br>"), (e += o);
    }
    (e += "</ul></nav>"), (n.innerHTML = e);
  }
  // Copyright 2018 The Distill Template Authors
  function S(n, t) {
    return n < t ? -1 : n > t ? 1 : n >= t ? 0 : NaN;
  }
  function M(n) {
    return (
      1 === n.length && (n = T(n)),
      {
        left: function (t, e, i, r) {
          for (null == i && (i = 0), null == r && (r = t.length); i < r; ) {
            var o = (i + r) >>> 1;
            n(t[o], e) < 0 ? (i = o + 1) : (r = o);
          }
          return i;
        },
        right: function (t, e, i, r) {
          for (null == i && (i = 0), null == r && (r = t.length); i < r; ) {
            var o = (i + r) >>> 1;
            n(t[o], e) > 0 ? (r = o) : (i = o + 1);
          }
          return i;
        },
      }
    );
  }
  function T(n) {
    return function (t, e) {
      return S(n(t), e);
    };
  }
  function _(n, t, e) {
    (n = +n),
      (t = +t),
      (e = (r = arguments.length) < 2 ? ((t = n), (n = 0), 1) : r < 3 ? 1 : +e);
    for (
      var i = -1, r = 0 | Math.max(0, Math.ceil((t - n) / e)), o = new Array(r);
      ++i < r;

    )
      o[i] = n + i * e;
    return o;
  }
  function C(n, t, e) {
    var i,
      r,
      o,
      a,
      s = -1;
    if (((e = +e), (n = +n) === (t = +t) && e > 0)) return [n];
    if (
      ((i = t < n) && ((r = n), (n = t), (t = r)),
      0 === (a = A(n, t, e)) || !isFinite(a))
    )
      return [];
    if (a > 0)
      for (
        n = Math.ceil(n / a),
          t = Math.floor(t / a),
          o = new Array((r = Math.ceil(t - n + 1)));
        ++s < r;

      )
        o[s] = (n + s) * a;
    else
      for (
        n = Math.floor(n * a),
          t = Math.ceil(t * a),
          o = new Array((r = Math.ceil(n - t + 1)));
        ++s < r;

      )
        o[s] = (n - s) / a;
    return i && o.reverse(), o;
  }
  function A(n, t, e) {
    var i = (t - n) / Math.max(0, e),
      r = Math.floor(Math.log(i) / Math.LN10),
      o = i / Math.pow(10, r);
    return r >= 0
      ? (o >= Lo ? 10 : o >= Do ? 5 : o >= Oo ? 2 : 1) * Math.pow(10, r)
      : -Math.pow(10, -r) / (o >= Lo ? 10 : o >= Do ? 5 : o >= Oo ? 2 : 1);
  }
  function E(n, t, e) {
    var i = Math.abs(t - n) / Math.max(0, e),
      r = Math.pow(10, Math.floor(Math.log(i) / Math.LN10)),
      o = i / r;
    return (
      o >= Lo ? (r *= 10) : o >= Do ? (r *= 5) : o >= Oo && (r *= 2),
      t < n ? -r : r
    );
  }
  function N(n, t) {
    switch (arguments.length) {
      case 0:
        break;
      case 1:
        this.range(n);
        break;
      default:
        this.range(t).domain(n);
    }
    return this;
  }
  function L(n, t, e) {
    (n.prototype = t.prototype = e), (e.constructor = n);
  }
  function D(n, t) {
    var e = Object.create(n.prototype);
    for (var i in t) e[i] = t[i];
    return e;
  }
  function O() {}
  function I() {
    return this.rgb().formatHex();
  }
  function F() {
    return G(this).formatHsl();
  }
  function R() {
    return this.rgb().formatRgb();
  }
  function U(n) {
    var t, e;
    return (
      (n = (n + "").trim().toLowerCase()),
      (t = Po.exec(n))
        ? ((e = t[1].length),
          (t = parseInt(t[1], 16)),
          6 === e
            ? $(t)
            : 3 === e
              ? new q(
                  ((t >> 8) & 15) | ((t >> 4) & 240),
                  ((t >> 4) & 15) | (240 & t),
                  ((15 & t) << 4) | (15 & t),
                  1,
                )
              : 8 === e
                ? P(
                    (t >> 24) & 255,
                    (t >> 16) & 255,
                    (t >> 8) & 255,
                    (255 & t) / 255,
                  )
                : 4 === e
                  ? P(
                      ((t >> 12) & 15) | ((t >> 8) & 240),
                      ((t >> 8) & 15) | ((t >> 4) & 240),
                      ((t >> 4) & 15) | (240 & t),
                      (((15 & t) << 4) | (15 & t)) / 255,
                    )
                  : null)
        : (t = Ho.exec(n))
          ? new q(t[1], t[2], t[3], 1)
          : (t = zo.exec(n))
            ? new q(
                (255 * t[1]) / 100,
                (255 * t[2]) / 100,
                (255 * t[3]) / 100,
                1,
              )
            : (t = qo.exec(n))
              ? P(t[1], t[2], t[3], t[4])
              : (t = jo.exec(n))
                ? P(
                    (255 * t[1]) / 100,
                    (255 * t[2]) / 100,
                    (255 * t[3]) / 100,
                    t[4],
                  )
                : (t = Bo.exec(n))
                  ? W(t[1], t[2] / 100, t[3] / 100, 1)
                  : (t = Yo.exec(n))
                    ? W(t[1], t[2] / 100, t[3] / 100, t[4])
                    : Wo.hasOwnProperty(n)
                      ? $(Wo[n])
                      : "transparent" === n
                        ? new q(NaN, NaN, NaN, 0)
                        : null
    );
  }
  function $(n) {
    return new q((n >> 16) & 255, (n >> 8) & 255, 255 & n, 1);
  }
  function P(n, t, e, i) {
    return i <= 0 && (n = t = e = NaN), new q(n, t, e, i);
  }
  function H(n) {
    return (
      n instanceof O || (n = U(n)),
      n ? new q((n = n.rgb()).r, n.g, n.b, n.opacity) : new q()
    );
  }
  function z(n, t, e, i) {
    return 1 === arguments.length ? H(n) : new q(n, t, e, null == i ? 1 : i);
  }
  function q(n, t, e, i) {
    (this.r = +n), (this.g = +t), (this.b = +e), (this.opacity = +i);
  }
  function j() {
    return "#" + Y(this.r) + Y(this.g) + Y(this.b);
  }
  function B() {
    var n = this.opacity;
    return (
      (1 === (n = isNaN(n) ? 1 : Math.max(0, Math.min(1, n)))
        ? "rgb("
        : "rgba(") +
      Math.max(0, Math.min(255, Math.round(this.r) || 0)) +
      ", " +
      Math.max(0, Math.min(255, Math.round(this.g) || 0)) +
      ", " +
      Math.max(0, Math.min(255, Math.round(this.b) || 0)) +
      (1 === n ? ")" : ", " + n + ")")
    );
  }
  function Y(n) {
    return (
      ((n = Math.max(0, Math.min(255, Math.round(n) || 0))) < 16 ? "0" : "") +
      n.toString(16)
    );
  }
  function W(n, t, e, i) {
    return (
      i <= 0
        ? (n = t = e = NaN)
        : e <= 0 || e >= 1
          ? (n = t = NaN)
          : t <= 0 && (n = NaN),
      new K(n, t, e, i)
    );
  }
  function G(n) {
    if (n instanceof K) return new K(n.h, n.s, n.l, n.opacity);
    if ((n instanceof O || (n = U(n)), !n)) return new K();
    if (n instanceof K) return n;
    var t = (n = n.rgb()).r / 255,
      e = n.g / 255,
      i = n.b / 255,
      r = Math.min(t, e, i),
      o = Math.max(t, e, i),
      a = NaN,
      s = o - r,
      l = (o + r) / 2;
    return (
      s
        ? ((a =
            t === o
              ? (e - i) / s + 6 * (e < i)
              : e === o
                ? (i - t) / s + 2
                : (t - e) / s + 4),
          (s /= l < 0.5 ? o + r : 2 - o - r),
          (a *= 60))
        : (s = l > 0 && l < 1 ? 0 : a),
      new K(a, s, l, n.opacity)
    );
  }
  function V(n, t, e, i) {
    return 1 === arguments.length ? G(n) : new K(n, t, e, null == i ? 1 : i);
  }
  function K(n, t, e, i) {
    (this.h = +n), (this.s = +t), (this.l = +e), (this.opacity = +i);
  }
  function X(n, t, e) {
    return (
      255 *
      (n < 60
        ? t + ((e - t) * n) / 60
        : n < 180
          ? e
          : n < 240
            ? t + ((e - t) * (240 - n)) / 60
            : t)
    );
  }
  function Z(n) {
    if (n instanceof J) return new J(n.l, n.a, n.b, n.opacity);
    if (n instanceof sn) return ln(n);
    n instanceof q || (n = H(n));
    var t,
      e,
      i = rn(n.r),
      r = rn(n.g),
      o = rn(n.b),
      a = nn((0.2225045 * i + 0.7168786 * r + 0.0606169 * o) / Zo);
    return (
      i === r && r === o
        ? (t = e = a)
        : ((t = nn((0.4360747 * i + 0.3850649 * r + 0.1430804 * o) / Xo)),
          (e = nn((0.0139322 * i + 0.0971045 * r + 0.7141733 * o) / Qo))),
      new J(116 * a - 16, 500 * (t - a), 200 * (a - e), n.opacity)
    );
  }
  function Q(n, t, e, i) {
    return 1 === arguments.length ? Z(n) : new J(n, t, e, null == i ? 1 : i);
  }
  function J(n, t, e, i) {
    (this.l = +n), (this.a = +t), (this.b = +e), (this.opacity = +i);
  }
  function nn(n) {
    return n > ea ? Math.pow(n, 1 / 3) : n / ta + Jo;
  }
  function tn(n) {
    return n > na ? n * n * n : ta * (n - Jo);
  }
  function en(n) {
    return (
      255 * (n <= 0.0031308 ? 12.92 * n : 1.055 * Math.pow(n, 1 / 2.4) - 0.055)
    );
  }
  function rn(n) {
    return (n /= 255) <= 0.04045
      ? n / 12.92
      : Math.pow((n + 0.055) / 1.055, 2.4);
  }
  function on(n) {
    if (n instanceof sn) return new sn(n.h, n.c, n.l, n.opacity);
    if ((n instanceof J || (n = Z(n)), 0 === n.a && 0 === n.b))
      return new sn(NaN, 0 < n.l && n.l < 100 ? 0 : NaN, n.l, n.opacity);
    var t = Math.atan2(n.b, n.a) * Vo;
    return new sn(
      t < 0 ? t + 360 : t,
      Math.sqrt(n.a * n.a + n.b * n.b),
      n.l,
      n.opacity,
    );
  }
  function an(n, t, e, i) {
    return 1 === arguments.length ? on(n) : new sn(n, t, e, null == i ? 1 : i);
  }
  function sn(n, t, e, i) {
    (this.h = +n), (this.c = +t), (this.l = +e), (this.opacity = +i);
  }
  function ln(n) {
    if (isNaN(n.h)) return new J(n.l, 0, 0, n.opacity);
    var t = n.h * Go;
    return new J(n.l, Math.cos(t) * n.c, Math.sin(t) * n.c, n.opacity);
  }
  function un(n) {
    if (n instanceof dn) return new dn(n.h, n.s, n.l, n.opacity);
    n instanceof q || (n = H(n));
    var t = n.r / 255,
      e = n.g / 255,
      i = n.b / 255,
      r = (ca * i + la * t - ua * e) / (ca + la - ua),
      o = i - r,
      a = (sa * (e - r) - oa * o) / aa,
      s = Math.sqrt(a * a + o * o) / (sa * r * (1 - r)),
      l = s ? Math.atan2(a, o) * Vo - 120 : NaN;
    return new dn(l < 0 ? l + 360 : l, s, r, n.opacity);
  }
  function cn(n, t, e, i) {
    return 1 === arguments.length ? un(n) : new dn(n, t, e, null == i ? 1 : i);
  }
  function dn(n, t, e, i) {
    (this.h = +n), (this.s = +t), (this.l = +e), (this.opacity = +i);
  }
  function hn(n) {
    return function () {
      return n;
    };
  }
  function pn(n, t) {
    return function (e) {
      return n + e * t;
    };
  }
  function fn(n, t, e) {
    return (
      (n = Math.pow(n, e)),
      (t = Math.pow(t, e) - n),
      (e = 1 / e),
      function (i) {
        return Math.pow(n + i * t, e);
      }
    );
  }
  function gn(n) {
    return 1 == (n = +n)
      ? mn
      : function (t, e) {
          return e - t ? fn(t, e, n) : hn(isNaN(t) ? e : t);
        };
  }
  function mn(n, t) {
    var e = t - n;
    return e ? pn(n, e) : hn(isNaN(n) ? t : n);
  }
  function bn(n, t) {
    t || (t = []);
    var e,
      i = n ? Math.min(t.length, n.length) : 0,
      r = t.slice();
    return function (o) {
      for (e = 0; e < i; ++e) r[e] = n[e] * (1 - o) + t[e] * o;
      return r;
    };
  }
  function yn(n) {
    return ArrayBuffer.isView(n) && !(n instanceof DataView);
  }
  function vn(n, t) {
    var e,
      i = t ? t.length : 0,
      r = n ? Math.min(i, n.length) : 0,
      o = new Array(r),
      a = new Array(i);
    for (e = 0; e < r; ++e) o[e] = _n(n[e], t[e]);
    for (; e < i; ++e) a[e] = t[e];
    return function (n) {
      for (e = 0; e < r; ++e) a[e] = o[e](n);
      return a;
    };
  }
  function wn(n, t) {
    var e = new Date();
    return (
      (n = +n),
      (t = +t),
      function (i) {
        return e.setTime(n * (1 - i) + t * i), e;
      }
    );
  }
  function xn(n, t) {
    return (
      (n = +n),
      (t = +t),
      function (e) {
        return n * (1 - e) + t * e;
      }
    );
  }
  function kn(n, t) {
    var e,
      i = {},
      r = {};
    for (e in ((null !== n && "object" == typeof n) || (n = {}),
    (null !== t && "object" == typeof t) || (t = {}),
    t))
      e in n ? (i[e] = _n(n[e], t[e])) : (r[e] = t[e]);
    return function (n) {
      for (e in i) r[e] = i[e](n);
      return r;
    };
  }
  function Sn(n) {
    return function () {
      return n;
    };
  }
  function Mn(n) {
    return function (t) {
      return n(t) + "";
    };
  }
  function Tn(n, t) {
    var e,
      i,
      r,
      o = (pa.lastIndex = fa.lastIndex = 0),
      a = -1,
      s = [],
      l = [];
    for (n += "", t += ""; (e = pa.exec(n)) && (i = fa.exec(t)); )
      (r = i.index) > o &&
        ((r = t.slice(o, r)), s[a] ? (s[a] += r) : (s[++a] = r)),
        (e = e[0]) === (i = i[0])
          ? s[a]
            ? (s[a] += i)
            : (s[++a] = i)
          : ((s[++a] = null), l.push({ i: a, x: xn(e, i) })),
        (o = fa.lastIndex);
    return (
      o < t.length && ((r = t.slice(o)), s[a] ? (s[a] += r) : (s[++a] = r)),
      s.length < 2
        ? l[0]
          ? Mn(l[0].x)
          : Sn(t)
        : ((t = l.length),
          function (n) {
            for (var e, i = 0; i < t; ++i) s[(e = l[i]).i] = e.x(n);
            return s.join("");
          })
    );
  }
  function _n(n, t) {
    var e,
      i = typeof t;
    return null == t || "boolean" === i
      ? hn(t)
      : ("number" === i
          ? xn
          : "string" === i
            ? (e = U(t))
              ? ((t = e), ha)
              : Tn
            : t instanceof U
              ? ha
              : t instanceof Date
                ? wn
                : yn(t)
                  ? bn
                  : Array.isArray(t)
                    ? vn
                    : ("function" != typeof t.valueOf &&
                          "function" != typeof t.toString) ||
                        isNaN(t)
                      ? kn
                      : xn)(n, t);
  }
  function Cn(n, t) {
    return (
      (n = +n),
      (t = +t),
      function (e) {
        return Math.round(n * (1 - e) + t * e);
      }
    );
  }
  function An(n) {
    return function () {
      return n;
    };
  }
  function En(n) {
    return +n;
  }
  function Nn(n) {
    return n;
  }
  function Ln(n, t) {
    return (t -= n = +n)
      ? function (e) {
          return (e - n) / t;
        }
      : An(isNaN(t) ? NaN : 0.5);
  }
  function Dn(n, t) {
    var e;
    return (
      n > t && ((e = n), (n = t), (t = e)),
      function (e) {
        return Math.max(n, Math.min(t, e));
      }
    );
  }
  function On(n, t, e) {
    var i = n[0],
      r = n[1],
      o = t[0],
      a = t[1];
    return (
      r < i ? ((i = Ln(r, i)), (o = e(a, o))) : ((i = Ln(i, r)), (o = e(o, a))),
      function (n) {
        return o(i(n));
      }
    );
  }
  function In(n, t, e) {
    var i = Math.min(n.length, t.length) - 1,
      r = new Array(i),
      o = new Array(i),
      a = -1;
    for (
      n[i] < n[0] && ((n = n.slice().reverse()), (t = t.slice().reverse()));
      ++a < i;

    )
      (r[a] = Ln(n[a], n[a + 1])), (o[a] = e(t[a], t[a + 1]));
    return function (t) {
      var e = No(n, t, 1, i) - 1;
      return o[e](r[e](t));
    };
  }
  function Fn(n, t) {
    return t
      .domain(n.domain())
      .range(n.range())
      .interpolate(n.interpolate())
      .clamp(n.clamp())
      .unknown(n.unknown());
  }
  function Rn() {
    function n() {
      var n = Math.min(l.length, u.length);
      return (
        d !== Nn && (d = Dn(l[0], l[n - 1])),
        (o = n > 2 ? In : On),
        (a = s = null),
        t
      );
    }
    function t(n) {
      return isNaN((n = +n)) ? r : (a || (a = o(l.map(e), u, c)))(e(d(n)));
    }
    var e,
      i,
      r,
      o,
      a,
      s,
      l = ga,
      u = ga,
      c = _n,
      d = Nn;
    return (
      (t.invert = function (n) {
        return d(i((s || (s = o(u, l.map(e), xn)))(n)));
      }),
      (t.domain = function (t) {
        return arguments.length ? ((l = Array.from(t, En)), n()) : l.slice();
      }),
      (t.range = function (t) {
        return arguments.length ? ((u = Array.from(t)), n()) : u.slice();
      }),
      (t.rangeRound = function (t) {
        return (u = Array.from(t)), (c = Cn), n();
      }),
      (t.clamp = function (t) {
        return arguments.length ? ((d = !!t || Nn), n()) : d !== Nn;
      }),
      (t.interpolate = function (t) {
        return arguments.length ? ((c = t), n()) : c;
      }),
      (t.unknown = function (n) {
        return arguments.length ? ((r = n), t) : r;
      }),
      function (t, r) {
        return (e = t), (i = r), n();
      }
    );
  }
  function Un() {
    return Rn()(Nn, Nn);
  }
  function $n(n, t) {
    if (
      (e = (n = t ? n.toExponential(t - 1) : n.toExponential()).indexOf("e")) <
      0
    )
      return null;
    var e,
      i = n.slice(0, e);
    return [i.length > 1 ? i[0] + i.slice(2) : i, +n.slice(e + 1)];
  }
  function Pn(n) {
    return (n = $n(Math.abs(n))) ? n[1] : NaN;
  }
  function Hn(n, t) {
    return function (e, i) {
      for (
        var r = e.length, o = [], a = 0, s = n[0], l = 0;
        r > 0 &&
        s > 0 &&
        (l + s + 1 > i && (s = Math.max(1, i - l)),
        o.push(e.substring((r -= s), r + s)),
        !((l += s + 1) > i));

      )
        s = n[(a = (a + 1) % n.length)];
      return o.reverse().join(t);
    };
  }
  function zn(n) {
    return function (t) {
      return t.replace(/[0-9]/g, function (t) {
        return n[+t];
      });
    };
  }
  function qn(n) {
    if (!(t = ma.exec(n))) throw new Error("invalid format: " + n);
    var t;
    return new jn({
      fill: t[1],
      align: t[2],
      sign: t[3],
      symbol: t[4],
      zero: t[5],
      width: t[6],
      comma: t[7],
      precision: t[8] && t[8].slice(1),
      trim: t[9],
      type: t[10],
    });
  }
  function jn(n) {
    (this.fill = n.fill === undefined ? " " : n.fill + ""),
      (this.align = n.align === undefined ? ">" : n.align + ""),
      (this.sign = n.sign === undefined ? "-" : n.sign + ""),
      (this.symbol = n.symbol === undefined ? "" : n.symbol + ""),
      (this.zero = !!n.zero),
      (this.width = n.width === undefined ? undefined : +n.width),
      (this.comma = !!n.comma),
      (this.precision = n.precision === undefined ? undefined : +n.precision),
      (this.trim = !!n.trim),
      (this.type = n.type === undefined ? "" : n.type + "");
  }
  function Bn(n) {
    n: for (var t, e = n.length, i = 1, r = -1; i < e; ++i)
      switch (n[i]) {
        case ".":
          r = t = i;
          break;
        case "0":
          0 === r && (r = i), (t = i);
          break;
        default:
          if (!+n[i]) break n;
          r > 0 && (r = 0);
      }
    return r > 0 ? n.slice(0, r) + n.slice(t + 1) : n;
  }
  function Yn(n, t) {
    var e = $n(n, t);
    if (!e) return n + "";
    var i = e[0],
      r = e[1],
      o = r - (da = 3 * Math.max(-8, Math.min(8, Math.floor(r / 3)))) + 1,
      a = i.length;
    return o === a
      ? i
      : o > a
        ? i + new Array(o - a + 1).join("0")
        : o > 0
          ? i.slice(0, o) + "." + i.slice(o)
          : "0." +
            new Array(1 - o).join("0") +
            $n(n, Math.max(0, t + o - 1))[0];
  }
  function Wn(n, t) {
    var e = $n(n, t);
    if (!e) return n + "";
    var i = e[0],
      r = e[1];
    return r < 0
      ? "0." + new Array(-r).join("0") + i
      : i.length > r + 1
        ? i.slice(0, r + 1) + "." + i.slice(r + 1)
        : i + new Array(r - i.length + 2).join("0");
  }
  function Gn(n) {
    return n;
  }
  function Vn(n) {
    function t(n) {
      function t(n) {
        var t,
          r,
          o,
          l = w,
          p = x;
        if ("c" === v) (p = k(n) + p), (n = "");
        else {
          var M = (n = +n) < 0 || 1 / n < 0;
          if (
            ((n = isNaN(n) ? c : k(Math.abs(n), b)),
            y && (n = Bn(n)),
            M && 0 == +n && "+" !== h && (M = !1),
            (l =
              (M ? ("(" === h ? h : u) : "-" === h || "(" === h ? "" : h) + l),
            (p =
              ("s" === v ? ka[8 + da / 3] : "") +
              p +
              (M && "(" === h ? ")" : "")),
            S)
          )
            for (t = -1, r = n.length; ++t < r; )
              if (48 > (o = n.charCodeAt(t)) || o > 57) {
                (p = (46 === o ? a + n.slice(t + 1) : n.slice(t)) + p),
                  (n = n.slice(0, t));
                break;
              }
        }
        m && !f && (n = i(n, Infinity));
        var T = l.length + n.length + p.length,
          _ = T < g ? new Array(g - T + 1).join(e) : "";
        switch (
          (m &&
            f &&
            ((n = i(_ + n, _.length ? g - p.length : Infinity)), (_ = "")),
          d)
        ) {
          case "<":
            n = l + n + p + _;
            break;
          case "=":
            n = l + _ + n + p;
            break;
          case "^":
            n = _.slice(0, (T = _.length >> 1)) + l + n + p + _.slice(T);
            break;
          default:
            n = _ + l + n + p;
        }
        return s(n);
      }
      var e = (n = qn(n)).fill,
        d = n.align,
        h = n.sign,
        p = n.symbol,
        f = n.zero,
        g = n.width,
        m = n.comma,
        b = n.precision,
        y = n.trim,
        v = n.type;
      "n" === v
        ? ((m = !0), (v = "g"))
        : wa[v] || (b === undefined && (b = 12), (y = !0), (v = "g")),
        (f || ("0" === e && "=" === d)) && ((f = !0), (e = "0"), (d = "="));
      var w =
          "$" === p
            ? r
            : "#" === p && /[boxX]/.test(v)
              ? "0" + v.toLowerCase()
              : "",
        x = "$" === p ? o : /[%p]/.test(v) ? l : "",
        k = wa[v],
        S = /[defgprs%]/.test(v);
      return (
        (b =
          b === undefined
            ? 6
            : /[gprs]/.test(v)
              ? Math.max(1, Math.min(21, b))
              : Math.max(0, Math.min(20, b))),
        (t.toString = function () {
          return n + "";
        }),
        t
      );
    }
    function e(n, e) {
      var i = t((((n = qn(n)).type = "f"), n)),
        r = 3 * Math.max(-8, Math.min(8, Math.floor(Pn(e) / 3))),
        o = Math.pow(10, -r),
        a = ka[8 + r / 3];
      return function (n) {
        return i(o * n) + a;
      };
    }
    var i =
        n.grouping === undefined || n.thousands === undefined
          ? Gn
          : Hn(xa.call(n.grouping, Number), n.thousands + ""),
      r = n.currency === undefined ? "" : n.currency[0] + "",
      o = n.currency === undefined ? "" : n.currency[1] + "",
      a = n.decimal === undefined ? "." : n.decimal + "",
      s = n.numerals === undefined ? Gn : zn(xa.call(n.numerals, String)),
      l = n.percent === undefined ? "%" : n.percent + "",
      u = n.minus === undefined ? "-" : n.minus + "",
      c = n.nan === undefined ? "NaN" : n.nan + "";
    return { format: t, formatPrefix: e };
  }
  function Kn(n) {
    return (ba = Vn(n)), (ya = ba.format), (va = ba.formatPrefix), ba;
  }
  function Xn(n) {
    return Math.max(0, -Pn(Math.abs(n)));
  }
  function Zn(n, t) {
    return Math.max(
      0,
      3 * Math.max(-8, Math.min(8, Math.floor(Pn(t) / 3))) - Pn(Math.abs(n)),
    );
  }
  function Qn(n, t) {
    return (
      (n = Math.abs(n)), (t = Math.abs(t) - n), Math.max(0, Pn(t) - Pn(n)) + 1
    );
  }
  function Jn(n, t, e, i) {
    var r,
      o = E(n, t, e);
    switch ((i = qn(null == i ? ",f" : i)).type) {
      case "s":
        var a = Math.max(Math.abs(n), Math.abs(t));
        return (
          null != i.precision || isNaN((r = Zn(o, a))) || (i.precision = r),
          va(i, a)
        );
      case "":
      case "e":
      case "g":
      case "p":
      case "r":
        null != i.precision ||
          isNaN((r = Qn(o, Math.max(Math.abs(n), Math.abs(t))))) ||
          (i.precision = r - ("e" === i.type));
        break;
      case "f":
      case "%":
        null != i.precision ||
          isNaN((r = Xn(o))) ||
          (i.precision = r - 2 * ("%" === i.type));
    }
    return ya(i);
  }
  function nt(n) {
    var t = n.domain;
    return (
      (n.ticks = function (n) {
        var e = t();
        return C(e[0], e[e.length - 1], null == n ? 10 : n);
      }),
      (n.tickFormat = function (n, e) {
        var i = t();
        return Jn(i[0], i[i.length - 1], null == n ? 10 : n, e);
      }),
      (n.nice = function (e) {
        null == e && (e = 10);
        var i,
          r = t(),
          o = 0,
          a = r.length - 1,
          s = r[o],
          l = r[a];
        return (
          l < s && ((i = s), (s = l), (l = i), (i = o), (o = a), (a = i)),
          (i = A(s, l, e)) > 0
            ? (i = A(
                (s = Math.floor(s / i) * i),
                (l = Math.ceil(l / i) * i),
                e,
              ))
            : i < 0 &&
              (i = A(
                (s = Math.ceil(s * i) / i),
                (l = Math.floor(l * i) / i),
                e,
              )),
          i > 0
            ? ((r[o] = Math.floor(s / i) * i),
              (r[a] = Math.ceil(l / i) * i),
              t(r))
            : i < 0 &&
              ((r[o] = Math.ceil(s * i) / i),
              (r[a] = Math.floor(l * i) / i),
              t(r)),
          n
        );
      }),
      n
    );
  }
  function tt() {
    var n = Un();
    return (
      (n.copy = function () {
        return Fn(n, tt());
      }),
      N.apply(n, arguments),
      nt(n)
    );
  }
  function et(n, t, e, i) {
    function r(t) {
      return n((t = 0 === arguments.length ? new Date() : new Date(+t))), t;
    }
    return (
      (r.floor = function (t) {
        return n((t = new Date(+t))), t;
      }),
      (r.ceil = function (e) {
        return n((e = new Date(e - 1))), t(e, 1), n(e), e;
      }),
      (r.round = function (n) {
        var t = r(n),
          e = r.ceil(n);
        return n - t < e - n ? t : e;
      }),
      (r.offset = function (n, e) {
        return t((n = new Date(+n)), null == e ? 1 : Math.floor(e)), n;
      }),
      (r.range = function (e, i, o) {
        var a,
          s = [];
        if (
          ((e = r.ceil(e)),
          (o = null == o ? 1 : Math.floor(o)),
          !(e < i && o > 0))
        )
          return s;
        do {
          s.push((a = new Date(+e))), t(e, o), n(e);
        } while (a < e && e < i);
        return s;
      }),
      (r.filter = function (e) {
        return et(
          function (t) {
            if (t >= t) for (; n(t), !e(t); ) t.setTime(t - 1);
          },
          function (n, i) {
            if (n >= n)
              if (i < 0) for (; ++i <= 0; ) for (; t(n, -1), !e(n); );
              else for (; --i >= 0; ) for (; t(n, 1), !e(n); );
          },
        );
      }),
      e &&
        ((r.count = function (t, i) {
          return (
            Sa.setTime(+t), Ma.setTime(+i), n(Sa), n(Ma), Math.floor(e(Sa, Ma))
          );
        }),
        (r.every = function (n) {
          return (
            (n = Math.floor(n)),
            isFinite(n) && n > 0
              ? n > 1
                ? r.filter(
                    i
                      ? function (t) {
                          return i(t) % n == 0;
                        }
                      : function (t) {
                          return r.count(0, t) % n == 0;
                        },
                  )
                : r
              : null
          );
        })),
      r
    );
  }
  function it(n) {
    return et(
      function (t) {
        t.setDate(t.getDate() - ((t.getDay() + 7 - n) % 7)),
          t.setHours(0, 0, 0, 0);
      },
      function (n, t) {
        n.setDate(n.getDate() + 7 * t);
      },
      function (n, t) {
        return (
          (t - n - (t.getTimezoneOffset() - n.getTimezoneOffset()) * Ca) / Na
        );
      },
    );
  }
  function rt(n) {
    return et(
      function (t) {
        t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 7 - n) % 7)),
          t.setUTCHours(0, 0, 0, 0);
      },
      function (n, t) {
        n.setUTCDate(n.getUTCDate() + 7 * t);
      },
      function (n, t) {
        return (t - n) / Na;
      },
    );
  }
  function ot(n) {
    if (0 <= n.y && n.y < 100) {
      var t = new Date(-1, n.m, n.d, n.H, n.M, n.S, n.L);
      return t.setFullYear(n.y), t;
    }
    return new Date(n.y, n.m, n.d, n.H, n.M, n.S, n.L);
  }
  function at(n) {
    if (0 <= n.y && n.y < 100) {
      var t = new Date(Date.UTC(-1, n.m, n.d, n.H, n.M, n.S, n.L));
      return t.setUTCFullYear(n.y), t;
    }
    return new Date(Date.UTC(n.y, n.m, n.d, n.H, n.M, n.S, n.L));
  }
  function st(n, t, e) {
    return { y: n, m: t, d: e, H: 0, M: 0, S: 0, L: 0 };
  }
  function lt(n) {
    function t(n, t) {
      return function (e) {
        var i,
          r,
          o,
          a = [],
          s = -1,
          l = 0,
          u = n.length;
        for (e instanceof Date || (e = new Date(+e)); ++s < u; )
          37 === n.charCodeAt(s) &&
            (a.push(n.slice(l, s)),
            null != (r = Ba[(i = n.charAt(++s))])
              ? (i = n.charAt(++s))
              : (r = "e" === i ? " " : "0"),
            (o = t[i]) && (i = o(e, r)),
            a.push(i),
            (l = s + 1));
        return a.push(n.slice(l, s)), a.join("");
      };
    }
    function e(n, t) {
      return function (e) {
        var r,
          o,
          a = st(1900, undefined, 1);
        if (i(a, n, (e += ""), 0) != e.length) return null;
        if ("Q" in a) return new Date(a.Q);
        if ("s" in a) return new Date(1e3 * a.s + ("L" in a ? a.L : 0));
        if (
          (!t || "Z" in a || (a.Z = 0),
          "p" in a && (a.H = (a.H % 12) + 12 * a.p),
          a.m === undefined && (a.m = "q" in a ? a.q : 0),
          "V" in a)
        ) {
          if (a.V < 1 || a.V > 53) return null;
          "w" in a || (a.w = 1),
            "Z" in a
              ? ((r =
                  (o = (r = at(st(a.y, 0, 1))).getUTCDay()) > 4 || 0 === o
                    ? $a.ceil(r)
                    : $a(r)),
                (r = Ra.offset(r, 7 * (a.V - 1))),
                (a.y = r.getUTCFullYear()),
                (a.m = r.getUTCMonth()),
                (a.d = r.getUTCDate() + ((a.w + 6) % 7)))
              : ((r =
                  (o = (r = ot(st(a.y, 0, 1))).getDay()) > 4 || 0 === o
                    ? Oa.ceil(r)
                    : Oa(r)),
                (r = La.offset(r, 7 * (a.V - 1))),
                (a.y = r.getFullYear()),
                (a.m = r.getMonth()),
                (a.d = r.getDate() + ((a.w + 6) % 7)));
        } else
          ("W" in a || "U" in a) &&
            ("w" in a || (a.w = "u" in a ? a.u % 7 : "W" in a ? 1 : 0),
            (o =
              "Z" in a
                ? at(st(a.y, 0, 1)).getUTCDay()
                : ot(st(a.y, 0, 1)).getDay()),
            (a.m = 0),
            (a.d =
              "W" in a
                ? ((a.w + 6) % 7) + 7 * a.W - ((o + 5) % 7)
                : a.w + 7 * a.U - ((o + 6) % 7)));
        return "Z" in a
          ? ((a.H += (a.Z / 100) | 0), (a.M += a.Z % 100), at(a))
          : ot(a);
      };
    }
    function i(n, t, e, i) {
      for (var r, o, a = 0, s = t.length, l = e.length; a < s; ) {
        if (i >= l) return -1;
        if (37 === (r = t.charCodeAt(a++))) {
          if (
            ((r = t.charAt(a++)),
            !(o = B[r in Ba ? t.charAt(a++) : r]) || (i = o(n, e, i)) < 0)
          )
            return -1;
        } else if (r != e.charCodeAt(i++)) return -1;
      }
      return i;
    }
    function r(n, t, e) {
      var i = D.exec(t.slice(e));
      return i ? ((n.p = O[i[0].toLowerCase()]), e + i[0].length) : -1;
    }
    function o(n, t, e) {
      var i = R.exec(t.slice(e));
      return i ? ((n.w = U[i[0].toLowerCase()]), e + i[0].length) : -1;
    }
    function a(n, t, e) {
      var i = I.exec(t.slice(e));
      return i ? ((n.w = F[i[0].toLowerCase()]), e + i[0].length) : -1;
    }
    function s(n, t, e) {
      var i = H.exec(t.slice(e));
      return i ? ((n.m = z[i[0].toLowerCase()]), e + i[0].length) : -1;
    }
    function l(n, t, e) {
      var i = $.exec(t.slice(e));
      return i ? ((n.m = P[i[0].toLowerCase()]), e + i[0].length) : -1;
    }
    function u(n, t, e) {
      return i(n, M, t, e);
    }
    function c(n, t, e) {
      return i(n, T, t, e);
    }
    function d(n, t, e) {
      return i(n, _, t, e);
    }
    function h(n) {
      return E[n.getDay()];
    }
    function p(n) {
      return A[n.getDay()];
    }
    function f(n) {
      return L[n.getMonth()];
    }
    function g(n) {
      return N[n.getMonth()];
    }
    function m(n) {
      return C[+(n.getHours() >= 12)];
    }
    function b(n) {
      return 1 + ~~(n.getMonth() / 3);
    }
    function y(n) {
      return E[n.getUTCDay()];
    }
    function v(n) {
      return A[n.getUTCDay()];
    }
    function w(n) {
      return L[n.getUTCMonth()];
    }
    function x(n) {
      return N[n.getUTCMonth()];
    }
    function k(n) {
      return C[+(n.getUTCHours() >= 12)];
    }
    function S(n) {
      return 1 + ~~(n.getUTCMonth() / 3);
    }
    var M = n.dateTime,
      T = n.date,
      _ = n.time,
      C = n.periods,
      A = n.days,
      E = n.shortDays,
      N = n.months,
      L = n.shortMonths,
      D = dt(C),
      O = ht(C),
      I = dt(A),
      F = ht(A),
      R = dt(E),
      U = ht(E),
      $ = dt(N),
      P = ht(N),
      H = dt(L),
      z = ht(L),
      q = {
        a: h,
        A: p,
        b: f,
        B: g,
        c: null,
        d: Ot,
        e: Ot,
        f: $t,
        H: It,
        I: Ft,
        j: Rt,
        L: Ut,
        m: Pt,
        M: Ht,
        p: m,
        q: b,
        Q: fe,
        s: ge,
        S: zt,
        u: qt,
        U: jt,
        V: Bt,
        w: Yt,
        W: Wt,
        x: null,
        X: null,
        y: Gt,
        Y: Vt,
        Z: Kt,
        "%": pe,
      },
      j = {
        a: y,
        A: v,
        b: w,
        B: x,
        c: null,
        d: Xt,
        e: Xt,
        f: te,
        H: Zt,
        I: Qt,
        j: Jt,
        L: ne,
        m: ee,
        M: ie,
        p: k,
        q: S,
        Q: fe,
        s: ge,
        S: re,
        u: oe,
        U: ae,
        V: se,
        w: le,
        W: ue,
        x: null,
        X: null,
        y: ce,
        Y: de,
        Z: he,
        "%": pe,
      },
      B = {
        a: o,
        A: a,
        b: s,
        B: l,
        c: u,
        d: St,
        e: St,
        f: Et,
        H: Tt,
        I: Tt,
        j: Mt,
        L: At,
        m: kt,
        M: _t,
        p: r,
        q: xt,
        Q: Lt,
        s: Dt,
        S: Ct,
        u: ft,
        U: gt,
        V: mt,
        w: pt,
        W: bt,
        x: c,
        X: d,
        y: vt,
        Y: yt,
        Z: wt,
        "%": Nt,
      };
    return (
      (q.x = t(T, q)),
      (q.X = t(_, q)),
      (q.c = t(M, q)),
      (j.x = t(T, j)),
      (j.X = t(_, j)),
      (j.c = t(M, j)),
      {
        format: function (n) {
          var e = t((n += ""), q);
          return (
            (e.toString = function () {
              return n;
            }),
            e
          );
        },
        parse: function (n) {
          var t = e((n += ""), !1);
          return (
            (t.toString = function () {
              return n;
            }),
            t
          );
        },
        utcFormat: function (n) {
          var e = t((n += ""), j);
          return (
            (e.toString = function () {
              return n;
            }),
            e
          );
        },
        utcParse: function (n) {
          var t = e((n += ""), !0);
          return (
            (t.toString = function () {
              return n;
            }),
            t
          );
        },
      }
    );
  }
  function ut(n, t, e) {
    var i = n < 0 ? "-" : "",
      r = (i ? -n : n) + "",
      o = r.length;
    return i + (o < e ? new Array(e - o + 1).join(t) + r : r);
  }
  function ct(n) {
    return n.replace(Ga, "\\$&");
  }
  function dt(n) {
    return new RegExp("^(?:" + n.map(ct).join("|") + ")", "i");
  }
  function ht(n) {
    for (var t = {}, e = -1, i = n.length; ++e < i; ) t[n[e].toLowerCase()] = e;
    return t;
  }
  function pt(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 1));
    return i ? ((n.w = +i[0]), e + i[0].length) : -1;
  }
  function ft(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 1));
    return i ? ((n.u = +i[0]), e + i[0].length) : -1;
  }
  function gt(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 2));
    return i ? ((n.U = +i[0]), e + i[0].length) : -1;
  }
  function mt(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 2));
    return i ? ((n.V = +i[0]), e + i[0].length) : -1;
  }
  function bt(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 2));
    return i ? ((n.W = +i[0]), e + i[0].length) : -1;
  }
  function yt(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 4));
    return i ? ((n.y = +i[0]), e + i[0].length) : -1;
  }
  function vt(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 2));
    return i
      ? ((n.y = +i[0] + (+i[0] > 68 ? 1900 : 2e3)), e + i[0].length)
      : -1;
  }
  function wt(n, t, e) {
    var i = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(e, e + 6));
    return i
      ? ((n.Z = i[1] ? 0 : -(i[2] + (i[3] || "00"))), e + i[0].length)
      : -1;
  }
  function xt(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 1));
    return i ? ((n.q = 3 * i[0] - 3), e + i[0].length) : -1;
  }
  function kt(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 2));
    return i ? ((n.m = i[0] - 1), e + i[0].length) : -1;
  }
  function St(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 2));
    return i ? ((n.d = +i[0]), e + i[0].length) : -1;
  }
  function Mt(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 3));
    return i ? ((n.m = 0), (n.d = +i[0]), e + i[0].length) : -1;
  }
  function Tt(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 2));
    return i ? ((n.H = +i[0]), e + i[0].length) : -1;
  }
  function _t(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 2));
    return i ? ((n.M = +i[0]), e + i[0].length) : -1;
  }
  function Ct(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 2));
    return i ? ((n.S = +i[0]), e + i[0].length) : -1;
  }
  function At(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 3));
    return i ? ((n.L = +i[0]), e + i[0].length) : -1;
  }
  function Et(n, t, e) {
    var i = Ya.exec(t.slice(e, e + 6));
    return i ? ((n.L = Math.floor(i[0] / 1e3)), e + i[0].length) : -1;
  }
  function Nt(n, t, e) {
    var i = Wa.exec(t.slice(e, e + 1));
    return i ? e + i[0].length : -1;
  }
  function Lt(n, t, e) {
    var i = Ya.exec(t.slice(e));
    return i ? ((n.Q = +i[0]), e + i[0].length) : -1;
  }
  function Dt(n, t, e) {
    var i = Ya.exec(t.slice(e));
    return i ? ((n.s = +i[0]), e + i[0].length) : -1;
  }
  function Ot(n, t) {
    return ut(n.getDate(), t, 2);
  }
  function It(n, t) {
    return ut(n.getHours(), t, 2);
  }
  function Ft(n, t) {
    return ut(n.getHours() % 12 || 12, t, 2);
  }
  function Rt(n, t) {
    return ut(1 + La.count(Fa(n), n), t, 3);
  }
  function Ut(n, t) {
    return ut(n.getMilliseconds(), t, 3);
  }
  function $t(n, t) {
    return Ut(n, t) + "000";
  }
  function Pt(n, t) {
    return ut(n.getMonth() + 1, t, 2);
  }
  function Ht(n, t) {
    return ut(n.getMinutes(), t, 2);
  }
  function zt(n, t) {
    return ut(n.getSeconds(), t, 2);
  }
  function qt(n) {
    var t = n.getDay();
    return 0 === t ? 7 : t;
  }
  function jt(n, t) {
    return ut(Da.count(Fa(n) - 1, n), t, 2);
  }
  function Bt(n, t) {
    var e = n.getDay();
    return (
      (n = e >= 4 || 0 === e ? Ia(n) : Ia.ceil(n)),
      ut(Ia.count(Fa(n), n) + (4 === Fa(n).getDay()), t, 2)
    );
  }
  function Yt(n) {
    return n.getDay();
  }
  function Wt(n, t) {
    return ut(Oa.count(Fa(n) - 1, n), t, 2);
  }
  function Gt(n, t) {
    return ut(n.getFullYear() % 100, t, 2);
  }
  function Vt(n, t) {
    return ut(n.getFullYear() % 1e4, t, 4);
  }
  function Kt(n) {
    var t = n.getTimezoneOffset();
    return (
      (t > 0 ? "-" : ((t *= -1), "+")) +
      ut((t / 60) | 0, "0", 2) +
      ut(t % 60, "0", 2)
    );
  }
  function Xt(n, t) {
    return ut(n.getUTCDate(), t, 2);
  }
  function Zt(n, t) {
    return ut(n.getUTCHours(), t, 2);
  }
  function Qt(n, t) {
    return ut(n.getUTCHours() % 12 || 12, t, 2);
  }
  function Jt(n, t) {
    return ut(1 + Ra.count(Ha(n), n), t, 3);
  }
  function ne(n, t) {
    return ut(n.getUTCMilliseconds(), t, 3);
  }
  function te(n, t) {
    return ne(n, t) + "000";
  }
  function ee(n, t) {
    return ut(n.getUTCMonth() + 1, t, 2);
  }
  function ie(n, t) {
    return ut(n.getUTCMinutes(), t, 2);
  }
  function re(n, t) {
    return ut(n.getUTCSeconds(), t, 2);
  }
  function oe(n) {
    var t = n.getUTCDay();
    return 0 === t ? 7 : t;
  }
  function ae(n, t) {
    return ut(Ua.count(Ha(n) - 1, n), t, 2);
  }
  function se(n, t) {
    var e = n.getUTCDay();
    return (
      (n = e >= 4 || 0 === e ? Pa(n) : Pa.ceil(n)),
      ut(Pa.count(Ha(n), n) + (4 === Ha(n).getUTCDay()), t, 2)
    );
  }
  function le(n) {
    return n.getUTCDay();
  }
  function ue(n, t) {
    return ut($a.count(Ha(n) - 1, n), t, 2);
  }
  function ce(n, t) {
    return ut(n.getUTCFullYear() % 100, t, 2);
  }
  function de(n, t) {
    return ut(n.getUTCFullYear() % 1e4, t, 4);
  }
  function he() {
    return "+0000";
  }
  function pe() {
    return "%";
  }
  function fe(n) {
    return +n;
  }
  function ge(n) {
    return Math.floor(+n / 1e3);
  }
  function me(n) {
    return (
      (za = lt(n)),
      za.format,
      za.parse,
      (qa = za.utcFormat),
      (ja = za.utcParse),
      za
    );
  }
  function be(n) {
    return n.toISOString();
  }
  function ye(n) {
    var t = new Date(n);
    return isNaN(t) ? null : t;
  }
  function ve() {
    for (var n, t = 0, e = arguments.length, i = {}; t < e; ++t) {
      if (!(n = arguments[t] + "") || n in i || /[\s.]/.test(n))
        throw new Error("illegal type: " + n);
      i[n] = [];
    }
    return new we(i);
  }
  function we(n) {
    this._ = n;
  }
  function xe(n, t) {
    return n
      .trim()
      .split(/^|\s+/)
      .map(function (n) {
        var e = "",
          i = n.indexOf(".");
        if (
          (i >= 0 && ((e = n.slice(i + 1)), (n = n.slice(0, i))),
          n && !t.hasOwnProperty(n))
        )
          throw new Error("unknown type: " + n);
        return { type: n, name: e };
      });
  }
  function ke(n, t) {
    for (var e, i = 0, r = n.length; i < r; ++i)
      if ((e = n[i]).name === t) return e.value;
  }
  function Se(n, t, e) {
    for (var i = 0, r = n.length; i < r; ++i)
      if (n[i].name === t) {
        (n[i] = Ka), (n = n.slice(0, i).concat(n.slice(i + 1)));
        break;
      }
    return null != e && n.push({ name: t, value: e }), n;
  }
  function Me(n) {
    var t = (n += ""),
      e = t.indexOf(":");
    return (
      e >= 0 && "xmlns" !== (t = n.slice(0, e)) && (n = n.slice(e + 1)),
      Za.hasOwnProperty(t) ? { space: Za[t], local: n } : n
    );
  }
  function Te(n) {
    return function () {
      var t = this.ownerDocument,
        e = this.namespaceURI;
      return e === Xa && t.documentElement.namespaceURI === Xa
        ? t.createElement(n)
        : t.createElementNS(e, n);
    };
  }
  function _e(n) {
    return function () {
      return this.ownerDocument.createElementNS(n.space, n.local);
    };
  }
  function Ce(n) {
    var t = Me(n);
    return (t.local ? _e : Te)(t);
  }
  function Ae() {}
  function Ee(n) {
    return null == n
      ? Ae
      : function () {
          return this.querySelector(n);
        };
  }
  function Ne(n) {
    "function" != typeof n && (n = Ee(n));
    for (
      var t = this._groups, e = t.length, i = new Array(e), r = 0;
      r < e;
      ++r
    )
      for (
        var o, a, s = t[r], l = s.length, u = (i[r] = new Array(l)), c = 0;
        c < l;
        ++c
      )
        (o = s[c]) &&
          (a = n.call(o, o.__data__, c, s)) &&
          ("__data__" in o && (a.__data__ = o.__data__), (u[c] = a));
    return new or(i, this._parents);
  }
  function Le() {
    return [];
  }
  function De(n) {
    return null == n
      ? Le
      : function () {
          return this.querySelectorAll(n);
        };
  }
  function Oe(n) {
    "function" != typeof n && (n = De(n));
    for (var t = this._groups, e = t.length, i = [], r = [], o = 0; o < e; ++o)
      for (var a, s = t[o], l = s.length, u = 0; u < l; ++u)
        (a = s[u]) && (i.push(n.call(a, a.__data__, u, s)), r.push(a));
    return new or(i, r);
  }
  function Ie(n) {
    return function () {
      return this.matches(n);
    };
  }
  function Fe(n) {
    "function" != typeof n && (n = Ie(n));
    for (
      var t = this._groups, e = t.length, i = new Array(e), r = 0;
      r < e;
      ++r
    )
      for (var o, a = t[r], s = a.length, l = (i[r] = []), u = 0; u < s; ++u)
        (o = a[u]) && n.call(o, o.__data__, u, a) && l.push(o);
    return new or(i, this._parents);
  }
  function Re(n) {
    return new Array(n.length);
  }
  function Ue() {
    return new or(this._enter || this._groups.map(Re), this._parents);
  }
  function $e(n, t) {
    (this.ownerDocument = n.ownerDocument),
      (this.namespaceURI = n.namespaceURI),
      (this._next = null),
      (this._parent = n),
      (this.__data__ = t);
  }
  function Pe(n) {
    return function () {
      return n;
    };
  }
  function He(n, t, e, i, r, o) {
    for (var a, s = 0, l = t.length, u = o.length; s < u; ++s)
      (a = t[s]) ? ((a.__data__ = o[s]), (i[s] = a)) : (e[s] = new $e(n, o[s]));
    for (; s < l; ++s) (a = t[s]) && (r[s] = a);
  }
  function ze(n, t, e, i, r, o, a) {
    var s,
      l,
      u,
      c = {},
      d = t.length,
      h = o.length,
      p = new Array(d);
    for (s = 0; s < d; ++s)
      (l = t[s]) &&
        ((p[s] = u = Qa + a.call(l, l.__data__, s, t)),
        u in c ? (r[s] = l) : (c[u] = l));
    for (s = 0; s < h; ++s)
      (l = c[(u = Qa + a.call(n, o[s], s, o))])
        ? ((i[s] = l), (l.__data__ = o[s]), (c[u] = null))
        : (e[s] = new $e(n, o[s]));
    for (s = 0; s < d; ++s) (l = t[s]) && c[p[s]] === l && (r[s] = l);
  }
  function qe(n, t) {
    if (!n)
      return (
        (p = new Array(this.size())),
        (u = -1),
        this.each(function (n) {
          p[++u] = n;
        }),
        p
      );
    var e = t ? ze : He,
      i = this._parents,
      r = this._groups;
    "function" != typeof n && (n = Pe(n));
    for (
      var o = r.length,
        a = new Array(o),
        s = new Array(o),
        l = new Array(o),
        u = 0;
      u < o;
      ++u
    ) {
      var c = i[u],
        d = r[u],
        h = d.length,
        p = n.call(c, c && c.__data__, u, i),
        f = p.length,
        g = (s[u] = new Array(f)),
        m = (a[u] = new Array(f));
      e(c, d, g, m, (l[u] = new Array(h)), p, t);
      for (var b, y, v = 0, w = 0; v < f; ++v)
        if ((b = g[v])) {
          for (v >= w && (w = v + 1); !(y = m[w]) && ++w < f; );
          b._next = y || null;
        }
    }
    return ((a = new or(a, i))._enter = s), (a._exit = l), a;
  }
  function je() {
    return new or(this._exit || this._groups.map(Re), this._parents);
  }
  function Be(n, t, e) {
    var i = this.enter(),
      r = this,
      o = this.exit();
    return (
      (i = "function" == typeof n ? n(i) : i.append(n + "")),
      null != t && (r = t(r)),
      null == e ? o.remove() : e(o),
      i && r ? i.merge(r).order() : r
    );
  }
  function Ye(n) {
    for (
      var t = this._groups,
        e = n._groups,
        i = t.length,
        r = e.length,
        o = Math.min(i, r),
        a = new Array(i),
        s = 0;
      s < o;
      ++s
    )
      for (
        var l,
          u = t[s],
          c = e[s],
          d = u.length,
          h = (a[s] = new Array(d)),
          p = 0;
        p < d;
        ++p
      )
        (l = u[p] || c[p]) && (h[p] = l);
    for (; s < i; ++s) a[s] = t[s];
    return new or(a, this._parents);
  }
  function We() {
    for (var n = this._groups, t = -1, e = n.length; ++t < e; )
      for (var i, r = n[t], o = r.length - 1, a = r[o]; --o >= 0; )
        (i = r[o]) &&
          (a &&
            4 ^ i.compareDocumentPosition(a) &&
            a.parentNode.insertBefore(i, a),
          (a = i));
    return this;
  }
  function Ge(n) {
    function t(t, e) {
      return t && e ? n(t.__data__, e.__data__) : !t - !e;
    }
    n || (n = Ve);
    for (
      var e = this._groups, i = e.length, r = new Array(i), o = 0;
      o < i;
      ++o
    ) {
      for (
        var a, s = e[o], l = s.length, u = (r[o] = new Array(l)), c = 0;
        c < l;
        ++c
      )
        (a = s[c]) && (u[c] = a);
      u.sort(t);
    }
    return new or(r, this._parents).order();
  }
  function Ve(n, t) {
    return n < t ? -1 : n > t ? 1 : n >= t ? 0 : NaN;
  }
  function Ke() {
    var n = arguments[0];
    return (arguments[0] = this), n.apply(null, arguments), this;
  }
  function Xe() {
    var n = new Array(this.size()),
      t = -1;
    return (
      this.each(function () {
        n[++t] = this;
      }),
      n
    );
  }
  function Ze() {
    for (var n = this._groups, t = 0, e = n.length; t < e; ++t)
      for (var i = n[t], r = 0, o = i.length; r < o; ++r) {
        var a = i[r];
        if (a) return a;
      }
    return null;
  }
  function Qe() {
    var n = 0;
    return (
      this.each(function () {
        ++n;
      }),
      n
    );
  }
  function Je() {
    return !this.node();
  }
  function ni(n) {
    for (var t = this._groups, e = 0, i = t.length; e < i; ++e)
      for (var r, o = t[e], a = 0, s = o.length; a < s; ++a)
        (r = o[a]) && n.call(r, r.__data__, a, o);
    return this;
  }
  function ti(n) {
    return function () {
      this.removeAttribute(n);
    };
  }
  function ei(n) {
    return function () {
      this.removeAttributeNS(n.space, n.local);
    };
  }
  function ii(n, t) {
    return function () {
      this.setAttribute(n, t);
    };
  }
  function ri(n, t) {
    return function () {
      this.setAttributeNS(n.space, n.local, t);
    };
  }
  function oi(n, t) {
    return function () {
      var e = t.apply(this, arguments);
      null == e ? this.removeAttribute(n) : this.setAttribute(n, e);
    };
  }
  function ai(n, t) {
    return function () {
      var e = t.apply(this, arguments);
      null == e
        ? this.removeAttributeNS(n.space, n.local)
        : this.setAttributeNS(n.space, n.local, e);
    };
  }
  function si(n, t) {
    var e = Me(n);
    if (arguments.length < 2) {
      var i = this.node();
      return e.local ? i.getAttributeNS(e.space, e.local) : i.getAttribute(e);
    }
    return this.each(
      (null == t
        ? e.local
          ? ei
          : ti
        : "function" == typeof t
          ? e.local
            ? ai
            : oi
          : e.local
            ? ri
            : ii)(e, t),
    );
  }
  function li(n) {
    return (
      (n.ownerDocument && n.ownerDocument.defaultView) ||
      (n.document && n) ||
      n.defaultView
    );
  }
  function ui(n) {
    return function () {
      this.style.removeProperty(n);
    };
  }
  function ci(n, t, e) {
    return function () {
      this.style.setProperty(n, t, e);
    };
  }
  function di(n, t, e) {
    return function () {
      var i = t.apply(this, arguments);
      null == i
        ? this.style.removeProperty(n)
        : this.style.setProperty(n, i, e);
    };
  }
  function hi(n, t, e) {
    return arguments.length > 1
      ? this.each(
          (null == t ? ui : "function" == typeof t ? di : ci)(
            n,
            t,
            null == e ? "" : e,
          ),
        )
      : pi(this.node(), n);
  }
  function pi(n, t) {
    return (
      n.style.getPropertyValue(t) ||
      li(n).getComputedStyle(n, null).getPropertyValue(t)
    );
  }
  function fi(n) {
    return function () {
      delete this[n];
    };
  }
  function gi(n, t) {
    return function () {
      this[n] = t;
    };
  }
  function mi(n, t) {
    return function () {
      var e = t.apply(this, arguments);
      null == e ? delete this[n] : (this[n] = e);
    };
  }
  function bi(n, t) {
    return arguments.length > 1
      ? this.each((null == t ? fi : "function" == typeof t ? mi : gi)(n, t))
      : this.node()[n];
  }
  function yi(n) {
    return n.trim().split(/^|\s+/);
  }
  function vi(n) {
    return n.classList || new wi(n);
  }
  function wi(n) {
    (this._node = n), (this._names = yi(n.getAttribute("class") || ""));
  }
  function xi(n, t) {
    for (var e = vi(n), i = -1, r = t.length; ++i < r; ) e.add(t[i]);
  }
  function ki(n, t) {
    for (var e = vi(n), i = -1, r = t.length; ++i < r; ) e.remove(t[i]);
  }
  function Si(n) {
    return function () {
      xi(this, n);
    };
  }
  function Mi(n) {
    return function () {
      ki(this, n);
    };
  }
  function Ti(n, t) {
    return function () {
      (t.apply(this, arguments) ? xi : ki)(this, n);
    };
  }
  function _i(n, t) {
    var e = yi(n + "");
    if (arguments.length < 2) {
      for (var i = vi(this.node()), r = -1, o = e.length; ++r < o; )
        if (!i.contains(e[r])) return !1;
      return !0;
    }
    return this.each(("function" == typeof t ? Ti : t ? Si : Mi)(e, t));
  }
  function Ci() {
    this.textContent = "";
  }
  function Ai(n) {
    return function () {
      this.textContent = n;
    };
  }
  function Ei(n) {
    return function () {
      var t = n.apply(this, arguments);
      this.textContent = null == t ? "" : t;
    };
  }
  function Ni(n) {
    return arguments.length
      ? this.each(null == n ? Ci : ("function" == typeof n ? Ei : Ai)(n))
      : this.node().textContent;
  }
  function Li() {
    this.innerHTML = "";
  }
  function Di(n) {
    return function () {
      this.innerHTML = n;
    };
  }
  function Oi(n) {
    return function () {
      var t = n.apply(this, arguments);
      this.innerHTML = null == t ? "" : t;
    };
  }
  function Ii(n) {
    return arguments.length
      ? this.each(null == n ? Li : ("function" == typeof n ? Oi : Di)(n))
      : this.node().innerHTML;
  }
  function Fi() {
    this.nextSibling && this.parentNode.appendChild(this);
  }
  function Ri() {
    return this.each(Fi);
  }
  function Ui() {
    this.previousSibling &&
      this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }
  function $i() {
    return this.each(Ui);
  }
  function Pi(n) {
    var t = "function" == typeof n ? n : Ce(n);
    return this.select(function () {
      return this.appendChild(t.apply(this, arguments));
    });
  }
  function Hi() {
    return null;
  }
  function zi(n, t) {
    var e = "function" == typeof n ? n : Ce(n),
      i = null == t ? Hi : "function" == typeof t ? t : Ee(t);
    return this.select(function () {
      return this.insertBefore(
        e.apply(this, arguments),
        i.apply(this, arguments) || null,
      );
    });
  }
  function qi() {
    var n = this.parentNode;
    n && n.removeChild(this);
  }
  function ji() {
    return this.each(qi);
  }
  function Bi() {
    var n = this.cloneNode(!1),
      t = this.parentNode;
    return t ? t.insertBefore(n, this.nextSibling) : n;
  }
  function Yi() {
    var n = this.cloneNode(!0),
      t = this.parentNode;
    return t ? t.insertBefore(n, this.nextSibling) : n;
  }
  function Wi(n) {
    return this.select(n ? Yi : Bi);
  }
  function Gi(n) {
    return arguments.length
      ? this.property("__data__", n)
      : this.node().__data__;
  }
  function Vi(n, t, e) {
    return (
      (n = Ki(n, t, e)),
      function (t) {
        var e = t.relatedTarget;
        (e && (e === this || 8 & e.compareDocumentPosition(this))) ||
          n.call(this, t);
      }
    );
  }
  function Ki(n, t, e) {
    return function (i) {
      var r = ns;
      ns = i;
      try {
        n.call(this, this.__data__, t, e);
      } finally {
        ns = r;
      }
    };
  }
  function Xi(n) {
    return n
      .trim()
      .split(/^|\s+/)
      .map(function (n) {
        var t = "",
          e = n.indexOf(".");
        return (
          e >= 0 && ((t = n.slice(e + 1)), (n = n.slice(0, e))),
          { type: n, name: t }
        );
      });
  }
  function Zi(n) {
    return function () {
      var t = this.__on;
      if (t) {
        for (var e, i = 0, r = -1, o = t.length; i < o; ++i)
          (e = t[i]),
            (n.type && e.type !== n.type) || e.name !== n.name
              ? (t[++r] = e)
              : this.removeEventListener(e.type, e.listener, e.capture);
        ++r ? (t.length = r) : delete this.__on;
      }
    };
  }
  function Qi(n, t, e) {
    var i = Ja.hasOwnProperty(n.type) ? Vi : Ki;
    return function (r, o, a) {
      var s,
        l = this.__on,
        u = i(t, o, a);
      if (l)
        for (var c = 0, d = l.length; c < d; ++c)
          if ((s = l[c]).type === n.type && s.name === n.name)
            return (
              this.removeEventListener(s.type, s.listener, s.capture),
              this.addEventListener(s.type, (s.listener = u), (s.capture = e)),
              void (s.value = t)
            );
      this.addEventListener(n.type, u, e),
        (s = { type: n.type, name: n.name, value: t, listener: u, capture: e }),
        l ? l.push(s) : (this.__on = [s]);
    };
  }
  function Ji(n, t, e) {
    var i,
      r,
      o = Xi(n + ""),
      a = o.length;
    if (!(arguments.length < 2)) {
      for (s = t ? Qi : Zi, null == e && (e = !1), i = 0; i < a; ++i)
        this.each(s(o[i], t, e));
      return this;
    }
    var s = this.node().__on;
    if (s)
      for (var l, u = 0, c = s.length; u < c; ++u)
        for (i = 0, l = s[u]; i < a; ++i)
          if ((r = o[i]).type === l.type && r.name === l.name) return l.value;
  }
  function nr(n, t, e, i) {
    var r = ns;
    (n.sourceEvent = ns), (ns = n);
    try {
      return t.apply(e, i);
    } finally {
      ns = r;
    }
  }
  function tr(n, t, e) {
    var i = li(n),
      r = i.CustomEvent;
    "function" == typeof r
      ? (r = new r(t, e))
      : ((r = i.document.createEvent("Event")),
        e
          ? (r.initEvent(t, e.bubbles, e.cancelable), (r.detail = e.detail))
          : r.initEvent(t, !1, !1)),
      n.dispatchEvent(r);
  }
  function er(n, t) {
    return function () {
      return tr(this, n, t);
    };
  }
  function ir(n, t) {
    return function () {
      return tr(this, n, t.apply(this, arguments));
    };
  }
  function rr(n, t) {
    return this.each(("function" == typeof t ? ir : er)(n, t));
  }
  function or(n, t) {
    (this._groups = n), (this._parents = t);
  }
  function ar() {
    return new or([[document.documentElement]], ts);
  }
  function sr(n) {
    return "string" == typeof n
      ? new or([[document.querySelector(n)]], [document.documentElement])
      : new or([[n]], ts);
  }
  function lr() {
    for (var n, t = ns; (n = t.sourceEvent); ) t = n;
    return t;
  }
  function ur(n, t) {
    var e = n.ownerSVGElement || n;
    if (e.createSVGPoint) {
      var i = e.createSVGPoint();
      return (
        (i.x = t.clientX),
        (i.y = t.clientY),
        [(i = i.matrixTransform(n.getScreenCTM().inverse())).x, i.y]
      );
    }
    var r = n.getBoundingClientRect();
    return [t.clientX - r.left - n.clientLeft, t.clientY - r.top - n.clientTop];
  }
  function cr(n) {
    var t = lr();
    return t.changedTouches && (t = t.changedTouches[0]), ur(n, t);
  }
  function dr(n, t, e) {
    arguments.length < 3 && ((e = t), (t = lr().changedTouches));
    for (var i, r = 0, o = t ? t.length : 0; r < o; ++r)
      if ((i = t[r]).identifier === e) return ur(n, i);
    return null;
  }
  function hr() {
    ns.stopImmediatePropagation();
  }
  function pr() {
    ns.preventDefault(), ns.stopImmediatePropagation();
  }
  function fr(n) {
    var t = n.document.documentElement,
      e = sr(n).on("dragstart.drag", pr, !0);
    "onselectstart" in t
      ? e.on("selectstart.drag", pr, !0)
      : ((t.__noselect = t.style.MozUserSelect),
        (t.style.MozUserSelect = "none"));
  }
  function gr(n, t) {
    var e = n.document.documentElement,
      i = sr(n).on("dragstart.drag", null);
    t &&
      (i.on("click.drag", pr, !0),
      setTimeout(function () {
        i.on("click.drag", null);
      }, 0)),
      "onselectstart" in e
        ? i.on("selectstart.drag", null)
        : ((e.style.MozUserSelect = e.__noselect), delete e.__noselect);
  }
  function mr(n) {
    return function () {
      return n;
    };
  }
  function br(n, t, e, i, r, o, a, s, l, u) {
    (this.target = n),
      (this.type = t),
      (this.subject = e),
      (this.identifier = i),
      (this.active = r),
      (this.x = o),
      (this.y = a),
      (this.dx = s),
      (this.dy = l),
      (this._ = u);
  }
  function yr() {
    return !ns.ctrlKey && !ns.button;
  }
  function vr() {
    return this.parentNode;
  }
  function wr(n) {
    return null == n ? { x: ns.x, y: ns.y } : n;
  }
  function xr() {
    return navigator.maxTouchPoints || "ontouchstart" in this;
  }
  function kr() {
    function n(n) {
      n.on("mousedown.drag", t)
        .filter(g)
        .on("touchstart.drag", r)
        .on("touchmove.drag", o)
        .on("touchend.drag touchcancel.drag", a)
        .style("touch-action", "none")
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }
    function t() {
      if (!d && h.apply(this, arguments)) {
        var n = s("mouse", p.apply(this, arguments), cr, this, arguments);
        n &&
          (sr(ns.view).on("mousemove.drag", e, !0).on("mouseup.drag", i, !0),
          fr(ns.view),
          hr(),
          (c = !1),
          (l = ns.clientX),
          (u = ns.clientY),
          n("start"));
      }
    }
    function e() {
      if ((pr(), !c)) {
        var n = ns.clientX - l,
          t = ns.clientY - u;
        c = n * n + t * t > v;
      }
      m.mouse("drag");
    }
    function i() {
      sr(ns.view).on("mousemove.drag mouseup.drag", null),
        gr(ns.view, c),
        pr(),
        m.mouse("end");
    }
    function r() {
      if (h.apply(this, arguments)) {
        var n,
          t,
          e = ns.changedTouches,
          i = p.apply(this, arguments),
          r = e.length;
        for (n = 0; n < r; ++n)
          (t = s(e[n].identifier, i, dr, this, arguments)) &&
            (hr(), t("start"));
      }
    }
    function o() {
      var n,
        t,
        e = ns.changedTouches,
        i = e.length;
      for (n = 0; n < i; ++n) (t = m[e[n].identifier]) && (pr(), t("drag"));
    }
    function a() {
      var n,
        t,
        e = ns.changedTouches,
        i = e.length;
      for (
        d && clearTimeout(d),
          d = setTimeout(function () {
            d = null;
          }, 500),
          n = 0;
        n < i;
        ++n
      )
        (t = m[e[n].identifier]) && (hr(), t("end"));
    }
    function s(t, e, i, r, o) {
      var a,
        s,
        l,
        u = i(e, t),
        c = b.copy();
      if (
        nr(new br(n, "beforestart", a, t, y, u[0], u[1], 0, 0, c), function () {
          return (
            null != (ns.subject = a = f.apply(r, o)) &&
            ((s = a.x - u[0] || 0), (l = a.y - u[1] || 0), !0)
          );
        })
      )
        return function d(h) {
          var p,
            f = u;
          switch (h) {
            case "start":
              (m[t] = d), (p = y++);
              break;
            case "end":
              delete m[t], --y;
            case "drag":
              (u = i(e, t)), (p = y);
          }
          nr(
            new br(
              n,
              h,
              a,
              t,
              p,
              u[0] + s,
              u[1] + l,
              u[0] - f[0],
              u[1] - f[1],
              c,
            ),
            c.apply,
            c,
            [h, r, o],
          );
        };
    }
    var l,
      u,
      c,
      d,
      h = yr,
      p = vr,
      f = wr,
      g = xr,
      m = {},
      b = ve("start", "drag", "end"),
      y = 0,
      v = 0;
    return (
      (n.filter = function (t) {
        return arguments.length
          ? ((h = "function" == typeof t ? t : mr(!!t)), n)
          : h;
      }),
      (n.container = function (t) {
        return arguments.length
          ? ((p = "function" == typeof t ? t : mr(t)), n)
          : p;
      }),
      (n.subject = function (t) {
        return arguments.length
          ? ((f = "function" == typeof t ? t : mr(t)), n)
          : f;
      }),
      (n.touchable = function (t) {
        return arguments.length
          ? ((g = "function" == typeof t ? t : mr(!!t)), n)
          : g;
      }),
      (n.on = function () {
        var t = b.on.apply(b, arguments);
        return t === b ? n : t;
      }),
      (n.clickDistance = function (t) {
        return arguments.length ? ((v = (t = +t) * t), n) : Math.sqrt(v);
      }),
      n
    );
  }
  // Copyright 2018 The Distill Template Authors
  function Sr(n) {
    let t = ls;
    "undefined" != typeof n.githubUrl &&
      ((t +=
        '\n    <h3 id="updates-and-corrections">Updates and Corrections</h3>\n    <p>'),
      n.githubCompareUpdatesUrl &&
        (t += `<a href="${n.githubCompareUpdatesUrl}">View all changes</a> to this article since it was first published.`),
      (t += `\n    If you see mistakes or want to suggest changes, please <a href="${n.githubUrl + "/issues/new"}">create an issue on GitHub</a>. </p>\n    `));
    const e = n.journal;
    return (
      void 0 !== e &&
        "Distill" === e.title &&
        (t += `\n    <h3 id="reuse">Reuse</h3>\n    <p>Diagrams and text are licensed under Creative Commons Attribution <a href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0</a> with the <a class="github" href="${n.githubUrl}">source available on GitHub</a>, unless noted otherwise. The figures that have been reused from other sources don\u2019t fall under this license and can be recognized by a note in their caption: \u201cFigure from \u2026\u201d.</p>\n    `),
      "undefined" != typeof n.publishedDate &&
        (t += `\n    <h3 id="citation">Citation</h3>\n    <p>For attribution in academic contexts, please cite this work as</p>\n    <pre class="citation short">${n.concatenatedAuthors}, "${n.title}", Distill, ${n.publishedYear}.</pre>\n    <p>BibTeX citation</p>\n    <pre class="citation long">${v(n)}</pre>\n    `),
      t
    );
  }
  const Mr = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    Tr = [
      "Jan.",
      "Feb.",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug.",
      "Sept.",
      "Oct.",
      "Nov.",
      "Dec.",
    ],
    _r = (n) => (n < 10 ? "0" + n : n),
    Cr = function (n) {
      return `${Mr[n.getDay()].substring(0, 3)}, ${_r(n.getDate())} ${Tr[n.getMonth()].substring(0, 3)} ${n.getFullYear().toString()} ${n.getUTCHours().toString()}:${n.getUTCMinutes().toString()}:${n.getUTCSeconds().toString()} Z`;
    },
    Ar = function (n) {
      return Array.from(n).reduce(
        (n, [t, e]) => Object.assign(n, { [t]: e }),
        {},
      );
    },
    Er = function (n) {
      const t = new Map();
      for (var e in n) n.hasOwnProperty(e) && t.set(e, n[e]);
      return t;
    };
  class Nr {
    constructor(n) {
      (this.name = n.author),
        (this.personalURL = n.authorURL),
        (this.affiliation = n.affiliation),
        (this.affiliationURL = n.affiliationURL),
        (this.affiliations = n.affiliations || []);
    }
    get firstName() {
      const n = this.name.split(" ");
      return n.slice(0, n.length - 1).join(" ");
    }
    get lastName() {
      const n = this.name.split(" ");
      return n[n.length - 1];
    }
  }
  class Lr {
    constructor() {
      (this.title = "unnamed article"),
        (this.description = ""),
        (this.authors = []),
        (this.bibliography = new Map()),
        (this.bibliographyParsed = !1),
        (this.citations = []),
        (this.citationsCollected = !1),
        (this.journal = {}),
        (this.katex = {}),
        (this.doi = undefined),
        (this.publishedDate = undefined);
    }
    set url(n) {
      this._url = n;
    }
    get url() {
      return this._url
        ? this._url
        : this.distillPath && this.journal.url
          ? this.journal.url + "/" + this.distillPath
          : this.journal.url
            ? this.journal.url
            : void 0;
    }
    get githubUrl() {
      return this.githubPath
        ? "https://github.com/" + this.githubPath
        : undefined;
    }
    set previewURL(n) {
      this._previewURL = n;
    }
    get previewURL() {
      return this._previewURL ? this._previewURL : this.url + "/thumbnail.jpg";
    }
    get publishedDateRFC() {
      return Cr(this.publishedDate);
    }
    get updatedDateRFC() {
      return Cr(this.updatedDate);
    }
    get publishedYear() {
      return this.publishedDate.getFullYear();
    }
    get publishedMonth() {
      return Tr[this.publishedDate.getMonth()];
    }
    get publishedDay() {
      return this.publishedDate.getDate();
    }
    get publishedMonthPadded() {
      return _r(this.publishedDate.getMonth() + 1);
    }
    get publishedDayPadded() {
      return _r(this.publishedDate.getDate());
    }
    get publishedISODateOnly() {
      return this.publishedDate.toISOString().split("T")[0];
    }
    get volume() {
      const n = this.publishedYear - 2015;
      if (n < 1)
        throw new Error(
          "Invalid publish date detected during computing volume",
        );
      return n;
    }
    get issue() {
      return this.publishedDate.getMonth() + 1;
    }
    get concatenatedAuthors() {
      return this.authors.length > 2
        ? this.authors[0].lastName + ", et al."
        : 2 === this.authors.length
          ? this.authors[0].lastName + " & " + this.authors[1].lastName
          : 1 === this.authors.length
            ? this.authors[0].lastName
            : void 0;
    }
    get bibtexAuthors() {
      return this.authors
        .map((n) => n.lastName + ", " + n.firstName)
        .join(" and ");
    }
    get slug() {
      let n = "";
      return (
        this.authors.length &&
          ((n += this.authors[0].lastName.toLowerCase()),
          (n += this.publishedYear),
          (n += this.title.split(" ")[0].toLowerCase())),
        n || "Untitled"
      );
    }
    get bibliographyEntries() {
      return new Map(
        this.citations.map((n) => {
          return [n, this.bibliography.get(n)];
        }),
      );
    }
    set bibliography(n) {
      n instanceof Map
        ? (this._bibliography = n)
        : "object" == typeof n && (this._bibliography = Er(n));
    }
    get bibliography() {
      return this._bibliography;
    }
    static fromObject(n) {
      const t = new Lr();
      return Object.assign(t, n), t;
    }
    assignToObject(n) {
      Object.assign(n, this),
        (n.bibliography = Ar(this.bibliographyEntries)),
        (n.url = this.url),
        (n.doi = this.doi),
        (n.githubUrl = this.githubUrl),
        (n.previewURL = this.previewURL),
        this.publishedDate &&
          ((n.volume = this.volume),
          (n.issue = this.issue),
          (n.publishedDateRFC = this.publishedDateRFC),
          (n.publishedYear = this.publishedYear),
          (n.publishedMonth = this.publishedMonth),
          (n.publishedDay = this.publishedDay),
          (n.publishedMonthPadded = this.publishedMonthPadded),
          (n.publishedDayPadded = this.publishedDayPadded)),
        this.updatedDate && (n.updatedDateRFC = this.updatedDateRFC),
        (n.concatenatedAuthors = this.concatenatedAuthors),
        (n.bibtexAuthors = this.bibtexAuthors),
        (n.slug = this.slug);
    }
  }
  // Copyright 2018 The Distill Template Authors
  const Dr = (n) =>
      class extends n {
        constructor() {
          super();
          const n = { childList: !0, characterData: !0, subtree: !0 },
            t = new MutationObserver(() => {
              t.disconnect(), this.renderIfPossible(), t.observe(this, n);
            });
          t.observe(this, n);
        }
        connectedCallback() {
          super.connectedCallback(), this.renderIfPossible();
        }
        renderIfPossible() {
          this.textContent && this.root && this.renderContent();
        }
        renderContent() {
          console.error(
            `Your class ${this.constructor.name} must provide a custom renderContent() method!`,
          );
        }
      },
    Or =
      (n, t, e = !0) =>
      (i) => {
        const r = document.createElement("template");
        return (
          (r.innerHTML = t),
          e && "ShadyCSS" in window && ShadyCSS.prepareTemplate(r, n),
          class extends i {
            static get is() {
              return n;
            }
            constructor() {
              super(),
                (this.clone = document.importNode(r.content, !0)),
                e &&
                  (this.attachShadow({ mode: "open" }),
                  this.shadowRoot.appendChild(this.clone));
            }
            connectedCallback() {
              this.hasAttribute("distill-prerendered") ||
                (e
                  ? "ShadyCSS" in window && ShadyCSS.styleElement(this)
                  : this.insertBefore(this.clone, this.firstChild));
            }
            get root() {
              return e ? this.shadowRoot : this;
            }
            $(n) {
              return this.root.querySelector(n);
            }
            $$(n) {
              return this.root.querySelectorAll(n);
            }
          }
        );
      };
  // Copyright 2018 The Distill Template Authors
  var Ir =
    '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nspan.katex-display {\n  text-align: left;\n  padding: 8px 0 8px 0;\n  margin: 0.5em 0 0.5em 1em;\n}\n\nspan.katex {\n  -webkit-font-smoothing: antialiased;\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 1.18em;\n}\n';
  // Copyright 2018 The Distill Template Authors
  const Fr = function (n, t, e) {
      let i = e,
        r = 0;
      const o = n.length;
      for (; i < t.length; ) {
        const e = t[i];
        if (r <= 0 && t.slice(i, i + o) === n) return i;
        "\\" === e ? i++ : "{" === e ? r++ : "}" === e && r--, i++;
      }
      return -1;
    },
    Rr = function (n, t, e, i) {
      const r = [];
      for (let o = 0; o < n.length; o++)
        if ("text" === n[o].type) {
          const a = n[o].data;
          let s,
            l = !0,
            u = 0;
          for (
            -1 !== (s = a.indexOf(t)) &&
            ((u = s), r.push({ type: "text", data: a.slice(0, u) }), (l = !1));
            ;

          ) {
            if (l) {
              if (-1 === (s = a.indexOf(t, u))) break;
              r.push({ type: "text", data: a.slice(u, s) }), (u = s);
            } else {
              if (-1 === (s = Fr(e, a, u + t.length))) break;
              r.push({
                type: "math",
                data: a.slice(u + t.length, s),
                rawData: a.slice(u, s + e.length),
                display: i,
              }),
                (u = s + e.length);
            }
            l = !l;
          }
          r.push({ type: "text", data: a.slice(u) });
        } else r.push(n[o]);
      return r;
    },
    Ur = function (n, t) {
      let e = [{ type: "text", data: n }];
      for (let n = 0; n < t.length; n++) {
        const i = t[n];
        e = Rr(e, i.left, i.right, i.display || !1);
      }
      return e;
    },
    $r = function (n, t) {
      const e = Ur(n, t.delimiters),
        i = document.createDocumentFragment();
      for (let n = 0; n < e.length; n++)
        if ("text" === e[n].type)
          i.appendChild(document.createTextNode(e[n].data));
        else {
          const o = document.createElement("d-math"),
            a = e[n].data;
          t.displayMode = e[n].display;
          try {
            (o.textContent = a), t.displayMode && o.setAttribute("block", "");
          } catch (r) {
            if (!(r instanceof katex.ParseError)) throw r;
            t.errorCallback(
              "KaTeX auto-render: Failed to parse `" + e[n].data + "` with ",
              r,
            ),
              i.appendChild(document.createTextNode(e[n].rawData));
            continue;
          }
          i.appendChild(o);
        }
      return i;
    },
    Pr = function (n, t) {
      for (let e = 0; e < n.childNodes.length; e++) {
        const i = n.childNodes[e];
        if (3 === i.nodeType) {
          const r = i.textContent;
          if (t.mightHaveMath(r)) {
            const o = $r(r, t);
            (e += o.childNodes.length - 1), n.replaceChild(o, i);
          }
        } else if (1 === i.nodeType) {
          -1 === t.ignoredTags.indexOf(i.nodeName.toLowerCase()) && Pr(i, t);
        }
      }
    },
    Hr = {
      delimiters: [
        { left: "$$", right: "$$", display: !0 },
        { left: "\\[", right: "\\]", display: !0 },
        { left: "\\(", right: "\\)", display: !1 },
      ],
      ignoredTags: [
        "script",
        "noscript",
        "style",
        "textarea",
        "pre",
        "code",
        "svg",
      ],
      errorCallback: function (n, t) {
        console.error(n, t);
      },
    },
    zr = function (n, t) {
      if (!n) throw new Error("No element provided to render");
      const e = Object.assign({}, Hr, t),
        i = e.delimiters.flatMap((n) => [n.left, n.right]),
        r = (n) => i.some((t) => -1 !== n.indexOf(t));
      (e.mightHaveMath = r), Pr(n, e);
    },
    qr = "https://distill.pub/third-party/katex/katex.min.js",
    jr =
      '<link rel="stylesheet" href="https://distill.pub/third-party/katex/katex.min.css" crossorigin="anonymous">',
    Br = Or(
      "d-math",
      `\n${jr}\n<style>\n\n:host {\n  display: inline-block;\n  contain: style;\n}\n\n:host([block]) {\n  display: block;\n}\n\n${Ir}\n</style>\n<span id='katex-container'></span>\n`,
    );
  class Yr extends Dr(Br(HTMLElement)) {
    static set katexOptions(n) {
      (Yr._katexOptions = n),
        Yr.katexOptions.delimiters &&
          (Yr.katexAdded ? Yr.katexLoadedCallback() : Yr.addKatex());
    }
    static get katexOptions() {
      return (
        Yr._katexOptions ||
          (Yr._katexOptions = {
            delimiters: [{ left: "$$", right: "$$", display: !1 }],
          }),
        Yr._katexOptions
      );
    }
    static katexLoadedCallback() {
      const n = document.querySelectorAll("d-math");
      for (const t of n) t.renderContent();
      Yr.katexOptions.delimiters && zr(document.body, Yr.katexOptions);
    }
    static addKatex() {
      document.head.insertAdjacentHTML("beforeend", jr);
      const n = document.createElement("script");
      (n.src = qr),
        (n.async = !0),
        (n.onload = Yr.katexLoadedCallback),
        (n.crossorigin = "anonymous"),
        document.head.appendChild(n),
        (Yr.katexAdded = !0);
    }
    get options() {
      const n = { displayMode: this.hasAttribute("block") };
      return Object.assign(n, Yr.katexOptions);
    }
    connectedCallback() {
      super.connectedCallback(), Yr.katexAdded || Yr.addKatex();
    }
    renderContent() {
      if ("undefined" != typeof katex) {
        const n = this.root.querySelector("#katex-container");
        katex.render(this.textContent, n, this.options);
      }
    }
  }
  (Yr.katexAdded = !1), (Yr.inlineMathRendered = !1), (window.DMath = Yr);
  class Wr extends HTMLElement {
    static get is() {
      return "d-front-matter";
    }
    constructor() {
      super();
      const n = { childList: !0, characterData: !0, subtree: !0 };
      new MutationObserver((n) => {
        for (const t of n)
          if ("SCRIPT" === t.target.nodeName || "characterData" === t.type) {
            const n = d(this);
            this.notify(n);
          }
      }).observe(this, n);
    }
    notify(n) {
      const t = new CustomEvent("onFrontMatterChanged", {
        detail: n,
        bubbles: !0,
      });
      document.dispatchEvent(t);
    }
  }
  const Gr = new Lr(),
    Vr = {
      frontMatter: Gr,
      waitingOn: { bibliography: [], citations: [] },
      listeners: {
        onCiteKeyCreated(n) {
          const [t, e] = n.detail;
          if (!Gr.citationsCollected)
            return void Vr.waitingOn.citations.push(() =>
              Vr.listeners.onCiteKeyCreated(n),
            );
          if (!Gr.bibliographyParsed)
            return void Vr.waitingOn.bibliography.push(() =>
              Vr.listeners.onCiteKeyCreated(n),
            );
          const i = e.map((n) => Gr.citations.indexOf(n));
          t.numbers = i;
          const r = e.map((n) => Gr.bibliography.get(n));
          t.entries = r;
        },
        onCiteKeyChanged() {
          (Gr.citations = t()), (Gr.citationsCollected = !0);
          for (const n of Vr.waitingOn.citations.slice()) n();
          const n = document.querySelector("d-citation-list"),
            e = new Map(Gr.citations.map((n) => [n, Gr.bibliography.get(n)]));
          n.citations = e;
          const i = document.querySelectorAll("d-cite");
          for (const n of i) {
            console.log(n);
            const t = n.keys,
              e = t.map((n) => Gr.citations.indexOf(n));
            n.numbers = e;
            const i = t.map((n) => Gr.bibliography.get(n));
            n.entries = i;
          }
        },
        onCiteKeyRemoved(n) {
          Vr.listeners.onCiteKeyChanged(n);
        },
        onBibliographyChanged(n) {
          const t = document.querySelector("d-citation-list"),
            e = n.detail;
          (Gr.bibliography = e), (Gr.bibliographyParsed = !0);
          for (const n of Vr.waitingOn.bibliography.slice()) n();
          if (Gr.citationsCollected)
            if (t.hasAttribute("distill-prerendered"))
              console.debug("Citation list was prerendered; not updating it.");
            else {
              const n = new Map(
                Gr.citations.map((n) => [n, Gr.bibliography.get(n)]),
              );
              t.citations = n;
            }
          else
            Vr.waitingOn.citations.push(function () {
              Vr.listeners.onBibliographyChanged({
                target: n.target,
                detail: n.detail,
              });
            });
        },
        onFootnoteChanged() {
          const n = document.querySelector("d-footnote-list");
          if (n) {
            const t = document.querySelectorAll("d-footnote");
            n.footnotes = t;
          }
        },
        onFrontMatterChanged(t) {
          const e = t.detail;
          n(Gr, e);
          const i = document.querySelector("d-interstitial");
          if (
            (i &&
              ("undefined" != typeof Gr.password
                ? (i.password = Gr.password)
                : i.parentElement.removeChild(i)),
            !document.body.hasAttribute("distill-prerendered") && u())
          ) {
            h(document, Gr);
            const n = document.querySelector("distill-appendix");
            n && (n.frontMatter = Gr);
            const t = document.querySelector("d-byline");
            t && (t.frontMatter = Gr), e.katex && (Yr.katexOptions = e.katex);
          }
        },
        DOMContentLoaded() {
          if (Vr.loaded)
            return void console.warn(
              "Controller received DOMContentLoaded but was already loaded!",
            );
          if (!u())
            return void console.warn(
              "Controller received DOMContentLoaded at document.readyState: " +
                document.readyState +
                "!",
            );
          (Vr.loaded = !0),
            console.debug("Runlevel 4: Controller running DOMContentLoaded");
          const n = document.querySelector("d-front-matter");
          if (n) {
            const t = d(n);
            Vr.listeners.onFrontMatterChanged({ detail: t });
          }
          (Gr.citations = t()), (Gr.citationsCollected = !0);
          for (const n of Vr.waitingOn.citations.slice()) n();
          if (Gr.bibliographyParsed)
            for (const n of Vr.waitingOn.bibliography.slice()) n();
          const e = document.querySelector("d-footnote-list");
          if (e) {
            const n = document.querySelectorAll("d-footnote");
            e.footnotes = n;
          }
        },
      },
    };
  // Copyright 2018 The Distill Template Authors
  const Kr =
      '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nhtml {\n  font-size: 14px;\n\tline-height: 1.6em;\n  /* font-family: "Libre Franklin", "Helvetica Neue", sans-serif; */\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif;\n  /*, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";*/\n  text-size-adjust: 100%;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%;\n}\n\n@media(min-width: 768px) {\n  html {\n    font-size: 16px;\n  }\n}\n\nbody {\n  margin: 0;\n}\n\na {\n  color: #004276;\n}\n\nfigure {\n  margin: 0;\n}\n\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}\n\ntable th {\n\ttext-align: left;\n}\n\ntable thead {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n\ntable thead th {\n  padding-bottom: 0.5em;\n}\n\ntable tbody :first-child td {\n  padding-top: 0.5em;\n}\n\npre {\n  overflow: auto;\n  max-width: 100%;\n}\n\np {\n  margin-top: 0;\n  margin-bottom: 1em;\n}\n\nsup, sub {\n  vertical-align: baseline;\n  position: relative;\n  top: -0.4em;\n  line-height: 1em;\n}\n\nsub {\n  top: 0.4em;\n}\n\n.kicker,\n.marker {\n  font-size: 15px;\n  font-weight: 600;\n  color: rgba(0, 0, 0, 0.5);\n}\n\n\n/* Headline */\n\n@media(min-width: 1024px) {\n  d-title h1 span {\n    display: block;\n  }\n}\n\n/* Figure */\n\nfigure {\n  position: relative;\n  margin-bottom: 2.5em;\n  margin-top: 1.5em;\n}\n\nfigcaption+figure {\n\n}\n\nfigure img {\n  width: 100%;\n}\n\nfigure svg text,\nfigure svg tspan {\n}\n\nfigcaption,\n.figcaption {\n  color: rgba(0, 0, 0, 0.6);\n  font-size: 12px;\n  line-height: 1.5em;\n}\n\n@media(min-width: 1024px) {\nfigcaption,\n.figcaption {\n    font-size: 13px;\n  }\n}\n\nfigure.external img {\n  background: white;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);\n  padding: 18px;\n  box-sizing: border-box;\n}\n\nfigcaption a {\n  color: rgba(0, 0, 0, 0.6);\n}\n\nfigcaption b,\nfigcaption strong, {\n  font-weight: 600;\n  color: rgba(0, 0, 0, 1.0);\n}\n' +
      '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n@supports not (display: grid) {\n  .base-grid,\n  distill-header,\n  d-title,\n  d-abstract,\n  d-article,\n  d-appendix,\n  distill-appendix,\n  d-byline,\n  d-footnote-list,\n  d-citation-list,\n  distill-footer {\n    display: block;\n    padding: 8px;\n  }\n}\n\n.base-grid,\ndistill-header,\nd-title,\nd-abstract,\nd-article,\nd-appendix,\ndistill-appendix,\nd-byline,\nd-footnote-list,\nd-citation-list,\ndistill-footer {\n  display: grid;\n  justify-items: stretch;\n  grid-template-columns: [screen-start] 8px [page-start kicker-start text-start gutter-start middle-start] 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr [text-end page-end gutter-end kicker-end middle-end] 8px [screen-end];\n  grid-column-gap: 8px;\n}\n\n.grid {\n  display: grid;\n  grid-column-gap: 8px;\n}\n\n@media(min-width: 768px) {\n  .base-grid,\n  distill-header,\n  d-title,\n  d-abstract,\n  d-article,\n  d-appendix,\n  distill-appendix,\n  d-byline,\n  d-footnote-list,\n  d-citation-list,\n  distill-footer {\n    grid-template-columns: [screen-start] 1fr [page-start kicker-start middle-start text-start] 45px 45px 45px 45px 45px 45px 45px 45px [ kicker-end text-end gutter-start] 45px [middle-end] 45px [page-end gutter-end] 1fr [screen-end];\n    grid-column-gap: 16px;\n  }\n\n  .grid {\n    grid-column-gap: 16px;\n  }\n}\n\n@media(min-width: 1000px) {\n  .base-grid,\n  distill-header,\n  d-title,\n  d-abstract,\n  d-article,\n  d-appendix,\n  distill-appendix,\n  d-byline,\n  d-footnote-list,\n  d-citation-list,\n  distill-footer {\n    grid-template-columns: [screen-start] 1fr [page-start kicker-start] 50px [middle-start] 50px [text-start kicker-end] 50px 50px 50px 50px 50px 50px 50px 50px [text-end gutter-start] 50px [middle-end] 50px [page-end gutter-end] 1fr [screen-end];\n    grid-column-gap: 16px;\n  }\n\n  .grid {\n    grid-column-gap: 16px;\n  }\n}\n\n@media(min-width: 1180px) {\n  .base-grid,\n  distill-header,\n  d-title,\n  d-abstract,\n  d-article,\n  d-appendix,\n  distill-appendix,\n  d-byline,\n  d-footnote-list,\n  d-citation-list,\n  distill-footer {\n    grid-template-columns: [screen-start] 1fr [page-start kicker-start] 60px [middle-start] 60px [text-start kicker-end] 60px 60px 60px 60px 60px 60px 60px 60px [text-end gutter-start] 60px [middle-end] 60px [page-end gutter-end] 1fr [screen-end];\n    grid-column-gap: 32px;\n  }\n\n  .grid {\n    grid-column-gap: 32px;\n  }\n}\n\n\n\n\n.base-grid {\n  grid-column: screen;\n}\n\n/* .l-body,\nd-article > *  {\n  grid-column: text;\n}\n\n.l-page,\nd-title > *,\nd-figure {\n  grid-column: page;\n} */\n\n.l-gutter {\n  grid-column: gutter;\n}\n\n.l-text,\n.l-body {\n  grid-column: text;\n}\n\n.l-page {\n  grid-column: page;\n}\n\n.l-body-outset {\n  grid-column: middle;\n}\n\n.l-page-outset {\n  grid-column: page;\n}\n\n.l-screen {\n  grid-column: screen;\n}\n\n.l-screen-inset {\n  grid-column: screen;\n  padding-left: 16px;\n  padding-left: 16px;\n}\n\n\n/* Aside */\n\nd-article aside {\n  grid-column: gutter;\n  font-size: 12px;\n  line-height: 1.6em;\n  color: rgba(0, 0, 0, 0.6)\n}\n\n@media(min-width: 768px) {\n  aside {\n    grid-column: gutter;\n  }\n\n  .side {\n    grid-column: gutter;\n  }\n}\n' +
      '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nd-title {\n  padding: 2rem 0 1.5rem;\n  contain: layout style;\n  overflow-x: hidden;\n}\n\n@media(min-width: 768px) {\n  d-title {\n    padding: 4rem 0 1.5rem;\n  }\n}\n\nd-title h1 {\n  grid-column: text;\n  font-size: 40px;\n  font-weight: 700;\n  line-height: 1.1em;\n  margin: 0 0 0.5rem;\n}\n\n@media(min-width: 768px) {\n  d-title h1 {\n    font-size: 50px;\n  }\n}\n\nd-title p {\n  font-weight: 300;\n  font-size: 1.2rem;\n  line-height: 1.55em;\n  grid-column: text;\n}\n\nd-title .status {\n  margin-top: 0px;\n  font-size: 12px;\n  color: #009688;\n  opacity: 0.8;\n  grid-column: kicker;\n}\n\nd-title .status span {\n  line-height: 1;\n  display: inline-block;\n  padding: 6px 0;\n  border-bottom: 1px solid #80cbc4;\n  font-size: 11px;\n  text-transform: uppercase;\n}\n' +
      '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nd-byline {\n  contain: style;\n  overflow: hidden;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  font-size: 0.8rem;\n  line-height: 1.8em;\n  padding: 1.5rem 0;\n  min-height: 1.8em;\n}\n\n\nd-byline .byline {\n  grid-template-columns: 1fr 1fr;\n  grid-column: text;\n}\n\n@media(min-width: 768px) {\n  d-byline .byline {\n    grid-template-columns: 1fr 1fr 1fr 1fr;\n  }\n}\n\nd-byline .authors-affiliations {\n  grid-column-end: span 2;\n  grid-template-columns: 1fr 1fr;\n  margin-bottom: 1em;\n}\n\n@media(min-width: 768px) {\n  d-byline .authors-affiliations {\n    margin-bottom: 0;\n  }\n}\n\nd-byline h3 {\n  font-size: 0.6rem;\n  font-weight: 400;\n  color: rgba(0, 0, 0, 0.5);\n  margin: 0;\n  text-transform: uppercase;\n}\n\nd-byline p {\n  margin: 0;\n}\n\nd-byline a,\nd-article d-byline a {\n  color: rgba(0, 0, 0, 0.8);\n  text-decoration: none;\n  border-bottom: none;\n}\n\nd-article d-byline a:hover {\n  text-decoration: underline;\n  border-bottom: none;\n}\n\nd-byline p.author {\n  font-weight: 500;\n}\n\nd-byline .affiliations {\n\n}\n' +
      '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nd-article {\n  contain: layout style;\n  overflow-x: hidden;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  padding-top: 2rem;\n  color: rgba(0, 0, 0, 0.8);\n}\n\nd-article > * {\n  grid-column: text;\n}\n\n@media(min-width: 768px) {\n  d-article {\n    font-size: 16px;\n  }\n}\n\n@media(min-width: 1024px) {\n  d-article {\n    font-size: 1.06rem;\n    line-height: 1.7em;\n  }\n}\n\n\n/* H2 */\n\n\nd-article .marker {\n  text-decoration: none;\n  border: none;\n  counter-reset: section;\n  grid-column: kicker;\n  line-height: 1.7em;\n}\n\nd-article .marker:hover {\n  border: none;\n}\n\nd-article .marker span {\n  padding: 0 3px 4px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.2);\n  position: relative;\n  top: 4px;\n}\n\nd-article .marker:hover span {\n  color: rgba(0, 0, 0, 0.7);\n  border-bottom: 1px solid rgba(0, 0, 0, 0.7);\n}\n\nd-article h2 {\n  font-weight: 600;\n  font-size: 24px;\n  line-height: 1.25em;\n  margin: 2rem 0 1.5rem 0;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n  padding-bottom: 1rem;\n}\n\n@media(min-width: 1024px) {\n  d-article h2 {\n    font-size: 36px;\n  }\n}\n\n/* H3 */\n\nd-article h3 {\n  font-weight: 700;\n  font-size: 18px;\n  line-height: 1.4em;\n  margin-bottom: 1em;\n  margin-top: 2em;\n}\n\n@media(min-width: 1024px) {\n  d-article h3 {\n    font-size: 20px;\n  }\n}\n\n/* H4 */\n\nd-article h4 {\n  font-weight: 600;\n  text-transform: uppercase;\n  font-size: 14px;\n  line-height: 1.4em;\n}\n\nd-article a {\n  color: inherit;\n}\n\nd-article p,\nd-article ul,\nd-article ol,\nd-article blockquote {\n  margin-top: 0;\n  margin-bottom: 1em;\n  margin-left: 0;\n  margin-right: 0;\n}\n\nd-article blockquote {\n  border-left: 2px solid rgba(0, 0, 0, 0.2);\n  padding-left: 2em;\n  font-style: italic;\n  color: rgba(0, 0, 0, 0.6);\n}\n\nd-article a {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.4);\n  text-decoration: none;\n}\n\nd-article a:hover {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.8);\n}\n\nd-article .link {\n  text-decoration: underline;\n  cursor: pointer;\n}\n\nd-article ul,\nd-article ol {\n  padding-left: 24px;\n}\n\nd-article li {\n  margin-bottom: 1em;\n  margin-left: 0;\n  padding-left: 0;\n}\n\nd-article li:last-child {\n  margin-bottom: 0;\n}\n\nd-article pre {\n  font-size: 14px;\n  margin-bottom: 20px;\n}\n\nd-article hr {\n  grid-column: screen;\n  width: 100%;\n  border: none;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n  margin-top: 60px;\n  margin-bottom: 60px;\n}\n\nd-article section {\n  margin-top: 60px;\n  margin-bottom: 60px;\n}\n\nd-article span.equation-mimic {\n  font-family: georgia;\n  font-size: 115%;\n  font-style: italic;\n}\n\nd-article > d-code,\nd-article section > d-code  {\n  display: block;\n}\n\nd-article > d-math[block],\nd-article section > d-math[block]  {\n  display: block;\n}\n\n@media (max-width: 768px) {\n  d-article > d-code,\n  d-article section > d-code,\n  d-article > d-math[block],\n  d-article section > d-math[block] {\n      overflow-x: scroll;\n      -ms-overflow-style: none;  // IE 10+\n      overflow: -moz-scrollbars-none;  // Firefox\n  }\n\n  d-article > d-code::-webkit-scrollbar,\n  d-article section > d-code::-webkit-scrollbar,\n  d-article > d-math[block]::-webkit-scrollbar,\n  d-article section > d-math[block]::-webkit-scrollbar {\n    display: none;  // Safari and Chrome\n  }\n}\n\nd-article .citation {\n  color: #668;\n  cursor: pointer;\n}\n\nd-include {\n  width: auto;\n  display: block;\n}\n\nd-figure {\n  contain: layout style;\n}\n\n/* KaTeX */\n\n.katex, .katex-prerendered {\n  contain: style;\n  display: inline-block;\n}\n\n/* Tables */\n\nd-article table {\n  border-collapse: collapse;\n  margin-bottom: 1.5rem;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.2);\n}\n\nd-article table th {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.2);\n}\n\nd-article table td {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n\nd-article table tr:last-of-type td {\n  border-bottom: none;\n}\n\nd-article table th,\nd-article table td {\n  font-size: 15px;\n  padding: 2px 8px;\n}\n\nd-article table tbody :first-child td {\n  padding-top: 2px;\n}\n' +
      Ir +
      '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n@media print {\n\n  @page {\n    size: 8in 11in;\n    @bottom-right {\n      content: counter(page) " of " counter(pages);\n    }\n  }\n\n  html {\n    /* no general margins -- CSS Grid takes care of those */\n  }\n\n  p, code {\n    page-break-inside: avoid;\n  }\n\n  h2, h3 {\n    page-break-after: avoid;\n  }\n\n  d-header {\n    visibility: hidden;\n  }\n\n  d-footer {\n    display: none!important;\n  }\n\n}\n',
    Xr = [
      {
        name: "WebComponents",
        support: function () {
          return (
            "customElements" in window &&
            "attachShadow" in Element.prototype &&
            "getRootNode" in Element.prototype &&
            "content" in document.createElement("template") &&
            "Promise" in window &&
            "from" in Array
          );
        },
        url: "https://distill.pub/third-party/polyfills/webcomponents-lite.js",
      },
      {
        name: "IntersectionObserver",
        support: function () {
          return (
            "IntersectionObserver" in window &&
            "IntersectionObserverEntry" in window
          );
        },
        url: "https://distill.pub/third-party/polyfills/intersection-observer.js",
      },
    ];
  class Zr {
    static browserSupportsAllFeatures() {
      return Xr.every((n) => n.support());
    }
    static load(n) {
      const t = function (t) {
        (t.loaded = !0),
          console.debug("Runlevel 0: Polyfill has finished loading: " + t.name),
          Zr.neededPolyfills.every((n) => n.loaded) &&
            (console.debug(
              "Runlevel 0: All required polyfills have finished loading.",
            ),
            console.debug("Runlevel 0->1."),
            (window.distillRunlevel = 1),
            n());
      };
      for (const n of Zr.neededPolyfills) f(n, t);
    }
    static get neededPolyfills() {
      return (
        Zr._neededPolyfills ||
          (Zr._neededPolyfills = Xr.filter((n) => !n.support())),
        Zr._neededPolyfills
      );
    }
  }
  const Qr = Or(
    "d-abstract",
    `\n<style>\n  :host {\n    font-size: 1.25rem;\n    line-height: 1.6em;\n    color: rgba(0, 0, 0, 0.7);\n    -webkit-font-smoothing: antialiased;\n  }\n\n  ::slotted(p) {\n    margin-top: 0;\n    margin-bottom: 1em;\n    grid-column: text-start / middle-end;\n  }\n  ${g("d-abstract")}\n</style>\n\n<slot></slot>\n`,
  );
  class Jr extends Qr(HTMLElement) {}
  // Copyright 2018 The Distill Template Authors
  const no = Or(
    "d-appendix",
    "\n<style>\n\nd-appendix {\n  contain: layout style;\n  font-size: 0.8em;\n  line-height: 1.7em;\n  margin-top: 60px;\n  margin-bottom: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  color: rgba(0,0,0,0.5);\n  padding-top: 60px;\n  padding-bottom: 48px;\n}\n\nd-appendix h3 {\n  grid-column: page-start / text-start;\n  font-size: 15px;\n  font-weight: 500;\n  margin-top: 1em;\n  margin-bottom: 0;\n  color: rgba(0,0,0,0.65);\n}\n\nd-appendix h3 + * {\n  margin-top: 1em;\n}\n\nd-appendix ol {\n  padding: 0 0 0 15px;\n}\n\n@media (min-width: 768px) {\n  d-appendix ol {\n    padding: 0 0 0 30px;\n    margin-left: -30px;\n  }\n}\n\nd-appendix li {\n  margin-bottom: 1em;\n}\n\nd-appendix a {\n  color: rgba(0, 0, 0, 0.6);\n}\n\nd-appendix > * {\n  grid-column: text;\n}\n\nd-appendix > d-footnote-list,\nd-appendix > d-citation-list,\nd-appendix > distill-appendix {\n  grid-column: screen;\n}\n\n</style>\n\n",
    !1,
  );
  class to extends no(HTMLElement) {}
  // Copyright 2018 The Distill Template Authors
  const eo = /^\s*$/;
  class io extends HTMLElement {
    static get is() {
      return "d-article";
    }
    constructor() {
      super(),
        new MutationObserver((n) => {
          for (const t of n)
            for (const n of t.addedNodes)
              switch (n.nodeName) {
                case "#text": {
                  const t = n.nodeValue;
                  if (!eo.test(t)) {
                    console.warn(
                      "Use of unwrapped text in distill articles is discouraged as it breaks layout! Please wrap any text in a <span> or <p> tag. We found the following text: " +
                        t,
                    );
                    const e = document.createElement("span");
                    (e.innerHTML = n.nodeValue),
                      n.parentNode.insertBefore(e, n),
                      n.parentNode.removeChild(n);
                  }
                }
              }
        }).observe(this, { childList: !0 });
    }
  }
  var ro =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof window
          ? window
          : "undefined" != typeof global
            ? global
            : "undefined" != typeof self
              ? self
              : {},
    oo = m(function (n, t) {
      !(function (n) {
        function t() {
          (this.months = [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec",
          ]),
            (this.notKey = [",", "{", "}", " ", "="]),
            (this.pos = 0),
            (this.input = ""),
            (this.entries = new Array()),
            (this.currentEntry = ""),
            (this.setInput = function (n) {
              this.input = n;
            }),
            (this.getEntries = function () {
              return this.entries;
            }),
            (this.isWhitespace = function (n) {
              return " " == n || "\r" == n || "\t" == n || "\n" == n;
            }),
            (this.match = function (n, t) {
              if (
                ((t != undefined && null != t) || (t = !0),
                this.skipWhitespace(t),
                this.input.substring(this.pos, this.pos + n.length) != n)
              )
                throw (
                  "Token mismatch, expected " +
                  n +
                  ", found " +
                  this.input.substring(this.pos)
                );
              (this.pos += n.length), this.skipWhitespace(t);
            }),
            (this.tryMatch = function (n, t) {
              return (
                (t != undefined && null != t) || (t = !0),
                this.skipWhitespace(t),
                this.input.substring(this.pos, this.pos + n.length) == n
              );
            }),
            (this.matchAt = function () {
              for (
                ;
                this.input.length > this.pos && "@" != this.input[this.pos];

              )
                this.pos++;
              return "@" == this.input[this.pos];
            }),
            (this.skipWhitespace = function (n) {
              for (; this.isWhitespace(this.input[this.pos]); ) this.pos++;
              if ("%" == this.input[this.pos] && 1 == n) {
                for (; "\n" != this.input[this.pos]; ) this.pos++;
                this.skipWhitespace(n);
              }
            }),
            (this.value_braces = function () {
              var n = 0;
              this.match("{", !1);
              for (var t = this.pos, e = !1; ; ) {
                if (!e)
                  if ("}" == this.input[this.pos]) {
                    if (!(n > 0)) {
                      var i = this.pos;
                      return this.match("}", !1), this.input.substring(t, i);
                    }
                    n--;
                  } else if ("{" == this.input[this.pos]) n++;
                  else if (this.pos >= this.input.length - 1)
                    throw "Unterminated value";
                (e = "\\" == this.input[this.pos] && 0 == e), this.pos++;
              }
            }),
            (this.value_comment = function () {
              for (var n = "", t = 0; !this.tryMatch("}", !1) || 0 != t; ) {
                if (
                  ((n += this.input[this.pos]),
                  "{" == this.input[this.pos] && t++,
                  "}" == this.input[this.pos] && t--,
                  this.pos >= this.input.length - 1)
                )
                  throw "Unterminated value:" + this.input.substring(start);
                this.pos++;
              }
              return n;
            }),
            (this.value_quotes = function () {
              this.match('"', !1);
              for (var n = this.pos, t = !1; ; ) {
                if (!t) {
                  if ('"' == this.input[this.pos]) {
                    var e = this.pos;
                    return this.match('"', !1), this.input.substring(n, e);
                  }
                  if (this.pos >= this.input.length - 1)
                    throw "Unterminated value:" + this.input.substring(n);
                }
                (t = "\\" == this.input[this.pos] && 0 == t), this.pos++;
              }
            }),
            (this.single_value = function () {
              var n = this.pos;
              if (this.tryMatch("{")) return this.value_braces();
              if (this.tryMatch('"')) return this.value_quotes();
              var t = this.key();
              if (t.match("^[0-9]+$")) return t;
              if (this.months.indexOf(t.toLowerCase()) >= 0)
                return t.toLowerCase();
              throw (
                "Value expected:" + this.input.substring(n) + " for key: " + t
              );
            }),
            (this.value = function () {
              var n = [];
              for (n.push(this.single_value()); this.tryMatch("#"); )
                this.match("#"), n.push(this.single_value());
              return n.join("");
            }),
            (this.key = function () {
              for (var n = this.pos; ; ) {
                if (this.pos >= this.input.length) throw "Runaway key";
                if (this.notKey.indexOf(this.input[this.pos]) >= 0)
                  return this.input.substring(n, this.pos);
                this.pos++;
              }
            }),
            (this.key_equals_value = function () {
              var n = this.key();
              if (this.tryMatch("=")) return this.match("="), [n, this.value()];
              throw (
                "... = value expected, equals sign missing:" +
                this.input.substring(this.pos)
              );
            }),
            (this.key_value_list = function () {
              var n = this.key_equals_value();
              for (
                this.currentEntry.entryTags = {},
                  this.currentEntry.entryTags[n[0]] = n[1];
                this.tryMatch(",") && (this.match(","), !this.tryMatch("}"));

              )
                (n = this.key_equals_value()),
                  (this.currentEntry.entryTags[n[0]] = n[1]);
            }),
            (this.entry_body = function (n) {
              (this.currentEntry = {}),
                (this.currentEntry.citationKey = this.key()),
                (this.currentEntry.entryType = n.substring(1)),
                this.match(","),
                this.key_value_list(),
                this.entries.push(this.currentEntry);
            }),
            (this.directive = function () {
              return this.match("@"), "@" + this.key();
            }),
            (this.preamble = function () {
              (this.currentEntry = {}),
                (this.currentEntry.entryType = "PREAMBLE"),
                (this.currentEntry.entry = this.value_comment()),
                this.entries.push(this.currentEntry);
            }),
            (this.comment = function () {
              (this.currentEntry = {}),
                (this.currentEntry.entryType = "COMMENT"),
                (this.currentEntry.entry = this.value_comment()),
                this.entries.push(this.currentEntry);
            }),
            (this.entry = function (n) {
              this.entry_body(n);
            }),
            (this.bibtex = function () {
              for (; this.matchAt(); ) {
                var n = this.directive();
                this.match("{"),
                  "@STRING" == n
                    ? this.string()
                    : "@PREAMBLE" == n
                      ? this.preamble()
                      : "@COMMENT" == n
                        ? this.comment()
                        : this.entry(n),
                  this.match("}");
              }
            });
        }
        (n.toJSON = function (n) {
          var e = new t();
          return e.setInput(n), e.bibtex(), e.entries;
        }),
          (n.toBibtex = function (n) {
            var t = "";
            for (var e in n) {
              if (
                ((t += "@" + n[e].entryType),
                (t += "{"),
                n[e].citationKey && (t += n[e].citationKey + ", "),
                n[e].entry && (t += n[e].entry),
                n[e].entryTags)
              ) {
                var i = "";
                for (var r in n[e].entryTags)
                  0 != i.length && (i += ", "),
                    (i += r + "= {" + n[e].entryTags[r] + "}");
                t += i;
              }
              t += "}\n\n";
            }
            return t;
          });
      })(t);
    });
  class ao extends HTMLElement {
    static get is() {
      return "d-bibliography";
    }
    constructor() {
      super();
      const n = { childList: !0, characterData: !0, subtree: !0 };
      new MutationObserver((n) => {
        for (const t of n)
          ("SCRIPT" !== t.target.nodeName && "characterData" !== t.type) ||
            this.parseIfPossible();
      }).observe(this, n);
    }
    connectedCallback() {
      requestAnimationFrame(() => {
        this.parseIfPossible();
      });
    }
    parseIfPossible() {
      const n = this.querySelector("script");
      if (n)
        if ("text/bibtex" == n.type) {
          const t = n.textContent;
          if (this.bibtex !== t) {
            this.bibtex = t;
            const n = y(this.bibtex);
            this.notify(n);
          }
        } else if ("text/json" == n.type) {
          const t = new Map(JSON.parse(n.textContent));
          this.notify(t);
        } else
          console.warn("Unsupported bibliography script tag type: " + n.type);
    }
    notify(n) {
      const t = new CustomEvent("onBibliographyChanged", {
        detail: n,
        bubbles: !0,
      });
      this.dispatchEvent(t);
    }
    static get observedAttributes() {
      return ["src"];
    }
    receivedBibtex(n) {
      const t = y(n.target.response);
      this.notify(t);
    }
    attributeChangedCallback(n, t, e) {
      var i = new XMLHttpRequest();
      (i.onload = (n) => this.receivedBibtex(n)),
        (i.onerror = () => console.warn(`Could not load Bibtex! (tried ${e})`)),
        (i.responseType = "text"),
        i.open("GET", e, !0),
        i.send();
    }
  }
  class so extends HTMLElement {
    static get is() {
      return "d-byline";
    }
    set frontMatter(n) {
      this.innerHTML = w(n);
    }
  }
  // Copyright 2018 The Distill Template Authors
  const lo = Or(
    "d-cite",
    '\n<style>\n\n:host {\n  display: inline-block;\n}\n\n.citation {\n  color: hsla(206, 90%, 20%, 0.7);\n}\n\n.citation-number {\n  cursor: default;\n  white-space: nowrap;\n  font-family: -apple-system, BlinkMacSystemFont, "Roboto", Helvetica, sans-serif;\n  font-size: 75%;\n  color: hsla(206, 90%, 20%, 0.7);\n  display: inline-block;\n  line-height: 1.1em;\n  text-align: center;\n  position: relative;\n  top: -2px;\n  margin: 0 2px;\n}\n\nfigcaption .citation-number {\n  font-size: 11px;\n  font-weight: normal;\n  top: -2px;\n  line-height: 1em;\n}\n\nul {\n  margin: 0;\n  padding: 0;\n  list-style-type: none;\n}\n\nul li {\n  padding: 15px 10px 15px 10px;\n  border-bottom: 1px solid rgba(0,0,0,0.1)\n}\n\nul li:last-of-type {\n  border-bottom: none;\n}\n\n</style>\n\n<d-hover-box id="hover-box"></d-hover-box>\n\n<div id="citation-" class="citation">\n  <span class="citation-number"></span>\n</div>\n',
  );
  class uo extends lo(HTMLElement) {
    constructor() {
      super(), (this._numbers = []), (this._entries = []);
    }
    connectedCallback() {
      (this.outerSpan = this.root.querySelector("#citation-")),
        (this.innerSpan = this.root.querySelector(".citation-number")),
        (this.hoverBox = this.root.querySelector("d-hover-box")),
        window.customElements.whenDefined("d-hover-box").then(() => {
          this.hoverBox.listen(this);
        }),
        this.numbers && this.displayNumbers(this.numbers),
        this.entries && this.displayEntries(this.entries);
    }
    static get observedAttributes() {
      return ["key", "bibtex-key"];
    }
    attributeChangedCallback(n, t, e) {
      const i = t ? "onCiteKeyChanged" : "onCiteKeyCreated",
        r = e.split(",").map((n) => n.trim()),
        o = new CustomEvent(i, { detail: [this, r], bubbles: !0 });
      document.dispatchEvent(o);
    }
    set key(n) {
      this.setAttribute("key", n);
    }
    get key() {
      return this.getAttribute("key") || this.getAttribute("bibtex-key");
    }
    get keys() {
      const n = this.key.split(",");
      return console.log(n), n;
    }
    set numbers(n) {
      (this._numbers = n), this.displayNumbers(n);
    }
    get numbers() {
      return this._numbers;
    }
    displayNumbers(n) {
      if (!this.innerSpan) return;
      const t =
        "[" + n.map((n) => (-1 == n ? "?" : n + 1 + "")).join(", ") + "]";
      this.innerSpan.textContent = t;
    }
    set entries(n) {
      (this._entries = n), this.displayEntries(n);
    }
    get entries() {
      return this._entries;
    }
    displayEntries(n) {
      this.hoverBox &&
        (this.hoverBox.innerHTML = `<ul>\n      ${n
          .map(l)
          .map((n) => `<li>${n}</li>`)
          .join("\n")}\n    </ul>`);
    }
  }
  // Copyright 2018 The Distill Template Authors
  const co =
    "\nd-citation-list {\n  contain: style;\n}\n\nd-citation-list .references {\n  grid-column: text;\n}\n\nd-citation-list .references .title {\n  font-weight: 500;\n}\n";
  class ho extends HTMLElement {
    static get is() {
      return "d-citation-list";
    }
    connectedCallback() {
      this.hasAttribute("distill-prerendered") || (this.style.display = "none");
    }
    set citations(n) {
      x(this, n);
    }
  }
  var po = m(function (n) {
    var t = (function (n) {
      function t(n, t, e, i, r) {
        (this.type = n),
          (this.content = t),
          (this.alias = e),
          (this.length = 0 | (i || "").length),
          (this.greedy = !!r);
      }
      function e(n, i, a, s, l, u, d) {
        for (var h in a)
          if (a.hasOwnProperty(h) && a[h]) {
            var p = a[h];
            p = Array.isArray(p) ? p : [p];
            for (var f = 0; f < p.length; ++f) {
              if (d && d == h + "," + f) return;
              var g = p[f],
                m = g.inside,
                b = !!g.lookbehind,
                y = !!g.greedy,
                v = 0,
                w = g.alias;
              if (y && !g.pattern.global) {
                var x = g.pattern.toString().match(/[imsuy]*$/)[0];
                g.pattern = RegExp(g.pattern.source, x + "g");
              }
              g = g.pattern || g;
              for (
                var k = s.next, S = l;
                k !== i.tail;
                S += k.value.length, k = k.next
              ) {
                var M = k.value;
                if (i.length > n.length) return;
                if (!(M instanceof t)) {
                  var T = 1;
                  if (y && k != i.tail.prev) {
                    if (((g.lastIndex = S), !(N = g.exec(n)))) break;
                    var _ = N.index + (b && N[1] ? N[1].length : 0),
                      C = N.index + N[0].length,
                      A = S;
                    for (A += k.value.length; _ >= A; )
                      A += (k = k.next).value.length;
                    if (((S = A -= k.value.length), k.value instanceof t))
                      continue;
                    for (
                      var E = k;
                      E !== i.tail &&
                      (A < C ||
                        ("string" == typeof E.value && !E.prev.value.greedy));
                      E = E.next
                    )
                      T++, (A += E.value.length);
                    T--, (M = n.slice(S, A)), (N.index -= S);
                  } else {
                    g.lastIndex = 0;
                    var N = g.exec(M);
                  }
                  if (N) {
                    b && (v = N[1] ? N[1].length : 0);
                    C = (_ = N.index + v) + (N = N[0].slice(v)).length;
                    var L = M.slice(0, _),
                      D = M.slice(C),
                      O = k.prev;
                    if (
                      (L && ((O = r(i, O, L)), (S += L.length)),
                      o(i, O, T),
                      (k = r(
                        i,
                        O,
                        new t(h, m ? c.tokenize(N, m) : N, w, N, y),
                      )),
                      D && r(i, k, D),
                      T > 1 && e(n, i, a, k.prev, S, !0, h + "," + f),
                      u)
                    )
                      break;
                  } else if (u) break;
                }
              }
            }
          }
      }
      function i() {
        var n = { value: null, prev: null, next: null },
          t = { value: null, prev: n, next: null };
        (n.next = t), (this.head = n), (this.tail = t), (this.length = 0);
      }
      function r(n, t, e) {
        var i = t.next,
          r = { value: e, prev: t, next: i };
        return (t.next = r), (i.prev = r), n.length++, r;
      }
      function o(n, t, e) {
        for (var i = t.next, r = 0; r < e && i !== n.tail; r++) i = i.next;
        (t.next = i), (i.prev = t), (n.length -= r);
      }
      function a(n) {
        for (var t = [], e = n.head.next; e !== n.tail; )
          t.push(e.value), (e = e.next);
        return t;
      }
      function s() {
        c.manual || c.highlightAll();
      }
      var l = /\blang(?:uage)?-([\w-]+)\b/i,
        u = 0,
        c = {
          manual: n.Prism && n.Prism.manual,
          disableWorkerMessageHandler:
            n.Prism && n.Prism.disableWorkerMessageHandler,
          util: {
            encode: function p(n) {
              return n instanceof t
                ? new t(n.type, p(n.content), n.alias)
                : Array.isArray(n)
                  ? n.map(p)
                  : n
                      .replace(/&/g, "&amp;")
                      .replace(/</g, "&lt;")
                      .replace(/\u00a0/g, " ");
            },
            type: function (n) {
              return Object.prototype.toString.call(n).slice(8, -1);
            },
            objId: function (n) {
              return (
                n.__id || Object.defineProperty(n, "__id", { value: ++u }),
                n.__id
              );
            },
            clone: function f(n, t) {
              var e,
                i,
                r = c.util.type(n);
              switch (((t = t || {}), r)) {
                case "Object":
                  if (((i = c.util.objId(n)), t[i])) return t[i];
                  for (var o in ((e = {}), (t[i] = e), n))
                    n.hasOwnProperty(o) && (e[o] = f(n[o], t));
                  return e;
                case "Array":
                  return (
                    (i = c.util.objId(n)),
                    t[i]
                      ? t[i]
                      : ((e = []),
                        (t[i] = e),
                        n.forEach(function (n, i) {
                          e[i] = f(n, t);
                        }),
                        e)
                  );
                default:
                  return n;
              }
            },
            getLanguage: function (n) {
              for (; n && !l.test(n.className); ) n = n.parentElement;
              return n
                ? (n.className.match(l) || [, "none"])[1].toLowerCase()
                : "none";
            },
            currentScript: function () {
              if ("undefined" == typeof document) return null;
              if ("currentScript" in document) return document.currentScript;
              try {
                throw new Error();
              } catch (i) {
                var n = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(i.stack) || [])[1];
                if (n) {
                  var t = document.getElementsByTagName("script");
                  for (var e in t) if (t[e].src == n) return t[e];
                }
                return null;
              }
            },
          },
          languages: {
            extend: function (n, t) {
              var e = c.util.clone(c.languages[n]);
              for (var i in t) e[i] = t[i];
              return e;
            },
            insertBefore: function (n, t, e, i) {
              var r = (i = i || c.languages)[n],
                o = {};
              for (var a in r)
                if (r.hasOwnProperty(a)) {
                  if (a == t)
                    for (var s in e) e.hasOwnProperty(s) && (o[s] = e[s]);
                  e.hasOwnProperty(a) || (o[a] = r[a]);
                }
              var l = i[n];
              return (
                (i[n] = o),
                c.languages.DFS(c.languages, function (t, e) {
                  e === l && t != n && (this[t] = o);
                }),
                o
              );
            },
            DFS: function g(n, t, e, i) {
              i = i || {};
              var r = c.util.objId;
              for (var o in n)
                if (n.hasOwnProperty(o)) {
                  t.call(n, o, n[o], e || o);
                  var a = n[o],
                    s = c.util.type(a);
                  "Object" !== s || i[r(a)]
                    ? "Array" !== s ||
                      i[r(a)] ||
                      ((i[r(a)] = !0), g(a, t, o, i))
                    : ((i[r(a)] = !0), g(a, t, null, i));
                }
            },
          },
          plugins: {},
          highlightAll: function (n, t) {
            c.highlightAllUnder(document, n, t);
          },
          highlightAllUnder: function (n, t, e) {
            var i = {
              callback: e,
              container: n,
              selector:
                'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
            };
            c.hooks.run("before-highlightall", i),
              (i.elements = Array.prototype.slice.apply(
                i.container.querySelectorAll(i.selector),
              )),
              c.hooks.run("before-all-elements-highlight", i);
            for (var r, o = 0; (r = i.elements[o++]); )
              c.highlightElement(r, !0 === t, i.callback);
          },
          highlightElement: function (t, e, i) {
            function r(n) {
              (u.highlightedCode = n),
                c.hooks.run("before-insert", u),
                (u.element.innerHTML = u.highlightedCode),
                c.hooks.run("after-highlight", u),
                c.hooks.run("complete", u),
                i && i.call(u.element);
            }
            var o = c.util.getLanguage(t),
              a = c.languages[o];
            t.className =
              t.className.replace(l, "").replace(/\s+/g, " ") +
              " language-" +
              o;
            var s = t.parentNode;
            s &&
              "pre" === s.nodeName.toLowerCase() &&
              (s.className =
                s.className.replace(l, "").replace(/\s+/g, " ") +
                " language-" +
                o);
            var u = {
              element: t,
              language: o,
              grammar: a,
              code: t.textContent,
            };
            if ((c.hooks.run("before-sanity-check", u), !u.code))
              return c.hooks.run("complete", u), void (i && i.call(u.element));
            if ((c.hooks.run("before-highlight", u), u.grammar))
              if (e && n.Worker) {
                var d = new Worker(c.filename);
                (d.onmessage = function (n) {
                  r(n.data);
                }),
                  d.postMessage(
                    JSON.stringify({
                      language: u.language,
                      code: u.code,
                      immediateClose: !0,
                    }),
                  );
              } else r(c.highlight(u.code, u.grammar, u.language));
            else r(c.util.encode(u.code));
          },
          highlight: function (n, e, i) {
            var r = { code: n, grammar: e, language: i };
            return (
              c.hooks.run("before-tokenize", r),
              (r.tokens = c.tokenize(r.code, r.grammar)),
              c.hooks.run("after-tokenize", r),
              t.stringify(c.util.encode(r.tokens), r.language)
            );
          },
          tokenize: function (n, t) {
            var o = t.rest;
            if (o) {
              for (var s in o) t[s] = o[s];
              delete t.rest;
            }
            var l = new i();
            return r(l, l.head, n), e(n, l, t, l.head, 0), a(l);
          },
          hooks: {
            all: {},
            add: function (n, t) {
              var e = c.hooks.all;
              (e[n] = e[n] || []), e[n].push(t);
            },
            run: function (n, t) {
              var e = c.hooks.all[n];
              if (e && e.length) for (var i, r = 0; (i = e[r++]); ) i(t);
            },
          },
          Token: t,
        };
      if (
        ((n.Prism = c),
        (t.stringify = function m(n, t) {
          if ("string" == typeof n) return n;
          if (Array.isArray(n)) {
            var e = "";
            return (
              n.forEach(function (n) {
                e += m(n, t);
              }),
              e
            );
          }
          var i = {
              type: n.type,
              content: m(n.content, t),
              tag: "span",
              classes: ["token", n.type],
              attributes: {},
              language: t,
            },
            r = n.alias;
          r &&
            (Array.isArray(r)
              ? Array.prototype.push.apply(i.classes, r)
              : i.classes.push(r)),
            c.hooks.run("wrap", i);
          var o = "";
          for (var a in i.attributes)
            o +=
              " " +
              a +
              '="' +
              (i.attributes[a] || "").replace(/"/g, "&quot;") +
              '"';
          return (
            "<" +
            i.tag +
            ' class="' +
            i.classes.join(" ") +
            '"' +
            o +
            ">" +
            i.content +
            "</" +
            i.tag +
            ">"
          );
        }),
        !n.document)
      )
        return n.addEventListener
          ? (c.disableWorkerMessageHandler ||
              n.addEventListener(
                "message",
                function (t) {
                  var e = JSON.parse(t.data),
                    i = e.language,
                    r = e.code,
                    o = e.immediateClose;
                  n.postMessage(c.highlight(r, c.languages[i], i)),
                    o && n.close();
                },
                !1,
              ),
            c)
          : c;
      var d = c.util.currentScript();
      if (
        (d &&
          ((c.filename = d.src),
          d.hasAttribute("data-manual") && (c.manual = !0)),
        !c.manual)
      ) {
        var h = document.readyState;
        "loading" === h || ("interactive" === h && d && d.defer)
          ? document.addEventListener("DOMContentLoaded", s)
          : window.requestAnimationFrame
            ? window.requestAnimationFrame(s)
            : window.setTimeout(s, 16);
      }
      return c;
    })(
      "undefined" != typeof window
        ? window
        : "undefined" != typeof WorkerGlobalScope &&
            self instanceof WorkerGlobalScope
          ? self
          : {},
    );
    n.exports && (n.exports = t),
      void 0 !== ro && (ro.Prism = t),
      (t.languages.markup = {
        comment: /<!--[\s\S]*?-->/,
        prolog: /<\?[\s\S]+?\?>/,
        doctype: {
          pattern:
            /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:(?!<!--)[^"'\]]|"[^"]*"|'[^']*'|<!--[\s\S]*?-->)*\]\s*)?>/i,
          greedy: !0,
        },
        cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
        tag: {
          pattern:
            /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
          greedy: !0,
          inside: {
            tag: {
              pattern: /^<\/?[^\s>\/]+/i,
              inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
            },
            "attr-value": {
              pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
              inside: {
                punctuation: [
                  /^=/,
                  { pattern: /^(\s*)["']|["']$/, lookbehind: !0 },
                ],
              },
            },
            punctuation: /\/?>/,
            "attr-name": {
              pattern: /[^\s>\/]+/,
              inside: { namespace: /^[^\s>\/:]+:/ },
            },
          },
        },
        entity: /&#?[\da-z]{1,8};/i,
      }),
      (t.languages.markup.tag.inside["attr-value"].inside.entity =
        t.languages.markup.entity),
      t.hooks.add("wrap", function (n) {
        "entity" === n.type &&
          (n.attributes.title = n.content.replace(/&amp;/, "&"));
      }),
      Object.defineProperty(t.languages.markup.tag, "addInlined", {
        value: function (n, e) {
          var i = {};
          (i["language-" + e] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: !0,
            inside: t.languages[e],
          }),
            (i.cdata = /^<!\[CDATA\[|\]\]>$/i);
          var r = {
            "included-cdata": {
              pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
              inside: i,
            },
          };
          r["language-" + e] = { pattern: /[\s\S]+/, inside: t.languages[e] };
          var o = {};
          (o[n] = {
            pattern: RegExp(
              /(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(
                /__/g,
                function () {
                  return n;
                },
              ),
              "i",
            ),
            lookbehind: !0,
            greedy: !0,
            inside: r,
          }),
            t.languages.insertBefore("markup", "cdata", o);
        },
      }),
      (t.languages.xml = t.languages.extend("markup", {})),
      (t.languages.html = t.languages.markup),
      (t.languages.mathml = t.languages.markup),
      (t.languages.svg = t.languages.markup),
      (function (n) {
        var t = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
        (n.languages.css = {
          comment: /\/\*[\s\S]*?\*\//,
          atrule: {
            pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
            inside: {
              rule: /^@[\w-]+/,
              "selector-function-argument": {
                pattern:
                  /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
                lookbehind: !0,
                alias: "selector",
              },
            },
          },
          url: {
            pattern: RegExp("url\\((?:" + t.source + "|[^\n\r()]*)\\)", "i"),
            greedy: !0,
            inside: { function: /^url/i, punctuation: /^\(|\)$/ },
          },
          selector: RegExp(
            "[^{}\\s](?:[^{};\"']|" + t.source + ")*?(?=\\s*\\{)",
          ),
          string: { pattern: t, greedy: !0 },
          property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
          important: /!important\b/i,
          function: /[-a-z0-9]+(?=\()/i,
          punctuation: /[(){};:,]/,
        }),
          (n.languages.css.atrule.inside.rest = n.languages.css);
        var e = n.languages.markup;
        e &&
          (e.tag.addInlined("style", "css"),
          n.languages.insertBefore(
            "inside",
            "attr-value",
            {
              "style-attr": {
                pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
                inside: {
                  "attr-name": { pattern: /^\s*style/i, inside: e.tag.inside },
                  punctuation: /^\s*=\s*['"]|['"]\s*$/,
                  "attr-value": { pattern: /.+/i, inside: n.languages.css },
                },
                alias: "language-css",
              },
            },
            e.tag,
          ));
      })(t),
      (t.languages.clike = {
        comment: [
          { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0 },
          { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
        ],
        string: {
          pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
          greedy: !0,
        },
        "class-name": {
          pattern:
            /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
          lookbehind: !0,
          inside: { punctuation: /[.\\]/ },
        },
        keyword:
          /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
        boolean: /\b(?:true|false)\b/,
        function: /\w+(?=\()/,
        number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
        operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
        punctuation: /[{}[\];(),.:]/,
      }),
      (t.languages.javascript = t.languages.extend("clike", {
        "class-name": [
          t.languages.clike["class-name"],
          {
            pattern:
              /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
            lookbehind: !0,
          },
        ],
        keyword: [
          { pattern: /((?:^|})\s*)(?:catch|finally)\b/, lookbehind: !0 },
          {
            pattern:
              /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
            lookbehind: !0,
          },
        ],
        number:
          /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
        function:
          /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
        operator:
          /--|\+\+|\*\*=?|=>|&&|\|\||[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?[.?]?|[~:]/,
      })),
      (t.languages.javascript["class-name"][0].pattern =
        /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/),
      t.languages.insertBefore("javascript", "keyword", {
        regex: {
          pattern:
            /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*[\s\S]*?\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
          lookbehind: !0,
          greedy: !0,
        },
        "function-variable": {
          pattern:
            /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
          alias: "function",
        },
        parameter: [
          {
            pattern:
              /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
            lookbehind: !0,
            inside: t.languages.javascript,
          },
          {
            pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
            inside: t.languages.javascript,
          },
          {
            pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
            lookbehind: !0,
            inside: t.languages.javascript,
          },
          {
            pattern:
              /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
            lookbehind: !0,
            inside: t.languages.javascript,
          },
        ],
        constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
      }),
      t.languages.insertBefore("javascript", "string", {
        "template-string": {
          pattern:
            /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
          greedy: !0,
          inside: {
            "template-punctuation": { pattern: /^`|`$/, alias: "string" },
            interpolation: {
              pattern:
                /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
              lookbehind: !0,
              inside: {
                "interpolation-punctuation": {
                  pattern: /^\${|}$/,
                  alias: "punctuation",
                },
                rest: t.languages.javascript,
              },
            },
            string: /[\s\S]+/,
          },
        },
      }),
      t.languages.markup &&
        t.languages.markup.tag.addInlined("script", "javascript"),
      (t.languages.js = t.languages.javascript),
      "undefined" != typeof self &&
        self.Prism &&
        self.document &&
        document.querySelector &&
        ((self.Prism.fileHighlight = function (n) {
          n = n || document;
          var e = {
            js: "javascript",
            py: "python",
            rb: "ruby",
            ps1: "powershell",
            psm1: "powershell",
            sh: "bash",
            bat: "batch",
            h: "c",
            tex: "latex",
          };
          Array.prototype.slice
            .call(n.querySelectorAll("pre[data-src]"))
            .forEach(function (n) {
              if (!n.hasAttribute("data-src-loaded")) {
                for (
                  var i,
                    r = n.getAttribute("data-src"),
                    o = n,
                    a = /\blang(?:uage)?-([\w-]+)\b/i;
                  o && !a.test(o.className);

                )
                  o = o.parentNode;
                if ((o && (i = (n.className.match(a) || [, ""])[1]), !i)) {
                  var s = (r.match(/\.(\w+)$/) || [, ""])[1];
                  i = e[s] || s;
                }
                var l = document.createElement("code");
                (l.className = "language-" + i),
                  (n.textContent = ""),
                  (l.textContent = "Loading\u2026"),
                  n.appendChild(l);
                var u = new XMLHttpRequest();
                u.open("GET", r, !0),
                  (u.onreadystatechange = function () {
                    4 == u.readyState &&
                      (u.status < 400 && u.responseText
                        ? ((l.textContent = u.responseText),
                          t.highlightElement(l),
                          n.setAttribute("data-src-loaded", ""))
                        : u.status >= 400
                          ? (l.textContent =
                              "\u2716 Error " +
                              u.status +
                              " while fetching file: " +
                              u.statusText)
                          : (l.textContent =
                              "\u2716 Error: File does not exist or is empty"));
                  }),
                  u.send(null);
              }
            });
        }),
        document.addEventListener("DOMContentLoaded", function () {
          self.Prism.fileHighlight();
        }));
  });
  (Prism.languages.python = {
    comment: { pattern: /(^|[^\\])#.*/, lookbehind: !0 },
    "string-interpolation": {
      pattern:
        /(?:f|rf|fr)(?:("""|''')[\s\S]+?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
      greedy: !0,
      inside: {
        interpolation: {
          pattern:
            /((?:^|[^{])(?:{{)*){(?!{)(?:[^{}]|{(?!{)(?:[^{}]|{(?!{)(?:[^{}])+})+})+}/,
          lookbehind: !0,
          inside: {
            "format-spec": { pattern: /(:)[^:(){}]+(?=}$)/, lookbehind: !0 },
            "conversion-option": {
              pattern: /![sra](?=[:}]$)/,
              alias: "punctuation",
            },
            rest: null,
          },
        },
        string: /[\s\S]+/,
      },
    },
    "triple-quoted-string": {
      pattern: /(?:[rub]|rb|br)?("""|''')[\s\S]+?\1/i,
      greedy: !0,
      alias: "string",
    },
    string: {
      pattern: /(?:[rub]|rb|br)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
      greedy: !0,
    },
    function: {
      pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
      lookbehind: !0,
    },
    "class-name": { pattern: /(\bclass\s+)\w+/i, lookbehind: !0 },
    decorator: {
      pattern: /(^\s*)@\w+(?:\.\w+)*/im,
      lookbehind: !0,
      alias: ["annotation", "punctuation"],
      inside: { punctuation: /\./ },
    },
    keyword:
      /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
    builtin:
      /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
    boolean: /\b(?:True|False|None)\b/,
    number:
      /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
    operator: /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
    punctuation: /[{}[\];(),.:]/,
  }),
    (Prism.languages.python[
      "string-interpolation"
    ].inside.interpolation.inside.rest = Prism.languages.python),
    (Prism.languages.py = Prism.languages.python),
    (Prism.languages.clike = {
      comment: [
        { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0 },
        { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
      ],
      string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0,
      },
      "class-name": {
        pattern:
          /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: !0,
        inside: { punctuation: /[.\\]/ },
      },
      keyword:
        /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
      boolean: /\b(?:true|false)\b/,
      function: /\w+(?=\()/,
      number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
      operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
      punctuation: /[{}[\];(),.:]/,
    }),
    (Prism.languages.lua = {
      comment: /^#!.+|--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/m,
      string: {
        pattern:
          /(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[\s\S]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,
        greedy: !0,
      },
      number:
        /\b0x[a-f\d]+\.?[a-f\d]*(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|\.?\d*(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,
      keyword:
        /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,
      function: /(?!\d)\w+(?=\s*(?:[({]))/,
      operator: [
        /[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/,
        { pattern: /(^|[^.])\.\.(?!\.)/, lookbehind: !0 },
      ],
      punctuation: /[\[\](){},;]|\.+|:+/,
    }),
    (function (n) {
      var t =
          "\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b",
        e = {
          environment: { pattern: RegExp("\\$" + t), alias: "constant" },
          variable: [
            {
              pattern: /\$?\(\([\s\S]+?\)\)/,
              greedy: !0,
              inside: {
                variable: [
                  { pattern: /(^\$\(\([\s\S]+)\)\)/, lookbehind: !0 },
                  /^\$\(\(/,
                ],
                number:
                  /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,
                operator:
                  /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
                punctuation: /\(\(?|\)\)?|,|;/,
              },
            },
            {
              pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
              greedy: !0,
              inside: { variable: /^\$\(|^`|\)$|`$/ },
            },
            {
              pattern: /\$\{[^}]+\}/,
              greedy: !0,
              inside: {
                operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
                punctuation: /[\[\]]/,
                environment: {
                  pattern: RegExp("(\\{)" + t),
                  lookbehind: !0,
                  alias: "constant",
                },
              },
            },
            /\$(?:\w+|[#?*!@$])/,
          ],
          entity:
            /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|x[0-9a-fA-F]{1,2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})/,
        };
      n.languages.bash = {
        shebang: { pattern: /^#!\s*\/.*/, alias: "important" },
        comment: { pattern: /(^|[^"{\\$])#.*/, lookbehind: !0 },
        "function-name": [
          {
            pattern: /(\bfunction\s+)\w+(?=(?:\s*\(?:\s*\))?\s*\{)/,
            lookbehind: !0,
            alias: "function",
          },
          { pattern: /\b\w+(?=\s*\(\s*\)\s*\{)/, alias: "function" },
        ],
        "for-or-select": {
          pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
          alias: "variable",
          lookbehind: !0,
        },
        "assign-left": {
          pattern: /(^|[\s;|&]|[<>]\()\w+(?=\+?=)/,
          inside: {
            environment: {
              pattern: RegExp("(^|[\\s;|&]|[<>]\\()" + t),
              lookbehind: !0,
              alias: "constant",
            },
          },
          alias: "variable",
          lookbehind: !0,
        },
        string: [
          {
            pattern:
              /((?:^|[^<])<<-?\s*)(\w+?)\s*(?:\r?\n|\r)[\s\S]*?(?:\r?\n|\r)\2/,
            lookbehind: !0,
            greedy: !0,
            inside: e,
          },
          {
            pattern:
              /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s*(?:\r?\n|\r)[\s\S]*?(?:\r?\n|\r)\3/,
            lookbehind: !0,
            greedy: !0,
          },
          {
            pattern:
              /(^|[^\\](?:\\\\)*)(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\2)[^\\])*\2/,
            lookbehind: !0,
            greedy: !0,
            inside: e,
          },
        ],
        environment: { pattern: RegExp("\\$?" + t), alias: "constant" },
        variable: e.variable,
        function: {
          pattern:
            /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|aptitude|apt-cache|apt-get|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
          lookbehind: !0,
        },
        keyword: {
          pattern:
            /(^|[\s;|&]|[<>]\()(?:if|then|else|elif|fi|for|while|in|case|esac|function|select|do|done|until)(?=$|[)\s;|&])/,
          lookbehind: !0,
        },
        builtin: {
          pattern:
            /(^|[\s;|&]|[<>]\()(?:\.|:|break|cd|continue|eval|exec|exit|export|getopts|hash|pwd|readonly|return|shift|test|times|trap|umask|unset|alias|bind|builtin|caller|command|declare|echo|enable|help|let|local|logout|mapfile|printf|read|readarray|source|type|typeset|ulimit|unalias|set|shopt)(?=$|[)\s;|&])/,
          lookbehind: !0,
          alias: "class-name",
        },
        boolean: {
          pattern: /(^|[\s;|&]|[<>]\()(?:true|false)(?=$|[)\s;|&])/,
          lookbehind: !0,
        },
        "file-descriptor": { pattern: /\B&\d\b/, alias: "important" },
        operator: {
          pattern:
            /\d?<>|>\||\+=|==?|!=?|=~|<<[<-]?|[&\d]?>>|\d?[<>]&?|&[>&]?|\|[&|]?|<=?|>=?/,
          inside: { "file-descriptor": { pattern: /^\d/, alias: "important" } },
        },
        punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
        number: {
          pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
          lookbehind: !0,
        },
      };
      for (
        var i = [
            "comment",
            "function-name",
            "for-or-select",
            "assign-left",
            "string",
            "environment",
            "function",
            "keyword",
            "builtin",
            "boolean",
            "file-descriptor",
            "operator",
            "punctuation",
            "number",
          ],
          r = e.variable[1].inside,
          o = 0;
        o < i.length;
        o++
      )
        r[i[o]] = n.languages.bash[i[o]];
      n.languages.shell = n.languages.bash;
    })(Prism),
    (Prism.languages.go = Prism.languages.extend("clike", {
      keyword:
        /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
      builtin:
        /\b(?:bool|byte|complex(?:64|128)|error|float(?:32|64)|rune|string|u?int(?:8|16|32|64)?|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print(?:ln)?|real|recover)\b/,
      boolean: /\b(?:_|iota|nil|true|false)\b/,
      operator:
        /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
      number: /(?:\b0x[a-f\d]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e[-+]?\d+)?)i?/i,
      string: { pattern: /(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/, greedy: !0 },
    })),
    delete Prism.languages.go["class-name"],
    (function (n) {
      function t(n, t) {
        return (
          (n = n.replace(/<inner>/g, function () {
            return e;
          })),
          t && (n = n + "|" + n.replace(/_/g, "\\*")),
          RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + "(?:" + n + ")")
        );
      }
      var e = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?!\n|\r\n?))/.source,
        i = /(?:\\.|``.+?``|`[^`\r\n]+`|[^\\|\r\n`])+/.source,
        r = /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|$)/.source.replace(
          /__/g,
          function () {
            return i;
          },
        ),
        o =
          /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/
            .source;
      (n.languages.markdown = n.languages.extend("markup", {})),
        n.languages.insertBefore("markdown", "prolog", {
          blockquote: { pattern: /^>(?:[\t ]*>)*/m, alias: "punctuation" },
          table: {
            pattern: RegExp("^" + r + o + "(?:" + r + ")*", "m"),
            inside: {
              "table-data-rows": {
                pattern: RegExp("^(" + r + o + ")(?:" + r + ")*$"),
                lookbehind: !0,
                inside: {
                  "table-data": {
                    pattern: RegExp(i),
                    inside: n.languages.markdown,
                  },
                  punctuation: /\|/,
                },
              },
              "table-line": {
                pattern: RegExp("^(" + r + ")" + o + "$"),
                lookbehind: !0,
                inside: { punctuation: /\||:?-{3,}:?/ },
              },
              "table-header-row": {
                pattern: RegExp("^" + r + "$"),
                inside: {
                  "table-header": {
                    pattern: RegExp(i),
                    alias: "important",
                    inside: n.languages.markdown,
                  },
                  punctuation: /\|/,
                },
              },
            },
          },
          code: [
            {
              pattern:
                /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
              lookbehind: !0,
              alias: "keyword",
            },
            { pattern: /``.+?``|`[^`\r\n]+`/, alias: "keyword" },
            {
              pattern: /^```[\s\S]*?^```$/m,
              greedy: !0,
              inside: {
                "code-block": {
                  pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
                  lookbehind: !0,
                },
                "code-language": { pattern: /^(```).+/, lookbehind: !0 },
                punctuation: /```/,
              },
            },
          ],
          title: [
            {
              pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
              alias: "important",
              inside: { punctuation: /==+$|--+$/ },
            },
            {
              pattern: /(^\s*)#+.+/m,
              lookbehind: !0,
              alias: "important",
              inside: { punctuation: /^#+|#+$/ },
            },
          ],
          hr: {
            pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
            lookbehind: !0,
            alias: "punctuation",
          },
          list: {
            pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
            lookbehind: !0,
            alias: "punctuation",
          },
          "url-reference": {
            pattern:
              /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
            inside: {
              variable: { pattern: /^(!?\[)[^\]]+/, lookbehind: !0 },
              string:
                /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
              punctuation: /^[\[\]!:]|[<>]/,
            },
            alias: "url",
          },
          bold: {
            pattern: t(/__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__/.source, !0),
            lookbehind: !0,
            greedy: !0,
            inside: {
              content: {
                pattern: /(^..)[\s\S]+(?=..$)/,
                lookbehind: !0,
                inside: {},
              },
              punctuation: /\*\*|__/,
            },
          },
          italic: {
            pattern: t(/_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_/.source, !0),
            lookbehind: !0,
            greedy: !0,
            inside: {
              content: {
                pattern: /(^.)[\s\S]+(?=.$)/,
                lookbehind: !0,
                inside: {},
              },
              punctuation: /[*_]/,
            },
          },
          strike: {
            pattern: t(/(~~?)(?:(?!~)<inner>)+?\2/.source, !1),
            lookbehind: !0,
            greedy: !0,
            inside: {
              content: {
                pattern: /(^~~?)[\s\S]+(?=\1$)/,
                lookbehind: !0,
                inside: {},
              },
              punctuation: /~~?/,
            },
          },
          url: {
            pattern: t(
              /!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[(?:(?!\])<inner>)+\])/
                .source,
              !1,
            ),
            lookbehind: !0,
            greedy: !0,
            inside: {
              variable: { pattern: /(\[)[^\]]+(?=\]$)/, lookbehind: !0 },
              content: {
                pattern: /(^!?\[)[^\]]+(?=\])/,
                lookbehind: !0,
                inside: {},
              },
              string: { pattern: /"(?:\\.|[^"\\])*"(?=\)$)/ },
            },
          },
        }),
        ["url", "bold", "italic", "strike"].forEach(function (t) {
          ["url", "bold", "italic", "strike"].forEach(function (e) {
            t !== e &&
              (n.languages.markdown[t].inside.content.inside[e] =
                n.languages.markdown[e]);
          });
        }),
        n.hooks.add("after-tokenize", function (n) {
          function t(n) {
            if (n && "string" != typeof n)
              for (var e = 0, i = n.length; e < i; e++) {
                var r = n[e];
                if ("code" === r.type) {
                  var o = r.content[1],
                    a = r.content[3];
                  if (
                    o &&
                    a &&
                    "code-language" === o.type &&
                    "code-block" === a.type &&
                    "string" == typeof o.content
                  ) {
                    var s = o.content
                        .replace(/\b#/g, "sharp")
                        .replace(/\b\+\+/g, "pp"),
                      l =
                        "language-" +
                        (s = (/[a-z][\w-]*/i.exec(s) || [""])[0].toLowerCase());
                    a.alias
                      ? "string" == typeof a.alias
                        ? (a.alias = [a.alias, l])
                        : a.alias.push(l)
                      : (a.alias = [l]);
                  }
                } else t(r.content);
              }
          }
          ("markdown" !== n.language && "md" !== n.language) || t(n.tokens);
        }),
        n.hooks.add("wrap", function (t) {
          if ("code-block" === t.type) {
            for (var e = "", i = 0, r = t.classes.length; i < r; i++) {
              var o = t.classes[i],
                a = /language-(.+)/.exec(o);
              if (a) {
                e = a[1];
                break;
              }
            }
            var s = n.languages[e];
            if (s) {
              var l = t.content.replace(/&lt;/g, "<").replace(/&amp;/g, "&");
              t.content = n.highlight(l, s, e);
            } else if (e && "none" !== e && n.plugins.autoloader) {
              var u =
                "md-" +
                new Date().valueOf() +
                "-" +
                Math.floor(1e16 * Math.random());
              (t.attributes.id = u),
                n.plugins.autoloader.loadLanguages(e, function () {
                  var t = document.getElementById(u);
                  t &&
                    (t.innerHTML = n.highlight(
                      t.textContent,
                      n.languages[e],
                      e,
                    ));
                });
            }
          }
        }),
        (n.languages.md = n.languages.markdown);
    })(Prism),
    (Prism.languages.julia = {
      comment: { pattern: /(^|[^\\])#.*/, lookbehind: !0 },
      string: /("""|''')[\s\S]+?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2/,
      keyword:
        /\b(?:abstract|baremodule|begin|bitstype|break|catch|ccall|const|continue|do|else|elseif|end|export|finally|for|function|global|if|immutable|import|importall|in|let|local|macro|module|print|println|quote|return|struct|try|type|typealias|using|while)\b/,
      boolean: /\b(?:true|false)\b/,
      number:
        /(?:\b(?=\d)|\B(?=\.))(?:0[box])?(?:[\da-f]+\.?\d*|\.\d+)(?:[efp][+-]?\d+)?j?/i,
      operator:
        /[-+*^%\xf7&$\\]=?|\/[\/=]?|!=?=?|\|[=>]?|<(?:<=?|[=:])?|>(?:=|>>?=?)?|==?=?|[~\u2260\u2264\u2265]/,
      punctuation: /[{}[\];(),.:]/,
      constant: /\b(?:(?:NaN|Inf)(?:16|32|64)?)\b/,
    });
  // Copyright 2018 The Distill Template Authors
  const fo = Or(
    "d-code",
    `\n<style>\n\ncode {\n  white-space: nowrap;\n  background: rgba(0, 0, 0, 0.04);\n  border-radius: 2px;\n  padding: 4px 7px;\n  font-size: 15px;\n  color: rgba(0, 0, 0, 0.6);\n}\n\npre code {\n  display: block;\n  border-left: 2px solid rgba(0, 0, 0, .1);\n  padding: 0 0 0 36px;\n}\n\n${'/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\ncode[class*="language-"],\npre[class*="language-"] {\n\tcolor: black;\n\tbackground: none;\n\ttext-shadow: 0 1px white;\n\tfont-family: Consolas, Monaco, \'Andale Mono\', \'Ubuntu Mono\', monospace;\n\tfont-size: 1em;\n\ttext-align: left;\n\twhite-space: pre;\n\tword-spacing: normal;\n\tword-break: normal;\n\tword-wrap: normal;\n\tline-height: 1.5;\n\n\t-moz-tab-size: 4;\n\t-o-tab-size: 4;\n\ttab-size: 4;\n\n\t-webkit-hyphens: none;\n\t-moz-hyphens: none;\n\t-ms-hyphens: none;\n\thyphens: none;\n}\n\npre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection,\ncode[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\npre[class*="language-"]::selection, pre[class*="language-"] ::selection,\ncode[class*="language-"]::selection, code[class*="language-"] ::selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\n@media print {\n\tcode[class*="language-"],\n\tpre[class*="language-"] {\n\t\ttext-shadow: none;\n\t}\n}\n\n/* Code blocks */\npre[class*="language-"] {\n\tpadding: 1em;\n\tmargin: .5em 0;\n\toverflow: auto;\n}\n\n:not(pre) > code[class*="language-"],\npre[class*="language-"] {\n\tbackground: #f5f2f0;\n}\n\n/* Inline code */\n:not(pre) > code[class*="language-"] {\n\tpadding: .1em;\n\tborder-radius: .3em;\n\twhite-space: normal;\n}\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n\tcolor: slategray;\n}\n\n.token.punctuation {\n\tcolor: #999;\n}\n\n.token.namespace {\n\topacity: .7;\n}\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n\tcolor: #905;\n}\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n\tcolor: #690;\n}\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n\tcolor: #9a6e3a;\n\tbackground: hsla(0, 0%, 100%, .5);\n}\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n\tcolor: #07a;\n}\n\n.token.function,\n.token.class-name {\n\tcolor: #DD4A68;\n}\n\n.token.regex,\n.token.important,\n.token.variable {\n\tcolor: #e90;\n}\n\n.token.important,\n.token.bold {\n\tfont-weight: bold;\n}\n.token.italic {\n\tfont-style: italic;\n}\n\n.token.entity {\n\tcursor: help;\n}\n'}\n</style>\n\n<code id="code-container"></code>\n\n`,
  );
  class go extends Dr(fo(HTMLElement)) {
    renderContent() {
      if (
        ((this.languageName = this.getAttribute("language")),
        !this.languageName)
      )
        return void console.warn(
          'You need to provide a language attribute to your <d-code> block to let us know how to highlight your code; e.g.:\n <d-code language="python">zeros = np.zeros(shape)</d-code>.',
        );
      const n = po.languages[this.languageName];
      if (n == undefined)
        return void console.warn(
          `Distill does not yet support highlighting your code block in "${this.languageName}'.`,
        );
      let t = this.textContent;
      const e = this.shadowRoot.querySelector("#code-container");
      if (this.hasAttribute("block")) {
        const n = (t = t.replace(/\n/, "")).match(/\s*/);
        if (
          ((t = (t = t.replace(new RegExp("\n" + n, "g"), "\n")).trim()),
          e.parentNode instanceof ShadowRoot)
        ) {
          const n = document.createElement("pre");
          this.shadowRoot.removeChild(e),
            n.appendChild(e),
            this.shadowRoot.appendChild(n);
        }
      }
      (e.className = `language-${this.languageName}`),
        (e.innerHTML = po.highlight(t, n));
    }
  }
  // Copyright 2018 The Distill Template Authors
  const mo = Or(
    "d-footnote",
    '\n<style>\n\nd-math[block] {\n  display: block;\n}\n\n:host {\n\n}\n\nsup {\n  line-height: 1em;\n  font-size: 0.75em;\n  position: relative;\n  top: -.5em;\n  vertical-align: baseline;\n}\n\nspan {\n  color: hsla(206, 90%, 20%, 0.7);\n  cursor: default;\n}\n\n.footnote-container {\n  padding: 10px;\n}\n\n</style>\n\n<d-hover-box>\n  <div class="footnote-container">\n    <slot id="slot"></slot>\n  </div>\n</d-hover-box>\n\n<sup>\n  <span id="fn-" data-hover-ref=""></span>\n</sup>\n\n',
  );
  class bo extends mo(HTMLElement) {
    constructor() {
      super();
      const n = { childList: !0, characterData: !0, subtree: !0 };
      new MutationObserver(this.notify).observe(this, n);
    }
    notify() {
      const n = new CustomEvent("onFootnoteChanged", {
        detail: this,
        bubbles: !0,
      });
      document.dispatchEvent(n);
    }
    connectedCallback() {
      (this.hoverBox = this.root.querySelector("d-hover-box")),
        window.customElements.whenDefined("d-hover-box").then(() => {
          this.hoverBox.listen(this);
        }),
        (bo.currentFootnoteId += 1);
      const n = bo.currentFootnoteId.toString();
      this.root.host.id = "d-footnote-" + n;
      const t = "dt-fn-hover-box-" + n;
      this.hoverBox.id = t;
      const e = this.root.querySelector("#fn-");
      e.setAttribute("id", "fn-" + n),
        e.setAttribute("data-hover-ref", t),
        (e.textContent = n);
    }
  }
  bo.currentFootnoteId = 0;
  // Copyright 2018 The Distill Template Authors
  const yo = Or(
    "d-footnote-list",
    "\n<style>\n\nd-footnote-list {\n  contain: layout style;\n}\n\nd-footnote-list > * {\n  grid-column: text;\n}\n\nd-footnote-list a.footnote-backlink {\n  color: rgba(0,0,0,0.3);\n  padding-left: 0.5em;\n}\n\n</style>\n\n<h3>Footnotes</h3>\n<ol></ol>\n",
    !1,
  );
  class vo extends yo(HTMLElement) {
    connectedCallback() {
      super.connectedCallback(),
        (this.list = this.root.querySelector("ol")),
        (this.root.style.display = "none");
    }
    set footnotes(n) {
      if (((this.list.innerHTML = ""), n.length)) {
        this.root.style.display = "";
        for (const t of n) {
          const n = document.createElement("li");
          (n.id = t.id + "-listing"), (n.innerHTML = t.innerHTML);
          const e = document.createElement("a");
          e.setAttribute("class", "footnote-backlink"),
            (e.textContent = "[\u21a9]"),
            (e.href = "#" + t.id),
            n.appendChild(e),
            this.list.appendChild(n);
        }
      } else this.root.style.display = "none";
    }
  }
  // Copyright 2018 The Distill Template Authors
  const wo = Or(
    "d-hover-box",
    '\n<style>\n\n:host {\n  position: absolute;\n  width: 100%;\n  left: 0px;\n  z-index: 10000;\n  display: none;\n  white-space: normal\n}\n\n.container {\n  position: relative;\n  width: 704px;\n  max-width: 100vw;\n  margin: 0 auto;\n}\n\n.panel {\n  position: absolute;\n  font-size: 1rem;\n  line-height: 1.5em;\n  top: 0;\n  left: 0;\n  width: 100%;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  background-color: rgba(250, 250, 250, 0.95);\n  box-shadow: 0 0 7px rgba(0, 0, 0, 0.1);\n  border-radius: 4px;\n  box-sizing: border-box;\n\n  backdrop-filter: blur(2px);\n  -webkit-backdrop-filter: blur(2px);\n}\n\n</style>\n\n<div class="container">\n  <div class="panel">\n    <slot></slot>\n  </div>\n</div>\n',
  );
  class xo extends wo(HTMLElement) {
    constructor() {
      super();
    }
    connectedCallback() {}
    listen(n) {
      this.bindDivEvents(this), this.bindTriggerEvents(n);
    }
    bindDivEvents(n) {
      n.addEventListener("mouseover", () => {
        this.visible || this.showAtNode(n), this.stopTimeout();
      }),
        n.addEventListener("mouseout", () => {
          this.extendTimeout(500);
        }),
        n.addEventListener(
          "touchstart",
          (n) => {
            n.stopPropagation();
          },
          { passive: !0 },
        ),
        document.body.addEventListener(
          "touchstart",
          () => {
            this.hide();
          },
          { passive: !0 },
        );
    }
    bindTriggerEvents(n) {
      n.addEventListener("mouseover", () => {
        this.visible || this.showAtNode(n), this.stopTimeout();
      }),
        n.addEventListener("mouseout", () => {
          this.extendTimeout(300);
        }),
        n.addEventListener(
          "touchstart",
          (t) => {
            this.visible ? this.hide() : this.showAtNode(n),
              t.stopPropagation();
          },
          { passive: !0 },
        );
    }
    show(n) {
      (this.visible = !0),
        (this.style.display = "block"),
        (this.style.top = Math.round(n[1] + 10) + "px");
    }
    showAtNode(n) {
      const t = n.getBoundingClientRect();
      this.show([n.offsetLeft + t.width, n.offsetTop + t.height]);
    }
    hide() {
      (this.visible = !1), (this.style.display = "none"), this.stopTimeout();
    }
    stopTimeout() {
      this.timeout && clearTimeout(this.timeout);
    }
    extendTimeout(n) {
      this.stopTimeout(),
        (this.timeout = setTimeout(() => {
          this.hide();
        }, n));
    }
  }
  // Copyright 2018 The Distill Template Authors
  class ko extends HTMLElement {
    static get is() {
      return "d-title";
    }
  }
  // Copyright 2018 The Distill Template Authors
  const So = Or(
    "d-references",
    "\n<style>\nd-references {\n  display: block;\n}\n</style>\n",
    !1,
  );
  class Mo extends So(HTMLElement) {}
  // Copyright 2018 The Distill Template Authors
  class To extends HTMLElement {
    static get is() {
      return "d-toc";
    }
    connectedCallback() {
      this.getAttribute("prerendered") ||
        (window.onload = () => {
          k(
            this,
            document.querySelector("d-article").querySelectorAll("h2, h3"),
          );
        });
    }
  }
  class _o extends HTMLElement {
    static get is() {
      return "d-figure";
    }
    static get readyQueue() {
      return _o._readyQueue || (_o._readyQueue = []), _o._readyQueue;
    }
    static addToReadyQueue(n) {
      -1 === _o.readyQueue.indexOf(n) &&
        (_o.readyQueue.push(n), _o.runReadyQueue());
    }
    static runReadyQueue() {
      const n = _o.readyQueue
        .sort((n, t) => n._seenOnScreen - t._seenOnScreen)
        .filter((n) => !n._ready)
        .pop();
      n && (n.ready(), requestAnimationFrame(_o.runReadyQueue));
    }
    constructor() {
      super(),
        (this._ready = !1),
        (this._onscreen = !1),
        (this._offscreen = !0);
    }
    connectedCallback() {
      (this.loadsWhileScrolling = this.hasAttribute("loadsWhileScrolling")),
        _o.marginObserver.observe(this),
        _o.directObserver.observe(this);
    }
    disconnectedCallback() {
      _o.marginObserver.unobserve(this), _o.directObserver.unobserve(this);
    }
    static get marginObserver() {
      if (!_o._marginObserver) {
        const n = window.innerHeight,
          t = Math.floor(2 * n),
          e = { rootMargin: t + "px 0px " + t + "px 0px", threshold: 0.01 },
          i = _o.didObserveMarginIntersection,
          r = new IntersectionObserver(i, e);
        _o._marginObserver = r;
      }
      return _o._marginObserver;
    }
    static didObserveMarginIntersection(n) {
      for (const t of n) {
        const n = t.target;
        t.isIntersecting && !n._ready && _o.addToReadyQueue(n);
      }
    }
    static get directObserver() {
      return (
        _o._directObserver ||
          (_o._directObserver = new IntersectionObserver(
            _o.didObserveDirectIntersection,
            { rootMargin: "0px", threshold: [0, 1] },
          )),
        _o._directObserver
      );
    }
    static didObserveDirectIntersection(n) {
      for (const t of n) {
        const n = t.target;
        t.isIntersecting
          ? ((n._seenOnScreen = new Date()), n._offscreen && n.onscreen())
          : n._onscreen && n.offscreen();
      }
    }
    addEventListener(n, t) {
      super.addEventListener(n, t),
        "ready" === n &&
          -1 !== _o.readyQueue.indexOf(this) &&
          ((this._ready = !1), _o.runReadyQueue()),
        "onscreen" === n && this.onscreen();
    }
    ready() {
      (this._ready = !0), _o.marginObserver.unobserve(this);
      const n = new CustomEvent("ready");
      this.dispatchEvent(n);
    }
    onscreen() {
      (this._onscreen = !0), (this._offscreen = !1);
      const n = new CustomEvent("onscreen");
      this.dispatchEvent(n);
    }
    offscreen() {
      (this._onscreen = !1), (this._offscreen = !0);
      const n = new CustomEvent("offscreen");
      this.dispatchEvent(n);
    }
  }
  if ("undefined" != typeof window) {
    let n;
    _o.isScrolling = !1;
    const t = () => {
      (_o.isScrolling = !0),
        clearTimeout(n),
        (n = setTimeout(() => {
          (_o.isScrolling = !1), _o.runReadyQueue();
        }, 500));
    };
    window.addEventListener("scroll", t, !0);
  }
  // Copyright 2018 The Distill Template Authors
  const Co = "distill.pub",
    Ao = Or(
      "d-interstitial",
      '\n<style>\n\n.overlay {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  background: white;\n\n  opacity: 1;\n  visibility: visible;\n\n  display: flex;\n  flex-flow: column;\n  justify-content: center;\n  z-index: 2147483647 /* MaxInt32 */\n\n}\n\n.container {\n  position: relative;\n  margin-left: auto;\n  margin-right: auto;\n  max-width: 420px;\n  padding: 2em;\n}\n\nh1 {\n  text-decoration: underline;\n  text-decoration-color: hsl(0,100%,40%);\n  -webkit-text-decoration-color: hsl(0,100%,40%);\n  margin-bottom: 1em;\n  line-height: 1.5em;\n}\n\ninput[type="password"] {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  -webkit-box-shadow: none;\n  -moz-box-shadow: none;\n  box-shadow: none;\n  -webkit-border-radius: none;\n  -moz-border-radius: none;\n  -ms-border-radius: none;\n  -o-border-radius: none;\n  border-radius: none;\n  outline: none;\n\n  font-size: 18px;\n  background: none;\n  width: 25%;\n  padding: 10px;\n  border: none;\n  border-bottom: solid 2px #999;\n  transition: border .3s;\n}\n\ninput[type="password"]:focus {\n  border-bottom: solid 2px #333;\n}\n\ninput[type="password"].wrong {\n  border-bottom: solid 2px hsl(0,100%,40%);\n}\n\np small {\n  color: #888;\n}\n\n.logo {\n  position: relative;\n  font-size: 1.5em;\n  margin-bottom: 3em;\n}\n\n.logo svg {\n  width: 36px;\n  position: relative;\n  top: 6px;\n  margin-right: 2px;\n}\n\n.logo svg path {\n  fill: none;\n  stroke: black;\n  stroke-width: 2px;\n}\n\n</style>\n\n<div class="overlay">\n  <div class="container">\n    <h1>This article is in review.</h1>\n    <p>Do not share this URL or the contents of this article. Thank you!</p>\n    <input id="interstitial-password-input" type="password" name="password" autofocus/>\n    <p><small>Enter the password we shared with you as part of the review process to view the article.</small></p>\n  </div>\n</div>\n',
    );
  class Eo extends Ao(HTMLElement) {
    connectedCallback() {
      if (this.shouldRemoveSelf()) this.parentElement.removeChild(this);
      else {
        this.root.querySelector("#interstitial-password-input").oninput = (n) =>
          this.passwordChanged(n);
      }
    }
    passwordChanged(n) {
      n.target.value === this.password &&
        (console.log("Correct password entered."),
        this.parentElement.removeChild(this),
        "undefined" != typeof Storage &&
          (console.log("Saved that correct password was entered."),
          localStorage.setItem(this.localStorageIdentifier(), "true")));
    }
    shouldRemoveSelf() {
      return window && window.location.hostname === Co
        ? (console.warn("Interstitial found on production, hiding it."), !0)
        : "undefined" != typeof Storage &&
            "true" === localStorage.getItem(this.localStorageIdentifier()) &&
            (console.log(
              "Loaded that correct password was entered before; skipping interstitial.",
            ),
            !0);
    }
    localStorageIdentifier() {
      const n = "interstitial-password-correct";
      return "distill-drafts" + (window ? window.location.pathname : "-") + n;
    }
  }
  var No = M(S).right,
    Lo = Math.sqrt(50),
    Do = Math.sqrt(10),
    Oo = Math.sqrt(2),
    Io = 0.7,
    Fo = 1 / Io,
    Ro = "\\s*([+-]?\\d+)\\s*",
    Uo = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    $o = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    Po = /^#([0-9a-f]{3,8})$/,
    Ho = new RegExp("^rgb\\(" + [Ro, Ro, Ro] + "\\)$"),
    zo = new RegExp("^rgb\\(" + [$o, $o, $o] + "\\)$"),
    qo = new RegExp("^rgba\\(" + [Ro, Ro, Ro, Uo] + "\\)$"),
    jo = new RegExp("^rgba\\(" + [$o, $o, $o, Uo] + "\\)$"),
    Bo = new RegExp("^hsl\\(" + [Uo, $o, $o] + "\\)$"),
    Yo = new RegExp("^hsla\\(" + [Uo, $o, $o, Uo] + "\\)$"),
    Wo = {
      aliceblue: 15792383,
      antiquewhite: 16444375,
      aqua: 65535,
      aquamarine: 8388564,
      azure: 15794175,
      beige: 16119260,
      bisque: 16770244,
      black: 0,
      blanchedalmond: 16772045,
      blue: 255,
      blueviolet: 9055202,
      brown: 10824234,
      burlywood: 14596231,
      cadetblue: 6266528,
      chartreuse: 8388352,
      chocolate: 13789470,
      coral: 16744272,
      cornflowerblue: 6591981,
      cornsilk: 16775388,
      crimson: 14423100,
      cyan: 65535,
      darkblue: 139,
      darkcyan: 35723,
      darkgoldenrod: 12092939,
      darkgray: 11119017,
      darkgreen: 25600,
      darkgrey: 11119017,
      darkkhaki: 12433259,
      darkmagenta: 9109643,
      darkolivegreen: 5597999,
      darkorange: 16747520,
      darkorchid: 10040012,
      darkred: 9109504,
      darksalmon: 15308410,
      darkseagreen: 9419919,
      darkslateblue: 4734347,
      darkslategray: 3100495,
      darkslategrey: 3100495,
      darkturquoise: 52945,
      darkviolet: 9699539,
      deeppink: 16716947,
      deepskyblue: 49151,
      dimgray: 6908265,
      dimgrey: 6908265,
      dodgerblue: 2003199,
      firebrick: 11674146,
      floralwhite: 16775920,
      forestgreen: 2263842,
      fuchsia: 16711935,
      gainsboro: 14474460,
      ghostwhite: 16316671,
      gold: 16766720,
      goldenrod: 14329120,
      gray: 8421504,
      green: 32768,
      greenyellow: 11403055,
      grey: 8421504,
      honeydew: 15794160,
      hotpink: 16738740,
      indianred: 13458524,
      indigo: 4915330,
      ivory: 16777200,
      khaki: 15787660,
      lavender: 15132410,
      lavenderblush: 16773365,
      lawngreen: 8190976,
      lemonchiffon: 16775885,
      lightblue: 11393254,
      lightcoral: 15761536,
      lightcyan: 14745599,
      lightgoldenrodyellow: 16448210,
      lightgray: 13882323,
      lightgreen: 9498256,
      lightgrey: 13882323,
      lightpink: 16758465,
      lightsalmon: 16752762,
      lightseagreen: 2142890,
      lightskyblue: 8900346,
      lightslategray: 7833753,
      lightslategrey: 7833753,
      lightsteelblue: 11584734,
      lightyellow: 16777184,
      lime: 65280,
      limegreen: 3329330,
      linen: 16445670,
      magenta: 16711935,
      maroon: 8388608,
      mediumaquamarine: 6737322,
      mediumblue: 205,
      mediumorchid: 12211667,
      mediumpurple: 9662683,
      mediumseagreen: 3978097,
      mediumslateblue: 8087790,
      mediumspringgreen: 64154,
      mediumturquoise: 4772300,
      mediumvioletred: 13047173,
      midnightblue: 1644912,
      mintcream: 16121850,
      mistyrose: 16770273,
      moccasin: 16770229,
      navajowhite: 16768685,
      navy: 128,
      oldlace: 16643558,
      olive: 8421376,
      olivedrab: 7048739,
      orange: 16753920,
      orangered: 16729344,
      orchid: 14315734,
      palegoldenrod: 15657130,
      palegreen: 10025880,
      paleturquoise: 11529966,
      palevioletred: 14381203,
      papayawhip: 16773077,
      peachpuff: 16767673,
      peru: 13468991,
      pink: 16761035,
      plum: 14524637,
      powderblue: 11591910,
      purple: 8388736,
      rebeccapurple: 6697881,
      red: 16711680,
      rosybrown: 12357519,
      royalblue: 4286945,
      saddlebrown: 9127187,
      salmon: 16416882,
      sandybrown: 16032864,
      seagreen: 3050327,
      seashell: 16774638,
      sienna: 10506797,
      silver: 12632256,
      skyblue: 8900331,
      slateblue: 6970061,
      slategray: 7372944,
      slategrey: 7372944,
      snow: 16775930,
      springgreen: 65407,
      steelblue: 4620980,
      tan: 13808780,
      teal: 32896,
      thistle: 14204888,
      tomato: 16737095,
      turquoise: 4251856,
      violet: 15631086,
      wheat: 16113331,
      white: 16777215,
      whitesmoke: 16119285,
      yellow: 16776960,
      yellowgreen: 10145074,
    };
  L(O, U, {
    copy: function (n) {
      return Object.assign(new this.constructor(), this, n);
    },
    displayable: function () {
      return this.rgb().displayable();
    },
    hex: I,
    formatHex: I,
    formatHsl: F,
    formatRgb: R,
    toString: R,
  }),
    L(
      q,
      z,
      D(O, {
        brighter: function (n) {
          return (
            (n = null == n ? Fo : Math.pow(Fo, n)),
            new q(this.r * n, this.g * n, this.b * n, this.opacity)
          );
        },
        darker: function (n) {
          return (
            (n = null == n ? Io : Math.pow(Io, n)),
            new q(this.r * n, this.g * n, this.b * n, this.opacity)
          );
        },
        rgb: function () {
          return this;
        },
        displayable: function () {
          return (
            -0.5 <= this.r &&
            this.r < 255.5 &&
            -0.5 <= this.g &&
            this.g < 255.5 &&
            -0.5 <= this.b &&
            this.b < 255.5 &&
            0 <= this.opacity &&
            this.opacity <= 1
          );
        },
        hex: j,
        formatHex: j,
        formatRgb: B,
        toString: B,
      }),
    ),
    L(
      K,
      V,
      D(O, {
        brighter: function (n) {
          return (
            (n = null == n ? Fo : Math.pow(Fo, n)),
            new K(this.h, this.s, this.l * n, this.opacity)
          );
        },
        darker: function (n) {
          return (
            (n = null == n ? Io : Math.pow(Io, n)),
            new K(this.h, this.s, this.l * n, this.opacity)
          );
        },
        rgb: function () {
          var n = (this.h % 360) + 360 * (this.h < 0),
            t = isNaN(n) || isNaN(this.s) ? 0 : this.s,
            e = this.l,
            i = e + (e < 0.5 ? e : 1 - e) * t,
            r = 2 * e - i;
          return new q(
            X(n >= 240 ? n - 240 : n + 120, r, i),
            X(n, r, i),
            X(n < 120 ? n + 240 : n - 120, r, i),
            this.opacity,
          );
        },
        displayable: function () {
          return (
            ((0 <= this.s && this.s <= 1) || isNaN(this.s)) &&
            0 <= this.l &&
            this.l <= 1 &&
            0 <= this.opacity &&
            this.opacity <= 1
          );
        },
        formatHsl: function () {
          var n = this.opacity;
          return (
            (1 === (n = isNaN(n) ? 1 : Math.max(0, Math.min(1, n)))
              ? "hsl("
              : "hsla(") +
            (this.h || 0) +
            ", " +
            100 * (this.s || 0) +
            "%, " +
            100 * (this.l || 0) +
            "%" +
            (1 === n ? ")" : ", " + n + ")")
          );
        },
      }),
    );
  var Go = Math.PI / 180,
    Vo = 180 / Math.PI,
    Ko = 18,
    Xo = 0.96422,
    Zo = 1,
    Qo = 0.82521,
    Jo = 4 / 29,
    na = 6 / 29,
    ta = 3 * na * na,
    ea = na * na * na;
  L(
    J,
    Q,
    D(O, {
      brighter: function (n) {
        return new J(
          this.l + Ko * (null == n ? 1 : n),
          this.a,
          this.b,
          this.opacity,
        );
      },
      darker: function (n) {
        return new J(
          this.l - Ko * (null == n ? 1 : n),
          this.a,
          this.b,
          this.opacity,
        );
      },
      rgb: function () {
        var n = (this.l + 16) / 116,
          t = isNaN(this.a) ? n : n + this.a / 500,
          e = isNaN(this.b) ? n : n - this.b / 200;
        return new q(
          en(
            3.1338561 * (t = Xo * tn(t)) -
              1.6168667 * (n = Zo * tn(n)) -
              0.4906146 * (e = Qo * tn(e)),
          ),
          en(-0.9787684 * t + 1.9161415 * n + 0.033454 * e),
          en(0.0719453 * t - 0.2289914 * n + 1.4052427 * e),
          this.opacity,
        );
      },
    }),
  ),
    L(
      sn,
      an,
      D(O, {
        brighter: function (n) {
          return new sn(
            this.h,
            this.c,
            this.l + Ko * (null == n ? 1 : n),
            this.opacity,
          );
        },
        darker: function (n) {
          return new sn(
            this.h,
            this.c,
            this.l - Ko * (null == n ? 1 : n),
            this.opacity,
          );
        },
        rgb: function () {
          return ln(this).rgb();
        },
      }),
    );
  var ia = -0.14861,
    ra = 1.78277,
    oa = -0.29227,
    aa = -0.90649,
    sa = 1.97294,
    la = sa * aa,
    ua = sa * ra,
    ca = ra * oa - aa * ia;
  L(
    dn,
    cn,
    D(O, {
      brighter: function (n) {
        return (
          (n = null == n ? Fo : Math.pow(Fo, n)),
          new dn(this.h, this.s, this.l * n, this.opacity)
        );
      },
      darker: function (n) {
        return (
          (n = null == n ? Io : Math.pow(Io, n)),
          new dn(this.h, this.s, this.l * n, this.opacity)
        );
      },
      rgb: function () {
        var n = isNaN(this.h) ? 0 : (this.h + 120) * Go,
          t = +this.l,
          e = isNaN(this.s) ? 0 : this.s * t * (1 - t),
          i = Math.cos(n),
          r = Math.sin(n);
        return new q(
          255 * (t + e * (ia * i + ra * r)),
          255 * (t + e * (oa * i + aa * r)),
          255 * (t + e * (sa * i)),
          this.opacity,
        );
      },
    }),
  );
  var da,
    ha = (function gs(n) {
      function t(n, t) {
        var i = e((n = z(n)).r, (t = z(t)).r),
          r = e(n.g, t.g),
          o = e(n.b, t.b),
          a = mn(n.opacity, t.opacity);
        return function (t) {
          return (
            (n.r = i(t)), (n.g = r(t)), (n.b = o(t)), (n.opacity = a(t)), n + ""
          );
        };
      }
      var e = gn(n);
      return (t.gamma = gs), t;
    })(1),
    pa = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    fa = new RegExp(pa.source, "g"),
    ga = [0, 1],
    ma =
      /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
  (qn.prototype = jn.prototype),
    (jn.prototype.toString = function () {
      return (
        this.fill +
        this.align +
        this.sign +
        this.symbol +
        (this.zero ? "0" : "") +
        (this.width === undefined ? "" : Math.max(1, 0 | this.width)) +
        (this.comma ? "," : "") +
        (this.precision === undefined
          ? ""
          : "." + Math.max(0, 0 | this.precision)) +
        (this.trim ? "~" : "") +
        this.type
      );
    });
  var ba,
    ya,
    va,
    wa = {
      "%": function (n, t) {
        return (100 * n).toFixed(t);
      },
      b: function (n) {
        return Math.round(n).toString(2);
      },
      c: function (n) {
        return n + "";
      },
      d: function (n) {
        return Math.round(n).toString(10);
      },
      e: function (n, t) {
        return n.toExponential(t);
      },
      f: function (n, t) {
        return n.toFixed(t);
      },
      g: function (n, t) {
        return n.toPrecision(t);
      },
      o: function (n) {
        return Math.round(n).toString(8);
      },
      p: function (n, t) {
        return Wn(100 * n, t);
      },
      r: Wn,
      s: Yn,
      X: function (n) {
        return Math.round(n).toString(16).toUpperCase();
      },
      x: function (n) {
        return Math.round(n).toString(16);
      },
    },
    xa = Array.prototype.map,
    ka = [
      "y",
      "z",
      "a",
      "f",
      "p",
      "n",
      "\xb5",
      "m",
      "",
      "k",
      "M",
      "G",
      "T",
      "P",
      "E",
      "Z",
      "Y",
    ];
  Kn({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""],
    minus: "-",
  });
  var Sa = new Date(),
    Ma = new Date(),
    Ta = et(
      function () {},
      function (n, t) {
        n.setTime(+n + t);
      },
      function (n, t) {
        return t - n;
      },
    );
  Ta.every = function (n) {
    return (
      (n = Math.floor(n)),
      isFinite(n) && n > 0
        ? n > 1
          ? et(
              function (t) {
                t.setTime(Math.floor(t / n) * n);
              },
              function (t, e) {
                t.setTime(+t + e * n);
              },
              function (t, e) {
                return (e - t) / n;
              },
            )
          : Ta
        : null
    );
  };
  var _a = 1e3,
    Ca = 6e4,
    Aa = 36e5,
    Ea = 864e5,
    Na = 6048e5,
    La =
      (et(
        function (n) {
          n.setTime(n - n.getMilliseconds());
        },
        function (n, t) {
          n.setTime(+n + t * _a);
        },
        function (n, t) {
          return (t - n) / _a;
        },
        function (n) {
          return n.getUTCSeconds();
        },
      ),
      et(
        function (n) {
          n.setTime(n - n.getMilliseconds() - n.getSeconds() * _a);
        },
        function (n, t) {
          n.setTime(+n + t * Ca);
        },
        function (n, t) {
          return (t - n) / Ca;
        },
        function (n) {
          return n.getMinutes();
        },
      ),
      et(
        function (n) {
          n.setTime(
            n - n.getMilliseconds() - n.getSeconds() * _a - n.getMinutes() * Ca,
          );
        },
        function (n, t) {
          n.setTime(+n + t * Aa);
        },
        function (n, t) {
          return (t - n) / Aa;
        },
        function (n) {
          return n.getHours();
        },
      ),
      et(
        function (n) {
          n.setHours(0, 0, 0, 0);
        },
        function (n, t) {
          n.setDate(n.getDate() + t);
        },
        function (n, t) {
          return (
            (t - n - (t.getTimezoneOffset() - n.getTimezoneOffset()) * Ca) / Ea
          );
        },
        function (n) {
          return n.getDate() - 1;
        },
      )),
    Da = it(0),
    Oa = it(1),
    Ia = (it(2), it(3), it(4)),
    Fa =
      (it(5),
      it(6),
      et(
        function (n) {
          n.setDate(1), n.setHours(0, 0, 0, 0);
        },
        function (n, t) {
          n.setMonth(n.getMonth() + t);
        },
        function (n, t) {
          return (
            t.getMonth() -
            n.getMonth() +
            12 * (t.getFullYear() - n.getFullYear())
          );
        },
        function (n) {
          return n.getMonth();
        },
      ),
      et(
        function (n) {
          n.setMonth(0, 1), n.setHours(0, 0, 0, 0);
        },
        function (n, t) {
          n.setFullYear(n.getFullYear() + t);
        },
        function (n, t) {
          return t.getFullYear() - n.getFullYear();
        },
        function (n) {
          return n.getFullYear();
        },
      ));
  Fa.every = function (n) {
    return isFinite((n = Math.floor(n))) && n > 0
      ? et(
          function (t) {
            t.setFullYear(Math.floor(t.getFullYear() / n) * n),
              t.setMonth(0, 1),
              t.setHours(0, 0, 0, 0);
          },
          function (t, e) {
            t.setFullYear(t.getFullYear() + e * n);
          },
        )
      : null;
  };
  et(
    function (n) {
      n.setUTCSeconds(0, 0);
    },
    function (n, t) {
      n.setTime(+n + t * Ca);
    },
    function (n, t) {
      return (t - n) / Ca;
    },
    function (n) {
      return n.getUTCMinutes();
    },
  ),
    et(
      function (n) {
        n.setUTCMinutes(0, 0, 0);
      },
      function (n, t) {
        n.setTime(+n + t * Aa);
      },
      function (n, t) {
        return (t - n) / Aa;
      },
      function (n) {
        return n.getUTCHours();
      },
    );
  var Ra = et(
      function (n) {
        n.setUTCHours(0, 0, 0, 0);
      },
      function (n, t) {
        n.setUTCDate(n.getUTCDate() + t);
      },
      function (n, t) {
        return (t - n) / Ea;
      },
      function (n) {
        return n.getUTCDate() - 1;
      },
    ),
    Ua = rt(0),
    $a = rt(1),
    Pa = (rt(2), rt(3), rt(4)),
    Ha =
      (rt(5),
      rt(6),
      et(
        function (n) {
          n.setUTCDate(1), n.setUTCHours(0, 0, 0, 0);
        },
        function (n, t) {
          n.setUTCMonth(n.getUTCMonth() + t);
        },
        function (n, t) {
          return (
            t.getUTCMonth() -
            n.getUTCMonth() +
            12 * (t.getUTCFullYear() - n.getUTCFullYear())
          );
        },
        function (n) {
          return n.getUTCMonth();
        },
      ),
      et(
        function (n) {
          n.setUTCMonth(0, 1), n.setUTCHours(0, 0, 0, 0);
        },
        function (n, t) {
          n.setUTCFullYear(n.getUTCFullYear() + t);
        },
        function (n, t) {
          return t.getUTCFullYear() - n.getUTCFullYear();
        },
        function (n) {
          return n.getUTCFullYear();
        },
      ));
  Ha.every = function (n) {
    return isFinite((n = Math.floor(n))) && n > 0
      ? et(
          function (t) {
            t.setUTCFullYear(Math.floor(t.getUTCFullYear() / n) * n),
              t.setUTCMonth(0, 1),
              t.setUTCHours(0, 0, 0, 0);
          },
          function (t, e) {
            t.setUTCFullYear(t.getUTCFullYear() + e * n);
          },
        )
      : null;
  };
  var za,
    qa,
    ja,
    Ba = { "-": "", _: " ", 0: "0" },
    Ya = /^\s*\d+/,
    Wa = /^%/,
    Ga = /[\\^$*+?|[\]().{}]/g;
  me({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    shortMonths: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  });
  var Va = "%Y-%m-%dT%H:%M:%S.%LZ",
    Ka =
      (Date.prototype.toISOString || qa(Va),
      +new Date("2000-01-01T00:00:00.000Z") || ja(Va),
      { value: function () {} });
  we.prototype = ve.prototype = {
    constructor: we,
    on: function (n, t) {
      var e,
        i = this._,
        r = xe(n + "", i),
        o = -1,
        a = r.length;
      if (!(arguments.length < 2)) {
        if (null != t && "function" != typeof t)
          throw new Error("invalid callback: " + t);
        for (; ++o < a; )
          if ((e = (n = r[o]).type)) i[e] = Se(i[e], n.name, t);
          else if (null == t) for (e in i) i[e] = Se(i[e], n.name, null);
        return this;
      }
      for (; ++o < a; )
        if ((e = (n = r[o]).type) && (e = ke(i[e], n.name))) return e;
    },
    copy: function () {
      var n = {},
        t = this._;
      for (var e in t) n[e] = t[e].slice();
      return new we(n);
    },
    call: function (n, t) {
      if ((e = arguments.length - 2) > 0)
        for (var e, i, r = new Array(e), o = 0; o < e; ++o)
          r[o] = arguments[o + 2];
      if (!this._.hasOwnProperty(n)) throw new Error("unknown type: " + n);
      for (o = 0, e = (i = this._[n]).length; o < e; ++o)
        i[o].value.apply(t, r);
    },
    apply: function (n, t, e) {
      if (!this._.hasOwnProperty(n)) throw new Error("unknown type: " + n);
      for (var i = this._[n], r = 0, o = i.length; r < o; ++r)
        i[r].value.apply(t, e);
    },
  };
  var Xa = "http://www.w3.org/1999/xhtml",
    Za = {
      svg: "http://www.w3.org/2000/svg",
      xhtml: Xa,
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/",
    };
  $e.prototype = {
    constructor: $e,
    appendChild: function (n) {
      return this._parent.insertBefore(n, this._next);
    },
    insertBefore: function (n, t) {
      return this._parent.insertBefore(n, t);
    },
    querySelector: function (n) {
      return this._parent.querySelector(n);
    },
    querySelectorAll: function (n) {
      return this._parent.querySelectorAll(n);
    },
  };
  var Qa = "$";
  wi.prototype = {
    add: function (n) {
      this._names.indexOf(n) < 0 &&
        (this._names.push(n),
        this._node.setAttribute("class", this._names.join(" ")));
    },
    remove: function (n) {
      var t = this._names.indexOf(n);
      t >= 0 &&
        (this._names.splice(t, 1),
        this._node.setAttribute("class", this._names.join(" ")));
    },
    contains: function (n) {
      return this._names.indexOf(n) >= 0;
    },
  };
  var Ja = {},
    ns = null;
  "undefined" != typeof document &&
    ("onmouseenter" in document.documentElement ||
      (Ja = { mouseenter: "mouseover", mouseleave: "mouseout" }));
  var ts = [null];
  (or.prototype = ar.prototype =
    {
      constructor: or,
      select: Ne,
      selectAll: Oe,
      filter: Fe,
      data: qe,
      enter: Ue,
      exit: je,
      join: Be,
      merge: Ye,
      order: We,
      sort: Ge,
      call: Ke,
      nodes: Xe,
      node: Ze,
      size: Qe,
      empty: Je,
      each: ni,
      attr: si,
      style: hi,
      property: bi,
      classed: _i,
      text: Ni,
      html: Ii,
      raise: Ri,
      lower: $i,
      append: Pi,
      insert: zi,
      remove: ji,
      clone: Wi,
      datum: Gi,
      on: Ji,
      dispatch: rr,
    }),
    (br.prototype.on = function () {
      var n = this._.on.apply(this._, arguments);
      return n === this._ ? this : n;
    });
  const es = Or(
      "d-slider",
      "\n<style>\n  :host {\n    position: relative;\n    display: inline-block;\n  }\n\n  :host(:focus) {\n    outline: none;\n  }\n\n  .background {\n    padding: 9px 0;\n    color: white;\n    position: relative;\n  }\n\n  .track {\n    height: 3px;\n    width: 100%;\n    border-radius: 2px;\n    background-color: hsla(0, 0%, 0%, 0.2);\n  }\n\n  .track-fill {\n    position: absolute;\n    top: 9px;\n    height: 3px;\n    border-radius: 4px;\n    background-color: hsl(24, 100%, 50%);\n  }\n\n  .knob-container {\n    position: absolute;\n    top: 10px;\n  }\n\n  .knob {\n    position: absolute;\n    top: -6px;\n    left: -6px;\n    width: 13px;\n    height: 13px;\n    background-color: hsl(24, 100%, 50%);\n    border-radius: 50%;\n    transition-property: transform;\n    transition-duration: 0.18s;\n    transition-timing-function: ease;\n  }\n  .mousedown .knob {\n    transform: scale(1.5);\n  }\n\n  .knob-highlight {\n    position: absolute;\n    top: -6px;\n    left: -6px;\n    width: 13px;\n    height: 13px;\n    background-color: hsla(0, 0%, 0%, 0.1);\n    border-radius: 50%;\n    transition-property: transform;\n    transition-duration: 0.18s;\n    transition-timing-function: ease;\n  }\n\n  .focus .knob-highlight {\n    transform: scale(2);\n  }\n\n  .ticks {\n    position: absolute;\n    top: 16px;\n    height: 4px;\n    width: 100%;\n    z-index: -1;\n  }\n\n  .ticks .tick {\n    position: absolute;\n    height: 100%;\n    border-left: 1px solid hsla(0, 0%, 0%, 0.2);\n  }\n\n</style>\n\n  <div class='background'>\n    <div class='track'></div>\n    <div class='track-fill'></div>\n    <div class='knob-container'>\n      <div class='knob-highlight'></div>\n      <div class='knob'></div>\n    </div>\n    <div class='ticks'></div>\n  </div>\n",
    ),
    is = {
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      pageUp: 33,
      pageDown: 34,
      end: 35,
      home: 36,
    };
  class rs extends es(HTMLElement) {
    connectedCallback() {
      (this.connected = !0),
        this.setAttribute("role", "slider"),
        this.hasAttribute("tabindex") || this.setAttribute("tabindex", 0),
        (this.mouseEvent = !1),
        (this.knob = this.root.querySelector(".knob-container")),
        (this.background = this.root.querySelector(".background")),
        (this.trackFill = this.root.querySelector(".track-fill")),
        (this.track = this.root.querySelector(".track")),
        (this.min = this.min ? this.min : 0),
        (this.max = this.max ? this.max : 100),
        (this.scale = tt()
          .domain([this.min, this.max])
          .range([0, 1])
          .clamp(!0)),
        (this.origin = this.origin !== undefined ? this.origin : this.min),
        (this.step = this.step ? this.step : 1),
        this.update(this.value ? this.value : 0),
        (this.ticks = !!this.ticks && this.ticks),
        this.renderTicks(),
        (this.drag = kr()
          .container(this.background)
          .on("start", () => {
            (this.mouseEvent = !0),
              this.background.classList.add("mousedown"),
              (this.changeValue = this.value),
              this.dragUpdate();
          })
          .on("drag", () => {
            this.dragUpdate();
          })
          .on("end", () => {
            (this.mouseEvent = !1),
              this.background.classList.remove("mousedown"),
              this.dragUpdate(),
              this.changeValue !== this.value && this.dispatchChange(),
              (this.changeValue = this.value);
          })),
        this.drag(sr(this.background)),
        this.addEventListener("focusin", () => {
          this.mouseEvent || this.background.classList.add("focus");
        }),
        this.addEventListener("focusout", () => {
          this.background.classList.remove("focus");
        }),
        this.addEventListener("keydown", this.onKeyDown);
    }
    static get observedAttributes() {
      return [
        "min",
        "max",
        "value",
        "step",
        "ticks",
        "origin",
        "tickValues",
        "tickLabels",
      ];
    }
    attributeChangedCallback(n, t, e) {
      isNaN(e) ||
        e === undefined ||
        null === e ||
        ("min" == n &&
          ((this.min = +e), this.setAttribute("aria-valuemin", this.min)),
        "max" == n &&
          ((this.max = +e), this.setAttribute("aria-valuemax", this.max)),
        "value" == n && this.update(+e),
        "origin" == n && (this.origin = +e),
        "step" == n && e > 0 && (this.step = +e),
        "ticks" == n && (this.ticks = "" === e || e));
    }
    onKeyDown(n) {
      this.changeValue = this.value;
      let t = !1;
      switch (n.keyCode) {
        case is.left:
        case is.down:
          this.update(this.value - this.step), (t = !0);
          break;
        case is.right:
        case is.up:
          this.update(this.value + this.step), (t = !0);
          break;
        case is.pageUp:
        case is.pageDown:
          this.update(this.value + 10 * this.step), (t = !0);
          break;
        case is.home:
          this.update(this.min), (t = !0);
          break;
        case is.end:
          this.update(this.max), (t = !0);
      }
      t &&
        (this.background.classList.add("focus"),
        n.preventDefault(),
        n.stopPropagation(),
        this.changeValue !== this.value && this.dispatchChange());
    }
    validateValueRange(n, t, e) {
      return Math.max(Math.min(t, e), n);
    }
    quantizeValue(n, t) {
      return Math.round(n / t) * t;
    }
    dragUpdate() {
      const n = this.background.getBoundingClientRect(),
        t = ns.x,
        e = n.width;
      this.update(this.scale.invert(t / e));
    }
    update(n) {
      let t = n;
      "any" !== this.step && (t = this.quantizeValue(n, this.step)),
        (t = this.validateValueRange(this.min, this.max, t)),
        this.connected &&
          ((this.knob.style.left = 100 * this.scale(t) + "%"),
          (this.trackFill.style.width =
            100 * this.scale(this.min + Math.abs(t - this.origin)) + "%"),
          (this.trackFill.style.left =
            100 * this.scale(Math.min(t, this.origin)) + "%")),
        this.value !== t &&
          ((this.value = t),
          this.setAttribute("aria-valuenow", this.value),
          this.dispatchInput());
    }
    dispatchChange() {
      const n = new Event("change");
      this.dispatchEvent(n, {});
    }
    dispatchInput() {
      const n = new Event("input");
      this.dispatchEvent(n, {});
    }
    renderTicks() {
      const n = this.root.querySelector(".ticks");
      if (!1 !== this.ticks) {
        let t = [];
        (t =
          this.ticks > 0
            ? this.scale.ticks(this.ticks)
            : "any" === this.step
              ? this.scale.ticks()
              : _(this.min, this.max + 1e-6, this.step)).forEach((t) => {
          const e = document.createElement("div");
          e.classList.add("tick"),
            (e.style.left = 100 * this.scale(t) + "%"),
            n.appendChild(e);
        });
      } else n.style.display = "none";
    }
  }
  var os =
    '<svg viewBox="-607 419 64 64">\n  <path d="M-573.4,478.9c-8,0-14.6-6.4-14.6-14.5s14.6-25.9,14.6-40.8c0,14.9,14.6,32.8,14.6,40.8S-565.4,478.9-573.4,478.9z"/>\n</svg>\n';
  const as = Or(
    "distill-header",
    `\n<style>\ndistill-header {\n  position: relative;\n  height: 60px;\n  background-color: hsl(200, 60%, 15%);\n  width: 100%;\n  box-sizing: border-box;\n  z-index: 2;\n  color: rgba(0, 0, 0, 0.8);\n  border-bottom: 1px solid rgba(0, 0, 0, 0.08);\n  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);\n}\ndistill-header .content {\n  height: 70px;\n  grid-column: page;\n}\ndistill-header a {\n  font-size: 16px;\n  height: 60px;\n  line-height: 60px;\n  text-decoration: none;\n  color: rgba(255, 255, 255, 0.8);\n  padding: 22px 0;\n}\ndistill-header a:hover {\n  color: rgba(255, 255, 255, 1);\n}\ndistill-header svg {\n  width: 24px;\n  position: relative;\n  top: 4px;\n  margin-right: 2px;\n}\n@media(min-width: 1080px) {\n  distill-header {\n    height: 70px;\n  }\n  distill-header a {\n    height: 70px;\n    line-height: 70px;\n    padding: 28px 0;\n  }\n  distill-header .logo {\n  }\n}\ndistill-header svg path {\n  fill: none;\n  stroke: rgba(255, 255, 255, 0.8);\n  stroke-width: 3px;\n}\ndistill-header .logo {\n  font-size: 17px;\n  font-weight: 200;\n}\ndistill-header .nav {\n  float: right;\n  font-weight: 300;\n}\ndistill-header .nav a {\n  font-size: 12px;\n  margin-left: 24px;\n  text-transform: uppercase;\n}\n</style>\n<div class="content">\n  <a href="/" class="logo">\n    ${os}\n    Distill\n  </a>\n  <nav class="nav">\n    <a href="/about/">About</a>\n    <a href="/prize/">Prize</a>\n    <a href="/journal/">Submit</a>\n  </nav>\n</div>\n`,
    !1,
  );
  // Copyright 2018 The Distill Template Authors
  class ss extends as(HTMLElement) {}
  // Copyright 2018 The Distill Template Authors
  const ls =
    "\n<style>\n  distill-appendix {\n    contain: layout style;\n  }\n\n  distill-appendix .citation {\n    font-size: 11px;\n    line-height: 15px;\n    border-left: 1px solid rgba(0, 0, 0, 0.1);\n    padding-left: 18px;\n    border: 1px solid rgba(0,0,0,0.1);\n    background: rgba(0, 0, 0, 0.02);\n    padding: 10px 18px;\n    border-radius: 3px;\n    color: rgba(150, 150, 150, 1);\n    overflow: hidden;\n    margin-top: -12px;\n    white-space: pre-wrap;\n    word-wrap: break-word;\n  }\n\n  distill-appendix > * {\n    grid-column: text;\n  }\n</style>\n";
  class us extends HTMLElement {
    static get is() {
      return "distill-appendix";
    }
    set frontMatter(n) {
      this.innerHTML = Sr(n);
    }
  }
  const cs = Or(
    "distill-footer",
    `\n<style>\n\n:host {\n  color: rgba(255, 255, 255, 0.5);\n  font-weight: 300;\n  padding: 2rem 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  background-color: hsl(180, 5%, 15%); /*hsl(200, 60%, 15%);*/\n  text-align: left;\n  contain: content;\n}\n\n.footer-container .logo svg {\n  width: 24px;\n  position: relative;\n  top: 4px;\n  margin-right: 2px;\n}\n\n.footer-container .logo svg path {\n  fill: none;\n  stroke: rgba(255, 255, 255, 0.8);\n  stroke-width: 3px;\n}\n\n.footer-container .logo {\n  font-size: 17px;\n  font-weight: 200;\n  color: rgba(255, 255, 255, 0.8);\n  text-decoration: none;\n  margin-right: 6px;\n}\n\n.footer-container {\n  grid-column: text;\n}\n\n.footer-container .nav {\n  font-size: 0.9em;\n  margin-top: 1.5em;\n}\n\n.footer-container .nav a {\n  color: rgba(255, 255, 255, 0.8);\n  margin-right: 6px;\n  text-decoration: none;\n}\n\n</style>\n\n<div class='footer-container'>\n\n  <a href="/" class="logo">\n    ${os}\n    Distill\n  </a> is dedicated to clear explanations of machine learning\n\n  <div class="nav">\n    <a href="https://distill.pub/about/">About</a>\n    <a href="https://distill.pub/journal/">Submit</a>\n    <a href="https://distill.pub/prize/">Prize</a>\n    <a href="https://distill.pub/archive/">Archive</a>\n    <a href="https://distill.pub/rss.xml">RSS</a>\n    <a href="https://github.com/distillpub">GitHub</a>\n    <a href="https://twitter.com/distillpub">Twitter</a>\n    &nbsp;&nbsp;&nbsp;&nbsp; ISSN 2476-0757\n  </div>\n\n</div>\n\n`,
  );
  // Copyright 2018 The Distill Template Authors
  class ds extends cs(HTMLElement) {}
  // Copyright 2018 The Distill Template Authors
  let hs = !1,
    ps = 0;
  const fs = function () {
    if (window.distill.runlevel < 1)
      throw new Error("Insufficient Runlevel for Distill Template!");
    if ("distill" in window && window.distill.templateIsLoading)
      throw new Error(
        "Runlevel 1: Distill Template is getting loaded more than once, aborting!",
      );
    (window.distill.templateIsLoading = !0),
      console.debug("Runlevel 1: Distill Template has started loading."),
      p(document),
      console.debug("Runlevel 1: Static Distill styles have been added."),
      console.debug("Runlevel 1->2."),
      (window.distill.runlevel += 1);
    for (const [n, t] of Object.entries(Vr.listeners))
      "function" == typeof t
        ? document.addEventListener(n, t)
        : console.error(
            "Runlevel 2: Controller listeners need to be functions!",
          );
    console.debug("Runlevel 2: We can now listen to controller events."),
      console.debug("Runlevel 2->3."),
      (window.distill.runlevel += 1);
    const n = [
        Jr,
        to,
        io,
        ao,
        so,
        uo,
        ho,
        go,
        bo,
        vo,
        Wr,
        xo,
        ko,
        Yr,
        Mo,
        To,
        _o,
        rs,
        Eo,
      ],
      t = [ss, us, ds];
    if (window.distill.runlevel < 2)
      throw new Error("Insufficient Runlevel for adding custom elements!");
    const e = n.concat(t);
    for (const n of e)
      console.debug("Runlevel 2: Registering custom element: " + n.is),
        customElements.define(n.is, n);
    console.debug(
      "Runlevel 3: Distill Template finished registering custom elements.",
    ),
      console.debug("Runlevel 3->4."),
      (window.distill.runlevel += 1),
      u() && Vr.listeners.DOMContentLoaded(),
      console.debug("Runlevel 4: Distill Template initialisation complete."),
      (window.distill.templateIsLoading = !1),
      (window.distill.templateHasLoaded = !0);
  };
  (window.distill = { runlevel: ps, initialize: fs, templateIsLoading: hs }),
    Zr.browserSupportsAllFeatures()
      ? (console.debug("Runlevel 0: No need for polyfills."),
        console.debug("Runlevel 0->1."),
        (window.distill.runlevel += 1),
        window.distill.initialize())
      : (console.debug("Runlevel 0: Distill Template is loading polyfills."),
        Zr.load(window.distill.initialize));
});
