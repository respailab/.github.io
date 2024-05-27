!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(exports, require("fs"))
    : "function" == typeof define && define.amd
      ? define(["exports", "fs"], t)
      : t(((e = e || self).dl = {}), e.fs);
})(this, function (e, t) {
  "use strict";
  function n(e, t) {
    (e.title = t.title),
      t.published &&
        (t.published instanceof Date
          ? (e.publishedDate = t.published)
          : t.published.constructor === String &&
            (e.publishedDate = new Date(t.published))),
      t.publishedDate &&
        (t.publishedDate instanceof Date
          ? (e.publishedDate = t.publishedDate)
          : t.publishedDate.constructor === String
            ? (e.publishedDate = new Date(t.publishedDate))
            : console.error(
                "Don't know what to do with published date: " + t.publishedDate,
              )),
      (e.description = t.description),
      (e.authors = t.authors.map((e) => new te(e))),
      (e.katex = t.katex),
      (e.password = t.password),
      t.doi && (e.doi = t.doi);
  }
  // Copyright 2018 The Distill Template Authors
  function r(e) {
    for (let t of e.authors) {
      const e = Boolean(t.affiliation),
        n = Boolean(t.affiliations);
      if (e)
        if (n)
          console.warn(
            `Author ${t.author} has both old-style ("affiliation" & "affiliationURL") and new style ("affiliations") affiliation information!`,
          );
        else {
          let e = { name: t.affiliation };
          t.affiliationURL && (e.url = t.affiliationURL),
            (t.affiliations = [e]);
        }
    }
    return e;
  }
  function i(e) {
    const t = e.firstElementChild;
    if (t) {
      if ("json" == t.getAttribute("type").split("/")[1]) {
        const e = t.textContent;
        return r(JSON.parse(e));
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
  function a(e, t) {
    const r = e.querySelector("d-front-matter");
    r ? n(t, i(r)) : console.warn("No front matter tag found!");
  }
  function o() {
    throw new Error(
      "Dynamic requires are not currently supported by rollup-plugin-commonjs",
    );
  }
  function s(e) {
    return e &&
      e.__esModule &&
      Object.prototype.hasOwnProperty.call(e, "default")
      ? e["default"]
      : e;
  }
  function l(e, t) {
    return e((t = { exports: {} }), t.exports), t.exports;
  }
  // Copyright 2018 The Distill Template Authors
  function u(e) {
    return e
      .replace(/[\t\n ]+/g, " ")
      .replace(/{\\["^`.'acu~Hvs]( )?([a-zA-Z])}/g, (e, t, n) => n)
      .replace(/{\\([a-zA-Z])}/g, (e, t) => t);
  }
  function d(e) {
    const t = new Map(),
      n = re.toJSON(e);
    for (const e of n) {
      for (const [t, n] of Object.entries(e.entryTags))
        e.entryTags[t.toLowerCase()] = u(n);
      (e.entryTags.type = e.entryType), t.set(e.citationKey, e.entryTags);
    }
    return t;
  }
  function c(e) {
    return `@article{${e.slug},\n  author = {${e.bibtexAuthors}},\n  title = {${e.title}},\n  journal = {${e.journal.title}},\n  year = {${e.publishedYear}},\n  note = {${e.url}},\n  doi = {${e.doi}}\n}`;
  }
  // Copyright 2018 The Distill Template Authors
  function h(e) {
    const t = e.firstElementChild;
    if (t && "SCRIPT" === t.tagName) {
      if ("text/bibtex" == t.type) {
        return d(e.firstElementChild.textContent);
      }
      if ("text/json" == t.type) return new Map(JSON.parse(t.textContent));
      console.warn("Unsupported bibliography script tag type: " + t.type);
    } else console.warn("Bibliography did not have any script tag.");
  }
  // Copyright 2018 The Distill Template Authors
  function p(e, n) {
    const r = e.querySelector("d-bibliography");
    if (!r) return void console.warn("No bibliography tag found!");
    const i = r.getAttribute("src");
    if (i) {
      const a = n.inputDirectory + "/" + i,
        o = d(t.readFileSync(a, "utf-8")),
        s = e.createElement("script");
      (s.type = "text/json"),
        (s.textContent = JSON.stringify([...o])),
        r.appendChild(s),
        r.removeAttribute("src");
    }
    n.bibliography = h(r);
  }
  // Copyright 2018 The Distill Template Authors
  function f(e = document) {
    const t = new Set(),
      n = e.querySelectorAll("d-cite");
    for (const e of n) {
      const n = (e.getAttribute("key") || e.getAttribute("bibtex-key"))
        .split(",")
        .map((e) => e.trim());
      for (const e of n) t.add(e);
    }
    return [...t];
  }
  function m(e, t, n, r) {
    if (null == e.author) return "";
    var i = e.author.split(" and ");
    let a = i.map((e) => {
      if (-1 != (e = e.trim()).indexOf(","))
        var n = e.split(",")[0].trim(),
          r = e.split(",")[1];
      else if (-1 != e.indexOf(" "))
        (n = e.split(" ").slice(-1)[0].trim()),
          (r = e.split(" ").slice(0, -1).join(" "));
      else n = e.trim();
      var i = "";
      return (
        r != undefined &&
          (i =
            (i = r
              .trim()
              .split(" ")
              .map((e) => e.trim()[0])).join(".") + "."),
        t.replace("${F}", r).replace("${L}", n).replace("${I}", i).trim()
      );
    });
    if (i.length > 1) {
      var o = a.slice(0, i.length - 1).join(n);
      return (o += (r || n) + a[i.length - 1]);
    }
    return a[0];
  }
  function g(e) {
    var t = e.journal || e.booktitle || "";
    if ("volume" in e) {
      var n = e.issue || e.number;
      (n = n != undefined ? "(" + n + ")" : ""), (t += ", Vol " + e.volume + n);
    }
    return (
      "pages" in e && (t += ", pp. " + e.pages),
      "" != t && (t += ". "),
      "publisher" in e && "." != (t += e.publisher)[t.length - 1] && (t += "."),
      t
    );
  }
  function v(e) {
    if ("url" in e) {
      var t = e.url,
        n = /arxiv\.org\/abs\/([0-9\.]*)/.exec(t);
      if (
        (null != n && (t = `http://arxiv.org/pdf/${n[1]}.pdf`),
        ".pdf" == t.slice(-4))
      )
        var r = "PDF";
      else if (".html" == t.slice(-5)) r = "HTML";
      return ` &ensp;<a href="${t}">[${r || "link"}]</a>`;
    }
    return "";
  }
  function b(e, t) {
    return "doi" in e
      ? `${t ? "<br>" : ""} <a href="https://doi.org/${e.doi}" style="text-decoration:inherit;">DOI: ${e.doi}</a>`
      : "";
  }
  function y(e) {
    return '<span class="title">' + e.title + "</span> ";
  }
  function x(e) {
    if (e) {
      var t = y(e);
      return (
        (t += v(e) + "<br>"),
        e.author &&
          ((t += m(e, "${L}, ${I}", ", ", " and ")),
          (e.year || e.date) && (t += ", ")),
        e.year || e.date ? (t += (e.year || e.date) + ". ") : (t += ". "),
        (t += g(e)),
        (t += b(e))
      );
    }
    return "?";
  }
  // Copyright 2018 The Distill Template Authors
  function w(e, t) {
    const n = new Set(t.citations),
      r = f(e);
    for (const e of r) n.add(e);
    t.citations = Array.from(n);
  }
  // Copyright 2018 The Distill Template Authors
  function k(e) {
    const t = e.querySelector("head");
    if (
      (e.querySelector("html").getAttribute("lang") ||
        e.querySelector("html").setAttribute("lang", "en"),
      !e.querySelector("meta[charset]"))
    ) {
      const n = e.createElement("meta");
      n.setAttribute("charset", "utf-8"), t.appendChild(n);
    }
    if (!e.querySelector("meta[name=viewport]")) {
      const n = e.createElement("meta");
      n.setAttribute("name", "viewport"),
        n.setAttribute("content", "width=device-width, initial-scale=1"),
        t.appendChild(n);
    }
  }
  // Copyright 2018 The Distill Template Authors
  function M(e) {
    return `\n  <div class="byline grid">\n    <div class="authors-affiliations grid">\n      <h3>Authors</h3>\n      <h3>Affiliations</h3>\n      ${e.authors.map((e) => `\n        <p class="author">\n          ${e.personalURL ? `\n            <a class="name" href="${e.personalURL}">${e.name}</a>` : `\n            <span class="name">${e.name}</span>`}\n        </p>\n        <p class="affiliation">\n        ${e.affiliations.map((e) => (e.url ? `<a class="affiliation" href="${e.url}">${e.name}</a>` : `<span class="affiliation">${e.name}</span>`)).join(", ")}\n        </p>\n      `).join("")}\n    </div>\n    <div>\n      <h3>Published</h3>\n      ${e.publishedDate ? `\n        <p>${e.publishedMonth} ${e.publishedDay}, ${e.publishedYear}</p> ` : "\n        <p><em>Not published yet.</em></p>"}\n    </div>\n  </div>\n`;
  }
  // Copyright 2018 The Distill Template Authors
  function S(e, t) {
    const n = e.querySelector("d-byline");
    n && (n.innerHTML = M(t));
  }
  // Copyright 2018 The Distill Template Authors
  function z(e, t) {
    const n = e.body,
      r = n.querySelector("d-article");
    if (!r)
      return void console.warn(
        "No d-article tag found; skipping adding optional components!",
      );
    let i = e.querySelector("d-byline");
    i ||
      (t.authors
        ? ((i = e.createElement("d-byline")), n.insertBefore(i, r))
        : console.warn(
            "No authors found in front matter; please add them before submission!",
          ));
    let a = e.querySelector("d-title");
    a || ((a = e.createElement("d-title")), n.insertBefore(a, i));
    let o = a.querySelector("h1");
    o ||
      (((o = e.createElement("h1")).textContent = t.title),
      a.insertBefore(o, a.firstChild));
    const s = "undefined" != typeof t.password;
    let l = n.querySelector("d-interstitial");
    if (s && !l) {
      const r = "undefined" != typeof window,
        i = r && window.location.hostname.includes("localhost");
      (r && i) ||
        (((l = e.createElement("d-interstitial")).password = t.password),
        n.insertBefore(l, n.firstChild));
    } else !s && l && l.parentElement.removeChild(this);
    let u = e.querySelector("d-appendix");
    u || ((u = e.createElement("d-appendix")), e.body.appendChild(u));
    let d = e.querySelector("d-footnote-list");
    d || ((d = e.createElement("d-footnote-list")), u.appendChild(d));
    let c = e.querySelector("d-citation-list");
    c || ((c = e.createElement("d-citation-list")), u.appendChild(c));
  }
  // Copyright 2018 The Distill Template Authors
  function A(e, t) {
    let n = !1;
    const r = e.querySelector("body");
    if (!r) return void console.warn("No body tag found!");
    t.katex && t.katex.delimiters && ((global.document = e), ce(r, t.katex));
    const i = r.querySelectorAll("d-math");
    if (i.length > 0) {
      (n = !0), console.warn(`Prerendering ${i.length} math tags...`);
      for (const n of i) {
        const r = { displayMode: n.hasAttribute("block") },
          i = Object.assign(r, t.katex),
          a = ie.renderToString(n.textContent, i),
          o = e.createElement("span");
        (o.innerHTML = a),
          n.parentElement.insertBefore(o, n),
          n.parentElement.removeChild(n);
      }
    }
    if (n) {
      const t =
        '<link rel="stylesheet" href="https://distill.pub/third-party/katex/katex.min.css" crossorigin="anonymous">';
      e.head.insertAdjacentHTML("beforeend", t);
    }
  }
  function C(e) {
    var t,
      n = "" + e,
      r = pe.exec(n);
    if (!r) return n;
    var i = "",
      a = 0,
      o = 0;
    for (a = r.index; a < n.length; a++) {
      switch (n.charCodeAt(a)) {
        case 34:
          t = "&quot;";
          break;
        case 38:
          t = "&amp;";
          break;
        case 39:
          t = "&#39;";
          break;
        case 60:
          t = "&lt;";
          break;
        case 62:
          t = "&gt;";
          break;
        default:
          continue;
      }
      o !== a && (i += n.substring(o, a)), (o = a + 1), (i += t);
    }
    return o !== a ? i + n.substring(o, a) : i;
  }
  // Copyright 2018 The Distill Template Authors
  function T(e, t) {
    function n(e, t, n) {
      (t || n) && i(`    <meta name="${e}" content="${fe(t)}" >\n`);
    }
    let r = e.querySelector("head"),
      i = (e) => N(r, e);
    if (
      (i(
        `\n    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">\n    <link rel="icon" type="image/png" href="data:image/png;base64,${he}">\n    <link href="/rss.xml" rel="alternate" type="application/rss+xml" title="Articles from Distill">\n  `,
      ),
      t.title && i(`\n    <title>${fe(t.title)}</title>\n    `),
      t.url && i(`\n    <link rel="canonical" href="${t.url}">\n    `),
      t.publishedDate &&
        i(
          `\n    <!--  https://schema.org/Article -->\n    <meta property="description"       itemprop="description"   content="${fe(t.description)}" />\n    <meta property="article:published" itemprop="datePublished" content="${t.publishedISODateOnly}" />\n    <meta property="article:created"   itemprop="dateCreated"   content="${t.publishedISODateOnly}" />\n    `,
        ),
      t.updatedDate &&
        i(
          `\n    <meta property="article:modified"  itemprop="dateModified"  content="${t.updatedDate.toISOString()}" />\n    `,
        ),
      (t.authors || []).forEach((e) => {
        N(
          r,
          `\n    <meta property="article:author" content="${fe(e.firstName)} ${fe(e.lastName)}" />`,
        );
      }),
      i(
        `\n    <!--  https://developers.facebook.com/docs/sharing/webmasters#markup -->\n    <meta property="og:type" content="article"/>\n    <meta property="og:title" content="${fe(t.title)}"/>\n    <meta property="og:description" content="${fe(t.description)}">\n    <meta property="og:url" content="${t.url}"/>\n    <meta property="og:image" content="${t.previewURL}"/>\n    <meta property="og:locale" content="en_US" />\n    <meta property="og:site_name" content="Distill" />\n  `,
      ),
      i(
        `\n    <!--  https://dev.twitter.com/cards/types/summary -->\n    <meta name="twitter:card" content="summary_large_image">\n    <meta name="twitter:title" content="${fe(t.title)}">\n    <meta name="twitter:description" content="${fe(t.description)}">\n    <meta name="twitter:url" content="${t.url}">\n    <meta name="twitter:image" content="${t.previewURL}">\n    <meta name="twitter:image:width" content="560">\n    <meta name="twitter:image:height" content="295">\n  `,
      ),
      t.doiSuffix)
    ) {
      i(
        "\n      <!--  https://scholar.google.com/intl/en/scholar/inclusion.html#indexing -->\n",
      ),
        n("citation_title", t.title),
        n("citation_fulltext_html_url", t.url),
        n("citation_volume", t.volume),
        n("citation_issue", t.issue),
        n("citation_firstpage", t.doiSuffix ? `e${t.doiSuffix}` : undefined),
        n("citation_doi", t.doi);
      let e = t.journal || {};
      n("citation_journal_title", e.full_title || e.title),
        n("citation_journal_abbrev", e.abbrev_title),
        n("citation_issn", e.issn),
        n("citation_publisher", e.publisher),
        n("citation_fulltext_world_readable", "", !0),
        t.publishedDate &&
          (n(
            "citation_online_date",
            `${t.publishedYear}/${t.publishedMonthPadded}/${t.publishedDayPadded}`,
          ),
          n(
            "citation_publication_date",
            `${t.publishedYear}/${t.publishedMonthPadded}/${t.publishedDayPadded}`,
          )),
        (t.authors || []).forEach((e) => {
          n("citation_author", `${e.lastName}, ${e.firstName}`),
            n("citation_author_institution", e.affiliation);
        });
    } else
      console.warn("No DOI suffix in data; not adding citation meta tags!");
    t.citations
      ? t.citations.forEach((e) => {
          if (t.bibliography && t.bibliography.has(e)) {
            n("citation_reference", E(t.bibliography.get(e)));
          } else console.warn("No bibliography data found for " + e);
        })
      : console.warn(
          "No citations found; not adding any references meta tags!",
        );
  }
  function N(e, t) {
    e.innerHTML += t;
  }
  function E(e) {
    var t = `citation_title=${e.title};`;
    e.author &&
      "" !== e.author &&
      e.author.split(" and ").forEach((e) => {
        let n, r;
        -1 != (e = e.trim()).indexOf(",")
          ? ((n = e.split(",")[0].trim()), (r = e.split(",")[1].trim()))
          : ((n = e.split(" ").slice(-1)[0].trim()),
            (r = e.split(" ").slice(0, -1).join(" "))),
          (t += `citation_author=${r} ${n};`);
      }),
      "year" in e && (t += `citation_publication_date=${e.year};`);
    let n = /https?:\/\/arxiv\.org\/pdf\/([0-9]*\.[0-9]*)\.pdf/.exec(e.url);
    return (n =
      (n = n || /https?:\/\/arxiv\.org\/abs\/([0-9]*\.[0-9]*)/.exec(e.url)) ||
      /arXiv preprint arXiv:([0-9]*\.[0-9]*)/.exec(e.journal)) && n[1]
      ? (t += `citation_arxiv_id=${n[1]};`)
      : ("journal" in e && (t += `citation_journal_title=${fe(e.journal)};`),
        "volume" in e && (t += `citation_volume=${fe(e.volume)};`),
        ("issue" in e || "number" in e) &&
          (t += `citation_number=${fe(e.issue || e.number)};`),
        t);
  }
  function R(e) {
    const t = "distill-prerendered-styles";
    if (!e.getElementById(t)) {
      const n = e.createElement("style");
      (n.id = t), (n.type = "text/css");
      const r = e.createTextNode(me);
      n.appendChild(r);
      const i = e.head.querySelector("script");
      e.head.insertBefore(n, i);
    }
  }
  // Copyright 2018 The Distill Template Authors
  function L(e, t) {
    let n =
      '\n  <style>\n\n  d-toc {\n    contain: layout style;\n    display: block;\n  }\n\n  d-toc ul {\n    padding-left: 0;\n  }\n\n  d-toc ul > ul {\n    padding-left: 24px;\n  }\n\n  d-toc a {\n    border-bottom: none;\n    text-decoration: none;\n  }\n\n  </style>\n  <nav role="navigation" class="table-of-contents"></nav>\n  <h2>Table of contents</h2>\n  <ul>';
    for (const e of t) {
      const t = "D-TITLE" == e.parentElement.tagName,
        r = e.getAttribute("no-toc");
      if (t || r) continue;
      const i = e.textContent;
      let a =
        '<li><a href="' + ("#" + e.getAttribute("id")) + '">' + i + "</a></li>";
      "H3" == e.tagName ? (a = "<ul>" + a + "</ul>") : (a += "<br>"), (n += a);
    }
    (n += "</ul></nav>"), (e.innerHTML = n);
  }
  // Copyright 2018 The Distill Template Authors
  function O(e) {
    const t = e.querySelector("d-article"),
      n = e.querySelector("d-toc");
    if (n) {
      L(n, t.querySelectorAll("h2, h3")), n.setAttribute("prerendered", "true");
    }
  }
  // Copyright 2018 The Distill Template Authors
  function q(e) {
    for (
      var t = e.createTreeWalker(e.body, e.defaultView.NodeFilter.SHOW_TEXT);
      t.nextNode();

    ) {
      var n = t.currentNode,
        r = n.nodeValue;
      r && _(n) && ((r = D((r = B(r)))), (n.nodeValue = r));
    }
  }
  function _(e) {
    var t = e.parentElement,
      n =
        !!(t && t.getAttribute && t.getAttribute("class")) &&
        (t.getAttribute("class").includes("katex") ||
          t.getAttribute("class").includes("MathJax"));
    return (
      t &&
      "SCRIPT" !== t.nodeName &&
      "STYLE" !== t.nodeName &&
      "CODE" !== t.nodeName &&
      "PRE" !== t.nodeName &&
      "SPAN" !== t.nodeName &&
      "D-HEADER" !== t.nodeName &&
      "D-BYLINE" !== t.nodeName &&
      "D-MATH" !== t.nodeName &&
      "D-CODE" !== t.nodeName &&
      "D-BIBLIOGRAPHY" !== t.nodeName &&
      "D-FOOTER" !== t.nodeName &&
      "D-APPENDIX" !== t.nodeName &&
      "D-FRONTMATTER" !== t.nodeName &&
      "D-TOC" !== t.nodeName &&
      8 !== t.nodeType &&
      !n
    );
  }
  /*!
   * typeset - Typesetting for the web
   * @version v0.1.6
   * @link https://github.com/davidmerfield/Typeset.js
   * @author David Merfield
   */ function D(e) {
    var t = "\xa0",
      n = /([\xab\xbf\xa1]) /g,
      r = / ([!?:;.,\u203d\xbb])/g;
    return (e = (e = (e = (e = (e = e.replace(/--/g, "\u2014")).replace(
      /\s*\u2014\s*/g,
      "\u2009\u2014\u2009",
    )).replace(/\.\.\./g, "\u2026")).replace(n, "$1" + t)).replace(
      r,
      t + "$1",
    ));
  }
  function B(e) {
    return (e = (e = (e = (e = (e = e
      .replace(/(\W|^)"([^\s!?:;.,\u203d\xbb])/g, "$1\u201c$2")
      .replace(/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, "$1\u201d$2")
      .replace(/([^0-9])"/g, "$1\u201d")
      .replace(/(\W|^)'(\S)/g, "$1\u2018$2")
      .replace(/([a-z])'([a-z])/gi, "$1\u2019$2")
      .replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/gi, "$1\u2019$3")
      .replace(
        /(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/gi,
        "\u2019$2$3",
      )
      .replace(
        /(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/gi,
        "$1\u2019",
      )
      .replace(/'''/g, "\u2034")
      .replace(/("|'')/g, "\u2033")
      .replace(/'/g, "\u2032")).replace(/\\\u201c/, '"')).replace(
      /\\\u201d/,
      '"',
    )).replace(/\\\u2019/, "'")).replace(/\\\u2018/, "'"));
  }
  // Copyright 2018 The Distill Template Authors
  function I(e) {
    const t = e.querySelector('script[src*="template.v2.js"]');
    t
      ? t.parentNode.removeChild(t)
      : console.debug(
          "FYI: Did not find template tag when trying to remove it. You may not have added it. Be aware that our polyfills will add it.",
        );
    const n = e.createElement("script");
    (n.src =
      "https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.0.17/webcomponents-loader.js"),
      e.head.insertBefore(n, e.head.firstChild);
    const r = e.createElement("script");
    (r.innerHTML = ge), e.head.insertBefore(r, e.head.firstChild);
  }
  // Copyright 2018 The Distill Template Authors
  function H(e, t, n = document) {
    if (t.size > 0) {
      e.style.display = "";
      let r = e.querySelector(".references");
      if (r) r.innerHTML = "";
      else {
        const t = n.createElement("style");
        (t.innerHTML = ve), e.appendChild(t);
        const i = n.createElement("h3");
        (i.id = "references"),
          (i.textContent = "References"),
          e.appendChild(i),
          ((r = n.createElement("ol")).id = "references-list"),
          (r.className = "references"),
          e.appendChild(r);
      }
      for (const [e, i] of t) {
        const t = n.createElement("li");
        (t.id = e), (t.innerHTML = x(i)), r.appendChild(t);
      }
    } else e.style.display = "none";
  }
  // Copyright 2018 The Distill Template Authors
  function P(e, t) {
    const n = e.querySelector("d-citation-list");
    if (n) {
      H(n, new Map(t.citations.map((e) => [e, t.bibliography.get(e)])), e),
        n.setAttribute("distill-prerendered", "true");
    }
  }
  // Copyright 2018 The Distill Template Authors
  function j(e) {
    const t = e.head,
      n = t.querySelector("meta[http-equiv]");
    t.insertBefore(n, t.firstChild);
    const r = t.querySelector("meta[name=viewport]");
    t.insertBefore(r, t.firstChild);
    const i = t.querySelector("meta[charset]");
    t.insertBefore(i, t.firstChild);
  }
  // Copyright 2018 The Distill Template Authors
  function F(e) {
    if (!e.querySelector("distill-header")) {
      const t = e.createElement("distill-header");
      (t.innerHTML = ye), t.setAttribute("distill-prerendered", "");
      const n = e.querySelector("body");
      n.insertBefore(t, n.firstChild);
    }
  }
  // Copyright 2018 The Distill Template Authors
  function $(e) {
    let t = xe;
    "undefined" != typeof e.githubUrl &&
      ((t +=
        '\n    <h3 id="updates-and-corrections">Updates and Corrections</h3>\n    <p>'),
      e.githubCompareUpdatesUrl &&
        (t += `<a href="${e.githubCompareUpdatesUrl}">View all changes</a> to this article since it was first published.`),
      (t += `\n    If you see mistakes or want to suggest changes, please <a href="${e.githubUrl + "/issues/new"}">create an issue on GitHub</a>. </p>\n    `));
    const n = e.journal;
    return (
      void 0 !== n &&
        "Distill" === n.title &&
        (t += `\n    <h3 id="reuse">Reuse</h3>\n    <p>Diagrams and text are licensed under Creative Commons Attribution <a href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0</a> with the <a class="github" href="${e.githubUrl}">source available on GitHub</a>, unless noted otherwise. The figures that have been reused from other sources don\u2019t fall under this license and can be recognized by a note in their caption: \u201cFigure from \u2026\u201d.</p>\n    `),
      "undefined" != typeof e.publishedDate &&
        (t += `\n    <h3 id="citation">Citation</h3>\n    <p>For attribution in academic contexts, please cite this work as</p>\n    <pre class="citation short">${e.concatenatedAuthors}, "${e.title}", Distill, ${e.publishedYear}.</pre>\n    <p>BibTeX citation</p>\n    <pre class="citation long">${c(e)}</pre>\n    `),
      t
    );
  }
  // Copyright 2018 The Distill Template Authors
  function U(e, t) {
    const n = e.querySelector("d-appendix");
    if (n) {
      if (!n.querySelector("distill-appendix")) {
        const r = e.createElement("distill-appendix");
        n.appendChild(r), (r.innerHTML = $(t));
      }
    } else console.warn("No appendix tag found!");
  }
  // Copyright 2018 The Distill Template Authors
  function Y(e) {
    if (!e.querySelector("distill-footer")) {
      const t = e.createElement("distill-footer");
      (t.innerHTML = we), e.querySelector("body").appendChild(t);
    }
  }
  // Copyright 2018 The Distill Template Authors
  function V(e, t, n = !0) {
    let r;
    r = t instanceof ne ? t : ne.fromObject(t);
    for (const [t, i] of ke.entries())
      n && console.warn("Running extractor: " + t), i(e, r, n);
    for (const [t, i] of Me.entries())
      n && console.warn("Running transform: " + t), i(e, r, n);
    e.body.setAttribute("distill-prerendered", ""),
      t instanceof ne || r.assignToObject(t);
  }
  function G(e, t, n = !0) {
    for (const [r, i] of Se.entries())
      n && console.warn("Running distillify: ", r), i(e, t, n);
  }
  function W(e) {
    const t = e.querySelectorAll("script");
    let n = undefined;
    for (const e of t) {
      const t = e.src;
      if (t.includes("template.v1.js")) n = !1;
      else if (t.includes("template.v2.js")) n = !0;
      else if (t.includes("template."))
        throw new Error("Uses distill template, but unknown version?!");
    }
    if (n === undefined)
      throw new Error("Does not seem to use Distill template at all.");
    return n;
  }
  t =
    t && Object.prototype.hasOwnProperty.call(t, "default") ? t["default"] : t;
  // Copyright 2018 The Distill Template Authors
  const K = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    J = [
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
    X = (e) => (e < 10 ? "0" + e : e),
    Z = function (e) {
      return `${K[e.getDay()].substring(0, 3)}, ${X(e.getDate())} ${J[e.getMonth()].substring(0, 3)} ${e.getFullYear().toString()} ${e.getUTCHours().toString()}:${e.getUTCMinutes().toString()}:${e.getUTCSeconds().toString()} Z`;
    },
    Q = function (e) {
      return Array.from(e).reduce(
        (e, [t, n]) => Object.assign(e, { [t]: n }),
        {},
      );
    },
    ee = function (e) {
      const t = new Map();
      for (var n in e) e.hasOwnProperty(n) && t.set(n, e[n]);
      return t;
    };
  class te {
    constructor(e) {
      (this.name = e.author),
        (this.personalURL = e.authorURL),
        (this.affiliation = e.affiliation),
        (this.affiliationURL = e.affiliationURL),
        (this.affiliations = e.affiliations || []);
    }
    get firstName() {
      const e = this.name.split(" ");
      return e.slice(0, e.length - 1).join(" ");
    }
    get lastName() {
      const e = this.name.split(" ");
      return e[e.length - 1];
    }
  }
  class ne {
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
    set url(e) {
      this._url = e;
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
    set previewURL(e) {
      this._previewURL = e;
    }
    get previewURL() {
      return this._previewURL ? this._previewURL : this.url + "/thumbnail.jpg";
    }
    get publishedDateRFC() {
      return Z(this.publishedDate);
    }
    get updatedDateRFC() {
      return Z(this.updatedDate);
    }
    get publishedYear() {
      return this.publishedDate.getFullYear();
    }
    get publishedMonth() {
      return J[this.publishedDate.getMonth()];
    }
    get publishedDay() {
      return this.publishedDate.getDate();
    }
    get publishedMonthPadded() {
      return X(this.publishedDate.getMonth() + 1);
    }
    get publishedDayPadded() {
      return X(this.publishedDate.getDate());
    }
    get publishedISODateOnly() {
      return this.publishedDate.toISOString().split("T")[0];
    }
    get volume() {
      const e = this.publishedYear - 2015;
      if (e < 1)
        throw new Error(
          "Invalid publish date detected during computing volume",
        );
      return e;
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
        .map((e) => e.lastName + ", " + e.firstName)
        .join(" and ");
    }
    get slug() {
      let e = "";
      return (
        this.authors.length &&
          ((e += this.authors[0].lastName.toLowerCase()),
          (e += this.publishedYear),
          (e += this.title.split(" ")[0].toLowerCase())),
        e || "Untitled"
      );
    }
    get bibliographyEntries() {
      return new Map(
        this.citations.map((e) => {
          return [e, this.bibliography.get(e)];
        }),
      );
    }
    set bibliography(e) {
      e instanceof Map
        ? (this._bibliography = e)
        : "object" == typeof e && (this._bibliography = ee(e));
    }
    get bibliography() {
      return this._bibliography;
    }
    static fromObject(e) {
      const t = new ne();
      return Object.assign(t, e), t;
    }
    assignToObject(e) {
      Object.assign(e, this),
        (e.bibliography = Q(this.bibliographyEntries)),
        (e.url = this.url),
        (e.doi = this.doi),
        (e.githubUrl = this.githubUrl),
        (e.previewURL = this.previewURL),
        this.publishedDate &&
          ((e.volume = this.volume),
          (e.issue = this.issue),
          (e.publishedDateRFC = this.publishedDateRFC),
          (e.publishedYear = this.publishedYear),
          (e.publishedMonth = this.publishedMonth),
          (e.publishedDay = this.publishedDay),
          (e.publishedMonthPadded = this.publishedMonthPadded),
          (e.publishedDayPadded = this.publishedDayPadded)),
        this.updatedDate && (e.updatedDateRFC = this.updatedDateRFC),
        (e.concatenatedAuthors = this.concatenatedAuthors),
        (e.bibtexAuthors = this.bibtexAuthors),
        (e.slug = this.slug);
    }
  }
  var re = l(function (e, t) {
      !(function (e) {
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
            (this.setInput = function (e) {
              this.input = e;
            }),
            (this.getEntries = function () {
              return this.entries;
            }),
            (this.isWhitespace = function (e) {
              return " " == e || "\r" == e || "\t" == e || "\n" == e;
            }),
            (this.match = function (e, t) {
              if (
                ((t != undefined && null != t) || (t = !0),
                this.skipWhitespace(t),
                this.input.substring(this.pos, this.pos + e.length) != e)
              )
                throw (
                  "Token mismatch, expected " +
                  e +
                  ", found " +
                  this.input.substring(this.pos)
                );
              (this.pos += e.length), this.skipWhitespace(t);
            }),
            (this.tryMatch = function (e, t) {
              return (
                (t != undefined && null != t) || (t = !0),
                this.skipWhitespace(t),
                this.input.substring(this.pos, this.pos + e.length) == e
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
            (this.skipWhitespace = function (e) {
              for (; this.isWhitespace(this.input[this.pos]); ) this.pos++;
              if ("%" == this.input[this.pos] && 1 == e) {
                for (; "\n" != this.input[this.pos]; ) this.pos++;
                this.skipWhitespace(e);
              }
            }),
            (this.value_braces = function () {
              var e = 0;
              this.match("{", !1);
              for (var t = this.pos, n = !1; ; ) {
                if (!n)
                  if ("}" == this.input[this.pos]) {
                    if (!(e > 0)) {
                      var r = this.pos;
                      return this.match("}", !1), this.input.substring(t, r);
                    }
                    e--;
                  } else if ("{" == this.input[this.pos]) e++;
                  else if (this.pos >= this.input.length - 1)
                    throw "Unterminated value";
                (n = "\\" == this.input[this.pos] && 0 == n), this.pos++;
              }
            }),
            (this.value_comment = function () {
              for (var e = "", t = 0; !this.tryMatch("}", !1) || 0 != t; ) {
                if (
                  ((e += this.input[this.pos]),
                  "{" == this.input[this.pos] && t++,
                  "}" == this.input[this.pos] && t--,
                  this.pos >= this.input.length - 1)
                )
                  throw "Unterminated value:" + this.input.substring(start);
                this.pos++;
              }
              return e;
            }),
            (this.value_quotes = function () {
              this.match('"', !1);
              for (var e = this.pos, t = !1; ; ) {
                if (!t) {
                  if ('"' == this.input[this.pos]) {
                    var n = this.pos;
                    return this.match('"', !1), this.input.substring(e, n);
                  }
                  if (this.pos >= this.input.length - 1)
                    throw "Unterminated value:" + this.input.substring(e);
                }
                (t = "\\" == this.input[this.pos] && 0 == t), this.pos++;
              }
            }),
            (this.single_value = function () {
              var e = this.pos;
              if (this.tryMatch("{")) return this.value_braces();
              if (this.tryMatch('"')) return this.value_quotes();
              var t = this.key();
              if (t.match("^[0-9]+$")) return t;
              if (this.months.indexOf(t.toLowerCase()) >= 0)
                return t.toLowerCase();
              throw (
                "Value expected:" + this.input.substring(e) + " for key: " + t
              );
            }),
            (this.value = function () {
              var e = [];
              for (e.push(this.single_value()); this.tryMatch("#"); )
                this.match("#"), e.push(this.single_value());
              return e.join("");
            }),
            (this.key = function () {
              for (var e = this.pos; ; ) {
                if (this.pos >= this.input.length) throw "Runaway key";
                if (this.notKey.indexOf(this.input[this.pos]) >= 0)
                  return this.input.substring(e, this.pos);
                this.pos++;
              }
            }),
            (this.key_equals_value = function () {
              var e = this.key();
              if (this.tryMatch("=")) return this.match("="), [e, this.value()];
              throw (
                "... = value expected, equals sign missing:" +
                this.input.substring(this.pos)
              );
            }),
            (this.key_value_list = function () {
              var e = this.key_equals_value();
              for (
                this.currentEntry.entryTags = {},
                  this.currentEntry.entryTags[e[0]] = e[1];
                this.tryMatch(",") && (this.match(","), !this.tryMatch("}"));

              )
                (e = this.key_equals_value()),
                  (this.currentEntry.entryTags[e[0]] = e[1]);
            }),
            (this.entry_body = function (e) {
              (this.currentEntry = {}),
                (this.currentEntry.citationKey = this.key()),
                (this.currentEntry.entryType = e.substring(1)),
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
            (this.entry = function (e) {
              this.entry_body(e);
            }),
            (this.bibtex = function () {
              for (; this.matchAt(); ) {
                var e = this.directive();
                this.match("{"),
                  "@STRING" == e
                    ? this.string()
                    : "@PREAMBLE" == e
                      ? this.preamble()
                      : "@COMMENT" == e
                        ? this.comment()
                        : this.entry(e),
                  this.match("}");
              }
            });
        }
        (e.toJSON = function (e) {
          var n = new t();
          return n.setInput(e), n.bibtex(), n.entries;
        }),
          (e.toBibtex = function (e) {
            var t = "";
            for (var n in e) {
              if (
                ((t += "@" + e[n].entryType),
                (t += "{"),
                e[n].citationKey && (t += e[n].citationKey + ", "),
                e[n].entry && (t += e[n].entry),
                e[n].entryTags)
              ) {
                var r = "";
                for (var i in e[n].entryTags)
                  0 != r.length && (r += ", "),
                    (r += i + "= {" + e[n].entryTags[i] + "}");
                t += r;
              }
              t += "}\n\n";
            }
            return t;
          });
      })(t);
    }),
    ie = s(
      l(function (e) {
        var t;
        (t = function () {
          return (function e(t, n, r) {
            function i(s, l) {
              if (!n[s]) {
                if (!t[s]) {
                  var u = "function" == typeof o && o;
                  if (!l && u) return u(s, !0);
                  if (a) return a(s, !0);
                  var d = new Error("Cannot find module '" + s + "'");
                  throw ((d.code = "MODULE_NOT_FOUND"), d);
                }
                var c = (n[s] = { exports: {} });
                t[s][0].call(
                  c.exports,
                  function (e) {
                    var n = t[s][1][e];
                    return i(n || e);
                  },
                  c,
                  c.exports,
                  e,
                  t,
                  n,
                  r,
                );
              }
              return n[s].exports;
            }
            for (var a = "function" == typeof o && o, s = 0; s < r.length; s++)
              i(r[s]);
            return i;
          })(
            {
              1: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = n(e("./src/ParseError")),
                    i = n(e("./src/Settings")),
                    a = n(e("./src/buildTree")),
                    o = n(e("./src/parseTree")),
                    s = n(e("./src/utils")),
                    l = function (e, t, n) {
                      s["default"].clearNode(t);
                      var r = new i["default"](n),
                        l = (0, o["default"])(e, r),
                        u = (0, a["default"])(l, e, r).toNode();
                      t.appendChild(u);
                    };
                  "undefined" != typeof document &&
                    "CSS1Compat" !== document.compatMode &&
                    ("undefined" != typeof console &&
                      console.warn(
                        "Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype.",
                      ),
                    (l = function () {
                      throw new r["default"](
                        "KaTeX doesn't work in quirks mode.",
                      );
                    }));
                  var u = function (e, t) {
                      var n = new i["default"](t),
                        r = (0, o["default"])(e, n);
                      return (0, a["default"])(r, e, n).toMarkup();
                    },
                    d = function (e, t) {
                      var n = new i["default"](t);
                      return (0, o["default"])(e, n);
                    };
                  t.exports = {
                    render: l,
                    renderToString: u,
                    __parse: d,
                    ParseError: r["default"],
                  };
                },
                {
                  "./src/ParseError": 29,
                  "./src/Settings": 32,
                  "./src/buildTree": 37,
                  "./src/parseTree": 46,
                  "./src/utils": 51,
                },
              ],
              2: [
                function (e, t) {
                  t.exports = {
                    default: e("core-js/library/fn/json/stringify"),
                    __esModule: !0,
                  };
                },
                { "core-js/library/fn/json/stringify": 6 },
              ],
              3: [
                function (e, t) {
                  t.exports = {
                    default: e("core-js/library/fn/object/define-property"),
                    __esModule: !0,
                  };
                },
                { "core-js/library/fn/object/define-property": 7 },
              ],
              4: [
                function (e, t, n) {
                  (n.__esModule = !0),
                    (n["default"] = function (e, t) {
                      if (!(e instanceof t))
                        throw new TypeError(
                          "Cannot call a class as a function",
                        );
                    });
                },
                {},
              ],
              5: [
                function (e, t, n) {
                  function r(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  n.__esModule = !0;
                  var i = r(e("../core-js/object/define-property"));
                  n["default"] = (function () {
                    function e(e, t) {
                      for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        (r.enumerable = r.enumerable || !1),
                          (r.configurable = !0),
                          "value" in r && (r.writable = !0),
                          (0, i["default"])(e, r.key, r);
                      }
                    }
                    return function (t, n, r) {
                      return n && e(t.prototype, n), r && e(t, r), t;
                    };
                  })();
                },
                { "../core-js/object/define-property": 3 },
              ],
              6: [
                function (e, t) {
                  var n = e("../../modules/_core"),
                    r = n.JSON || (n.JSON = { stringify: JSON.stringify });
                  t.exports = function () {
                    return r.stringify.apply(r, arguments);
                  };
                },
                { "../../modules/_core": 10 },
              ],
              7: [
                function (e, t) {
                  e("../../modules/es6.object.define-property");
                  var n = e("../../modules/_core").Object;
                  t.exports = function (e, t, r) {
                    return n.defineProperty(e, t, r);
                  };
                },
                {
                  "../../modules/_core": 10,
                  "../../modules/es6.object.define-property": 23,
                },
              ],
              8: [
                function (e, t) {
                  t.exports = function (e) {
                    if ("function" != typeof e)
                      throw TypeError(e + " is not a function!");
                    return e;
                  };
                },
                {},
              ],
              9: [
                function (e, t) {
                  var n = e("./_is-object");
                  t.exports = function (e) {
                    if (!n(e)) throw TypeError(e + " is not an object!");
                    return e;
                  };
                },
                { "./_is-object": 19 },
              ],
              10: [
                function (e, t) {
                  var n = (t.exports = { version: "2.4.0" });
                  "number" == typeof __e && (__e = n);
                },
                {},
              ],
              11: [
                function (e, t) {
                  var n = e("./_a-function");
                  t.exports = function (e, t, r) {
                    if ((n(e), t === undefined)) return e;
                    switch (r) {
                      case 1:
                        return function (n) {
                          return e.call(t, n);
                        };
                      case 2:
                        return function (n, r) {
                          return e.call(t, n, r);
                        };
                      case 3:
                        return function (n, r, i) {
                          return e.call(t, n, r, i);
                        };
                    }
                    return function () {
                      return e.apply(t, arguments);
                    };
                  };
                },
                { "./_a-function": 8 },
              ],
              12: [
                function (e, t) {
                  t.exports = !e("./_fails")(function () {
                    return (
                      7 !=
                      Object.defineProperty({}, "a", {
                        get: function () {
                          return 7;
                        },
                      }).a
                    );
                  });
                },
                { "./_fails": 15 },
              ],
              13: [
                function (e, t) {
                  var n = e("./_is-object"),
                    r = e("./_global").document,
                    i = n(r) && n(r.createElement);
                  t.exports = function (e) {
                    return i ? r.createElement(e) : {};
                  };
                },
                { "./_global": 16, "./_is-object": 19 },
              ],
              14: [
                function (e, t) {
                  var n = e("./_global"),
                    r = e("./_core"),
                    i = e("./_ctx"),
                    a = e("./_hide"),
                    o = "prototype",
                    s = function (e, t, l) {
                      var u,
                        d,
                        c,
                        h = e & s.F,
                        p = e & s.G,
                        f = e & s.S,
                        m = e & s.P,
                        g = e & s.B,
                        v = e & s.W,
                        b = p ? r : r[t] || (r[t] = {}),
                        y = b[o],
                        x = p ? n : f ? n[t] : (n[t] || {})[o];
                      for (u in (p && (l = t), l))
                        ((d = !h && x && x[u] !== undefined) && u in b) ||
                          ((c = d ? x[u] : l[u]),
                          (b[u] =
                            p && "function" != typeof x[u]
                              ? l[u]
                              : g && d
                                ? i(c, n)
                                : v && x[u] == c
                                  ? (function (e) {
                                      var t = function (t, n, r) {
                                        if (this instanceof e) {
                                          switch (arguments.length) {
                                            case 0:
                                              return new e();
                                            case 1:
                                              return new e(t);
                                            case 2:
                                              return new e(t, n);
                                          }
                                          return new e(t, n, r);
                                        }
                                        return e.apply(this, arguments);
                                      };
                                      return (t[o] = e[o]), t;
                                    })(c)
                                  : m && "function" == typeof c
                                    ? i(Function.call, c)
                                    : c),
                          m &&
                            (((b.virtual || (b.virtual = {}))[u] = c),
                            e & s.R && y && !y[u] && a(y, u, c)));
                    };
                  (s.F = 1),
                    (s.G = 2),
                    (s.S = 4),
                    (s.P = 8),
                    (s.B = 16),
                    (s.W = 32),
                    (s.U = 64),
                    (s.R = 128),
                    (t.exports = s);
                },
                { "./_core": 10, "./_ctx": 11, "./_global": 16, "./_hide": 17 },
              ],
              15: [
                function (e, t) {
                  t.exports = function (e) {
                    try {
                      return !!e();
                    } catch (t) {
                      return !0;
                    }
                  };
                },
                {},
              ],
              16: [
                function (e, t) {
                  var n = (t.exports =
                    "undefined" != typeof window && window.Math == Math
                      ? window
                      : "undefined" != typeof self && self.Math == Math
                        ? self
                        : Function("return this")());
                  "number" == typeof __g && (__g = n);
                },
                {},
              ],
              17: [
                function (e, t) {
                  var n = e("./_object-dp"),
                    r = e("./_property-desc");
                  t.exports = e("./_descriptors")
                    ? function (e, t, i) {
                        return n.f(e, t, r(1, i));
                      }
                    : function (e, t, n) {
                        return (e[t] = n), e;
                      };
                },
                {
                  "./_descriptors": 12,
                  "./_object-dp": 20,
                  "./_property-desc": 21,
                },
              ],
              18: [
                function (e, t) {
                  t.exports =
                    !e("./_descriptors") &&
                    !e("./_fails")(function () {
                      return (
                        7 !=
                        Object.defineProperty(e("./_dom-create")("div"), "a", {
                          get: function () {
                            return 7;
                          },
                        }).a
                      );
                    });
                },
                { "./_descriptors": 12, "./_dom-create": 13, "./_fails": 15 },
              ],
              19: [
                function (e, t) {
                  t.exports = function (e) {
                    return "object" == typeof e
                      ? null !== e
                      : "function" == typeof e;
                  };
                },
                {},
              ],
              20: [
                function (e, t, n) {
                  var r = e("./_an-object"),
                    i = e("./_ie8-dom-define"),
                    a = e("./_to-primitive"),
                    o = Object.defineProperty;
                  n.f = e("./_descriptors")
                    ? Object.defineProperty
                    : function (e, t, n) {
                        if ((r(e), (t = a(t, !0)), r(n), i))
                          try {
                            return o(e, t, n);
                          } catch (s) {}
                        if ("get" in n || "set" in n)
                          throw TypeError("Accessors not supported!");
                        return "value" in n && (e[t] = n.value), e;
                      };
                },
                {
                  "./_an-object": 9,
                  "./_descriptors": 12,
                  "./_ie8-dom-define": 18,
                  "./_to-primitive": 22,
                },
              ],
              21: [
                function (e, t) {
                  t.exports = function (e, t) {
                    return {
                      enumerable: !(1 & e),
                      configurable: !(2 & e),
                      writable: !(4 & e),
                      value: t,
                    };
                  };
                },
                {},
              ],
              22: [
                function (e, t) {
                  var n = e("./_is-object");
                  t.exports = function (e, t) {
                    if (!n(e)) return e;
                    var r, i;
                    if (
                      t &&
                      "function" == typeof (r = e.toString) &&
                      !n((i = r.call(e)))
                    )
                      return i;
                    if (
                      "function" == typeof (r = e.valueOf) &&
                      !n((i = r.call(e)))
                    )
                      return i;
                    if (
                      !t &&
                      "function" == typeof (r = e.toString) &&
                      !n((i = r.call(e)))
                    )
                      return i;
                    throw TypeError("Can't convert object to primitive value");
                  };
                },
                { "./_is-object": 19 },
              ],
              23: [
                function (e) {
                  var t = e("./_export");
                  t(t.S + t.F * !e("./_descriptors"), "Object", {
                    defineProperty: e("./_object-dp").f,
                  });
                },
                { "./_descriptors": 12, "./_export": 14, "./_object-dp": 20 },
              ],
              24: [
                function (e, t) {
                  function n(e) {
                    if (!e.__matchAtRelocatable) {
                      var t = e.source + "|()",
                        n =
                          "g" +
                          (e.ignoreCase ? "i" : "") +
                          (e.multiline ? "m" : "") +
                          (e.unicode ? "u" : "");
                      e.__matchAtRelocatable = new RegExp(t, n);
                    }
                    return e.__matchAtRelocatable;
                  }
                  function r(e, t, r) {
                    if (e.global || e.sticky)
                      throw new Error(
                        "matchAt(...): Only non-global regexes are supported",
                      );
                    var i = n(e);
                    i.lastIndex = r;
                    var a = i.exec(t);
                    return null == a[a.length - 1]
                      ? ((a.length = a.length - 1), a)
                      : null;
                  }
                  t.exports = r;
                },
                {},
              ],
              25: [
                function (e, t) {
                  function n(e) {
                    if (null === e || e === undefined)
                      throw new TypeError(
                        "Object.assign cannot be called with null or undefined",
                      );
                    return Object(e);
                  }
                  function r() {
                    try {
                      if (!Object.assign) return !1;
                      var e = new String("abc");
                      if (
                        ((e[5] = "de"),
                        "5" === Object.getOwnPropertyNames(e)[0])
                      )
                        return !1;
                      for (var t = {}, n = 0; n < 10; n++)
                        t["_" + String.fromCharCode(n)] = n;
                      if (
                        "0123456789" !==
                        Object.getOwnPropertyNames(t)
                          .map(function (e) {
                            return t[e];
                          })
                          .join("")
                      )
                        return !1;
                      var r = {};
                      return (
                        "abcdefghijklmnopqrst".split("").forEach(function (e) {
                          r[e] = e;
                        }),
                        "abcdefghijklmnopqrst" ===
                          Object.keys(Object.assign({}, r)).join("")
                      );
                    } catch (i) {
                      return !1;
                    }
                  }
                  var i = Object.prototype.hasOwnProperty,
                    a = Object.prototype.propertyIsEnumerable;
                  t.exports = r()
                    ? Object.assign
                    : function (e) {
                        for (
                          var t, r, o = n(e), s = 1;
                          s < arguments.length;
                          s++
                        ) {
                          for (var l in (t = Object(arguments[s])))
                            i.call(t, l) && (o[l] = t[l]);
                          if (Object.getOwnPropertySymbols) {
                            r = Object.getOwnPropertySymbols(t);
                            for (var u = 0; u < r.length; u++)
                              a.call(t, r[u]) && (o[r[u]] = t[r[u]]);
                          }
                        }
                        return o;
                      };
                },
                {},
              ],
              26: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = n(e("babel-runtime/helpers/classCallCheck")),
                    i = n(e("babel-runtime/helpers/createClass")),
                    a = n(e("match-at")),
                    o = n(e("./ParseError")),
                    s = (function () {
                      function e(t, n, i, a) {
                        (0, r["default"])(this, e),
                          (this.text = t),
                          (this.start = n),
                          (this.end = i),
                          (this.lexer = a);
                      }
                      return (
                        (0, i["default"])(e, [
                          {
                            key: "range",
                            value: function (t, n) {
                              return t.lexer !== this.lexer
                                ? new e(n)
                                : new e(n, this.start, t.end, this.lexer);
                            },
                          },
                        ]),
                        e
                      );
                    })(),
                    l = new RegExp(
                      "([ \r\n\t]+)|([!-\\[\\]-\u2027\u202a-\ud7ff\uf900-\uffff]|[\ud800-\udbff][\udc00-\udfff]|\\\\(?:[a-zA-Z]+|[^\ud800-\udfff]))",
                    ),
                    u = (function () {
                      function e(t) {
                        (0, r["default"])(this, e),
                          (this.input = t),
                          (this.pos = 0);
                      }
                      return (
                        (0, i["default"])(e, [
                          {
                            key: "lex",
                            value: function () {
                              var e = this.input,
                                t = this.pos;
                              if (t === e.length)
                                return new s("EOF", t, t, this);
                              var n = (0, a["default"])(l, e, t);
                              if (null === n)
                                throw new o["default"](
                                  "Unexpected character: '" + e[t] + "'",
                                  new s(e[t], t, t + 1, this),
                                );
                              var r = n[2] || " ",
                                i = this.pos;
                              this.pos += n[0].length;
                              var u = this.pos;
                              return new s(r, i, u, this);
                            },
                          },
                        ]),
                        e
                      );
                    })();
                  t.exports = u;
                },
                {
                  "./ParseError": 29,
                  "babel-runtime/helpers/classCallCheck": 4,
                  "babel-runtime/helpers/createClass": 5,
                  "match-at": 24,
                },
              ],
              27: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = n(e("babel-runtime/helpers/classCallCheck")),
                    i = n(e("babel-runtime/helpers/createClass")),
                    a = n(e("./Lexer")),
                    o = n(e("./macros")),
                    s = n(e("./ParseError")),
                    l = n(e("object-assign")),
                    u = (function () {
                      function e(t, n) {
                        (0, r["default"])(this, e),
                          (this.lexer = new a["default"](t)),
                          (this.macros = (0, l["default"])(
                            {},
                            o["default"],
                            n,
                          )),
                          (this.stack = []),
                          (this.discardedWhiteSpace = []);
                      }
                      return (
                        (0, i["default"])(e, [
                          {
                            key: "nextToken",
                            value: function () {
                              for (;;) {
                                0 === this.stack.length &&
                                  this.stack.push(this.lexer.lex());
                                var e = this.stack.pop(),
                                  t = e.text;
                                if (
                                  "\\" !== t.charAt(0) ||
                                  !this.macros.hasOwnProperty(t)
                                )
                                  return e;
                                var n = void 0,
                                  r = this.macros[t];
                                if ("string" == typeof r) {
                                  var i = 0;
                                  if (-1 !== r.indexOf("#"))
                                    for (
                                      var o = r.replace(/##/g, "");
                                      -1 !== o.indexOf("#" + (i + 1));

                                    )
                                      ++i;
                                  var l = new a["default"](r);
                                  for (r = [], n = l.lex(); "EOF" !== n.text; )
                                    r.push(n), (n = l.lex());
                                  r.reverse(),
                                    (r.numArgs = i),
                                    (this.macros[t] = r);
                                }
                                if (r.numArgs) {
                                  var u = [],
                                    d = void 0;
                                  for (d = 0; d < r.numArgs; ++d) {
                                    var c = this.get(!0);
                                    if ("{" === c.text) {
                                      for (var h = [], p = 1; 0 !== p; )
                                        if (
                                          ((n = this.get(!1)),
                                          h.push(n),
                                          "{" === n.text)
                                        )
                                          ++p;
                                        else if ("}" === n.text) --p;
                                        else if ("EOF" === n.text)
                                          throw new s["default"](
                                            "End of input in macro argument",
                                            c,
                                          );
                                      h.pop(), h.reverse(), (u[d] = h);
                                    } else {
                                      if ("EOF" === c.text)
                                        throw new s["default"](
                                          "End of input expecting macro argument",
                                          e,
                                        );
                                      u[d] = [c];
                                    }
                                  }
                                  for (
                                    d = (r = r.slice()).length - 1;
                                    d >= 0;
                                    --d
                                  )
                                    if ("#" === (n = r[d]).text) {
                                      if (0 === d)
                                        throw new s["default"](
                                          "Incomplete placeholder at end of macro body",
                                          n,
                                        );
                                      if ("#" === (n = r[--d]).text)
                                        r.splice(d + 1, 1);
                                      else {
                                        if (!/^[1-9]$/.test(n.text))
                                          throw new s["default"](
                                            "Not a valid argument number",
                                            n,
                                          );
                                        r.splice.apply(
                                          r,
                                          [d, 2].concat(u[n.text - 1]),
                                        );
                                      }
                                    }
                                }
                                this.stack = this.stack.concat(r);
                              }
                            },
                          },
                          {
                            key: "get",
                            value: function (e) {
                              this.discardedWhiteSpace = [];
                              var t = this.nextToken();
                              if (e)
                                for (; " " === t.text; )
                                  this.discardedWhiteSpace.push(t),
                                    (t = this.nextToken());
                              return t;
                            },
                          },
                          {
                            key: "unget",
                            value: function (e) {
                              for (
                                this.stack.push(e);
                                0 !== this.discardedWhiteSpace.length;

                              )
                                this.stack.push(this.discardedWhiteSpace.pop());
                            },
                          },
                        ]),
                        e
                      );
                    })();
                  t.exports = u;
                },
                {
                  "./Lexer": 26,
                  "./ParseError": 29,
                  "./macros": 44,
                  "babel-runtime/helpers/classCallCheck": 4,
                  "babel-runtime/helpers/createClass": 5,
                  "object-assign": 25,
                },
              ],
              28: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = n(e("babel-runtime/helpers/classCallCheck")),
                    i = n(e("babel-runtime/helpers/createClass")),
                    a = n(e("./fontMetrics")),
                    o = 6,
                    s = [
                      [1, 1, 1],
                      [2, 1, 1],
                      [3, 1, 1],
                      [4, 2, 1],
                      [5, 2, 1],
                      [6, 3, 1],
                      [7, 4, 2],
                      [8, 6, 3],
                      [9, 7, 6],
                      [10, 8, 7],
                      [11, 10, 9],
                    ],
                    l = [
                      0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.2, 1.44, 1.728, 2.074,
                      2.488,
                    ],
                    u = function (e, t) {
                      return t.size < 2 ? e : s[e - 1][t.size - 1];
                    },
                    d = (function () {
                      function e(t) {
                        (0, r["default"])(this, e),
                          (this.style = t.style),
                          (this.color = t.color),
                          (this.size = t.size || o),
                          (this.textSize = t.textSize || this.size),
                          (this.phantom = t.phantom),
                          (this.font = t.font),
                          (this.sizeMultiplier = l[this.size - 1]),
                          (this._fontMetrics = null);
                      }
                      return (
                        (0, i["default"])(e, [
                          {
                            key: "extend",
                            value: function (t) {
                              var n = {
                                style: this.style,
                                size: this.size,
                                textSize: this.textSize,
                                color: this.color,
                                phantom: this.phantom,
                                font: this.font,
                              };
                              for (var r in t)
                                t.hasOwnProperty(r) && (n[r] = t[r]);
                              return new e(n);
                            },
                          },
                          {
                            key: "havingStyle",
                            value: function (e) {
                              return this.style === e
                                ? this
                                : this.extend({
                                    style: e,
                                    size: u(this.textSize, e),
                                  });
                            },
                          },
                          {
                            key: "havingCrampedStyle",
                            value: function () {
                              return this.havingStyle(this.style.cramp());
                            },
                          },
                          {
                            key: "havingSize",
                            value: function (e) {
                              return this.size === e && this.textSize === e
                                ? this
                                : this.extend({
                                    style: this.style.text(),
                                    size: e,
                                    textSize: e,
                                  });
                            },
                          },
                          {
                            key: "havingBaseStyle",
                            value: function (e) {
                              e = e || this.style.text();
                              var t = u(o, e);
                              return this.size === t &&
                                this.textSize === o &&
                                this.style === e
                                ? this
                                : this.extend({
                                    style: e,
                                    size: t,
                                    baseSize: o,
                                  });
                            },
                          },
                          {
                            key: "withColor",
                            value: function (e) {
                              return this.extend({ color: e });
                            },
                          },
                          {
                            key: "withPhantom",
                            value: function () {
                              return this.extend({ phantom: !0 });
                            },
                          },
                          {
                            key: "withFont",
                            value: function (e) {
                              return this.extend({ font: e || this.font });
                            },
                          },
                          {
                            key: "sizingClasses",
                            value: function (e) {
                              return e.size !== this.size
                                ? [
                                    "sizing",
                                    "reset-size" + e.size,
                                    "size" + this.size,
                                  ]
                                : [];
                            },
                          },
                          {
                            key: "baseSizingClasses",
                            value: function () {
                              return this.size !== o
                                ? [
                                    "sizing",
                                    "reset-size" + this.size,
                                    "size" + o,
                                  ]
                                : [];
                            },
                          },
                          {
                            key: "fontMetrics",
                            value: function () {
                              return (
                                this._fontMetrics ||
                                  (this._fontMetrics = a[
                                    "default"
                                  ].getFontMetrics(this.size)),
                                this._fontMetrics
                              );
                            },
                          },
                          {
                            key: "getColor",
                            value: function () {
                              return this.phantom
                                ? "transparent"
                                : e.colorMap[this.color] || this.color;
                            },
                          },
                        ]),
                        e
                      );
                    })();
                  (d.colorMap = {
                    "katex-blue": "#6495ed",
                    "katex-orange": "#ffa500",
                    "katex-pink": "#ff00af",
                    "katex-red": "#df0030",
                    "katex-green": "#28ae7b",
                    "katex-gray": "gray",
                    "katex-purple": "#9d38bd",
                    "katex-blueA": "#ccfaff",
                    "katex-blueB": "#80f6ff",
                    "katex-blueC": "#63d9ea",
                    "katex-blueD": "#11accd",
                    "katex-blueE": "#0c7f99",
                    "katex-tealA": "#94fff5",
                    "katex-tealB": "#26edd5",
                    "katex-tealC": "#01d1c1",
                    "katex-tealD": "#01a995",
                    "katex-tealE": "#208170",
                    "katex-greenA": "#b6ffb0",
                    "katex-greenB": "#8af281",
                    "katex-greenC": "#74cf70",
                    "katex-greenD": "#1fab54",
                    "katex-greenE": "#0d923f",
                    "katex-goldA": "#ffd0a9",
                    "katex-goldB": "#ffbb71",
                    "katex-goldC": "#ff9c39",
                    "katex-goldD": "#e07d10",
                    "katex-goldE": "#a75a05",
                    "katex-redA": "#fca9a9",
                    "katex-redB": "#ff8482",
                    "katex-redC": "#f9685d",
                    "katex-redD": "#e84d39",
                    "katex-redE": "#bc2612",
                    "katex-maroonA": "#ffbde0",
                    "katex-maroonB": "#ff92c6",
                    "katex-maroonC": "#ed5fa6",
                    "katex-maroonD": "#ca337c",
                    "katex-maroonE": "#9e034e",
                    "katex-purpleA": "#ddd7ff",
                    "katex-purpleB": "#c6b9fc",
                    "katex-purpleC": "#aa87ff",
                    "katex-purpleD": "#7854ab",
                    "katex-purpleE": "#543b78",
                    "katex-mintA": "#f5f9e8",
                    "katex-mintB": "#edf2df",
                    "katex-mintC": "#e0e5cc",
                    "katex-grayA": "#f6f7f7",
                    "katex-grayB": "#f0f1f2",
                    "katex-grayC": "#e3e5e6",
                    "katex-grayD": "#d6d8da",
                    "katex-grayE": "#babec2",
                    "katex-grayF": "#888d93",
                    "katex-grayG": "#626569",
                    "katex-grayH": "#3b3e40",
                    "katex-grayI": "#21242c",
                    "katex-kaBlue": "#314453",
                    "katex-kaGreen": "#71B307",
                  }),
                    (d.BASESIZE = o),
                    (t.exports = d);
                },
                {
                  "./fontMetrics": 41,
                  "babel-runtime/helpers/classCallCheck": 4,
                  "babel-runtime/helpers/createClass": 5,
                },
              ],
              29: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = n(e("babel-runtime/helpers/classCallCheck")),
                    i = function a(e, t) {
                      (0, r["default"])(this, a);
                      var n = "KaTeX parse error: " + e,
                        i = void 0,
                        o = void 0;
                      if (t && t.lexer && t.start <= t.end) {
                        var s = t.lexer.input;
                        (i = t.start),
                          (o = t.end),
                          i === s.length
                            ? (n += " at end of input: ")
                            : (n += " at position " + (i + 1) + ": ");
                        var l = s.slice(i, o).replace(/[^]/g, "$&\u0332");
                        n +=
                          (i > 15
                            ? "\u2026" + s.slice(i - 15, i)
                            : s.slice(0, i)) +
                          l +
                          (o + 15 < s.length
                            ? s.slice(o, o + 15) + "\u2026"
                            : s.slice(o));
                      }
                      var u = new Error(n);
                      return (
                        (u.name = "ParseError"),
                        (u.__proto__ = a.prototype),
                        (u.position = i),
                        u
                      );
                    };
                  (i.prototype.__proto__ = Error.prototype), (t.exports = i);
                },
                { "babel-runtime/helpers/classCallCheck": 4 },
              ],
              30: [
                function (e, t, n) {
                  function r(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  Object.defineProperty(n, "__esModule", { value: !0 });
                  var i = r(e("babel-runtime/helpers/classCallCheck")),
                    a = function o(e, t, n, r, a) {
                      (0, i["default"])(this, o),
                        (this.type = e),
                        (this.value = t),
                        (this.mode = n),
                        !r ||
                          (a && a.lexer !== r.lexer) ||
                          ((this.lexer = r.lexer),
                          (this.start = r.start),
                          (this.end = (a || r).end));
                    };
                  n["default"] = a;
                },
                { "babel-runtime/helpers/classCallCheck": 4 },
              ],
              31: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  function r(e, t, n) {
                    (this.result = e), (this.isFunction = t), (this.token = n);
                  }
                  var i = n(e("babel-runtime/helpers/classCallCheck")),
                    a = n(e("babel-runtime/helpers/createClass")),
                    o = n(e("./functions")),
                    s = n(e("./environments")),
                    l = n(e("./MacroExpander")),
                    u = n(e("./symbols")),
                    d = n(e("./utils")),
                    c = n(e("./units")),
                    h = e("./unicodeRegexes"),
                    p = n(e("./ParseNode")),
                    f = n(e("./ParseError")),
                    m = (function () {
                      function e(t, n) {
                        (0, i["default"])(this, e),
                          (this.gullet = new l["default"](t, n.macros)),
                          n.colorIsTextColor &&
                            (this.gullet.macros["\\color"] = "\\textcolor"),
                          (this.settings = n),
                          (this.leftrightDepth = 0);
                      }
                      return (
                        (0, a["default"])(e, [
                          {
                            key: "expect",
                            value: function (e, t) {
                              if (this.nextToken.text !== e)
                                throw new f["default"](
                                  "Expected '" +
                                    e +
                                    "', got '" +
                                    this.nextToken.text +
                                    "'",
                                  this.nextToken,
                                );
                              !1 !== t && this.consume();
                            },
                          },
                          {
                            key: "consume",
                            value: function () {
                              this.nextToken = this.gullet.get(
                                "math" === this.mode,
                              );
                            },
                          },
                          {
                            key: "switchMode",
                            value: function (e) {
                              this.gullet.unget(this.nextToken),
                                (this.mode = e),
                                this.consume();
                            },
                          },
                          {
                            key: "parse",
                            value: function () {
                              (this.mode = "math"), this.consume();
                              var e = this.parseInput();
                              return e;
                            },
                          },
                          {
                            key: "parseInput",
                            value: function () {
                              var e = this.parseExpression(!1);
                              return this.expect("EOF", !1), e;
                            },
                          },
                          {
                            key: "parseExpression",
                            value: function (t, n) {
                              for (var r = []; ; ) {
                                var i = this.nextToken;
                                if (-1 !== e.endOfExpression.indexOf(i.text))
                                  break;
                                if (n && i.text === n) break;
                                if (
                                  t &&
                                  o["default"][i.text] &&
                                  o["default"][i.text].infix
                                )
                                  break;
                                var a = this.parseAtom();
                                if (!a) {
                                  if (
                                    !this.settings.throwOnError &&
                                    "\\" === i.text[0]
                                  ) {
                                    var s = this.handleUnsupportedCmd();
                                    r.push(s);
                                    continue;
                                  }
                                  break;
                                }
                                r.push(a);
                              }
                              return this.handleInfixNodes(r);
                            },
                          },
                          {
                            key: "handleInfixNodes",
                            value: function (e) {
                              for (
                                var t = -1, n = void 0, r = 0;
                                r < e.length;
                                r++
                              ) {
                                var i = e[r];
                                if ("infix" === i.type) {
                                  if (-1 !== t)
                                    throw new f["default"](
                                      "only one infix operator per group",
                                      i.value.token,
                                    );
                                  (t = r), (n = i.value.replaceWith);
                                }
                              }
                              if (-1 !== t) {
                                var a = void 0,
                                  o = void 0,
                                  s = e.slice(0, t),
                                  l = e.slice(t + 1);
                                (a =
                                  1 === s.length && "ordgroup" === s[0].type
                                    ? s[0]
                                    : new p["default"](
                                        "ordgroup",
                                        s,
                                        this.mode,
                                      )),
                                  (o =
                                    1 === l.length && "ordgroup" === l[0].type
                                      ? l[0]
                                      : new p["default"](
                                          "ordgroup",
                                          l,
                                          this.mode,
                                        ));
                                var u = this.callFunction(n, [a, o], null);
                                return [new p["default"](u.type, u, this.mode)];
                              }
                              return e;
                            },
                          },
                          {
                            key: "handleSupSubscript",
                            value: function (t) {
                              var n = this.nextToken,
                                r = n.text;
                              this.consume();
                              var i = this.parseGroup();
                              if (i) {
                                if (i.isFunction) {
                                  if (
                                    o["default"][i.result].greediness >
                                    e.SUPSUB_GREEDINESS
                                  )
                                    return this.parseFunction(i);
                                  throw new f["default"](
                                    "Got function '" +
                                      i.result +
                                      "' with no arguments as " +
                                      t,
                                    n,
                                  );
                                }
                                return i.result;
                              }
                              if (
                                this.settings.throwOnError ||
                                "\\" !== this.nextToken.text[0]
                              )
                                throw new f["default"](
                                  "Expected group after '" + r + "'",
                                  n,
                                );
                              return this.handleUnsupportedCmd();
                            },
                          },
                          {
                            key: "handleUnsupportedCmd",
                            value: function () {
                              for (
                                var e = this.nextToken.text, t = [], n = 0;
                                n < e.length;
                                n++
                              )
                                t.push(
                                  new p["default"]("textord", e[n], "text"),
                                );
                              var r = new p["default"](
                                  "text",
                                  { body: t, type: "text" },
                                  this.mode,
                                ),
                                i = new p["default"](
                                  "color",
                                  {
                                    color: this.settings.errorColor,
                                    value: [r],
                                    type: "color",
                                  },
                                  this.mode,
                                );
                              return this.consume(), i;
                            },
                          },
                          {
                            key: "parseAtom",
                            value: function () {
                              var e = this.parseImplicitGroup();
                              if ("text" === this.mode) return e;
                              for (var t = void 0, n = void 0; ; ) {
                                var r = this.nextToken;
                                if (
                                  "\\limits" === r.text ||
                                  "\\nolimits" === r.text
                                ) {
                                  if (!e || "op" !== e.type)
                                    throw new f["default"](
                                      "Limit controls must follow a math operator",
                                      r,
                                    );
                                  var i = "\\limits" === r.text;
                                  (e.value.limits = i),
                                    (e.value.alwaysHandleSupSub = !0),
                                    this.consume();
                                } else if ("^" === r.text) {
                                  if (t)
                                    throw new f["default"](
                                      "Double superscript",
                                      r,
                                    );
                                  t = this.handleSupSubscript("superscript");
                                } else if ("_" === r.text) {
                                  if (n)
                                    throw new f["default"](
                                      "Double subscript",
                                      r,
                                    );
                                  n = this.handleSupSubscript("subscript");
                                } else {
                                  if ("'" !== r.text) break;
                                  if (t)
                                    throw new f["default"](
                                      "Double superscript",
                                      r,
                                    );
                                  var a = new p["default"](
                                      "textord",
                                      "\\prime",
                                      this.mode,
                                    ),
                                    o = [a];
                                  for (
                                    this.consume();
                                    "'" === this.nextToken.text;

                                  )
                                    o.push(a), this.consume();
                                  "^" === this.nextToken.text &&
                                    o.push(
                                      this.handleSupSubscript("superscript"),
                                    ),
                                    (t = new p["default"](
                                      "ordgroup",
                                      o,
                                      this.mode,
                                    ));
                                }
                              }
                              return t || n
                                ? new p["default"](
                                    "supsub",
                                    { base: e, sup: t, sub: n },
                                    this.mode,
                                  )
                                : e;
                            },
                          },
                          {
                            key: "parseImplicitGroup",
                            value: function () {
                              var t = this.parseSymbol();
                              if (null == t) return this.parseFunction();
                              var n = t.result;
                              if ("\\left" === n) {
                                var r = this.parseFunction(t);
                                ++this.leftrightDepth;
                                var i = this.parseExpression(!1);
                                --this.leftrightDepth,
                                  this.expect("\\right", !1);
                                var a = this.parseFunction();
                                return new p["default"](
                                  "leftright",
                                  {
                                    body: i,
                                    left: r.value.value,
                                    right: a.value.value,
                                  },
                                  this.mode,
                                );
                              }
                              if ("\\begin" === n) {
                                var o = this.parseFunction(t),
                                  l = o.value.name;
                                if (!s["default"].hasOwnProperty(l))
                                  throw new f["default"](
                                    "No such environment: " + l,
                                    o.value.nameGroup,
                                  );
                                var u = s["default"][l],
                                  c = this.parseArguments(
                                    "\\begin{" + l + "}",
                                    u,
                                  ),
                                  h = {
                                    mode: this.mode,
                                    envName: l,
                                    parser: this,
                                    positions: c.pop(),
                                  },
                                  m = u.handler(h, c);
                                this.expect("\\end", !1);
                                var g = this.nextToken,
                                  v = this.parseFunction();
                                if (v.value.name !== l)
                                  throw new f["default"](
                                    "Mismatch: \\begin{" +
                                      l +
                                      "} matched by \\end{" +
                                      v.value.name +
                                      "}",
                                    g,
                                  );
                                return (m.position = v.position), m;
                              }
                              if (d["default"].contains(e.sizeFuncs, n)) {
                                this.consumeSpaces();
                                var b = this.parseExpression(!1);
                                return new p["default"](
                                  "sizing",
                                  {
                                    size:
                                      d["default"].indexOf(e.sizeFuncs, n) + 1,
                                    value: b,
                                  },
                                  this.mode,
                                );
                              }
                              if (d["default"].contains(e.styleFuncs, n)) {
                                this.consumeSpaces();
                                var y = this.parseExpression(!0);
                                return new p["default"](
                                  "styling",
                                  { style: n.slice(1, n.length - 5), value: y },
                                  this.mode,
                                );
                              }
                              if (n in e.oldFontFuncs) {
                                var x = e.oldFontFuncs[n];
                                this.consumeSpaces();
                                var w = this.parseExpression(!0);
                                return "text" === x.slice(0, 4)
                                  ? new p["default"](
                                      "text",
                                      {
                                        style: x,
                                        body: new p["default"](
                                          "ordgroup",
                                          w,
                                          this.mode,
                                        ),
                                      },
                                      this.mode,
                                    )
                                  : new p["default"](
                                      "font",
                                      {
                                        font: x,
                                        body: new p["default"](
                                          "ordgroup",
                                          w,
                                          this.mode,
                                        ),
                                      },
                                      this.mode,
                                    );
                              }
                              if ("\\color" === n) {
                                var k = this.parseColorGroup(!1);
                                if (!k)
                                  throw new f["default"](
                                    "\\color not followed by color",
                                  );
                                var M = this.parseExpression(!0);
                                return new p["default"](
                                  "color",
                                  {
                                    type: "color",
                                    color: k.result.value,
                                    value: M,
                                  },
                                  this.mode,
                                );
                              }
                              if ("$" === n) {
                                if ("math" === this.mode)
                                  throw new f["default"]("$ within math mode");
                                this.consume();
                                var S = this.mode;
                                this.switchMode("math");
                                var z = this.parseExpression(!1, "$");
                                return (
                                  this.expect("$", !0),
                                  this.switchMode(S),
                                  new p["default"](
                                    "styling",
                                    { style: "text", value: z },
                                    "math",
                                  )
                                );
                              }
                              return this.parseFunction(t);
                            },
                          },
                          {
                            key: "parseFunction",
                            value: function (e) {
                              if ((e || (e = this.parseGroup()), e)) {
                                if (e.isFunction) {
                                  var t = e.result,
                                    n = o["default"][t];
                                  if ("text" === this.mode && !n.allowedInText)
                                    throw new f["default"](
                                      "Can't use function '" +
                                        t +
                                        "' in text mode",
                                      e.token,
                                    );
                                  if (
                                    "math" === this.mode &&
                                    !1 === n.allowedInMath
                                  )
                                    throw new f["default"](
                                      "Can't use function '" +
                                        t +
                                        "' in math mode",
                                      e.token,
                                    );
                                  var r = this.parseArguments(t, n),
                                    i = e.token,
                                    a = this.callFunction(t, r, r.pop(), i);
                                  return new p["default"](a.type, a, this.mode);
                                }
                                return e.result;
                              }
                              return null;
                            },
                          },
                          {
                            key: "callFunction",
                            value: function (e, t, n, r) {
                              var i = {
                                funcName: e,
                                parser: this,
                                positions: n,
                                token: r,
                              };
                              return o["default"][e].handler(i, t);
                            },
                          },
                          {
                            key: "parseArguments",
                            value: function (e, t) {
                              var n = t.numArgs + t.numOptionalArgs;
                              if (0 === n) return [[this.pos]];
                              for (
                                var i = t.greediness,
                                  a = [this.pos],
                                  s = [],
                                  l = 0;
                                l < n;
                                l++
                              ) {
                                var u = this.nextToken,
                                  d = t.argTypes && t.argTypes[l],
                                  c = void 0;
                                if (l < t.numOptionalArgs) {
                                  if (
                                    !(c = d
                                      ? this.parseGroupOfType(d, !0)
                                      : this.parseGroup(!0))
                                  ) {
                                    s.push(null), a.push(this.pos);
                                    continue;
                                  }
                                } else if (
                                  !(c = d
                                    ? this.parseGroupOfType(d)
                                    : this.parseGroup())
                                ) {
                                  if (
                                    this.settings.throwOnError ||
                                    "\\" !== this.nextToken.text[0]
                                  )
                                    throw new f["default"](
                                      "Expected group after '" + e + "'",
                                      u,
                                    );
                                  c = new r(
                                    this.handleUnsupportedCmd(
                                      this.nextToken.text,
                                    ),
                                    !1,
                                  );
                                }
                                var h = void 0;
                                if (c.isFunction) {
                                  if (!(o["default"][c.result].greediness > i))
                                    throw new f["default"](
                                      "Got function '" +
                                        c.result +
                                        "' as argument to '" +
                                        e +
                                        "'",
                                      u,
                                    );
                                  h = this.parseFunction(c);
                                } else h = c.result;
                                s.push(h), a.push(this.pos);
                              }
                              return s.push(a), s;
                            },
                          },
                          {
                            key: "parseGroupOfType",
                            value: function (e, t) {
                              var n = this.mode;
                              if (("original" === e && (e = n), "color" === e))
                                return this.parseColorGroup(t);
                              if ("size" === e) return this.parseSizeGroup(t);
                              this.switchMode(e),
                                "text" === e && this.consumeSpaces();
                              var r = this.parseGroup(t);
                              return this.switchMode(n), r;
                            },
                          },
                          {
                            key: "consumeSpaces",
                            value: function () {
                              for (; " " === this.nextToken.text; )
                                this.consume();
                            },
                          },
                          {
                            key: "parseStringGroup",
                            value: function (e, t) {
                              if (t && "[" !== this.nextToken.text) return null;
                              var n = this.mode;
                              (this.mode = "text"), this.expect(t ? "[" : "{");
                              for (
                                var r = "", i = this.nextToken, a = i;
                                this.nextToken.text !== (t ? "]" : "}");

                              ) {
                                if ("EOF" === this.nextToken.text)
                                  throw new f["default"](
                                    "Unexpected end of input in " + e,
                                    i.range(this.nextToken, r),
                                  );
                                (r += (a = this.nextToken).text),
                                  this.consume();
                              }
                              return (
                                (this.mode = n),
                                this.expect(t ? "]" : "}"),
                                i.range(a, r)
                              );
                            },
                          },
                          {
                            key: "parseRegexGroup",
                            value: function (e, t) {
                              var n = this.mode;
                              this.mode = "text";
                              for (
                                var r = this.nextToken, i = r, a = "";
                                "EOF" !== this.nextToken.text &&
                                e.test(a + this.nextToken.text);

                              )
                                (a += (i = this.nextToken).text),
                                  this.consume();
                              if ("" === a)
                                throw new f["default"](
                                  "Invalid " + t + ": '" + r.text + "'",
                                  r,
                                );
                              return (this.mode = n), r.range(i, a);
                            },
                          },
                          {
                            key: "parseColorGroup",
                            value: function (e) {
                              var t = this.parseStringGroup("color", e);
                              if (!t) return null;
                              var n = /^(#[a-z0-9]+|[a-z]+)$/i.exec(t.text);
                              if (!n)
                                throw new f["default"](
                                  "Invalid color: '" + t.text + "'",
                                  t,
                                );
                              return new r(
                                new p["default"]("color", n[0], this.mode),
                                !1,
                              );
                            },
                          },
                          {
                            key: "parseSizeGroup",
                            value: function (e) {
                              var t = void 0;
                              if (
                                !(t =
                                  e || "{" === this.nextToken.text
                                    ? this.parseStringGroup("size", e)
                                    : this.parseRegexGroup(
                                        /^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/,
                                        "size",
                                      ))
                              )
                                return null;
                              var n =
                                /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(
                                  t.text,
                                );
                              if (!n)
                                throw new f["default"](
                                  "Invalid size: '" + t.text + "'",
                                  t,
                                );
                              var i = { number: +(n[1] + n[2]), unit: n[3] };
                              if (!c["default"].validUnit(i))
                                throw new f["default"](
                                  "Invalid unit: '" + i.unit + "'",
                                  t,
                                );
                              return new r(
                                new p["default"]("size", i, this.mode),
                                !1,
                              );
                            },
                          },
                          {
                            key: "parseGroup",
                            value: function (e) {
                              var t = this.nextToken;
                              if (this.nextToken.text === (e ? "[" : "{")) {
                                this.consume();
                                var n = this.parseExpression(
                                    !1,
                                    e ? "]" : null,
                                  ),
                                  i = this.nextToken;
                                return (
                                  this.expect(e ? "]" : "}"),
                                  "text" === this.mode && this.formLigatures(n),
                                  new r(
                                    new p["default"](
                                      "ordgroup",
                                      n,
                                      this.mode,
                                      t,
                                      i,
                                    ),
                                    !1,
                                  )
                                );
                              }
                              return e ? null : this.parseSymbol();
                            },
                          },
                          {
                            key: "formLigatures",
                            value: function (e) {
                              for (var t = e.length - 1, n = 0; n < t; ++n) {
                                var r = e[n],
                                  i = r.value;
                                "-" === i &&
                                  "-" === e[n + 1].value &&
                                  (n + 1 < t && "-" === e[n + 2].value
                                    ? (e.splice(
                                        n,
                                        3,
                                        new p["default"](
                                          "textord",
                                          "---",
                                          "text",
                                          r,
                                          e[n + 2],
                                        ),
                                      ),
                                      (t -= 2))
                                    : (e.splice(
                                        n,
                                        2,
                                        new p["default"](
                                          "textord",
                                          "--",
                                          "text",
                                          r,
                                          e[n + 1],
                                        ),
                                      ),
                                      (t -= 1))),
                                  ("'" !== i && "`" !== i) ||
                                    e[n + 1].value !== i ||
                                    (e.splice(
                                      n,
                                      2,
                                      new p["default"](
                                        "textord",
                                        i + i,
                                        "text",
                                        r,
                                        e[n + 1],
                                      ),
                                    ),
                                    (t -= 1));
                              }
                            },
                          },
                          {
                            key: "parseSymbol",
                            value: function () {
                              var e = this.nextToken;
                              return o["default"][e.text]
                                ? (this.consume(), new r(e.text, !0, e))
                                : u["default"][this.mode][e.text]
                                  ? (this.consume(),
                                    new r(
                                      new p["default"](
                                        u["default"][this.mode][e.text].group,
                                        e.text,
                                        this.mode,
                                        e,
                                      ),
                                      !1,
                                      e,
                                    ))
                                  : "text" === this.mode &&
                                      h.cjkRegex.test(e.text)
                                    ? (this.consume(),
                                      new r(
                                        new p["default"](
                                          "textord",
                                          e.text,
                                          this.mode,
                                          e,
                                        ),
                                        !1,
                                        e,
                                      ))
                                    : "$" === e.text
                                      ? new r(e.text, !1, e)
                                      : null;
                            },
                          },
                        ]),
                        e
                      );
                    })();
                  (m.endOfExpression = [
                    "}",
                    "\\end",
                    "\\right",
                    "&",
                    "\\\\",
                    "\\cr",
                  ]),
                    (m.SUPSUB_GREEDINESS = 1),
                    (m.sizeFuncs = [
                      "\\tiny",
                      "\\sixptsize",
                      "\\scriptsize",
                      "\\footnotesize",
                      "\\small",
                      "\\normalsize",
                      "\\large",
                      "\\Large",
                      "\\LARGE",
                      "\\huge",
                      "\\Huge",
                    ]),
                    (m.styleFuncs = [
                      "\\displaystyle",
                      "\\textstyle",
                      "\\scriptstyle",
                      "\\scriptscriptstyle",
                    ]),
                    (m.oldFontFuncs = {
                      "\\rm": "mathrm",
                      "\\sf": "mathsf",
                      "\\tt": "mathtt",
                      "\\bf": "mathbf",
                      "\\it": "mathit",
                    }),
                    (m.prototype.ParseNode = p["default"]),
                    (t.exports = m);
                },
                {
                  "./MacroExpander": 27,
                  "./ParseError": 29,
                  "./ParseNode": 30,
                  "./environments": 40,
                  "./functions": 43,
                  "./symbols": 48,
                  "./unicodeRegexes": 49,
                  "./units": 50,
                  "./utils": 51,
                  "babel-runtime/helpers/classCallCheck": 4,
                  "babel-runtime/helpers/createClass": 5,
                },
              ],
              32: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = n(e("babel-runtime/helpers/classCallCheck")),
                    i = n(e("./utils")),
                    a = function o(e) {
                      (0, r["default"])(this, o),
                        (e = e || {}),
                        (this.displayMode = i["default"].deflt(
                          e.displayMode,
                          !1,
                        )),
                        (this.throwOnError = i["default"].deflt(
                          e.throwOnError,
                          !0,
                        )),
                        (this.errorColor = i["default"].deflt(
                          e.errorColor,
                          "#cc0000",
                        )),
                        (this.macros = e.macros || {}),
                        (this.colorIsTextColor = i["default"].deflt(
                          e.colorIsTextColor,
                          !1,
                        ));
                    };
                  t.exports = a;
                },
                { "./utils": 51, "babel-runtime/helpers/classCallCheck": 4 },
              ],
              33: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = n(e("babel-runtime/helpers/classCallCheck")),
                    i = n(e("babel-runtime/helpers/createClass")),
                    a = (function () {
                      function e(t, n, i) {
                        (0, r["default"])(this, e),
                          (this.id = t),
                          (this.size = n),
                          (this.cramped = i);
                      }
                      return (
                        (0, i["default"])(e, [
                          {
                            key: "sup",
                            value: function () {
                              return f[m[this.id]];
                            },
                          },
                          {
                            key: "sub",
                            value: function () {
                              return f[g[this.id]];
                            },
                          },
                          {
                            key: "fracNum",
                            value: function () {
                              return f[v[this.id]];
                            },
                          },
                          {
                            key: "fracDen",
                            value: function () {
                              return f[b[this.id]];
                            },
                          },
                          {
                            key: "cramp",
                            value: function () {
                              return f[y[this.id]];
                            },
                          },
                          {
                            key: "text",
                            value: function () {
                              return f[x[this.id]];
                            },
                          },
                          {
                            key: "isTight",
                            value: function () {
                              return this.size >= 2;
                            },
                          },
                        ]),
                        e
                      );
                    })(),
                    o = 0,
                    s = 1,
                    l = 2,
                    u = 3,
                    d = 4,
                    c = 5,
                    h = 6,
                    p = 7,
                    f = [
                      new a(o, 0, !1),
                      new a(s, 0, !0),
                      new a(l, 1, !1),
                      new a(u, 1, !0),
                      new a(d, 2, !1),
                      new a(c, 2, !0),
                      new a(h, 3, !1),
                      new a(p, 3, !0),
                    ],
                    m = [d, c, d, c, h, p, h, p],
                    g = [c, c, c, c, p, p, p, p],
                    v = [l, u, d, c, h, p, h, p],
                    b = [u, u, c, c, p, p, p, p],
                    y = [s, s, u, u, c, c, p, p],
                    x = [o, s, l, u, l, u, l, u];
                  t.exports = {
                    DISPLAY: f[o],
                    TEXT: f[l],
                    SCRIPT: f[d],
                    SCRIPTSCRIPT: f[h],
                  };
                },
                {
                  "babel-runtime/helpers/classCallCheck": 4,
                  "babel-runtime/helpers/createClass": 5,
                },
              ],
              34: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = n(e("./domTree")),
                    i = n(e("./fontMetrics")),
                    a = n(e("./symbols")),
                    o = n(e("./utils")),
                    s = ["\\imath", "\\jmath", "\\pounds"],
                    l = function (e, t, n) {
                      return (
                        a["default"][n][e] &&
                          a["default"][n][e].replace &&
                          (e = a["default"][n][e].replace),
                        {
                          value: e,
                          metrics: i["default"].getCharacterMetrics(e, t),
                        }
                      );
                    },
                    u = function (e, t, n, i, a) {
                      var o = l(e, t, n),
                        s = o.metrics;
                      e = o.value;
                      var u = void 0;
                      if (s) {
                        var d = s.italic;
                        "text" === n && (d = 0),
                          (u = new r["default"].symbolNode(
                            e,
                            s.height,
                            s.depth,
                            d,
                            s.skew,
                            a,
                          ));
                      } else
                        "undefined" != typeof console &&
                          console.warn(
                            "No character metrics for '" +
                              e +
                              "' in style '" +
                              t +
                              "'",
                          ),
                          (u = new r["default"].symbolNode(e, 0, 0, 0, 0, a));
                      return (
                        i &&
                          ((u.maxFontSize = i.sizeMultiplier),
                          i.style.isTight() && u.classes.push("mtight"),
                          i.getColor() && (u.style.color = i.getColor())),
                        u
                      );
                    },
                    d = function (e, t, n, r) {
                      return "\\" === e || "main" === a["default"][t][e].font
                        ? u(e, "Main-Regular", t, n, r)
                        : u(e, "AMS-Regular", t, n, r.concat(["amsrm"]));
                    },
                    c = function (e, t, n, r, i) {
                      if ("mathord" === i) {
                        var o = h(e);
                        return u(e, o.fontName, t, n, r.concat([o.fontClass]));
                      }
                      if ("textord" === i)
                        return "ams" ===
                          (a["default"][t][e] && a["default"][t][e].font)
                          ? u(e, "AMS-Regular", t, n, r.concat(["amsrm"]))
                          : u(e, "Main-Regular", t, n, r.concat(["mathrm"]));
                      throw new Error(
                        "unexpected type: " + i + " in mathDefault",
                      );
                    },
                    h = function (e) {
                      return /[0-9]/.test(e.charAt(0)) ||
                        o["default"].contains(s, e)
                        ? { fontName: "Main-Italic", fontClass: "mainit" }
                        : { fontName: "Math-Italic", fontClass: "mathit" };
                    },
                    p = function (e, t, n) {
                      var r = e.mode,
                        i = e.value,
                        a = ["mord"],
                        d = t.font;
                      if (d) {
                        var p = void 0;
                        return (
                          (p =
                            "mathit" === d || o["default"].contains(s, i)
                              ? h(i)
                              : x[d]),
                          l(i, p.fontName, r).metrics
                            ? u(
                                i,
                                p.fontName,
                                r,
                                t,
                                a.concat([p.fontClass || d]),
                              )
                            : c(i, r, t, a, n)
                        );
                      }
                      return c(i, r, t, a, n);
                    },
                    f = function (e) {
                      var t = 0,
                        n = 0,
                        r = 0;
                      if (e.children)
                        for (var i = 0; i < e.children.length; i++)
                          e.children[i].height > t &&
                            (t = e.children[i].height),
                            e.children[i].depth > n &&
                              (n = e.children[i].depth),
                            e.children[i].maxFontSize > r &&
                              (r = e.children[i].maxFontSize);
                      (e.height = t), (e.depth = n), (e.maxFontSize = r);
                    },
                    m = function (e, t, n) {
                      var i = new r["default"].span(e, t, n);
                      return f(i), i;
                    },
                    g = function (e, t) {
                      (e.children = t.concat(e.children)), f(e);
                    },
                    v = function (e) {
                      var t = new r["default"].documentFragment(e);
                      return f(t), t;
                    },
                    b = function (e, t, n) {
                      var i = void 0,
                        a = void 0,
                        o = void 0;
                      if ("individualShift" === t) {
                        var s = e;
                        for (
                          e = [s[0]],
                            a = i = -s[0].shift - s[0].elem.depth,
                            o = 1;
                          o < s.length;
                          o++
                        ) {
                          var l = -s[o].shift - a - s[o].elem.depth,
                            u =
                              l - (s[o - 1].elem.height + s[o - 1].elem.depth);
                          (a += l),
                            e.push({ type: "kern", size: u }),
                            e.push(s[o]);
                        }
                      } else if ("top" === t) {
                        var d = n;
                        for (o = 0; o < e.length; o++)
                          "kern" === e[o].type
                            ? (d -= e[o].size)
                            : (d -= e[o].elem.height + e[o].elem.depth);
                        i = d;
                      } else
                        i =
                          "bottom" === t
                            ? -n
                            : "shift" === t
                              ? -e[0].elem.depth - n
                              : "firstBaseline" === t
                                ? -e[0].elem.depth
                                : 0;
                      var c = 0;
                      for (o = 0; o < e.length; o++)
                        if ("elem" === e[o].type) {
                          var h = e[o].elem;
                          c = Math.max(c, h.maxFontSize, h.height);
                        }
                      c += 2;
                      var p = m(["pstrut"], []);
                      p.style.height = c + "em";
                      var f = [],
                        g = i,
                        v = i;
                      for (a = i, o = 0; o < e.length; o++) {
                        if ("kern" === e[o].type) a += e[o].size;
                        else {
                          var b = e[o].elem,
                            y = m([], [p, b]);
                          (y.style.top = -c - a - b.depth + "em"),
                            e[o].marginLeft &&
                              (y.style.marginLeft = e[o].marginLeft),
                            e[o].marginRight &&
                              (y.style.marginRight = e[o].marginRight),
                            f.push(y),
                            (a += b.height + b.depth);
                        }
                        (g = Math.min(g, a)), (v = Math.max(v, a));
                      }
                      var x = m(["vlist"], f);
                      x.style.height = v + "em";
                      var w = void 0;
                      if (g < 0) {
                        var k = m(["vlist"], []);
                        k.style.height = -g + "em";
                        var M = m(
                          ["vlist-s"],
                          [new r["default"].symbolNode("\u200b")],
                        );
                        w = [m(["vlist-r"], [x, M]), m(["vlist-r"], [k])];
                      } else w = [m(["vlist-r"], [x])];
                      var S = m(["vlist-t"], w);
                      return (
                        2 === w.length && S.classes.push("vlist-t2"),
                        (S.height = v),
                        (S.depth = -g),
                        S
                      );
                    },
                    y = {
                      "\\qquad": { size: "2em", className: "qquad" },
                      "\\quad": { size: "1em", className: "quad" },
                      "\\enspace": { size: "0.5em", className: "enspace" },
                      "\\;": { size: "0.277778em", className: "thickspace" },
                      "\\:": { size: "0.22222em", className: "mediumspace" },
                      "\\,": { size: "0.16667em", className: "thinspace" },
                      "\\!": {
                        size: "-0.16667em",
                        className: "negativethinspace",
                      },
                    },
                    x = {
                      mathbf: { variant: "bold", fontName: "Main-Bold" },
                      mathrm: { variant: "normal", fontName: "Main-Regular" },
                      textit: { variant: "italic", fontName: "Main-Italic" },
                      mathbb: {
                        variant: "double-struck",
                        fontName: "AMS-Regular",
                      },
                      mathcal: {
                        variant: "script",
                        fontName: "Caligraphic-Regular",
                      },
                      mathfrak: {
                        variant: "fraktur",
                        fontName: "Fraktur-Regular",
                      },
                      mathscr: {
                        variant: "script",
                        fontName: "Script-Regular",
                      },
                      mathsf: {
                        variant: "sans-serif",
                        fontName: "SansSerif-Regular",
                      },
                      mathtt: {
                        variant: "monospace",
                        fontName: "Typewriter-Regular",
                      },
                    };
                  t.exports = {
                    fontMap: x,
                    makeSymbol: u,
                    mathsym: d,
                    makeSpan: m,
                    makeFragment: v,
                    makeVList: b,
                    makeOrd: p,
                    prependChildren: g,
                    spacingFunctions: y,
                  };
                },
                {
                  "./domTree": 39,
                  "./fontMetrics": 41,
                  "./symbols": 48,
                  "./utils": 51,
                },
              ],
              35: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  function r(e, t, n) {
                    for (
                      var r = y(e, t, !1),
                        i = t.sizeMultiplier / n.sizeMultiplier,
                        a = 0;
                      a < r.length;
                      a++
                    ) {
                      var o = h["default"].indexOf(r[a].classes, "sizing");
                      o < 0
                        ? Array.prototype.push.apply(
                            r[a].classes,
                            t.sizingClasses(n),
                          )
                        : r[a].classes[o + 1] === "reset-size" + t.size &&
                          (r[a].classes[o + 1] = "reset-size" + n.size),
                        (r[a].height *= i),
                        (r[a].depth *= i);
                    }
                    return l["default"].makeFragment(r);
                  }
                  var i = n(e("babel-runtime/core-js/json/stringify")),
                    a = n(e("./ParseError")),
                    o = n(e("./Style")),
                    s = e("./buildCommon"),
                    l = n(s),
                    u = n(e("./delimiter")),
                    d = n(e("./domTree")),
                    c = n(e("./units")),
                    h = n(e("./utils")),
                    p = n(e("./stretchy")),
                    f = function (e) {
                      return (
                        e instanceof d["default"].span &&
                        "mspace" === e.classes[0]
                      );
                    },
                    m = function (e) {
                      return e && "mbin" === e.classes[0];
                    },
                    g = function (e, t) {
                      return e
                        ? h["default"].contains(
                            ["mbin", "mopen", "mrel", "mop", "mpunct"],
                            e.classes[0],
                          )
                        : t;
                    },
                    v = function (e, t) {
                      return e
                        ? h["default"].contains(
                            ["mrel", "mclose", "mpunct"],
                            e.classes[0],
                          )
                        : t;
                    },
                    b = function (e, t) {
                      for (var n = t; n < e.length && f(e[n]); ) n++;
                      return n === t ? null : e.splice(t, n - t);
                    },
                    y = function (e, t, n) {
                      for (var r = [], i = 0; i < e.length; i++) {
                        var a = e[i],
                          o = C(a, t);
                        o instanceof d["default"].documentFragment
                          ? Array.prototype.push.apply(r, o.children)
                          : r.push(o);
                      }
                      for (var u = 0; u < r.length; u++) {
                        var c = b(r, u);
                        if (c) {
                          if (!(u < r.length)) {
                            Array.prototype.push.apply(r, c);
                            break;
                          }
                          r[u] instanceof d["default"].symbolNode &&
                            (r[u] = (0, s.makeSpan)([].concat(r[u].classes), [
                              r[u],
                            ])),
                            l["default"].prependChildren(r[u], c);
                        }
                      }
                      for (var h = 0; h < r.length; h++)
                        m(r[h]) &&
                          (g(r[h - 1], n) || v(r[h + 1], n)) &&
                          (r[h].classes[0] = "mord");
                      for (var p = 0; p < r.length; p++)
                        if ("\u0338" === r[p].value && p + 1 < r.length) {
                          var f = r.slice(p, p + 2);
                          (f[0].classes = ["mainrm"]),
                            (f[0].style.position = "absolute"),
                            (f[0].style.right = "0");
                          var y = r[p + 1].classes,
                            x = (0, s.makeSpan)(y, f);
                          -1 !== y.indexOf("mord") &&
                            (x.style.paddingLeft = "0.277771em"),
                            (x.style.position = "relative"),
                            r.splice(p, 2, x);
                        }
                      return r;
                    },
                    x = function N(e) {
                      if (e instanceof d["default"].documentFragment) {
                        if (e.children.length)
                          return N(e.children[e.children.length - 1]);
                      } else if (
                        h["default"].contains(
                          [
                            "mord",
                            "mop",
                            "mbin",
                            "mrel",
                            "mopen",
                            "mclose",
                            "mpunct",
                            "minner",
                          ],
                          e.classes[0],
                        )
                      )
                        return e.classes[0];
                      return null;
                    },
                    w = function (e, t) {
                      if (e.value.base) {
                        var n = e.value.base;
                        return "op" === n.type
                          ? n.value.limits &&
                              (t.style.size === o["default"].DISPLAY.size ||
                                n.value.alwaysHandleSupSub)
                          : "accent" === n.type
                            ? M(n.value.base)
                            : "horizBrace" === n.type
                              ? !e.value.sub === n.value.isOver
                              : null;
                      }
                      return !1;
                    },
                    k = function E(e) {
                      return (
                        !!e &&
                        ("ordgroup" === e.type
                          ? 1 === e.value.length
                            ? E(e.value[0])
                            : e
                          : "color" === e.type
                            ? 1 === e.value.value.length
                              ? E(e.value.value[0])
                              : e
                            : "font" === e.type
                              ? E(e.value.body)
                              : e)
                      );
                    },
                    M = function (e) {
                      var t = k(e);
                      return (
                        "mathord" === t.type ||
                        "textord" === t.type ||
                        "bin" === t.type ||
                        "rel" === t.type ||
                        "inner" === t.type ||
                        "open" === t.type ||
                        "close" === t.type ||
                        "punct" === t.type
                      );
                    },
                    S = function (e, t) {
                      var n = ["nulldelimiter"].concat(e.baseSizingClasses());
                      return (0, s.makeSpan)(t.concat(n));
                    },
                    z = {
                      mathord: function (e, t) {
                        return l["default"].makeOrd(e, t, "mathord");
                      },
                      textord: function (e, t) {
                        return l["default"].makeOrd(e, t, "textord");
                      },
                      bin: function (e, t) {
                        return l["default"].mathsym(e.value, e.mode, t, [
                          "mbin",
                        ]);
                      },
                      rel: function (e, t) {
                        return l["default"].mathsym(e.value, e.mode, t, [
                          "mrel",
                        ]);
                      },
                      open: function (e, t) {
                        return l["default"].mathsym(e.value, e.mode, t, [
                          "mopen",
                        ]);
                      },
                      close: function (e, t) {
                        return l["default"].mathsym(e.value, e.mode, t, [
                          "mclose",
                        ]);
                      },
                      inner: function (e, t) {
                        return l["default"].mathsym(e.value, e.mode, t, [
                          "minner",
                        ]);
                      },
                      punct: function (e, t) {
                        return l["default"].mathsym(e.value, e.mode, t, [
                          "mpunct",
                        ]);
                      },
                      ordgroup: function (e, t) {
                        return (0, s.makeSpan)(["mord"], y(e.value, t, !0), t);
                      },
                      text: function (e, t) {
                        for (
                          var n = t.withFont(e.value.style),
                            r = y(e.value.body, n, !0),
                            i = 0;
                          i < r.length - 1;
                          i++
                        )
                          r[i].tryCombine(r[i + 1]) &&
                            (r.splice(i + 1, 1), i--);
                        return (0, s.makeSpan)(["mord", "text"], r, n);
                      },
                      color: function (e, t) {
                        var n = y(
                          e.value.value,
                          t.withColor(e.value.color),
                          !1,
                        );
                        return new l["default"].makeFragment(n);
                      },
                      supsub: function (e, t) {
                        if (w(e, t)) return z[e.value.base.type](e, t);
                        var n = C(e.value.base, t),
                          r = void 0,
                          i = void 0,
                          a = t.fontMetrics(),
                          u = void 0,
                          c = 0,
                          h = 0;
                        e.value.sup &&
                          ((u = t.havingStyle(t.style.sup())),
                          (r = C(e.value.sup, u, t)),
                          M(e.value.base) ||
                            (c =
                              n.height -
                              (u.fontMetrics().supDrop * u.sizeMultiplier) /
                                t.sizeMultiplier)),
                          e.value.sub &&
                            ((u = t.havingStyle(t.style.sub())),
                            (i = C(e.value.sub, u, t)),
                            M(e.value.base) ||
                              (h =
                                n.depth +
                                (u.fontMetrics().subDrop * u.sizeMultiplier) /
                                  t.sizeMultiplier));
                        var p = void 0;
                        p =
                          t.style === o["default"].DISPLAY
                            ? a.sup1
                            : t.style.cramped
                              ? a.sup3
                              : a.sup2;
                        var f = t.sizeMultiplier,
                          m = 0.5 / a.ptPerEm / f + "em",
                          g = void 0;
                        if (e.value.sup)
                          if (e.value.sub) {
                            (c = Math.max(c, p, r.depth + 0.25 * a.xHeight)),
                              (h = Math.max(h, a.sub2));
                            var v = a.defaultRuleThickness;
                            if (c - r.depth - (i.height - h) < 4 * v) {
                              h = 4 * v - (c - r.depth) + i.height;
                              var b = 0.8 * a.xHeight - (c - r.depth);
                              b > 0 && ((c += b), (h -= b));
                            }
                            var y = [
                              {
                                type: "elem",
                                elem: i,
                                shift: h,
                                marginRight: m,
                              },
                              {
                                type: "elem",
                                elem: r,
                                shift: -c,
                                marginRight: m,
                              },
                            ];
                            n instanceof d["default"].symbolNode &&
                              (y[0].marginLeft = -n.italic + "em"),
                              (g = l["default"].makeVList(
                                y,
                                "individualShift",
                                null,
                                t,
                              ));
                          } else
                            (c = Math.max(c, p, r.depth + 0.25 * a.xHeight)),
                              (g = l["default"].makeVList(
                                [{ type: "elem", elem: r, marginRight: m }],
                                "shift",
                                -c,
                                t,
                              ));
                        else {
                          h = Math.max(h, a.sub1, i.height - 0.8 * a.xHeight);
                          var k = [{ type: "elem", elem: i, marginRight: m }];
                          n instanceof d["default"].symbolNode &&
                            (k[0].marginLeft = -n.italic + "em"),
                            (g = l["default"].makeVList(k, "shift", h, t));
                        }
                        var S = x(n) || "mord";
                        return (0, s.makeSpan)(
                          [S],
                          [n, (0, s.makeSpan)(["msupsub"], [g])],
                          t,
                        );
                      },
                      genfrac: function (e, t) {
                        var n = t.style;
                        "display" === e.value.size
                          ? (n = o["default"].DISPLAY)
                          : "text" === e.value.size && (n = o["default"].TEXT);
                        var r = n.fracNum(),
                          i = n.fracDen(),
                          a = void 0;
                        a = t.havingStyle(r);
                        var d = C(e.value.numer, a, t);
                        a = t.havingStyle(i);
                        var c = C(e.value.denom, a, t),
                          h = void 0,
                          p = void 0,
                          f = void 0;
                        e.value.hasBarLine
                          ? ((p = (h = A("frac-line", t)).height),
                            (f = h.height))
                          : ((h = null),
                            (p = 0),
                            (f = t.fontMetrics().defaultRuleThickness));
                        var m = void 0,
                          g = void 0,
                          v = void 0;
                        n.size === o["default"].DISPLAY.size
                          ? ((m = t.fontMetrics().num1),
                            (g = p > 0 ? 3 * f : 7 * f),
                            (v = t.fontMetrics().denom1))
                          : (p > 0
                              ? ((m = t.fontMetrics().num2), (g = f))
                              : ((m = t.fontMetrics().num3), (g = 3 * f)),
                            (v = t.fontMetrics().denom2));
                        var b = void 0;
                        if (0 === p) {
                          var y = m - d.depth - (c.height - v);
                          y < g && ((m += 0.5 * (g - y)), (v += 0.5 * (g - y))),
                            (b = l["default"].makeVList(
                              [
                                { type: "elem", elem: c, shift: v },
                                { type: "elem", elem: d, shift: -m },
                              ],
                              "individualShift",
                              null,
                              t,
                            ));
                        } else {
                          var x = t.fontMetrics().axisHeight;
                          m - d.depth - (x + 0.5 * p) < g &&
                            (m += g - (m - d.depth - (x + 0.5 * p))),
                            x - 0.5 * p - (c.height - v) < g &&
                              (v += g - (x - 0.5 * p - (c.height - v)));
                          var w = -(x - 0.5 * p);
                          b = l["default"].makeVList(
                            [
                              { type: "elem", elem: c, shift: v },
                              { type: "elem", elem: h, shift: w },
                              { type: "elem", elem: d, shift: -m },
                            ],
                            "individualShift",
                            null,
                            t,
                          );
                        }
                        (a = t.havingStyle(n)),
                          (b.height *= a.sizeMultiplier / t.sizeMultiplier),
                          (b.depth *= a.sizeMultiplier / t.sizeMultiplier);
                        var k = void 0;
                        k =
                          n.size === o["default"].DISPLAY.size
                            ? t.fontMetrics().delim1
                            : t.fontMetrics().delim2;
                        var M = void 0,
                          z = void 0;
                        return (
                          (M =
                            null == e.value.leftDelim
                              ? S(t, ["mopen"])
                              : u["default"].customSizedDelim(
                                  e.value.leftDelim,
                                  k,
                                  !0,
                                  t.havingStyle(n),
                                  e.mode,
                                  ["mopen"],
                                )),
                          (z =
                            null == e.value.rightDelim
                              ? S(t, ["mclose"])
                              : u["default"].customSizedDelim(
                                  e.value.rightDelim,
                                  k,
                                  !0,
                                  t.havingStyle(n),
                                  e.mode,
                                  ["mclose"],
                                )),
                          (0, s.makeSpan)(
                            ["mord"].concat(a.sizingClasses(t)),
                            [M, (0, s.makeSpan)(["mfrac"], [b]), z],
                            t,
                          )
                        );
                      },
                      array: function (e, t) {
                        var n = void 0,
                          r = void 0,
                          i = e.value.body.length,
                          o = 0,
                          u = new Array(i),
                          d = 1 / t.fontMetrics().ptPerEm,
                          p = 5 * d,
                          f = 12 * d,
                          m = 3 * d,
                          g = h["default"].deflt(e.value.arraystretch, 1) * f,
                          v = 0.7 * g,
                          b = 0.3 * g,
                          y = 0;
                        for (n = 0; n < e.value.body.length; ++n) {
                          var x = e.value.body[n],
                            w = v,
                            k = b;
                          o < x.length && (o = x.length);
                          var M = new Array(x.length);
                          for (r = 0; r < x.length; ++r) {
                            var S = C(x[r], t);
                            k < S.depth && (k = S.depth),
                              w < S.height && (w = S.height),
                              (M[r] = S);
                          }
                          var z = 0;
                          e.value.rowGaps[n] &&
                            (z = c["default"].calculateSize(
                              e.value.rowGaps[n].value,
                              t,
                            )) > 0 &&
                            (k < (z += b) && (k = z), (z = 0)),
                            e.value.addJot && (k += m),
                            (M.height = w),
                            (M.depth = k),
                            (y += w),
                            (M.pos = y),
                            (y += k + z),
                            (u[n] = M);
                        }
                        var A = y / 2 + t.fontMetrics().axisHeight,
                          T = e.value.cols || [],
                          N = [],
                          E = void 0,
                          R = void 0;
                        for (r = 0, R = 0; r < o || R < T.length; ++r, ++R) {
                          for (
                            var L = T[R] || {}, O = !0;
                            "separator" === L.type;

                          ) {
                            if (
                              (O ||
                                (((E = (0, s.makeSpan)(
                                  ["arraycolsep"],
                                  [],
                                )).style.width =
                                  t.fontMetrics().doubleRuleSep + "em"),
                                N.push(E)),
                              "|" !== L.separator)
                            )
                              throw new a["default"](
                                "Invalid separator type: " + L.separator,
                              );
                            var q = (0, s.makeSpan)(["vertical-separator"], []);
                            (q.style.height = y + "em"),
                              (q.style.verticalAlign = -(y - A) + "em"),
                              N.push(q),
                              (L = T[++R] || {}),
                              (O = !1);
                          }
                          if (!(r >= o)) {
                            var _ = void 0;
                            (r > 0 || e.value.hskipBeforeAndAfter) &&
                              0 !== (_ = h["default"].deflt(L.pregap, p)) &&
                              (((E = (0, s.makeSpan)(
                                ["arraycolsep"],
                                [],
                              )).style.width = _ + "em"),
                              N.push(E));
                            var D = [];
                            for (n = 0; n < i; ++n) {
                              var B = u[n],
                                I = B[r];
                              if (I) {
                                var H = B.pos - A;
                                (I.depth = B.depth),
                                  (I.height = B.height),
                                  D.push({ type: "elem", elem: I, shift: H });
                              }
                            }
                            (D = l["default"].makeVList(
                              D,
                              "individualShift",
                              null,
                              t,
                            )),
                              (D = (0, s.makeSpan)(
                                ["col-align-" + (L.align || "c")],
                                [D],
                              )),
                              N.push(D),
                              (r < o - 1 || e.value.hskipBeforeAndAfter) &&
                                0 !== (_ = h["default"].deflt(L.postgap, p)) &&
                                (((E = (0, s.makeSpan)(
                                  ["arraycolsep"],
                                  [],
                                )).style.width = _ + "em"),
                                N.push(E));
                          }
                        }
                        return (
                          (u = (0, s.makeSpan)(["mtable"], N)),
                          (0, s.makeSpan)(["mord"], [u], t)
                        );
                      },
                      spacing: function (e, t) {
                        return "\\ " === e.value ||
                          "\\space" === e.value ||
                          " " === e.value ||
                          "~" === e.value
                          ? "text" === e.mode
                            ? l["default"].makeOrd(e, t, "textord")
                            : (0, s.makeSpan)(
                                ["mspace"],
                                [l["default"].mathsym(e.value, e.mode, t)],
                                t,
                              )
                          : (0, s.makeSpan)(
                              [
                                "mspace",
                                l["default"].spacingFunctions[e.value]
                                  .className,
                              ],
                              [],
                              t,
                            );
                      },
                      llap: function (e, t) {
                        var n = (0, s.makeSpan)(
                            ["inner"],
                            [C(e.value.body, t)],
                          ),
                          r = (0, s.makeSpan)(["fix"], []);
                        return (0, s.makeSpan)(["mord", "llap"], [n, r], t);
                      },
                      rlap: function (e, t) {
                        var n = (0, s.makeSpan)(
                            ["inner"],
                            [C(e.value.body, t)],
                          ),
                          r = (0, s.makeSpan)(["fix"], []);
                        return (0, s.makeSpan)(["mord", "rlap"], [n, r], t);
                      },
                      op: function (e, t) {
                        var n = void 0,
                          r = void 0,
                          i = !1;
                        "supsub" === e.type &&
                          ((n = e.value.sup),
                          (r = e.value.sub),
                          (e = e.value.base),
                          (i = !0));
                        var a = t.style,
                          u = ["\\smallint"],
                          c = !1;
                        a.size === o["default"].DISPLAY.size &&
                          e.value.symbol &&
                          !h["default"].contains(u, e.value.body) &&
                          (c = !0);
                        var p = void 0;
                        if (e.value.symbol) {
                          var f = c ? "Size2-Regular" : "Size1-Regular";
                          p = l["default"].makeSymbol(
                            e.value.body,
                            f,
                            "math",
                            t,
                            ["mop", "op-symbol", c ? "large-op" : "small-op"],
                          );
                        } else if (e.value.value) {
                          var m = y(e.value.value, t, !0);
                          1 === m.length &&
                          m[0] instanceof d["default"].symbolNode
                            ? ((p = m[0]).classes[0] = "mop")
                            : (p = (0, s.makeSpan)(["mop"], m, t));
                        } else {
                          for (var g = [], v = 1; v < e.value.body.length; v++)
                            g.push(
                              l["default"].mathsym(e.value.body[v], e.mode),
                            );
                          p = (0, s.makeSpan)(["mop"], g, t);
                        }
                        var b = 0,
                          x = 0;
                        if (
                          (p instanceof d["default"].symbolNode &&
                            ((b =
                              (p.height - p.depth) / 2 -
                              t.fontMetrics().axisHeight),
                            (x = p.italic)),
                          i)
                        ) {
                          p = (0, s.makeSpan)([], [p]);
                          var w = void 0,
                            k = void 0,
                            M = void 0,
                            S = void 0,
                            z = void 0;
                          n &&
                            ((z = t.havingStyle(a.sup())),
                            (w = C(n, z, t)),
                            (k = Math.max(
                              t.fontMetrics().bigOpSpacing1,
                              t.fontMetrics().bigOpSpacing3 - w.depth,
                            ))),
                            r &&
                              ((z = t.havingStyle(a.sub())),
                              (M = C(r, z, t)),
                              (S = Math.max(
                                t.fontMetrics().bigOpSpacing2,
                                t.fontMetrics().bigOpSpacing4 - M.height,
                              )));
                          var A = void 0,
                            T = void 0,
                            N = void 0;
                          if (n)
                            if (r) {
                              if (!n && !r) return p;
                              (N =
                                t.fontMetrics().bigOpSpacing5 +
                                M.height +
                                M.depth +
                                S +
                                p.depth +
                                b),
                                (A = l["default"].makeVList(
                                  [
                                    {
                                      type: "kern",
                                      size: t.fontMetrics().bigOpSpacing5,
                                    },
                                    {
                                      type: "elem",
                                      elem: M,
                                      marginLeft: -x + "em",
                                    },
                                    { type: "kern", size: S },
                                    { type: "elem", elem: p },
                                    { type: "kern", size: k },
                                    {
                                      type: "elem",
                                      elem: w,
                                      marginLeft: x + "em",
                                    },
                                    {
                                      type: "kern",
                                      size: t.fontMetrics().bigOpSpacing5,
                                    },
                                  ],
                                  "bottom",
                                  N,
                                  t,
                                ));
                            } else
                              (N = p.depth + b),
                                (A = l["default"].makeVList(
                                  [
                                    { type: "elem", elem: p },
                                    { type: "kern", size: k },
                                    {
                                      type: "elem",
                                      elem: w,
                                      marginLeft: x + "em",
                                    },
                                    {
                                      type: "kern",
                                      size: t.fontMetrics().bigOpSpacing5,
                                    },
                                  ],
                                  "bottom",
                                  N,
                                  t,
                                ));
                          else
                            (T = p.height - b),
                              (A = l["default"].makeVList(
                                [
                                  {
                                    type: "kern",
                                    size: t.fontMetrics().bigOpSpacing5,
                                  },
                                  {
                                    type: "elem",
                                    elem: M,
                                    marginLeft: -x + "em",
                                  },
                                  { type: "kern", size: S },
                                  { type: "elem", elem: p },
                                ],
                                "top",
                                T,
                                t,
                              ));
                          return (0, s.makeSpan)(["mop", "op-limits"], [A], t);
                        }
                        return (
                          b &&
                            ((p.style.position = "relative"),
                            (p.style.top = b + "em")),
                          p
                        );
                      },
                      mod: function (e, t) {
                        var n = [];
                        if (
                          ("bmod" === e.value.modType
                            ? (t.style.isTight() ||
                                n.push(
                                  (0, s.makeSpan)(
                                    ["mspace", "negativemediumspace"],
                                    [],
                                    t,
                                  ),
                                ),
                              n.push(
                                (0, s.makeSpan)(
                                  ["mspace", "thickspace"],
                                  [],
                                  t,
                                ),
                              ))
                            : t.style.size === o["default"].DISPLAY.size
                              ? n.push(
                                  (0, s.makeSpan)(["mspace", "quad"], [], t),
                                )
                              : "mod" === e.value.modType
                                ? n.push(
                                    (0, s.makeSpan)(
                                      ["mspace", "twelvemuspace"],
                                      [],
                                      t,
                                    ),
                                  )
                                : n.push(
                                    (0, s.makeSpan)(
                                      ["mspace", "eightmuspace"],
                                      [],
                                      t,
                                    ),
                                  ),
                          ("pod" !== e.value.modType &&
                            "pmod" !== e.value.modType) ||
                            n.push(l["default"].mathsym("(", e.mode)),
                          "pod" !== e.value.modType)
                        ) {
                          var r = [
                            l["default"].mathsym("m", e.mode),
                            l["default"].mathsym("o", e.mode),
                            l["default"].mathsym("d", e.mode),
                          ];
                          "bmod" === e.value.modType
                            ? (n.push((0, s.makeSpan)(["mbin"], r, t)),
                              n.push(
                                (0, s.makeSpan)(
                                  ["mspace", "thickspace"],
                                  [],
                                  t,
                                ),
                              ),
                              t.style.isTight() ||
                                n.push(
                                  (0, s.makeSpan)(
                                    ["mspace", "negativemediumspace"],
                                    [],
                                    t,
                                  ),
                                ))
                            : (Array.prototype.push.apply(n, r),
                              n.push(
                                (0, s.makeSpan)(
                                  ["mspace", "sixmuspace"],
                                  [],
                                  t,
                                ),
                              ));
                        }
                        return (
                          e.value.value &&
                            Array.prototype.push.apply(
                              n,
                              y(e.value.value, t, !1),
                            ),
                          ("pod" !== e.value.modType &&
                            "pmod" !== e.value.modType) ||
                            n.push(l["default"].mathsym(")", e.mode)),
                          l["default"].makeFragment(n)
                        );
                      },
                      katex: function (e, t) {
                        var n = (0, s.makeSpan)(
                            ["k"],
                            [l["default"].mathsym("K", e.mode)],
                            t,
                          ),
                          r = (0, s.makeSpan)(
                            ["a"],
                            [l["default"].mathsym("A", e.mode)],
                            t,
                          );
                        (r.height = 0.75 * (r.height + 0.2)),
                          (r.depth = 0.75 * (r.height - 0.2));
                        var i = (0, s.makeSpan)(
                            ["t"],
                            [l["default"].mathsym("T", e.mode)],
                            t,
                          ),
                          a = (0, s.makeSpan)(
                            ["e"],
                            [l["default"].mathsym("E", e.mode)],
                            t,
                          );
                        (a.height = a.height - 0.2155),
                          (a.depth = a.depth + 0.2155);
                        var o = (0, s.makeSpan)(
                          ["x"],
                          [l["default"].mathsym("X", e.mode)],
                          t,
                        );
                        return (0, s.makeSpan)(
                          ["mord", "katex-logo"],
                          [n, r, i, a, o],
                          t,
                        );
                      },
                    },
                    A = function (e, t, n) {
                      var r = (0, s.makeSpan)([e], [], t);
                      return (
                        (r.height = n || t.fontMetrics().defaultRuleThickness),
                        (r.style.borderBottomWidth = r.height + "em"),
                        (r.maxFontSize = 1),
                        r
                      );
                    };
                  (z.overline = function (e, t) {
                    var n = C(e.value.body, t.havingCrampedStyle()),
                      r = A("overline-line", t),
                      i = l["default"].makeVList(
                        [
                          { type: "elem", elem: n },
                          { type: "kern", size: 3 * r.height },
                          { type: "elem", elem: r },
                          { type: "kern", size: r.height },
                        ],
                        "firstBaseline",
                        null,
                        t,
                      );
                    return (0, s.makeSpan)(["mord", "overline"], [i], t);
                  }),
                    (z.underline = function (e, t) {
                      var n = C(e.value.body, t),
                        r = A("underline-line", t),
                        i = l["default"].makeVList(
                          [
                            { type: "kern", size: r.height },
                            { type: "elem", elem: r },
                            { type: "kern", size: 3 * r.height },
                            { type: "elem", elem: n },
                          ],
                          "top",
                          n.height,
                          t,
                        );
                      return (0, s.makeSpan)(["mord", "underline"], [i], t);
                    }),
                    (z.sqrt = function (e, t) {
                      var n = C(e.value.body, t.havingCrampedStyle());
                      n instanceof d["default"].documentFragment &&
                        (n = (0, s.makeSpan)([], [n], t));
                      var r = t.fontMetrics().defaultRuleThickness,
                        i = r;
                      t.style.id < o["default"].TEXT.id &&
                        (i = t.fontMetrics().xHeight);
                      var a = r + i / 4,
                        c = (n.height + n.depth + a + r) * t.sizeMultiplier,
                        h = u["default"].customSizedDelim(
                          "\\surd",
                          c,
                          !1,
                          t,
                          e.mode,
                        ),
                        p =
                          t.fontMetrics().sqrtRuleThickness * h.sizeMultiplier,
                        f = h.height - p;
                      f > n.height + n.depth + a &&
                        (a = (a + f - n.height - n.depth) / 2);
                      var m = h.height - n.height - a - p,
                        g = void 0;
                      if (
                        (0 === n.height && 0 === n.depth
                          ? (g = (0, s.makeSpan)())
                          : ((n.style.paddingLeft = h.surdWidth + "em"),
                            (g = l["default"].makeVList(
                              [
                                { type: "elem", elem: n },
                                { type: "kern", size: -(n.height + m) },
                                { type: "elem", elem: h },
                                { type: "kern", size: p },
                              ],
                              "firstBaseline",
                              null,
                              t,
                            )).children[0].children[0].classes.push(
                              "svg-align",
                            )),
                        e.value.index)
                      ) {
                        var v = t.havingStyle(o["default"].SCRIPTSCRIPT),
                          b = C(e.value.index, v, t),
                          y = 0.6 * (g.height - g.depth),
                          x = l["default"].makeVList(
                            [{ type: "elem", elem: b }],
                            "shift",
                            -y,
                            t,
                          ),
                          w = (0, s.makeSpan)(["root"], [x]);
                        return (0, s.makeSpan)(["mord", "sqrt"], [w, g], t);
                      }
                      return (0, s.makeSpan)(["mord", "sqrt"], [g], t);
                    }),
                    (z.sizing = function (e, t) {
                      var n = t.havingSize(e.value.size);
                      return r(e.value.value, n, t);
                    }),
                    (z.styling = function (e, t) {
                      var n = {
                          display: o["default"].DISPLAY,
                          text: o["default"].TEXT,
                          script: o["default"].SCRIPT,
                          scriptscript: o["default"].SCRIPTSCRIPT,
                        }[e.value.style],
                        i = t.havingStyle(n);
                      return r(e.value.value, i, t);
                    }),
                    (z.font = function (e, t) {
                      var n = e.value.font;
                      return C(e.value.body, t.withFont(n));
                    }),
                    (z.delimsizing = function (e, t) {
                      var n = e.value.value;
                      return "." === n
                        ? (0, s.makeSpan)([e.value.mclass])
                        : u["default"].sizedDelim(n, e.value.size, t, e.mode, [
                            e.value.mclass,
                          ]);
                    }),
                    (z.leftright = function (e, t) {
                      for (
                        var n = y(e.value.body, t, !0),
                          r = 0,
                          i = 0,
                          a = !1,
                          o = 0;
                        o < n.length;
                        o++
                      )
                        n[o].isMiddle
                          ? (a = !0)
                          : ((r = Math.max(n[o].height, r)),
                            (i = Math.max(n[o].depth, i)));
                      (r *= t.sizeMultiplier), (i *= t.sizeMultiplier);
                      var d = void 0;
                      if (
                        ((d =
                          "." === e.value.left
                            ? S(t, ["mopen"])
                            : u["default"].leftRightDelim(
                                e.value.left,
                                r,
                                i,
                                t,
                                e.mode,
                                ["mopen"],
                              )),
                        n.unshift(d),
                        a)
                      )
                        for (var c = 1; c < n.length; c++) {
                          var h = n[c];
                          if (h.isMiddle) {
                            n[c] = u["default"].leftRightDelim(
                              h.isMiddle.value,
                              r,
                              i,
                              h.isMiddle.options,
                              e.mode,
                              [],
                            );
                            var p = b(h.children, 0);
                            p && l["default"].prependChildren(n[c], p);
                          }
                        }
                      var f = void 0;
                      return (
                        (f =
                          "." === e.value.right
                            ? S(t, ["mclose"])
                            : u["default"].leftRightDelim(
                                e.value.right,
                                r,
                                i,
                                t,
                                e.mode,
                                ["mclose"],
                              )),
                        n.push(f),
                        (0, s.makeSpan)(["minner"], n, t)
                      );
                    }),
                    (z.middle = function (e, t) {
                      var n = void 0;
                      return (
                        "." === e.value.value
                          ? (n = S(t, []))
                          : ((n = u["default"].sizedDelim(
                              e.value.value,
                              1,
                              t,
                              e.mode,
                              [],
                            )).isMiddle = { value: e.value.value, options: t }),
                        n
                      );
                    }),
                    (z.rule = function (e, t) {
                      var n = (0, s.makeSpan)(["mord", "rule"], [], t),
                        r = 0;
                      e.value.shift &&
                        (r = c["default"].calculateSize(e.value.shift, t));
                      var i = c["default"].calculateSize(e.value.width, t),
                        a = c["default"].calculateSize(e.value.height, t);
                      return (
                        (n.style.borderRightWidth = i + "em"),
                        (n.style.borderTopWidth = a + "em"),
                        (n.style.bottom = r + "em"),
                        (n.width = i),
                        (n.height = a + r),
                        (n.depth = -r),
                        (n.maxFontSize = 1.125 * a * t.sizeMultiplier),
                        n
                      );
                    }),
                    (z.kern = function (e, t) {
                      var n = (0, s.makeSpan)(["mord", "rule"], [], t);
                      if (e.value.dimension) {
                        var r = c["default"].calculateSize(
                          e.value.dimension,
                          t,
                        );
                        n.style.marginLeft = r + "em";
                      }
                      return n;
                    }),
                    (z.accent = function (e, t) {
                      var n = e.value.base,
                        r = void 0;
                      if ("supsub" === e.type) {
                        var i = e;
                        (n = (e = i.value.base).value.base),
                          (i.value.base = n),
                          (r = C(i, t));
                      }
                      var a = C(n, t.havingCrampedStyle()),
                        o = 0;
                      if (e.value.isShifty && M(n)) {
                        var u = k(n);
                        o = C(u, t.havingCrampedStyle()).skew;
                      }
                      var d = Math.min(a.height, t.fontMetrics().xHeight),
                        c = void 0;
                      if (e.value.isStretchy) {
                        c = p["default"].svgSpan(e, t);
                        var h = (c = l["default"].makeVList(
                          [
                            { type: "elem", elem: a },
                            { type: "elem", elem: c },
                          ],
                          "firstBaseline",
                          null,
                          t,
                        )).children[0].children[0].children[1];
                        h.classes.push("svg-align"),
                          o > 0 &&
                            ((h.style.width = "calc(100% - " + 2 * o + "em)"),
                            (h.style.marginLeft = 2 * o + "em"));
                      } else {
                        var f = l["default"].makeSymbol(
                          e.value.label,
                          "Main-Regular",
                          e.mode,
                          t,
                        );
                        f.italic = 0;
                        var m = null;
                        "\\vec" === e.value.label
                          ? (m = "accent-vec")
                          : "\\H" === e.value.label && (m = "accent-hungarian"),
                          (c = (0, s.makeSpan)([], [f])),
                          ((c = (0, s.makeSpan)(
                            ["accent-body", m],
                            [c],
                          )).style.marginLeft = 2 * o + "em"),
                          (c = l["default"].makeVList(
                            [
                              { type: "elem", elem: a },
                              { type: "kern", size: -d },
                              { type: "elem", elem: c },
                            ],
                            "firstBaseline",
                            null,
                            t,
                          ));
                      }
                      var g = (0, s.makeSpan)(["mord", "accent"], [c], t);
                      return r
                        ? ((r.children[0] = g),
                          (r.height = Math.max(g.height, r.height)),
                          (r.classes[0] = "mord"),
                          r)
                        : g;
                    }),
                    (z.horizBrace = function (e, t) {
                      var n = t.style,
                        r = "supsub" === e.type,
                        i = void 0,
                        a = void 0;
                      r &&
                        (e.value.sup
                          ? ((a = t.havingStyle(n.sup())),
                            (i = C(e.value.sup, a, t)))
                          : ((a = t.havingStyle(n.sub())),
                            (i = C(e.value.sub, a, t))),
                        (e = e.value.base));
                      var u = C(
                          e.value.base,
                          t.havingBaseStyle(o["default"].DISPLAY),
                        ),
                        d = p["default"].svgSpan(e, t),
                        c = void 0;
                      if (
                        (e.value.isOver
                          ? (c = l["default"].makeVList(
                              [
                                { type: "elem", elem: u },
                                { type: "kern", size: 0.1 },
                                { type: "elem", elem: d },
                              ],
                              "firstBaseline",
                              null,
                              t,
                            )).children[0].children[0].children[1].classes.push(
                              "svg-align",
                            )
                          : (c = l["default"].makeVList(
                              [
                                { type: "elem", elem: d },
                                { type: "kern", size: 0.1 },
                                { type: "elem", elem: u },
                              ],
                              "bottom",
                              u.depth + 0.1 + d.height,
                              t,
                            )).children[0].children[0].children[0].classes.push(
                              "svg-align",
                            ),
                        r)
                      ) {
                        var h = (0, s.makeSpan)(
                          ["mord", e.value.isOver ? "mover" : "munder"],
                          [c],
                          t,
                        );
                        c = e.value.isOver
                          ? l["default"].makeVList(
                              [
                                { type: "elem", elem: h },
                                { type: "kern", size: 0.2 },
                                { type: "elem", elem: i },
                              ],
                              "firstBaseline",
                              null,
                              t,
                            )
                          : l["default"].makeVList(
                              [
                                { type: "elem", elem: i },
                                { type: "kern", size: 0.2 },
                                { type: "elem", elem: h },
                              ],
                              "bottom",
                              h.depth + 0.2 + i.height,
                              t,
                            );
                      }
                      return (0, s.makeSpan)(
                        ["mord", e.value.isOver ? "mover" : "munder"],
                        [c],
                        t,
                      );
                    }),
                    (z.accentUnder = function (e, t) {
                      var n = C(e.value.body, t),
                        r = p["default"].svgSpan(e, t),
                        i = /tilde/.test(e.value.label) ? 0.12 : 0,
                        a = l["default"].makeVList(
                          [
                            { type: "elem", elem: r },
                            { type: "kern", size: i },
                            { type: "elem", elem: n },
                          ],
                          "bottom",
                          r.height + i,
                          t,
                        );
                      return (
                        a.children[0].children[0].children[0].classes.push(
                          "svg-align",
                        ),
                        (0, s.makeSpan)(["mord", "accentunder"], [a], t)
                      );
                    }),
                    (z.enclose = function (e, t) {
                      var n = C(e.value.body, t),
                        r = e.value.label.substr(1),
                        i = t.sizeMultiplier,
                        a = void 0,
                        o = 0,
                        u = 0;
                      if ("sout" === r)
                        ((a = (0, s.makeSpan)(["stretchy", "sout"])).height =
                          t.fontMetrics().defaultRuleThickness / i),
                          (u = -0.5 * t.fontMetrics().xHeight);
                      else {
                        n.classes.push("fbox" === r ? "boxpad" : "cancel-pad");
                        var d = M(e.value.body);
                        (o = "fbox" === r ? 0.34 : d ? 0.2 : 0),
                          (u = n.depth + o),
                          (a = p["default"].encloseSpan(n, r, o, t));
                      }
                      var c = l["default"].makeVList(
                        [
                          { type: "elem", elem: n, shift: 0 },
                          { type: "elem", elem: a, shift: u },
                        ],
                        "individualShift",
                        null,
                        t,
                      );
                      return (
                        "fbox" !== r &&
                          c.children[0].children[0].children[1].classes.push(
                            "svg-align",
                          ),
                        /cancel/.test(r)
                          ? (0, s.makeSpan)(["mord", "cancel-lap"], [c], t)
                          : (0, s.makeSpan)(["mord"], [c], t)
                      );
                    }),
                    (z.xArrow = function (e, t) {
                      var n = t.style,
                        r = t.havingStyle(n.sup()),
                        i = C(e.value.body, r, t);
                      i.classes.push("x-arrow-pad");
                      var a = void 0;
                      e.value.below &&
                        ((r = t.havingStyle(n.sub())),
                        (a = C(e.value.below, r, t)).classes.push(
                          "x-arrow-pad",
                        ));
                      var o = p["default"].svgSpan(e, t),
                        u = -t.fontMetrics().axisHeight + o.depth,
                        d = -t.fontMetrics().axisHeight - o.height - 0.111,
                        c = void 0;
                      if (e.value.below) {
                        var h =
                          -t.fontMetrics().axisHeight +
                          a.height +
                          o.height +
                          0.111;
                        c = l["default"].makeVList(
                          [
                            { type: "elem", elem: i, shift: d },
                            { type: "elem", elem: o, shift: u },
                            { type: "elem", elem: a, shift: h },
                          ],
                          "individualShift",
                          null,
                          t,
                        );
                      } else
                        c = l["default"].makeVList(
                          [
                            { type: "elem", elem: i, shift: d },
                            { type: "elem", elem: o, shift: u },
                          ],
                          "individualShift",
                          null,
                          t,
                        );
                      return (
                        c.children[0].children[0].children[1].classes.push(
                          "svg-align",
                        ),
                        (0, s.makeSpan)(["mrel", "x-arrow"], [c], t)
                      );
                    }),
                    (z.phantom = function (e, t) {
                      var n = y(e.value.value, t.withPhantom(), !1);
                      return new l["default"].makeFragment(n);
                    }),
                    (z.mclass = function (e, t) {
                      var n = y(e.value.value, t, !0);
                      return (0, s.makeSpan)([e.value.mclass], n, t);
                    });
                  var C = function (e, t, n) {
                      if (!e) return (0, s.makeSpan)();
                      if (z[e.type]) {
                        var r = z[e.type](e, t);
                        if (n && t.size !== n.size) {
                          r = (0, s.makeSpan)(t.sizingClasses(n), [r], t);
                          var i = t.sizeMultiplier / n.sizeMultiplier;
                          (r.height *= i), (r.depth *= i);
                        }
                        return r;
                      }
                      throw new a["default"](
                        "Got group of unknown type: '" + e.type + "'",
                      );
                    },
                    T = function (e, t) {
                      e = JSON.parse((0, i["default"])(e));
                      var n = y(e, t, !0),
                        r = (0, s.makeSpan)(["base"], n, t),
                        a = (0, s.makeSpan)(["strut"]),
                        o = (0, s.makeSpan)(["strut", "bottom"]);
                      (a.style.height = r.height + "em"),
                        (o.style.height = r.height + r.depth + "em"),
                        (o.style.verticalAlign = -r.depth + "em");
                      var l = (0, s.makeSpan)(["katex-html"], [a, o, r]);
                      return l.setAttribute("aria-hidden", "true"), l;
                    };
                  t.exports = T;
                },
                {
                  "./ParseError": 29,
                  "./Style": 33,
                  "./buildCommon": 34,
                  "./delimiter": 38,
                  "./domTree": 39,
                  "./stretchy": 47,
                  "./units": 50,
                  "./utils": 51,
                  "babel-runtime/core-js/json/stringify": 2,
                },
              ],
              36: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = e("./buildCommon"),
                    i = n(r),
                    a = n(e("./fontMetrics")),
                    o = n(e("./mathMLTree")),
                    s = n(e("./ParseError")),
                    l = n(e("./Style")),
                    u = n(e("./symbols")),
                    d = n(e("./utils")),
                    c = n(e("./stretchy")),
                    h = function (e, t) {
                      return (
                        u["default"][t][e] &&
                          u["default"][t][e].replace &&
                          (e = u["default"][t][e].replace),
                        new o["default"].TextNode(e)
                      );
                    },
                    p = function (e, t) {
                      var n = t.font;
                      if (!n) return null;
                      var i = e.mode;
                      if ("mathit" === n) return "italic";
                      var o = e.value;
                      if (d["default"].contains(["\\imath", "\\jmath"], o))
                        return null;
                      u["default"][i][o] &&
                        u["default"][i][o].replace &&
                        (o = u["default"][i][o].replace);
                      var s = r.fontMap[n].fontName;
                      return a["default"].getCharacterMetrics(o, s)
                        ? r.fontMap[t.font].variant
                        : null;
                    },
                    f = {},
                    m = { mi: "italic", mn: "normal", mtext: "normal" };
                  (f.mathord = function (e, t) {
                    var n = new o["default"].MathNode("mi", [
                        h(e.value, e.mode),
                      ]),
                      r = p(e, t) || "italic";
                    return (
                      r !== m[n.type] && n.setAttribute("mathvariant", r), n
                    );
                  }),
                    (f.textord = function (e, t) {
                      var n = h(e.value, e.mode),
                        r = p(e, t) || "normal",
                        i = void 0;
                      return (
                        (i =
                          "text" === e.mode
                            ? new o["default"].MathNode("mtext", [n])
                            : /[0-9]/.test(e.value)
                              ? new o["default"].MathNode("mn", [n])
                              : "\\prime" === e.value
                                ? new o["default"].MathNode("mo", [n])
                                : new o["default"].MathNode("mi", [n])),
                        r !== m[i.type] && i.setAttribute("mathvariant", r),
                        i
                      );
                    }),
                    (f.bin = function (e) {
                      return new o["default"].MathNode("mo", [
                        h(e.value, e.mode),
                      ]);
                    }),
                    (f.rel = function (e) {
                      return new o["default"].MathNode("mo", [
                        h(e.value, e.mode),
                      ]);
                    }),
                    (f.open = function (e) {
                      return new o["default"].MathNode("mo", [
                        h(e.value, e.mode),
                      ]);
                    }),
                    (f.close = function (e) {
                      return new o["default"].MathNode("mo", [
                        h(e.value, e.mode),
                      ]);
                    }),
                    (f.inner = function (e) {
                      return new o["default"].MathNode("mo", [
                        h(e.value, e.mode),
                      ]);
                    }),
                    (f.punct = function (e) {
                      var t = new o["default"].MathNode("mo", [
                        h(e.value, e.mode),
                      ]);
                      return t.setAttribute("separator", "true"), t;
                    }),
                    (f.ordgroup = function (e, t) {
                      var n = g(e.value, t);
                      return new o["default"].MathNode("mrow", n);
                    }),
                    (f.text = function (e, t) {
                      for (
                        var n = e.value.body, r = [], i = null, a = 0;
                        a < n.length;
                        a++
                      ) {
                        var s = v(n[a], t);
                        "mtext" === s.type && null != i
                          ? Array.prototype.push.apply(i.children, s.children)
                          : (r.push(s), "mtext" === s.type && (i = s));
                      }
                      return 1 === r.length
                        ? r[0]
                        : new o["default"].MathNode("mrow", r);
                    }),
                    (f.color = function (e, t) {
                      var n = g(e.value.value, t),
                        r = new o["default"].MathNode("mstyle", n);
                      return r.setAttribute("mathcolor", e.value.color), r;
                    }),
                    (f.supsub = function (e, t) {
                      var n = !1,
                        r = void 0;
                      e.value.base &&
                        "horizBrace" === e.value.base.value.type &&
                        !!e.value.sup === e.value.base.value.isOver &&
                        ((n = !0), (r = e.value.base.value.isOver));
                      var i = !0,
                        a = [v(e.value.base, t, i)];
                      e.value.sub && a.push(v(e.value.sub, t, i)),
                        e.value.sup && a.push(v(e.value.sup, t, i));
                      var s = void 0;
                      if (n) s = r ? "mover" : "munder";
                      else if (e.value.sub)
                        if (e.value.sup) {
                          var u = e.value.base;
                          s =
                            u &&
                            u.value.limits &&
                            t.style === l["default"].DISPLAY
                              ? "munderover"
                              : "msubsup";
                        } else s = "msub";
                      else s = "msup";
                      return new o["default"].MathNode(s, a);
                    }),
                    (f.genfrac = function (e, t) {
                      var n = new o["default"].MathNode("mfrac", [
                        v(e.value.numer, t),
                        v(e.value.denom, t),
                      ]);
                      if (
                        (e.value.hasBarLine ||
                          n.setAttribute("linethickness", "0px"),
                        null != e.value.leftDelim || null != e.value.rightDelim)
                      ) {
                        var r = [];
                        if (null != e.value.leftDelim) {
                          var i = new o["default"].MathNode("mo", [
                            new o["default"].TextNode(e.value.leftDelim),
                          ]);
                          i.setAttribute("fence", "true"), r.push(i);
                        }
                        if ((r.push(n), null != e.value.rightDelim)) {
                          var a = new o["default"].MathNode("mo", [
                            new o["default"].TextNode(e.value.rightDelim),
                          ]);
                          a.setAttribute("fence", "true"), r.push(a);
                        }
                        return new o["default"].MathNode("mrow", r);
                      }
                      return n;
                    }),
                    (f.array = function (e, t) {
                      return new o["default"].MathNode(
                        "mtable",
                        e.value.body.map(function (e) {
                          return new o["default"].MathNode(
                            "mtr",
                            e.map(function (e) {
                              return new o["default"].MathNode("mtd", [
                                v(e, t),
                              ]);
                            }),
                          );
                        }),
                      );
                    }),
                    (f.sqrt = function (e, t) {
                      return e.value.index
                        ? new o["default"].MathNode("mroot", [
                            v(e.value.body, t),
                            v(e.value.index, t),
                          ])
                        : new o["default"].MathNode("msqrt", [
                            v(e.value.body, t),
                          ]);
                    }),
                    (f.leftright = function (e, t) {
                      var n = g(e.value.body, t);
                      if ("." !== e.value.left) {
                        var r = new o["default"].MathNode("mo", [
                          h(e.value.left, e.mode),
                        ]);
                        r.setAttribute("fence", "true"), n.unshift(r);
                      }
                      if ("." !== e.value.right) {
                        var i = new o["default"].MathNode("mo", [
                          h(e.value.right, e.mode),
                        ]);
                        i.setAttribute("fence", "true"), n.push(i);
                      }
                      return new o["default"].MathNode("mrow", n);
                    }),
                    (f.middle = function (e) {
                      var t = new o["default"].MathNode("mo", [
                        h(e.value.middle, e.mode),
                      ]);
                      return t.setAttribute("fence", "true"), t;
                    }),
                    (f.accent = function (e, t) {
                      var n = void 0;
                      n = e.value.isStretchy
                        ? c["default"].mathMLnode(e.value.label)
                        : new o["default"].MathNode("mo", [
                            h(e.value.label, e.mode),
                          ]);
                      var r = new o["default"].MathNode("mover", [
                        v(e.value.base, t),
                        n,
                      ]);
                      return r.setAttribute("accent", "true"), r;
                    }),
                    (f.spacing = function (e) {
                      var t = void 0;
                      return (
                        "\\ " === e.value ||
                        "\\space" === e.value ||
                        " " === e.value ||
                        "~" === e.value
                          ? (t = new o["default"].MathNode("mtext", [
                              new o["default"].TextNode("\xa0"),
                            ]))
                          : (t = new o["default"].MathNode(
                              "mspace",
                            )).setAttribute(
                              "width",
                              i["default"].spacingFunctions[e.value].size,
                            ),
                        t
                      );
                    }),
                    (f.op = function (e, t) {
                      return e.value.symbol
                        ? new o["default"].MathNode("mo", [
                            h(e.value.body, e.mode),
                          ])
                        : e.value.value
                          ? new o["default"].MathNode("mo", g(e.value.value, t))
                          : new o["default"].MathNode("mi", [
                              new o["default"].TextNode(e.value.body.slice(1)),
                            ]);
                    }),
                    (f.mod = function (e, t) {
                      var n = [];
                      if (
                        (("pod" !== e.value.modType &&
                          "pmod" !== e.value.modType) ||
                          n.push(
                            new o["default"].MathNode("mo", [h("(", e.mode)]),
                          ),
                        "pod" !== e.value.modType &&
                          n.push(
                            new o["default"].MathNode("mo", [h("mod", e.mode)]),
                          ),
                        e.value.value)
                      ) {
                        var r = new o["default"].MathNode("mspace");
                        r.setAttribute("width", "0.333333em"),
                          n.push(r),
                          (n = n.concat(g(e.value.value, t)));
                      }
                      return (
                        ("pod" !== e.value.modType &&
                          "pmod" !== e.value.modType) ||
                          n.push(
                            new o["default"].MathNode("mo", [h(")", e.mode)]),
                          ),
                        new o["default"].MathNode("mo", n)
                      );
                    }),
                    (f.katex = function () {
                      return new o["default"].MathNode("mtext", [
                        new o["default"].TextNode("KaTeX"),
                      ]);
                    }),
                    (f.font = function (e, t) {
                      var n = e.value.font;
                      return v(e.value.body, t.withFont(n));
                    }),
                    (f.delimsizing = function (e) {
                      var t = [];
                      "." !== e.value.value && t.push(h(e.value.value, e.mode));
                      var n = new o["default"].MathNode("mo", t);
                      return (
                        "mopen" === e.value.mclass ||
                        "mclose" === e.value.mclass
                          ? n.setAttribute("fence", "true")
                          : n.setAttribute("fence", "false"),
                        n
                      );
                    }),
                    (f.styling = function (e, t) {
                      var n = {
                          display: l["default"].DISPLAY,
                          text: l["default"].TEXT,
                          script: l["default"].SCRIPT,
                          scriptscript: l["default"].SCRIPTSCRIPT,
                        }[e.value.style],
                        r = t.havingStyle(n),
                        i = g(e.value.value, r),
                        a = new o["default"].MathNode("mstyle", i),
                        s = {
                          display: ["0", "true"],
                          text: ["0", "false"],
                          script: ["1", "false"],
                          scriptscript: ["2", "false"],
                        }[e.value.style];
                      return (
                        a.setAttribute("scriptlevel", s[0]),
                        a.setAttribute("displaystyle", s[1]),
                        a
                      );
                    }),
                    (f.sizing = function (e, t) {
                      var n = t.havingSize(e.value.size),
                        r = g(e.value.value, n),
                        i = new o["default"].MathNode("mstyle", r);
                      return (
                        i.setAttribute("mathsize", n.sizeMultiplier + "em"), i
                      );
                    }),
                    (f.overline = function (e, t) {
                      var n = new o["default"].MathNode("mo", [
                        new o["default"].TextNode("\u203e"),
                      ]);
                      n.setAttribute("stretchy", "true");
                      var r = new o["default"].MathNode("mover", [
                        v(e.value.body, t),
                        n,
                      ]);
                      return r.setAttribute("accent", "true"), r;
                    }),
                    (f.underline = function (e, t) {
                      var n = new o["default"].MathNode("mo", [
                        new o["default"].TextNode("\u203e"),
                      ]);
                      n.setAttribute("stretchy", "true");
                      var r = new o["default"].MathNode("munder", [
                        v(e.value.body, t),
                        n,
                      ]);
                      return r.setAttribute("accentunder", "true"), r;
                    }),
                    (f.accentUnder = function (e, t) {
                      var n = c["default"].mathMLnode(e.value.label),
                        r = new o["default"].MathNode("munder", [
                          v(e.value.body, t),
                          n,
                        ]);
                      return r.setAttribute("accentunder", "true"), r;
                    }),
                    (f.enclose = function (e, t) {
                      var n = new o["default"].MathNode("menclose", [
                          v(e.value.body, t),
                        ]),
                        r = "";
                      switch (e.value.label) {
                        case "\\bcancel":
                          r = "downdiagonalstrike";
                          break;
                        case "\\sout":
                          r = "horizontalstrike";
                          break;
                        case "\\fbox":
                          r = "box";
                          break;
                        default:
                          r = "updiagonalstrike";
                      }
                      return n.setAttribute("notation", r), n;
                    }),
                    (f.horizBrace = function (e, t) {
                      var n = c["default"].mathMLnode(e.value.label);
                      return new o["default"].MathNode(
                        e.value.isOver ? "mover" : "munder",
                        [v(e.value.base, t), n],
                      );
                    }),
                    (f.xArrow = function (e, t) {
                      var n = c["default"].mathMLnode(e.value.label),
                        r = void 0,
                        i = void 0;
                      if (e.value.body) {
                        var a = v(e.value.body, t);
                        e.value.below
                          ? ((i = v(e.value.below, t)),
                            (r = new o["default"].MathNode("munderover", [
                              n,
                              i,
                              a,
                            ])))
                          : (r = new o["default"].MathNode("mover", [n, a]));
                      } else
                        e.value.below
                          ? ((i = v(e.value.below, t)),
                            (r = new o["default"].MathNode("munder", [n, i])))
                          : (r = new o["default"].MathNode("mover", [n]));
                      return r;
                    }),
                    (f.rule = function () {
                      return new o["default"].MathNode("mrow");
                    }),
                    (f.kern = function () {
                      return new o["default"].MathNode("mrow");
                    }),
                    (f.llap = function (e, t) {
                      var n = new o["default"].MathNode("mpadded", [
                        v(e.value.body, t),
                      ]);
                      return (
                        n.setAttribute("lspace", "-1width"),
                        n.setAttribute("width", "0px"),
                        n
                      );
                    }),
                    (f.rlap = function (e, t) {
                      var n = new o["default"].MathNode("mpadded", [
                        v(e.value.body, t),
                      ]);
                      return n.setAttribute("width", "0px"), n;
                    }),
                    (f.phantom = function (e, t) {
                      var n = g(e.value.value, t);
                      return new o["default"].MathNode("mphantom", n);
                    }),
                    (f.mclass = function (e, t) {
                      var n = g(e.value.value, t);
                      return new o["default"].MathNode("mstyle", n);
                    });
                  var g = function (e, t) {
                      for (var n = [], r = 0; r < e.length; r++) {
                        var i = e[r];
                        n.push(v(i, t));
                      }
                      return n;
                    },
                    v = function (e, t) {
                      var n =
                        arguments.length > 2 &&
                        arguments[2] !== undefined &&
                        arguments[2];
                      if (!e) return new o["default"].MathNode("mrow");
                      if (f[e.type]) {
                        var r = f[e.type](e, t);
                        return n && "mrow" === r.type && 1 === r.children.length
                          ? r.children[0]
                          : r;
                      }
                      throw new s["default"](
                        "Got group of unknown type: '" + e.type + "'",
                      );
                    },
                    b = function (e, t, n) {
                      var i = g(e, n),
                        a = new o["default"].MathNode("mrow", i),
                        s = new o["default"].MathNode("annotation", [
                          new o["default"].TextNode(t),
                        ]);
                      s.setAttribute("encoding", "application/x-tex");
                      var l = new o["default"].MathNode("semantics", [a, s]),
                        u = new o["default"].MathNode("math", [l]);
                      return (0, r.makeSpan)(["katex-mathml"], [u]);
                    };
                  t.exports = b;
                },
                {
                  "./ParseError": 29,
                  "./Style": 33,
                  "./buildCommon": 34,
                  "./fontMetrics": 41,
                  "./mathMLTree": 45,
                  "./stretchy": 47,
                  "./symbols": 48,
                  "./utils": 51,
                },
              ],
              37: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = n(e("./buildHTML")),
                    i = n(e("./buildMathML")),
                    a = e("./buildCommon"),
                    o = n(e("./Options")),
                    s = n(e("./Settings")),
                    l = n(e("./Style")),
                    u = function (e, t, n) {
                      n = n || new s["default"]({});
                      var u = l["default"].TEXT;
                      n.displayMode && (u = l["default"].DISPLAY);
                      var d = new o["default"]({ style: u }),
                        c = (0, i["default"])(e, t, d),
                        h = (0, r["default"])(e, d),
                        p = (0, a.makeSpan)(["katex"], [c, h]);
                      return n.displayMode
                        ? (0, a.makeSpan)(["katex-display"], [p])
                        : p;
                    };
                  t.exports = u;
                },
                {
                  "./Options": 28,
                  "./Settings": 32,
                  "./Style": 33,
                  "./buildCommon": 34,
                  "./buildHTML": 35,
                  "./buildMathML": 36,
                },
              ],
              38: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = n(e("./ParseError")),
                    i = n(e("./Style")),
                    a = e("./buildCommon"),
                    o = n(a),
                    s = n(e("./fontMetrics")),
                    l = n(e("./symbols")),
                    u = n(e("./utils")),
                    d = function (e, t) {
                      return l["default"].math[e] &&
                        l["default"].math[e].replace
                        ? s["default"].getCharacterMetrics(
                            l["default"].math[e].replace,
                            t,
                          )
                        : s["default"].getCharacterMetrics(e, t);
                    },
                    c = function (e, t, n, r) {
                      var i = n.havingBaseStyle(t),
                        o = (0, a.makeSpan)(
                          (r || []).concat(i.sizingClasses(n)),
                          [e],
                          n,
                        );
                      return (
                        (o.delimSizeMultiplier =
                          i.sizeMultiplier / n.sizeMultiplier),
                        (o.height *= o.delimSizeMultiplier),
                        (o.depth *= o.delimSizeMultiplier),
                        (o.maxFontSize = i.sizeMultiplier),
                        o
                      );
                    },
                    h = function (e, t, n) {
                      var r = t.havingBaseStyle(n),
                        i =
                          (1 - t.sizeMultiplier / r.sizeMultiplier) *
                          t.fontMetrics().axisHeight;
                      e.classes.push("delimcenter"),
                        (e.style.top = i + "em"),
                        (e.height -= i),
                        (e.depth += i);
                    },
                    p = function (e, t, n, r, i, a) {
                      var s = o["default"].makeSymbol(e, "Main-Regular", i, r),
                        l = c(s, t, r, a);
                      return n && h(l, r, t), l;
                    },
                    f = function (e, t, n, r) {
                      return o["default"].makeSymbol(
                        e,
                        "Size" + t + "-Regular",
                        n,
                        r,
                      );
                    },
                    m = function (e, t, n, r, o, s) {
                      var l = f(e, t, o, r),
                        u = c(
                          (0, a.makeSpan)(["delimsizing", "size" + t], [l], r),
                          i["default"].TEXT,
                          r,
                          s,
                        );
                      return n && h(u, r, i["default"].TEXT), u;
                    },
                    g = function (e, t, n) {
                      var r = void 0;
                      return (
                        "Size1-Regular" === t
                          ? (r = "delim-size1")
                          : "Size4-Regular" === t && (r = "delim-size4"),
                        {
                          type: "elem",
                          elem: (0, a.makeSpan)(
                            ["delimsizinginner", r],
                            [
                              (0, a.makeSpan)(
                                [],
                                [o["default"].makeSymbol(e, t, n)],
                              ),
                            ],
                          ),
                        }
                      );
                    },
                    v = function (e, t, n, r, s, l) {
                      var u = void 0,
                        h = void 0,
                        p = void 0,
                        f = void 0;
                      (u = p = f = e), (h = null);
                      var m = "Size1-Regular";
                      "\\uparrow" === e
                        ? (p = f = "\u23d0")
                        : "\\Uparrow" === e
                          ? (p = f = "\u2016")
                          : "\\downarrow" === e
                            ? (u = p = "\u23d0")
                            : "\\Downarrow" === e
                              ? (u = p = "\u2016")
                              : "\\updownarrow" === e
                                ? ((u = "\\uparrow"),
                                  (p = "\u23d0"),
                                  (f = "\\downarrow"))
                                : "\\Updownarrow" === e
                                  ? ((u = "\\Uparrow"),
                                    (p = "\u2016"),
                                    (f = "\\Downarrow"))
                                  : "[" === e || "\\lbrack" === e
                                    ? ((u = "\u23a1"),
                                      (p = "\u23a2"),
                                      (f = "\u23a3"),
                                      (m = "Size4-Regular"))
                                    : "]" === e || "\\rbrack" === e
                                      ? ((u = "\u23a4"),
                                        (p = "\u23a5"),
                                        (f = "\u23a6"),
                                        (m = "Size4-Regular"))
                                      : "\\lfloor" === e
                                        ? ((p = u = "\u23a2"),
                                          (f = "\u23a3"),
                                          (m = "Size4-Regular"))
                                        : "\\lceil" === e
                                          ? ((u = "\u23a1"),
                                            (p = f = "\u23a2"),
                                            (m = "Size4-Regular"))
                                          : "\\rfloor" === e
                                            ? ((p = u = "\u23a5"),
                                              (f = "\u23a6"),
                                              (m = "Size4-Regular"))
                                            : "\\rceil" === e
                                              ? ((u = "\u23a4"),
                                                (p = f = "\u23a5"),
                                                (m = "Size4-Regular"))
                                              : "(" === e
                                                ? ((u = "\u239b"),
                                                  (p = "\u239c"),
                                                  (f = "\u239d"),
                                                  (m = "Size4-Regular"))
                                                : ")" === e
                                                  ? ((u = "\u239e"),
                                                    (p = "\u239f"),
                                                    (f = "\u23a0"),
                                                    (m = "Size4-Regular"))
                                                  : "\\{" === e ||
                                                      "\\lbrace" === e
                                                    ? ((u = "\u23a7"),
                                                      (h = "\u23a8"),
                                                      (f = "\u23a9"),
                                                      (p = "\u23aa"),
                                                      (m = "Size4-Regular"))
                                                    : "\\}" === e ||
                                                        "\\rbrace" === e
                                                      ? ((u = "\u23ab"),
                                                        (h = "\u23ac"),
                                                        (f = "\u23ad"),
                                                        (p = "\u23aa"),
                                                        (m = "Size4-Regular"))
                                                      : "\\lgroup" === e
                                                        ? ((u = "\u23a7"),
                                                          (f = "\u23a9"),
                                                          (p = "\u23aa"),
                                                          (m = "Size4-Regular"))
                                                        : "\\rgroup" === e
                                                          ? ((u = "\u23ab"),
                                                            (f = "\u23ad"),
                                                            (p = "\u23aa"),
                                                            (m =
                                                              "Size4-Regular"))
                                                          : "\\lmoustache" === e
                                                            ? ((u = "\u23a7"),
                                                              (f = "\u23ad"),
                                                              (p = "\u23aa"),
                                                              (m =
                                                                "Size4-Regular"))
                                                            : "\\rmoustache" ===
                                                                e &&
                                                              ((u = "\u23ab"),
                                                              (f = "\u23a9"),
                                                              (p = "\u23aa"),
                                                              (m =
                                                                "Size4-Regular"));
                      var v = d(u, m),
                        b = v.height + v.depth,
                        y = d(p, m),
                        x = y.height + y.depth,
                        w = d(f, m),
                        k = w.height + w.depth,
                        M = 0,
                        S = 1;
                      if (null !== h) {
                        var z = d(h, m);
                        (M = z.height + z.depth), (S = 2);
                      }
                      var A = b + k + M,
                        C = Math.ceil((t - A) / (S * x)),
                        T = A + C * S * x,
                        N = r.fontMetrics().axisHeight;
                      n && (N *= r.sizeMultiplier);
                      var E = T / 2 - N,
                        R = [];
                      if ((R.push(g(f, m, s)), null === h))
                        for (var L = 0; L < C; L++) R.push(g(p, m, s));
                      else {
                        for (var O = 0; O < C; O++) R.push(g(p, m, s));
                        R.push(g(h, m, s));
                        for (var q = 0; q < C; q++) R.push(g(p, m, s));
                      }
                      R.push(g(u, m, s));
                      var _ = r.havingBaseStyle(i["default"].TEXT),
                        D = o["default"].makeVList(R, "bottom", E, _);
                      return c(
                        (0, a.makeSpan)(["delimsizing", "mult"], [D], _),
                        i["default"].TEXT,
                        r,
                        l,
                      );
                    },
                    b = {
                      main: "<svg viewBox='0 0 400000 1000' preserveAspectRatio='xMinYMin\nslice'><path d='M95 622c-2.667 0-7.167-2.667-13.5\n-8S72 604 72 600c0-2 .333-3.333 1-4 1.333-2.667 23.833-20.667 67.5-54s\n65.833-50.333 66.5-51c1.333-1.333 3-2 5-2 4.667 0 8.667 3.333 12 10l173\n378c.667 0 35.333-71 104-213s137.5-285 206.5-429S812 17.333 812 14c5.333\n-9.333 12-14 20-14h399166v40H845.272L620 507 385 993c-2.667 4.667-9 7-19\n7-6 0-10-1-12-3L160 575l-65 47zM834 0h399166v40H845z'/></svg>",
                      1: "<svg viewBox='0 0 400000 1200' preserveAspectRatio='xMinYMin\nslice'><path d='M263 601c.667 0 18 39.667 52 119s68.167\n 158.667 102.5 238 51.833 119.333 52.5 120C810 373.333 980.667 17.667 982 11\nc4.667-7.333 11-11 19-11h398999v40H1012.333L741 607c-38.667 80.667-84 175-136\n 283s-89.167 185.333-111.5 232-33.833 70.333-34.5 71c-4.667 4.667-12.333 7-23\n 7l-12-1-109-253c-72.667-168-109.333-252-110-252-10.667 8-22 16.667-34 26-22\n 17.333-33.333 26-34 26l-26-26 76-59 76-60zM1001 0h398999v40H1012z'/></svg>",
                      2: "<svg viewBox='0 0 400000 1800' preserveAspectRatio='xMinYMin\nslice'><path d='M1001 0h398999v40H1013.084S929.667 308 749\n 880s-277 876.333-289 913c-4.667 4.667-12.667 7-24 7h-12c-1.333-3.333-3.667\n-11.667-7-25-35.333-125.333-106.667-373.333-214-744-10 12-21 25-33 39l-32 39\nc-6-5.333-15-14-27-26l25-30c26.667-32.667 52-63 76-91l52-60 208 722c56-175.333\n 126.333-397.333 211-666s153.833-488.167 207.5-658.5C944.167 129.167 975 32.667\n 983 10c4-6.667 10-10 18-10zm0 0h398999v40H1013z'/></svg>",
                      3: "<svg viewBox='0 0 400000 2400' preserveAspectRatio='xMinYMin\nslice'><path d='M424 2398c-1.333-.667-38.5-172-111.5-514\nS202.667 1370.667 202 1370c0-2-10.667 14.333-32 49-4.667 7.333-9.833 15.667\n-15.5 25s-9.833 16-12.5 20l-5 7c-4-3.333-8.333-7.667-13-13l-13-13 76-122 77-121\n 209 968c0-2 84.667-361.667 254-1079C896.333 373.667 981.667 13.333 983 10\nc4-6.667 10-10 18-10h398999v40H1014.622S927.332 418.667 742 1206c-185.333\n 787.333-279.333 1182.333-282 1185-2 6-10 9-24 9-8 0-12-.667-12-2z\nM1001 0h398999v40H1014z'/></svg>",
                      4: "<svg viewBox='0 0 400000 3000' preserveAspectRatio='xMinYMin\nslice'><path d='M473 2713C812.333 913.667 982.333 13 983 11\nc3.333-7.333 9.333-11 18-11h399110v40H1017.698S927.168 518 741.5 1506C555.833\n 2494 462 2989 460 2991c-2 6-10 9-24 9-8 0-12-.667-12-2s-5.333-32-16-92c-50.667\n-293.333-119.667-693.333-207-1200 0-1.333-5.333 8.667-16 30l-32 64-16 33-26-26\n 76-153 77-151c.667.667 35.667 202 105 604 67.333 400.667 102 602.667 104 606z\nM1001 0h398999v40H1017z'/></svg>",
                      tall: "l-4 4-4 4c-.667.667-2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1h\n-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170c-4-3.333-8.333\n-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667 219 661 l218 661z\nM702 0H400000v40H742z'/></svg>",
                    },
                    y = function (e, t, n) {
                      var r = o["default"].makeSpan([], [], n),
                        i = n.sizeMultiplier;
                      if ("small" === t.type)
                        (i =
                          n.havingBaseStyle(t.style).sizeMultiplier /
                          n.sizeMultiplier),
                          (r.height = 1 * i),
                          (r.style.height = r.height + "em"),
                          (r.surdWidth = 0.833 * i),
                          (r.innerHTML =
                            "<svg width='100%' height='" +
                            r.height +
                            "em'>\n            " +
                            b.main +
                            "</svg>");
                      else if ("large" === t.type)
                        (r.height = M[t.size] / i),
                          (r.style.height = r.height + "em"),
                          (r.surdWidth = 1 / i),
                          (r.innerHTML =
                            '<svg width="100%" height="' +
                            r.height +
                            'em">\n            ' +
                            b[t.size] +
                            "</svg>");
                      else {
                        (r.height = e / i),
                          (r.style.height = r.height + "em"),
                          (r.surdWidth = 1.056 / i);
                        var a = Math.floor(1e3 * r.height),
                          s = a - 54;
                        r.innerHTML =
                          "<svg width='100%' height='" +
                          r.height +
                          "em'>\n            <svg viewBox='0 0 400000 " +
                          a +
                          "'\n            preserveAspectRatio='xMinYMax slice'>\n            <path d='M702 0H400000v40H742v" +
                          s +
                          "\n            " +
                          b.tall +
                          "</svg>";
                      }
                      return (r.sizeMultiplier = i), r;
                    },
                    x = [
                      "(",
                      ")",
                      "[",
                      "\\lbrack",
                      "]",
                      "\\rbrack",
                      "\\{",
                      "\\lbrace",
                      "\\}",
                      "\\rbrace",
                      "\\lfloor",
                      "\\rfloor",
                      "\\lceil",
                      "\\rceil",
                      "\\surd",
                    ],
                    w = [
                      "\\uparrow",
                      "\\downarrow",
                      "\\updownarrow",
                      "\\Uparrow",
                      "\\Downarrow",
                      "\\Updownarrow",
                      "|",
                      "\\|",
                      "\\vert",
                      "\\Vert",
                      "\\lvert",
                      "\\rvert",
                      "\\lVert",
                      "\\rVert",
                      "\\lgroup",
                      "\\rgroup",
                      "\\lmoustache",
                      "\\rmoustache",
                    ],
                    k = [
                      "<",
                      ">",
                      "\\langle",
                      "\\rangle",
                      "/",
                      "\\backslash",
                      "\\lt",
                      "\\gt",
                    ],
                    M = [0, 1.2, 1.8, 2.4, 3],
                    S = function (e, t, n, i, a) {
                      if (
                        ("<" === e || "\\lt" === e
                          ? (e = "\\langle")
                          : (">" !== e && "\\gt" !== e) || (e = "\\rangle"),
                        u["default"].contains(x, e) ||
                          u["default"].contains(k, e))
                      )
                        return m(e, t, !1, n, i, a);
                      if (u["default"].contains(w, e))
                        return v(e, M[t], !1, n, i, a);
                      throw new r["default"]("Illegal delimiter: '" + e + "'");
                    },
                    z = [
                      { type: "small", style: i["default"].SCRIPTSCRIPT },
                      { type: "small", style: i["default"].SCRIPT },
                      { type: "small", style: i["default"].TEXT },
                      { type: "large", size: 1 },
                      { type: "large", size: 2 },
                      { type: "large", size: 3 },
                      { type: "large", size: 4 },
                    ],
                    A = [
                      { type: "small", style: i["default"].SCRIPTSCRIPT },
                      { type: "small", style: i["default"].SCRIPT },
                      { type: "small", style: i["default"].TEXT },
                      { type: "stack" },
                    ],
                    C = [
                      { type: "small", style: i["default"].SCRIPTSCRIPT },
                      { type: "small", style: i["default"].SCRIPT },
                      { type: "small", style: i["default"].TEXT },
                      { type: "large", size: 1 },
                      { type: "large", size: 2 },
                      { type: "large", size: 3 },
                      { type: "large", size: 4 },
                      { type: "stack" },
                    ],
                    T = function (e) {
                      return "small" === e.type
                        ? "Main-Regular"
                        : "large" === e.type
                          ? "Size" + e.size + "-Regular"
                          : "stack" === e.type
                            ? "Size4-Regular"
                            : void 0;
                    },
                    N = function (e, t, n, r) {
                      for (
                        var i = Math.min(2, 3 - r.style.size);
                        i < n.length && "stack" !== n[i].type;
                        i++
                      ) {
                        var a = d(e, T(n[i])),
                          o = a.height + a.depth;
                        if (
                          ("small" === n[i].type &&
                            (o *= r.havingBaseStyle(n[i].style).sizeMultiplier),
                          o > t)
                        )
                          return n[i];
                      }
                      return n[n.length - 1];
                    },
                    E = function (e, t, n, r, i, a) {
                      "<" === e || "\\lt" === e
                        ? (e = "\\langle")
                        : (">" !== e && "\\gt" !== e) || (e = "\\rangle");
                      var o = void 0;
                      o = u["default"].contains(k, e)
                        ? z
                        : u["default"].contains(x, e)
                          ? C
                          : A;
                      var s = N(e, t, o, r);
                      return "\\surd" === e
                        ? y(t, s, r)
                        : "small" === s.type
                          ? p(e, s.style, n, r, i, a)
                          : "large" === s.type
                            ? m(e, s.size, n, r, i, a)
                            : "stack" === s.type
                              ? v(e, t, n, r, i, a)
                              : void 0;
                    },
                    R = function (e, t, n, r, i, a) {
                      var o = r.fontMetrics().axisHeight * r.sizeMultiplier,
                        s = 901,
                        l = 5 / r.fontMetrics().ptPerEm,
                        u = Math.max(t - o, n + o),
                        d = Math.max((u / 500) * s, 2 * u - l);
                      return E(e, d, !0, r, i, a);
                    };
                  t.exports = {
                    sizedDelim: S,
                    customSizedDelim: E,
                    leftRightDelim: R,
                  };
                },
                {
                  "./ParseError": 29,
                  "./Style": 33,
                  "./buildCommon": 34,
                  "./fontMetrics": 41,
                  "./symbols": 48,
                  "./utils": 51,
                },
              ],
              39: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = n(e("babel-runtime/helpers/classCallCheck")),
                    i = n(e("babel-runtime/helpers/createClass")),
                    a = n(e("./unicodeRegexes")),
                    o = n(e("./utils")),
                    s = function (e) {
                      for (var t = (e = e.slice()).length - 1; t >= 0; t--)
                        e[t] || e.splice(t, 1);
                      return e.join(" ");
                    },
                    l = (function () {
                      function e(t, n, i) {
                        (0, r["default"])(this, e),
                          (this.classes = t || []),
                          (this.children = n || []),
                          (this.height = 0),
                          (this.depth = 0),
                          (this.maxFontSize = 0),
                          (this.style = {}),
                          (this.attributes = {}),
                          this.innerHTML,
                          i &&
                            (i.style.isTight() && this.classes.push("mtight"),
                            i.getColor() && (this.style.color = i.getColor()));
                      }
                      return (
                        (0, i["default"])(e, [
                          {
                            key: "setAttribute",
                            value: function (e, t) {
                              this.attributes[e] = t;
                            },
                          },
                          {
                            key: "tryCombine",
                            value: function () {
                              return !1;
                            },
                          },
                          {
                            key: "toNode",
                            value: function () {
                              var e = document.createElement("span");
                              for (var t in ((e.className = s(this.classes)),
                              this.style))
                                Object.prototype.hasOwnProperty.call(
                                  this.style,
                                  t,
                                ) && (e.style[t] = this.style[t]);
                              for (var n in this.attributes)
                                Object.prototype.hasOwnProperty.call(
                                  this.attributes,
                                  n,
                                ) && e.setAttribute(n, this.attributes[n]);
                              this.innerHTML && (e.innerHTML = this.innerHTML);
                              for (var r = 0; r < this.children.length; r++)
                                e.appendChild(this.children[r].toNode());
                              return e;
                            },
                          },
                          {
                            key: "toMarkup",
                            value: function () {
                              var e = "<span";
                              this.classes.length &&
                                ((e += ' class="'),
                                (e += o["default"].escape(s(this.classes))),
                                (e += '"'));
                              var t = "";
                              for (var n in this.style)
                                this.style.hasOwnProperty(n) &&
                                  (t +=
                                    o["default"].hyphenate(n) +
                                    ":" +
                                    this.style[n] +
                                    ";");
                              for (var r in (t &&
                                (e +=
                                  ' style="' + o["default"].escape(t) + '"'),
                              this.attributes))
                                Object.prototype.hasOwnProperty.call(
                                  this.attributes,
                                  r,
                                ) &&
                                  ((e += " " + r + '="'),
                                  (e += o["default"].escape(
                                    this.attributes[r],
                                  )),
                                  (e += '"'));
                              (e += ">"),
                                this.innerHTML && (e += this.innerHTML);
                              for (var i = 0; i < this.children.length; i++)
                                e += this.children[i].toMarkup();
                              return (e += "</span>");
                            },
                          },
                        ]),
                        e
                      );
                    })(),
                    u = (function () {
                      function e(t) {
                        (0, r["default"])(this, e),
                          (this.children = t || []),
                          (this.height = 0),
                          (this.depth = 0),
                          (this.maxFontSize = 0);
                      }
                      return (
                        (0, i["default"])(e, [
                          {
                            key: "toNode",
                            value: function () {
                              for (
                                var e = document.createDocumentFragment(),
                                  t = 0;
                                t < this.children.length;
                                t++
                              )
                                e.appendChild(this.children[t].toNode());
                              return e;
                            },
                          },
                          {
                            key: "toMarkup",
                            value: function () {
                              for (
                                var e = "", t = 0;
                                t < this.children.length;
                                t++
                              )
                                e += this.children[t].toMarkup();
                              return e;
                            },
                          },
                        ]),
                        e
                      );
                    })(),
                    d = {
                      "\xee": "\u0131\u0302",
                      "\xef": "\u0131\u0308",
                      "\xed": "\u0131\u0301",
                      "\xec": "\u0131\u0300",
                    },
                    c = (function () {
                      function e(t, n, i, o, s, l, u) {
                        (0, r["default"])(this, e),
                          (this.value = t || ""),
                          (this.height = n || 0),
                          (this.depth = i || 0),
                          (this.italic = o || 0),
                          (this.skew = s || 0),
                          (this.classes = l || []),
                          (this.style = u || {}),
                          (this.maxFontSize = 0),
                          a["default"].cjkRegex.test(t) &&
                            (a["default"].hangulRegex.test(t)
                              ? this.classes.push("hangul_fallback")
                              : this.classes.push("cjk_fallback")),
                          /[\xee\xef\xed\xec]/.test(this.value) &&
                            (this.value = d[this.value]);
                      }
                      return (
                        (0, i["default"])(e, [
                          {
                            key: "tryCombine",
                            value: function (t) {
                              if (
                                !t ||
                                !(t instanceof e) ||
                                this.italic > 0 ||
                                s(this.classes) !== s(t.classes) ||
                                this.skew !== t.skew ||
                                this.maxFontSize !== t.maxFontSize
                              )
                                return !1;
                              for (var n in this.style)
                                if (
                                  this.style.hasOwnProperty(n) &&
                                  this.style[n] !== t.style[n]
                                )
                                  return !1;
                              for (var r in t.style)
                                if (
                                  t.style.hasOwnProperty(r) &&
                                  this.style[r] !== t.style[r]
                                )
                                  return !1;
                              return (
                                (this.value += t.value),
                                (this.height = Math.max(this.height, t.height)),
                                (this.depth = Math.max(this.depth, t.depth)),
                                (this.italic = t.italic),
                                !0
                              );
                            },
                          },
                          {
                            key: "toNode",
                            value: function () {
                              var e = document.createTextNode(this.value),
                                t = null;
                              for (var n in (this.italic > 0 &&
                                ((t =
                                  document.createElement(
                                    "span",
                                  )).style.marginRight = this.italic + "em"),
                              this.classes.length > 0 &&
                                ((t =
                                  t ||
                                  document.createElement("span")).className = s(
                                  this.classes,
                                )),
                              this.style))
                                this.style.hasOwnProperty(n) &&
                                  ((t =
                                    t || document.createElement("span")).style[
                                    n
                                  ] = this.style[n]);
                              return t ? (t.appendChild(e), t) : e;
                            },
                          },
                          {
                            key: "toMarkup",
                            value: function () {
                              var e = !1,
                                t = "<span";
                              this.classes.length &&
                                ((e = !0),
                                (t += ' class="'),
                                (t += o["default"].escape(s(this.classes))),
                                (t += '"'));
                              var n = "";
                              for (var r in (this.italic > 0 &&
                                (n += "margin-right:" + this.italic + "em;"),
                              this.style))
                                this.style.hasOwnProperty(r) &&
                                  (n +=
                                    o["default"].hyphenate(r) +
                                    ":" +
                                    this.style[r] +
                                    ";");
                              n &&
                                ((e = !0),
                                (t +=
                                  ' style="' + o["default"].escape(n) + '"'));
                              var i = o["default"].escape(this.value);
                              return e
                                ? ((t += ">"), (t += i), (t += "</span>"))
                                : i;
                            },
                          },
                        ]),
                        e
                      );
                    })();
                  t.exports = { span: l, documentFragment: u, symbolNode: c };
                },
                {
                  "./unicodeRegexes": 49,
                  "./utils": 51,
                  "babel-runtime/helpers/classCallCheck": 4,
                  "babel-runtime/helpers/createClass": 5,
                },
              ],
              40: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  function r(e, t, n) {
                    for (var r = [], i = [r], a = []; ; ) {
                      var l = e.parseExpression(!1, null);
                      (l = new o["default"]("ordgroup", l, e.mode)),
                        n &&
                          (l = new o["default"](
                            "styling",
                            { style: n, value: [l] },
                            e.mode,
                          )),
                        r.push(l);
                      var u = e.nextToken.text;
                      if ("&" === u) e.consume();
                      else {
                        if ("\\end" === u) break;
                        if ("\\\\" !== u && "\\cr" !== u)
                          throw new s["default"](
                            "Expected & or \\\\ or \\end",
                            e.nextToken,
                          );
                        var d = e.parseFunction();
                        a.push(d.value.size), (r = []), i.push(r);
                      }
                    }
                    return (
                      (t.body = i),
                      (t.rowGaps = a),
                      new o["default"](t.type, t, e.mode)
                    );
                  }
                  function i(e, n, r) {
                    "string" == typeof e && (e = [e]),
                      "number" == typeof n && (n = { numArgs: n });
                    for (
                      var i = {
                          numArgs: n.numArgs || 0,
                          argTypes: n.argTypes,
                          greediness: 1,
                          allowedInText: !!n.allowedInText,
                          numOptionalArgs: n.numOptionalArgs || 0,
                          handler: r,
                        },
                        a = 0;
                      a < e.length;
                      ++a
                    )
                      t.exports[e[a]] = i;
                  }
                  function a(e) {
                    return "d" === e.substr(0, 1) ? "display" : "text";
                  }
                  var o = n(e("./ParseNode")),
                    s = n(e("./ParseError"));
                  i(["array", "darray"], { numArgs: 1 }, function (e, t) {
                    var n = t[0],
                      i = {
                        type: "array",
                        cols: (n = n.value.map ? n.value : [n]).map(
                          function (e) {
                            var t = e.value;
                            if (-1 !== "lcr".indexOf(t))
                              return { type: "align", align: t };
                            if ("|" === t)
                              return { type: "separator", separator: "|" };
                            throw new s["default"](
                              "Unknown column alignment: " + e.value,
                              e,
                            );
                          },
                        ),
                        hskipBeforeAndAfter: !0,
                      };
                    return (i = r(e.parser, i, a(e.envName)));
                  }),
                    i(
                      [
                        "matrix",
                        "pmatrix",
                        "bmatrix",
                        "Bmatrix",
                        "vmatrix",
                        "Vmatrix",
                      ],
                      {},
                      function (e) {
                        var t = {
                            matrix: null,
                            pmatrix: ["(", ")"],
                            bmatrix: ["[", "]"],
                            Bmatrix: ["\\{", "\\}"],
                            vmatrix: ["|", "|"],
                            Vmatrix: ["\\Vert", "\\Vert"],
                          }[e.envName],
                          n = { type: "array", hskipBeforeAndAfter: !1 };
                        return (
                          (n = r(e.parser, n, a(e.envName))),
                          t &&
                            (n = new o["default"](
                              "leftright",
                              { body: [n], left: t[0], right: t[1] },
                              e.mode,
                            )),
                          n
                        );
                      },
                    ),
                    i(["cases", "dcases"], {}, function (e) {
                      var t = {
                        type: "array",
                        arraystretch: 1.2,
                        cols: [
                          { type: "align", align: "l", pregap: 0, postgap: 1 },
                          { type: "align", align: "l", pregap: 0, postgap: 0 },
                        ],
                      };
                      return (
                        (t = r(e.parser, t, a(e.envName))),
                        (t = new o["default"](
                          "leftright",
                          { body: [t], left: "\\{", right: "." },
                          e.mode,
                        ))
                      );
                    }),
                    i("aligned", {}, function (e) {
                      var t = { type: "array", cols: [], addJot: !0 };
                      t = r(e.parser, t, "display");
                      var n = new o["default"]("ordgroup", [], e.mode),
                        i = 0;
                      t.value.body.forEach(function (e) {
                        for (var t = 1; t < e.length; t += 2) {
                          e[t].value.value[0].value.unshift(n);
                        }
                        i < e.length && (i = e.length);
                      });
                      for (var a = 0; a < i; ++a) {
                        var s = "r",
                          l = 0;
                        a % 2 == 1 ? (s = "l") : a > 0 && (l = 2),
                          (t.value.cols[a] = {
                            type: "align",
                            align: s,
                            pregap: l,
                            postgap: 0,
                          });
                      }
                      return t;
                    }),
                    i("gathered", {}, function (e) {
                      var t = {
                        type: "array",
                        cols: [{ type: "align", align: "c" }],
                        addJot: !0,
                      };
                      return (t = r(e.parser, t, "display"));
                    });
                },
                { "./ParseError": 29, "./ParseNode": 30 },
              ],
              41: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = e("./unicodeRegexes"),
                    i = n(e("./fontMetricsData")),
                    a = {
                      slant: [0.25, 0.25, 0.25],
                      space: [0, 0, 0],
                      stretch: [0, 0, 0],
                      shrink: [0, 0, 0],
                      xHeight: [0.431, 0.431, 0.431],
                      quad: [1, 1.171, 1.472],
                      extraSpace: [0, 0, 0],
                      num1: [0.677, 0.732, 0.925],
                      num2: [0.394, 0.384, 0.387],
                      num3: [0.444, 0.471, 0.504],
                      denom1: [0.686, 0.752, 1.025],
                      denom2: [0.345, 0.344, 0.532],
                      sup1: [0.413, 0.503, 0.504],
                      sup2: [0.363, 0.431, 0.404],
                      sup3: [0.289, 0.286, 0.294],
                      sub1: [0.15, 0.143, 0.2],
                      sub2: [0.247, 0.286, 0.4],
                      supDrop: [0.386, 0.353, 0.494],
                      subDrop: [0.05, 0.071, 0.1],
                      delim1: [2.39, 1.7, 1.98],
                      delim2: [1.01, 1.157, 1.42],
                      axisHeight: [0.25, 0.25, 0.25],
                      defaultRuleThickness: [0.04, 0.049, 0.049],
                      bigOpSpacing1: [0.111, 0.111, 0.111],
                      bigOpSpacing2: [0.166, 0.166, 0.166],
                      bigOpSpacing3: [0.2, 0.2, 0.2],
                      bigOpSpacing4: [0.6, 0.611, 0.611],
                      bigOpSpacing5: [0.1, 0.143, 0.143],
                      sqrtRuleThickness: [0.04, 0.04, 0.04],
                      ptPerEm: [10, 10, 10],
                      doubleRuleSep: [0.2, 0.2, 0.2],
                    },
                    o = {
                      "\xc0": "A",
                      "\xc1": "A",
                      "\xc2": "A",
                      "\xc3": "A",
                      "\xc4": "A",
                      "\xc5": "A",
                      "\xc6": "A",
                      "\xc7": "C",
                      "\xc8": "E",
                      "\xc9": "E",
                      "\xca": "E",
                      "\xcb": "E",
                      "\xcc": "I",
                      "\xcd": "I",
                      "\xce": "I",
                      "\xcf": "I",
                      "\xd0": "D",
                      "\xd1": "N",
                      "\xd2": "O",
                      "\xd3": "O",
                      "\xd4": "O",
                      "\xd5": "O",
                      "\xd6": "O",
                      "\xd8": "O",
                      "\xd9": "U",
                      "\xda": "U",
                      "\xdb": "U",
                      "\xdc": "U",
                      "\xdd": "Y",
                      "\xde": "o",
                      "\xdf": "B",
                      "\xe0": "a",
                      "\xe1": "a",
                      "\xe2": "a",
                      "\xe3": "a",
                      "\xe4": "a",
                      "\xe5": "a",
                      "\xe6": "a",
                      "\xe7": "c",
                      "\xe8": "e",
                      "\xe9": "e",
                      "\xea": "e",
                      "\xeb": "e",
                      "\xec": "i",
                      "\xed": "i",
                      "\xee": "i",
                      "\xef": "i",
                      "\xf0": "d",
                      "\xf1": "n",
                      "\xf2": "o",
                      "\xf3": "o",
                      "\xf4": "o",
                      "\xf5": "o",
                      "\xf6": "o",
                      "\xf8": "o",
                      "\xf9": "u",
                      "\xfa": "u",
                      "\xfb": "u",
                      "\xfc": "u",
                      "\xfd": "y",
                      "\xfe": "o",
                      "\xff": "y",
                      "\u0410": "A",
                      "\u0411": "B",
                      "\u0412": "B",
                      "\u0413": "F",
                      "\u0414": "A",
                      "\u0415": "E",
                      "\u0416": "K",
                      "\u0417": "3",
                      "\u0418": "N",
                      "\u0419": "N",
                      "\u041a": "K",
                      "\u041b": "N",
                      "\u041c": "M",
                      "\u041d": "H",
                      "\u041e": "O",
                      "\u041f": "N",
                      "\u0420": "P",
                      "\u0421": "C",
                      "\u0422": "T",
                      "\u0423": "y",
                      "\u0424": "O",
                      "\u0425": "X",
                      "\u0426": "U",
                      "\u0427": "h",
                      "\u0428": "W",
                      "\u0429": "W",
                      "\u042a": "B",
                      "\u042b": "X",
                      "\u042c": "B",
                      "\u042d": "3",
                      "\u042e": "X",
                      "\u042f": "R",
                      "\u0430": "a",
                      "\u0431": "b",
                      "\u0432": "a",
                      "\u0433": "r",
                      "\u0434": "y",
                      "\u0435": "e",
                      "\u0436": "m",
                      "\u0437": "e",
                      "\u0438": "n",
                      "\u0439": "n",
                      "\u043a": "n",
                      "\u043b": "n",
                      "\u043c": "m",
                      "\u043d": "n",
                      "\u043e": "o",
                      "\u043f": "n",
                      "\u0440": "p",
                      "\u0441": "c",
                      "\u0442": "o",
                      "\u0443": "y",
                      "\u0444": "b",
                      "\u0445": "x",
                      "\u0446": "n",
                      "\u0447": "n",
                      "\u0448": "w",
                      "\u0449": "w",
                      "\u044a": "a",
                      "\u044b": "m",
                      "\u044c": "a",
                      "\u044d": "e",
                      "\u044e": "m",
                      "\u044f": "r",
                    },
                    s = function (e, t) {
                      var n = e.charCodeAt(0);
                      e[0] in o
                        ? (n = o[e[0]].charCodeAt(0))
                        : r.cjkRegex.test(e[0]) && (n = "M".charCodeAt(0));
                      var a = i["default"][t][n];
                      if (a)
                        return {
                          depth: a[0],
                          height: a[1],
                          italic: a[2],
                          skew: a[3],
                          width: a[4],
                        };
                    },
                    l = {},
                    u = function (e) {
                      var t = void 0;
                      if (!l[(t = e >= 5 ? 0 : e >= 3 ? 1 : 2)]) {
                        var n = (l[t] = {});
                        for (var r in a)
                          a.hasOwnProperty(r) && (n[r] = a[r][t]);
                        n.cssEmPerMu = n.quad / 18;
                      }
                      return l[t];
                    };
                  t.exports = { getFontMetrics: u, getCharacterMetrics: s };
                },
                { "./fontMetricsData": 42, "./unicodeRegexes": 49 },
              ],
              42: [
                function (e, t) {
                  t.exports = {
                    "AMS-Regular": {
                      65: [0, 0.68889, 0, 0],
                      66: [0, 0.68889, 0, 0],
                      67: [0, 0.68889, 0, 0],
                      68: [0, 0.68889, 0, 0],
                      69: [0, 0.68889, 0, 0],
                      70: [0, 0.68889, 0, 0],
                      71: [0, 0.68889, 0, 0],
                      72: [0, 0.68889, 0, 0],
                      73: [0, 0.68889, 0, 0],
                      74: [0.16667, 0.68889, 0, 0],
                      75: [0, 0.68889, 0, 0],
                      76: [0, 0.68889, 0, 0],
                      77: [0, 0.68889, 0, 0],
                      78: [0, 0.68889, 0, 0],
                      79: [0.16667, 0.68889, 0, 0],
                      80: [0, 0.68889, 0, 0],
                      81: [0.16667, 0.68889, 0, 0],
                      82: [0, 0.68889, 0, 0],
                      83: [0, 0.68889, 0, 0],
                      84: [0, 0.68889, 0, 0],
                      85: [0, 0.68889, 0, 0],
                      86: [0, 0.68889, 0, 0],
                      87: [0, 0.68889, 0, 0],
                      88: [0, 0.68889, 0, 0],
                      89: [0, 0.68889, 0, 0],
                      90: [0, 0.68889, 0, 0],
                      107: [0, 0.68889, 0, 0],
                      165: [0, 0.675, 0.025, 0],
                      174: [0.15559, 0.69224, 0, 0],
                      240: [0, 0.68889, 0, 0],
                      295: [0, 0.68889, 0, 0],
                      710: [0, 0.825, 0, 0],
                      732: [0, 0.9, 0, 0],
                      770: [0, 0.825, 0, 0],
                      771: [0, 0.9, 0, 0],
                      989: [0.08167, 0.58167, 0, 0],
                      1008: [0, 0.43056, 0.04028, 0],
                      8245: [0, 0.54986, 0, 0],
                      8463: [0, 0.68889, 0, 0],
                      8487: [0, 0.68889, 0, 0],
                      8498: [0, 0.68889, 0, 0],
                      8502: [0, 0.68889, 0, 0],
                      8503: [0, 0.68889, 0, 0],
                      8504: [0, 0.68889, 0, 0],
                      8513: [0, 0.68889, 0, 0],
                      8592: [-0.03598, 0.46402, 0, 0],
                      8594: [-0.03598, 0.46402, 0, 0],
                      8602: [-0.13313, 0.36687, 0, 0],
                      8603: [-0.13313, 0.36687, 0, 0],
                      8606: [0.01354, 0.52239, 0, 0],
                      8608: [0.01354, 0.52239, 0, 0],
                      8610: [0.01354, 0.52239, 0, 0],
                      8611: [0.01354, 0.52239, 0, 0],
                      8619: [0, 0.54986, 0, 0],
                      8620: [0, 0.54986, 0, 0],
                      8621: [-0.13313, 0.37788, 0, 0],
                      8622: [-0.13313, 0.36687, 0, 0],
                      8624: [0, 0.69224, 0, 0],
                      8625: [0, 0.69224, 0, 0],
                      8630: [0, 0.43056, 0, 0],
                      8631: [0, 0.43056, 0, 0],
                      8634: [0.08198, 0.58198, 0, 0],
                      8635: [0.08198, 0.58198, 0, 0],
                      8638: [0.19444, 0.69224, 0, 0],
                      8639: [0.19444, 0.69224, 0, 0],
                      8642: [0.19444, 0.69224, 0, 0],
                      8643: [0.19444, 0.69224, 0, 0],
                      8644: [0.1808, 0.675, 0, 0],
                      8646: [0.1808, 0.675, 0, 0],
                      8647: [0.1808, 0.675, 0, 0],
                      8648: [0.19444, 0.69224, 0, 0],
                      8649: [0.1808, 0.675, 0, 0],
                      8650: [0.19444, 0.69224, 0, 0],
                      8651: [0.01354, 0.52239, 0, 0],
                      8652: [0.01354, 0.52239, 0, 0],
                      8653: [-0.13313, 0.36687, 0, 0],
                      8654: [-0.13313, 0.36687, 0, 0],
                      8655: [-0.13313, 0.36687, 0, 0],
                      8666: [0.13667, 0.63667, 0, 0],
                      8667: [0.13667, 0.63667, 0, 0],
                      8669: [-0.13313, 0.37788, 0, 0],
                      8672: [-0.064, 0.437, 0, 0],
                      8674: [-0.064, 0.437, 0, 0],
                      8705: [0, 0.825, 0, 0],
                      8708: [0, 0.68889, 0, 0],
                      8709: [0.08167, 0.58167, 0, 0],
                      8717: [0, 0.43056, 0, 0],
                      8722: [-0.03598, 0.46402, 0, 0],
                      8724: [0.08198, 0.69224, 0, 0],
                      8726: [0.08167, 0.58167, 0, 0],
                      8733: [0, 0.69224, 0, 0],
                      8736: [0, 0.69224, 0, 0],
                      8737: [0, 0.69224, 0, 0],
                      8738: [0.03517, 0.52239, 0, 0],
                      8739: [0.08167, 0.58167, 0, 0],
                      8740: [0.25142, 0.74111, 0, 0],
                      8741: [0.08167, 0.58167, 0, 0],
                      8742: [0.25142, 0.74111, 0, 0],
                      8756: [0, 0.69224, 0, 0],
                      8757: [0, 0.69224, 0, 0],
                      8764: [-0.13313, 0.36687, 0, 0],
                      8765: [-0.13313, 0.37788, 0, 0],
                      8769: [-0.13313, 0.36687, 0, 0],
                      8770: [-0.03625, 0.46375, 0, 0],
                      8774: [0.30274, 0.79383, 0, 0],
                      8776: [-0.01688, 0.48312, 0, 0],
                      8778: [0.08167, 0.58167, 0, 0],
                      8782: [0.06062, 0.54986, 0, 0],
                      8783: [0.06062, 0.54986, 0, 0],
                      8785: [0.08198, 0.58198, 0, 0],
                      8786: [0.08198, 0.58198, 0, 0],
                      8787: [0.08198, 0.58198, 0, 0],
                      8790: [0, 0.69224, 0, 0],
                      8791: [0.22958, 0.72958, 0, 0],
                      8796: [0.08198, 0.91667, 0, 0],
                      8806: [0.25583, 0.75583, 0, 0],
                      8807: [0.25583, 0.75583, 0, 0],
                      8808: [0.25142, 0.75726, 0, 0],
                      8809: [0.25142, 0.75726, 0, 0],
                      8812: [0.25583, 0.75583, 0, 0],
                      8814: [0.20576, 0.70576, 0, 0],
                      8815: [0.20576, 0.70576, 0, 0],
                      8816: [0.30274, 0.79383, 0, 0],
                      8817: [0.30274, 0.79383, 0, 0],
                      8818: [0.22958, 0.72958, 0, 0],
                      8819: [0.22958, 0.72958, 0, 0],
                      8822: [0.1808, 0.675, 0, 0],
                      8823: [0.1808, 0.675, 0, 0],
                      8828: [0.13667, 0.63667, 0, 0],
                      8829: [0.13667, 0.63667, 0, 0],
                      8830: [0.22958, 0.72958, 0, 0],
                      8831: [0.22958, 0.72958, 0, 0],
                      8832: [0.20576, 0.70576, 0, 0],
                      8833: [0.20576, 0.70576, 0, 0],
                      8840: [0.30274, 0.79383, 0, 0],
                      8841: [0.30274, 0.79383, 0, 0],
                      8842: [0.13597, 0.63597, 0, 0],
                      8843: [0.13597, 0.63597, 0, 0],
                      8847: [0.03517, 0.54986, 0, 0],
                      8848: [0.03517, 0.54986, 0, 0],
                      8858: [0.08198, 0.58198, 0, 0],
                      8859: [0.08198, 0.58198, 0, 0],
                      8861: [0.08198, 0.58198, 0, 0],
                      8862: [0, 0.675, 0, 0],
                      8863: [0, 0.675, 0, 0],
                      8864: [0, 0.675, 0, 0],
                      8865: [0, 0.675, 0, 0],
                      8872: [0, 0.69224, 0, 0],
                      8873: [0, 0.69224, 0, 0],
                      8874: [0, 0.69224, 0, 0],
                      8876: [0, 0.68889, 0, 0],
                      8877: [0, 0.68889, 0, 0],
                      8878: [0, 0.68889, 0, 0],
                      8879: [0, 0.68889, 0, 0],
                      8882: [0.03517, 0.54986, 0, 0],
                      8883: [0.03517, 0.54986, 0, 0],
                      8884: [0.13667, 0.63667, 0, 0],
                      8885: [0.13667, 0.63667, 0, 0],
                      8888: [0, 0.54986, 0, 0],
                      8890: [0.19444, 0.43056, 0, 0],
                      8891: [0.19444, 0.69224, 0, 0],
                      8892: [0.19444, 0.69224, 0, 0],
                      8901: [0, 0.54986, 0, 0],
                      8903: [0.08167, 0.58167, 0, 0],
                      8905: [0.08167, 0.58167, 0, 0],
                      8906: [0.08167, 0.58167, 0, 0],
                      8907: [0, 0.69224, 0, 0],
                      8908: [0, 0.69224, 0, 0],
                      8909: [-0.03598, 0.46402, 0, 0],
                      8910: [0, 0.54986, 0, 0],
                      8911: [0, 0.54986, 0, 0],
                      8912: [0.03517, 0.54986, 0, 0],
                      8913: [0.03517, 0.54986, 0, 0],
                      8914: [0, 0.54986, 0, 0],
                      8915: [0, 0.54986, 0, 0],
                      8916: [0, 0.69224, 0, 0],
                      8918: [0.0391, 0.5391, 0, 0],
                      8919: [0.0391, 0.5391, 0, 0],
                      8920: [0.03517, 0.54986, 0, 0],
                      8921: [0.03517, 0.54986, 0, 0],
                      8922: [0.38569, 0.88569, 0, 0],
                      8923: [0.38569, 0.88569, 0, 0],
                      8926: [0.13667, 0.63667, 0, 0],
                      8927: [0.13667, 0.63667, 0, 0],
                      8928: [0.30274, 0.79383, 0, 0],
                      8929: [0.30274, 0.79383, 0, 0],
                      8934: [0.23222, 0.74111, 0, 0],
                      8935: [0.23222, 0.74111, 0, 0],
                      8936: [0.23222, 0.74111, 0, 0],
                      8937: [0.23222, 0.74111, 0, 0],
                      8938: [0.20576, 0.70576, 0, 0],
                      8939: [0.20576, 0.70576, 0, 0],
                      8940: [0.30274, 0.79383, 0, 0],
                      8941: [0.30274, 0.79383, 0, 0],
                      8994: [0.19444, 0.69224, 0, 0],
                      8995: [0.19444, 0.69224, 0, 0],
                      9416: [0.15559, 0.69224, 0, 0],
                      9484: [0, 0.69224, 0, 0],
                      9488: [0, 0.69224, 0, 0],
                      9492: [0, 0.37788, 0, 0],
                      9496: [0, 0.37788, 0, 0],
                      9585: [0.19444, 0.68889, 0, 0],
                      9586: [0.19444, 0.74111, 0, 0],
                      9632: [0, 0.675, 0, 0],
                      9633: [0, 0.675, 0, 0],
                      9650: [0, 0.54986, 0, 0],
                      9651: [0, 0.54986, 0, 0],
                      9654: [0.03517, 0.54986, 0, 0],
                      9660: [0, 0.54986, 0, 0],
                      9661: [0, 0.54986, 0, 0],
                      9664: [0.03517, 0.54986, 0, 0],
                      9674: [0.11111, 0.69224, 0, 0],
                      9733: [0.19444, 0.69224, 0, 0],
                      10003: [0, 0.69224, 0, 0],
                      10016: [0, 0.69224, 0, 0],
                      10731: [0.11111, 0.69224, 0, 0],
                      10846: [0.19444, 0.75583, 0, 0],
                      10877: [0.13667, 0.63667, 0, 0],
                      10878: [0.13667, 0.63667, 0, 0],
                      10885: [0.25583, 0.75583, 0, 0],
                      10886: [0.25583, 0.75583, 0, 0],
                      10887: [0.13597, 0.63597, 0, 0],
                      10888: [0.13597, 0.63597, 0, 0],
                      10889: [0.26167, 0.75726, 0, 0],
                      10890: [0.26167, 0.75726, 0, 0],
                      10891: [0.48256, 0.98256, 0, 0],
                      10892: [0.48256, 0.98256, 0, 0],
                      10901: [0.13667, 0.63667, 0, 0],
                      10902: [0.13667, 0.63667, 0, 0],
                      10933: [0.25142, 0.75726, 0, 0],
                      10934: [0.25142, 0.75726, 0, 0],
                      10935: [0.26167, 0.75726, 0, 0],
                      10936: [0.26167, 0.75726, 0, 0],
                      10937: [0.26167, 0.75726, 0, 0],
                      10938: [0.26167, 0.75726, 0, 0],
                      10949: [0.25583, 0.75583, 0, 0],
                      10950: [0.25583, 0.75583, 0, 0],
                      10955: [0.28481, 0.79383, 0, 0],
                      10956: [0.28481, 0.79383, 0, 0],
                      57350: [0.08167, 0.58167, 0, 0],
                      57351: [0.08167, 0.58167, 0, 0],
                      57352: [0.08167, 0.58167, 0, 0],
                      57353: [0, 0.43056, 0.04028, 0],
                      57356: [0.25142, 0.75726, 0, 0],
                      57357: [0.25142, 0.75726, 0, 0],
                      57358: [0.41951, 0.91951, 0, 0],
                      57359: [0.30274, 0.79383, 0, 0],
                      57360: [0.30274, 0.79383, 0, 0],
                      57361: [0.41951, 0.91951, 0, 0],
                      57366: [0.25142, 0.75726, 0, 0],
                      57367: [0.25142, 0.75726, 0, 0],
                      57368: [0.25142, 0.75726, 0, 0],
                      57369: [0.25142, 0.75726, 0, 0],
                      57370: [0.13597, 0.63597, 0, 0],
                      57371: [0.13597, 0.63597, 0, 0],
                    },
                    "Caligraphic-Regular": {
                      48: [0, 0.43056, 0, 0],
                      49: [0, 0.43056, 0, 0],
                      50: [0, 0.43056, 0, 0],
                      51: [0.19444, 0.43056, 0, 0],
                      52: [0.19444, 0.43056, 0, 0],
                      53: [0.19444, 0.43056, 0, 0],
                      54: [0, 0.64444, 0, 0],
                      55: [0.19444, 0.43056, 0, 0],
                      56: [0, 0.64444, 0, 0],
                      57: [0.19444, 0.43056, 0, 0],
                      65: [0, 0.68333, 0, 0.19445],
                      66: [0, 0.68333, 0.03041, 0.13889],
                      67: [0, 0.68333, 0.05834, 0.13889],
                      68: [0, 0.68333, 0.02778, 0.08334],
                      69: [0, 0.68333, 0.08944, 0.11111],
                      70: [0, 0.68333, 0.09931, 0.11111],
                      71: [0.09722, 0.68333, 0.0593, 0.11111],
                      72: [0, 0.68333, 0.00965, 0.11111],
                      73: [0, 0.68333, 0.07382, 0],
                      74: [0.09722, 0.68333, 0.18472, 0.16667],
                      75: [0, 0.68333, 0.01445, 0.05556],
                      76: [0, 0.68333, 0, 0.13889],
                      77: [0, 0.68333, 0, 0.13889],
                      78: [0, 0.68333, 0.14736, 0.08334],
                      79: [0, 0.68333, 0.02778, 0.11111],
                      80: [0, 0.68333, 0.08222, 0.08334],
                      81: [0.09722, 0.68333, 0, 0.11111],
                      82: [0, 0.68333, 0, 0.08334],
                      83: [0, 0.68333, 0.075, 0.13889],
                      84: [0, 0.68333, 0.25417, 0],
                      85: [0, 0.68333, 0.09931, 0.08334],
                      86: [0, 0.68333, 0.08222, 0],
                      87: [0, 0.68333, 0.08222, 0.08334],
                      88: [0, 0.68333, 0.14643, 0.13889],
                      89: [0.09722, 0.68333, 0.08222, 0.08334],
                      90: [0, 0.68333, 0.07944, 0.13889],
                    },
                    "Fraktur-Regular": {
                      33: [0, 0.69141, 0, 0],
                      34: [0, 0.69141, 0, 0],
                      38: [0, 0.69141, 0, 0],
                      39: [0, 0.69141, 0, 0],
                      40: [0.24982, 0.74947, 0, 0],
                      41: [0.24982, 0.74947, 0, 0],
                      42: [0, 0.62119, 0, 0],
                      43: [0.08319, 0.58283, 0, 0],
                      44: [0, 0.10803, 0, 0],
                      45: [0.08319, 0.58283, 0, 0],
                      46: [0, 0.10803, 0, 0],
                      47: [0.24982, 0.74947, 0, 0],
                      48: [0, 0.47534, 0, 0],
                      49: [0, 0.47534, 0, 0],
                      50: [0, 0.47534, 0, 0],
                      51: [0.18906, 0.47534, 0, 0],
                      52: [0.18906, 0.47534, 0, 0],
                      53: [0.18906, 0.47534, 0, 0],
                      54: [0, 0.69141, 0, 0],
                      55: [0.18906, 0.47534, 0, 0],
                      56: [0, 0.69141, 0, 0],
                      57: [0.18906, 0.47534, 0, 0],
                      58: [0, 0.47534, 0, 0],
                      59: [0.12604, 0.47534, 0, 0],
                      61: [-0.13099, 0.36866, 0, 0],
                      63: [0, 0.69141, 0, 0],
                      65: [0, 0.69141, 0, 0],
                      66: [0, 0.69141, 0, 0],
                      67: [0, 0.69141, 0, 0],
                      68: [0, 0.69141, 0, 0],
                      69: [0, 0.69141, 0, 0],
                      70: [0.12604, 0.69141, 0, 0],
                      71: [0, 0.69141, 0, 0],
                      72: [0.06302, 0.69141, 0, 0],
                      73: [0, 0.69141, 0, 0],
                      74: [0.12604, 0.69141, 0, 0],
                      75: [0, 0.69141, 0, 0],
                      76: [0, 0.69141, 0, 0],
                      77: [0, 0.69141, 0, 0],
                      78: [0, 0.69141, 0, 0],
                      79: [0, 0.69141, 0, 0],
                      80: [0.18906, 0.69141, 0, 0],
                      81: [0.03781, 0.69141, 0, 0],
                      82: [0, 0.69141, 0, 0],
                      83: [0, 0.69141, 0, 0],
                      84: [0, 0.69141, 0, 0],
                      85: [0, 0.69141, 0, 0],
                      86: [0, 0.69141, 0, 0],
                      87: [0, 0.69141, 0, 0],
                      88: [0, 0.69141, 0, 0],
                      89: [0.18906, 0.69141, 0, 0],
                      90: [0.12604, 0.69141, 0, 0],
                      91: [0.24982, 0.74947, 0, 0],
                      93: [0.24982, 0.74947, 0, 0],
                      94: [0, 0.69141, 0, 0],
                      97: [0, 0.47534, 0, 0],
                      98: [0, 0.69141, 0, 0],
                      99: [0, 0.47534, 0, 0],
                      100: [0, 0.62119, 0, 0],
                      101: [0, 0.47534, 0, 0],
                      102: [0.18906, 0.69141, 0, 0],
                      103: [0.18906, 0.47534, 0, 0],
                      104: [0.18906, 0.69141, 0, 0],
                      105: [0, 0.69141, 0, 0],
                      106: [0, 0.69141, 0, 0],
                      107: [0, 0.69141, 0, 0],
                      108: [0, 0.69141, 0, 0],
                      109: [0, 0.47534, 0, 0],
                      110: [0, 0.47534, 0, 0],
                      111: [0, 0.47534, 0, 0],
                      112: [0.18906, 0.52396, 0, 0],
                      113: [0.18906, 0.47534, 0, 0],
                      114: [0, 0.47534, 0, 0],
                      115: [0, 0.47534, 0, 0],
                      116: [0, 0.62119, 0, 0],
                      117: [0, 0.47534, 0, 0],
                      118: [0, 0.52396, 0, 0],
                      119: [0, 0.52396, 0, 0],
                      120: [0.18906, 0.47534, 0, 0],
                      121: [0.18906, 0.47534, 0, 0],
                      122: [0.18906, 0.47534, 0, 0],
                      8216: [0, 0.69141, 0, 0],
                      8217: [0, 0.69141, 0, 0],
                      58112: [0, 0.62119, 0, 0],
                      58113: [0, 0.62119, 0, 0],
                      58114: [0.18906, 0.69141, 0, 0],
                      58115: [0.18906, 0.69141, 0, 0],
                      58116: [0.18906, 0.47534, 0, 0],
                      58117: [0, 0.69141, 0, 0],
                      58118: [0, 0.62119, 0, 0],
                      58119: [0, 0.47534, 0, 0],
                    },
                    "Main-Bold": {
                      33: [0, 0.69444, 0, 0],
                      34: [0, 0.69444, 0, 0],
                      35: [0.19444, 0.69444, 0, 0],
                      36: [0.05556, 0.75, 0, 0],
                      37: [0.05556, 0.75, 0, 0],
                      38: [0, 0.69444, 0, 0],
                      39: [0, 0.69444, 0, 0],
                      40: [0.25, 0.75, 0, 0],
                      41: [0.25, 0.75, 0, 0],
                      42: [0, 0.75, 0, 0],
                      43: [0.13333, 0.63333, 0, 0],
                      44: [0.19444, 0.15556, 0, 0],
                      45: [0, 0.44444, 0, 0],
                      46: [0, 0.15556, 0, 0],
                      47: [0.25, 0.75, 0, 0],
                      48: [0, 0.64444, 0, 0],
                      49: [0, 0.64444, 0, 0],
                      50: [0, 0.64444, 0, 0],
                      51: [0, 0.64444, 0, 0],
                      52: [0, 0.64444, 0, 0],
                      53: [0, 0.64444, 0, 0],
                      54: [0, 0.64444, 0, 0],
                      55: [0, 0.64444, 0, 0],
                      56: [0, 0.64444, 0, 0],
                      57: [0, 0.64444, 0, 0],
                      58: [0, 0.44444, 0, 0],
                      59: [0.19444, 0.44444, 0, 0],
                      60: [0.08556, 0.58556, 0, 0],
                      61: [-0.10889, 0.39111, 0, 0],
                      62: [0.08556, 0.58556, 0, 0],
                      63: [0, 0.69444, 0, 0],
                      64: [0, 0.69444, 0, 0],
                      65: [0, 0.68611, 0, 0],
                      66: [0, 0.68611, 0, 0],
                      67: [0, 0.68611, 0, 0],
                      68: [0, 0.68611, 0, 0],
                      69: [0, 0.68611, 0, 0],
                      70: [0, 0.68611, 0, 0],
                      71: [0, 0.68611, 0, 0],
                      72: [0, 0.68611, 0, 0],
                      73: [0, 0.68611, 0, 0],
                      74: [0, 0.68611, 0, 0],
                      75: [0, 0.68611, 0, 0],
                      76: [0, 0.68611, 0, 0],
                      77: [0, 0.68611, 0, 0],
                      78: [0, 0.68611, 0, 0],
                      79: [0, 0.68611, 0, 0],
                      80: [0, 0.68611, 0, 0],
                      81: [0.19444, 0.68611, 0, 0],
                      82: [0, 0.68611, 0, 0],
                      83: [0, 0.68611, 0, 0],
                      84: [0, 0.68611, 0, 0],
                      85: [0, 0.68611, 0, 0],
                      86: [0, 0.68611, 0.01597, 0],
                      87: [0, 0.68611, 0.01597, 0],
                      88: [0, 0.68611, 0, 0],
                      89: [0, 0.68611, 0.02875, 0],
                      90: [0, 0.68611, 0, 0],
                      91: [0.25, 0.75, 0, 0],
                      92: [0.25, 0.75, 0, 0],
                      93: [0.25, 0.75, 0, 0],
                      94: [0, 0.69444, 0, 0],
                      95: [0.31, 0.13444, 0.03194, 0],
                      96: [0, 0.69444, 0, 0],
                      97: [0, 0.44444, 0, 0],
                      98: [0, 0.69444, 0, 0],
                      99: [0, 0.44444, 0, 0],
                      100: [0, 0.69444, 0, 0],
                      101: [0, 0.44444, 0, 0],
                      102: [0, 0.69444, 0.10903, 0],
                      103: [0.19444, 0.44444, 0.01597, 0],
                      104: [0, 0.69444, 0, 0],
                      105: [0, 0.69444, 0, 0],
                      106: [0.19444, 0.69444, 0, 0],
                      107: [0, 0.69444, 0, 0],
                      108: [0, 0.69444, 0, 0],
                      109: [0, 0.44444, 0, 0],
                      110: [0, 0.44444, 0, 0],
                      111: [0, 0.44444, 0, 0],
                      112: [0.19444, 0.44444, 0, 0],
                      113: [0.19444, 0.44444, 0, 0],
                      114: [0, 0.44444, 0, 0],
                      115: [0, 0.44444, 0, 0],
                      116: [0, 0.63492, 0, 0],
                      117: [0, 0.44444, 0, 0],
                      118: [0, 0.44444, 0.01597, 0],
                      119: [0, 0.44444, 0.01597, 0],
                      120: [0, 0.44444, 0, 0],
                      121: [0.19444, 0.44444, 0.01597, 0],
                      122: [0, 0.44444, 0, 0],
                      123: [0.25, 0.75, 0, 0],
                      124: [0.25, 0.75, 0, 0],
                      125: [0.25, 0.75, 0, 0],
                      126: [0.35, 0.34444, 0, 0],
                      168: [0, 0.69444, 0, 0],
                      172: [0, 0.44444, 0, 0],
                      175: [0, 0.59611, 0, 0],
                      176: [0, 0.69444, 0, 0],
                      177: [0.13333, 0.63333, 0, 0],
                      180: [0, 0.69444, 0, 0],
                      215: [0.13333, 0.63333, 0, 0],
                      247: [0.13333, 0.63333, 0, 0],
                      305: [0, 0.44444, 0, 0],
                      567: [0.19444, 0.44444, 0, 0],
                      710: [0, 0.69444, 0, 0],
                      711: [0, 0.63194, 0, 0],
                      713: [0, 0.59611, 0, 0],
                      714: [0, 0.69444, 0, 0],
                      715: [0, 0.69444, 0, 0],
                      728: [0, 0.69444, 0, 0],
                      729: [0, 0.69444, 0, 0],
                      730: [0, 0.69444, 0, 0],
                      732: [0, 0.69444, 0, 0],
                      768: [0, 0.69444, 0, 0],
                      769: [0, 0.69444, 0, 0],
                      770: [0, 0.69444, 0, 0],
                      771: [0, 0.69444, 0, 0],
                      772: [0, 0.59611, 0, 0],
                      774: [0, 0.69444, 0, 0],
                      775: [0, 0.69444, 0, 0],
                      776: [0, 0.69444, 0, 0],
                      778: [0, 0.69444, 0, 0],
                      779: [0, 0.69444, 0, 0],
                      780: [0, 0.63194, 0, 0],
                      824: [0.19444, 0.69444, 0, 0],
                      915: [0, 0.68611, 0, 0],
                      916: [0, 0.68611, 0, 0],
                      920: [0, 0.68611, 0, 0],
                      923: [0, 0.68611, 0, 0],
                      926: [0, 0.68611, 0, 0],
                      928: [0, 0.68611, 0, 0],
                      931: [0, 0.68611, 0, 0],
                      933: [0, 0.68611, 0, 0],
                      934: [0, 0.68611, 0, 0],
                      936: [0, 0.68611, 0, 0],
                      937: [0, 0.68611, 0, 0],
                      8211: [0, 0.44444, 0.03194, 0],
                      8212: [0, 0.44444, 0.03194, 0],
                      8216: [0, 0.69444, 0, 0],
                      8217: [0, 0.69444, 0, 0],
                      8220: [0, 0.69444, 0, 0],
                      8221: [0, 0.69444, 0, 0],
                      8224: [0.19444, 0.69444, 0, 0],
                      8225: [0.19444, 0.69444, 0, 0],
                      8242: [0, 0.55556, 0, 0],
                      8407: [0, 0.72444, 0.15486, 0],
                      8463: [0, 0.69444, 0, 0],
                      8465: [0, 0.69444, 0, 0],
                      8467: [0, 0.69444, 0, 0],
                      8472: [0.19444, 0.44444, 0, 0],
                      8476: [0, 0.69444, 0, 0],
                      8501: [0, 0.69444, 0, 0],
                      8592: [-0.10889, 0.39111, 0, 0],
                      8593: [0.19444, 0.69444, 0, 0],
                      8594: [-0.10889, 0.39111, 0, 0],
                      8595: [0.19444, 0.69444, 0, 0],
                      8596: [-0.10889, 0.39111, 0, 0],
                      8597: [0.25, 0.75, 0, 0],
                      8598: [0.19444, 0.69444, 0, 0],
                      8599: [0.19444, 0.69444, 0, 0],
                      8600: [0.19444, 0.69444, 0, 0],
                      8601: [0.19444, 0.69444, 0, 0],
                      8636: [-0.10889, 0.39111, 0, 0],
                      8637: [-0.10889, 0.39111, 0, 0],
                      8640: [-0.10889, 0.39111, 0, 0],
                      8641: [-0.10889, 0.39111, 0, 0],
                      8656: [-0.10889, 0.39111, 0, 0],
                      8657: [0.19444, 0.69444, 0, 0],
                      8658: [-0.10889, 0.39111, 0, 0],
                      8659: [0.19444, 0.69444, 0, 0],
                      8660: [-0.10889, 0.39111, 0, 0],
                      8661: [0.25, 0.75, 0, 0],
                      8704: [0, 0.69444, 0, 0],
                      8706: [0, 0.69444, 0.06389, 0],
                      8707: [0, 0.69444, 0, 0],
                      8709: [0.05556, 0.75, 0, 0],
                      8711: [0, 0.68611, 0, 0],
                      8712: [0.08556, 0.58556, 0, 0],
                      8715: [0.08556, 0.58556, 0, 0],
                      8722: [0.13333, 0.63333, 0, 0],
                      8723: [0.13333, 0.63333, 0, 0],
                      8725: [0.25, 0.75, 0, 0],
                      8726: [0.25, 0.75, 0, 0],
                      8727: [-0.02778, 0.47222, 0, 0],
                      8728: [-0.02639, 0.47361, 0, 0],
                      8729: [-0.02639, 0.47361, 0, 0],
                      8730: [0.18, 0.82, 0, 0],
                      8733: [0, 0.44444, 0, 0],
                      8734: [0, 0.44444, 0, 0],
                      8736: [0, 0.69224, 0, 0],
                      8739: [0.25, 0.75, 0, 0],
                      8741: [0.25, 0.75, 0, 0],
                      8743: [0, 0.55556, 0, 0],
                      8744: [0, 0.55556, 0, 0],
                      8745: [0, 0.55556, 0, 0],
                      8746: [0, 0.55556, 0, 0],
                      8747: [0.19444, 0.69444, 0.12778, 0],
                      8764: [-0.10889, 0.39111, 0, 0],
                      8768: [0.19444, 0.69444, 0, 0],
                      8771: [0.00222, 0.50222, 0, 0],
                      8776: [0.02444, 0.52444, 0, 0],
                      8781: [0.00222, 0.50222, 0, 0],
                      8801: [0.00222, 0.50222, 0, 0],
                      8804: [0.19667, 0.69667, 0, 0],
                      8805: [0.19667, 0.69667, 0, 0],
                      8810: [0.08556, 0.58556, 0, 0],
                      8811: [0.08556, 0.58556, 0, 0],
                      8826: [0.08556, 0.58556, 0, 0],
                      8827: [0.08556, 0.58556, 0, 0],
                      8834: [0.08556, 0.58556, 0, 0],
                      8835: [0.08556, 0.58556, 0, 0],
                      8838: [0.19667, 0.69667, 0, 0],
                      8839: [0.19667, 0.69667, 0, 0],
                      8846: [0, 0.55556, 0, 0],
                      8849: [0.19667, 0.69667, 0, 0],
                      8850: [0.19667, 0.69667, 0, 0],
                      8851: [0, 0.55556, 0, 0],
                      8852: [0, 0.55556, 0, 0],
                      8853: [0.13333, 0.63333, 0, 0],
                      8854: [0.13333, 0.63333, 0, 0],
                      8855: [0.13333, 0.63333, 0, 0],
                      8856: [0.13333, 0.63333, 0, 0],
                      8857: [0.13333, 0.63333, 0, 0],
                      8866: [0, 0.69444, 0, 0],
                      8867: [0, 0.69444, 0, 0],
                      8868: [0, 0.69444, 0, 0],
                      8869: [0, 0.69444, 0, 0],
                      8900: [-0.02639, 0.47361, 0, 0],
                      8901: [-0.02639, 0.47361, 0, 0],
                      8902: [-0.02778, 0.47222, 0, 0],
                      8968: [0.25, 0.75, 0, 0],
                      8969: [0.25, 0.75, 0, 0],
                      8970: [0.25, 0.75, 0, 0],
                      8971: [0.25, 0.75, 0, 0],
                      8994: [-0.13889, 0.36111, 0, 0],
                      8995: [-0.13889, 0.36111, 0, 0],
                      9651: [0.19444, 0.69444, 0, 0],
                      9657: [-0.02778, 0.47222, 0, 0],
                      9661: [0.19444, 0.69444, 0, 0],
                      9667: [-0.02778, 0.47222, 0, 0],
                      9711: [0.19444, 0.69444, 0, 0],
                      9824: [0.12963, 0.69444, 0, 0],
                      9825: [0.12963, 0.69444, 0, 0],
                      9826: [0.12963, 0.69444, 0, 0],
                      9827: [0.12963, 0.69444, 0, 0],
                      9837: [0, 0.75, 0, 0],
                      9838: [0.19444, 0.69444, 0, 0],
                      9839: [0.19444, 0.69444, 0, 0],
                      10216: [0.25, 0.75, 0, 0],
                      10217: [0.25, 0.75, 0, 0],
                      10815: [0, 0.68611, 0, 0],
                      10927: [0.19667, 0.69667, 0, 0],
                      10928: [0.19667, 0.69667, 0, 0],
                    },
                    "Main-Italic": {
                      33: [0, 0.69444, 0.12417, 0],
                      34: [0, 0.69444, 0.06961, 0],
                      35: [0.19444, 0.69444, 0.06616, 0],
                      37: [0.05556, 0.75, 0.13639, 0],
                      38: [0, 0.69444, 0.09694, 0],
                      39: [0, 0.69444, 0.12417, 0],
                      40: [0.25, 0.75, 0.16194, 0],
                      41: [0.25, 0.75, 0.03694, 0],
                      42: [0, 0.75, 0.14917, 0],
                      43: [0.05667, 0.56167, 0.03694, 0],
                      44: [0.19444, 0.10556, 0, 0],
                      45: [0, 0.43056, 0.02826, 0],
                      46: [0, 0.10556, 0, 0],
                      47: [0.25, 0.75, 0.16194, 0],
                      48: [0, 0.64444, 0.13556, 0],
                      49: [0, 0.64444, 0.13556, 0],
                      50: [0, 0.64444, 0.13556, 0],
                      51: [0, 0.64444, 0.13556, 0],
                      52: [0.19444, 0.64444, 0.13556, 0],
                      53: [0, 0.64444, 0.13556, 0],
                      54: [0, 0.64444, 0.13556, 0],
                      55: [0.19444, 0.64444, 0.13556, 0],
                      56: [0, 0.64444, 0.13556, 0],
                      57: [0, 0.64444, 0.13556, 0],
                      58: [0, 0.43056, 0.0582, 0],
                      59: [0.19444, 0.43056, 0.0582, 0],
                      61: [-0.13313, 0.36687, 0.06616, 0],
                      63: [0, 0.69444, 0.1225, 0],
                      64: [0, 0.69444, 0.09597, 0],
                      65: [0, 0.68333, 0, 0],
                      66: [0, 0.68333, 0.10257, 0],
                      67: [0, 0.68333, 0.14528, 0],
                      68: [0, 0.68333, 0.09403, 0],
                      69: [0, 0.68333, 0.12028, 0],
                      70: [0, 0.68333, 0.13305, 0],
                      71: [0, 0.68333, 0.08722, 0],
                      72: [0, 0.68333, 0.16389, 0],
                      73: [0, 0.68333, 0.15806, 0],
                      74: [0, 0.68333, 0.14028, 0],
                      75: [0, 0.68333, 0.14528, 0],
                      76: [0, 0.68333, 0, 0],
                      77: [0, 0.68333, 0.16389, 0],
                      78: [0, 0.68333, 0.16389, 0],
                      79: [0, 0.68333, 0.09403, 0],
                      80: [0, 0.68333, 0.10257, 0],
                      81: [0.19444, 0.68333, 0.09403, 0],
                      82: [0, 0.68333, 0.03868, 0],
                      83: [0, 0.68333, 0.11972, 0],
                      84: [0, 0.68333, 0.13305, 0],
                      85: [0, 0.68333, 0.16389, 0],
                      86: [0, 0.68333, 0.18361, 0],
                      87: [0, 0.68333, 0.18361, 0],
                      88: [0, 0.68333, 0.15806, 0],
                      89: [0, 0.68333, 0.19383, 0],
                      90: [0, 0.68333, 0.14528, 0],
                      91: [0.25, 0.75, 0.1875, 0],
                      93: [0.25, 0.75, 0.10528, 0],
                      94: [0, 0.69444, 0.06646, 0],
                      95: [0.31, 0.12056, 0.09208, 0],
                      97: [0, 0.43056, 0.07671, 0],
                      98: [0, 0.69444, 0.06312, 0],
                      99: [0, 0.43056, 0.05653, 0],
                      100: [0, 0.69444, 0.10333, 0],
                      101: [0, 0.43056, 0.07514, 0],
                      102: [0.19444, 0.69444, 0.21194, 0],
                      103: [0.19444, 0.43056, 0.08847, 0],
                      104: [0, 0.69444, 0.07671, 0],
                      105: [0, 0.65536, 0.1019, 0],
                      106: [0.19444, 0.65536, 0.14467, 0],
                      107: [0, 0.69444, 0.10764, 0],
                      108: [0, 0.69444, 0.10333, 0],
                      109: [0, 0.43056, 0.07671, 0],
                      110: [0, 0.43056, 0.07671, 0],
                      111: [0, 0.43056, 0.06312, 0],
                      112: [0.19444, 0.43056, 0.06312, 0],
                      113: [0.19444, 0.43056, 0.08847, 0],
                      114: [0, 0.43056, 0.10764, 0],
                      115: [0, 0.43056, 0.08208, 0],
                      116: [0, 0.61508, 0.09486, 0],
                      117: [0, 0.43056, 0.07671, 0],
                      118: [0, 0.43056, 0.10764, 0],
                      119: [0, 0.43056, 0.10764, 0],
                      120: [0, 0.43056, 0.12042, 0],
                      121: [0.19444, 0.43056, 0.08847, 0],
                      122: [0, 0.43056, 0.12292, 0],
                      126: [0.35, 0.31786, 0.11585, 0],
                      163: [0, 0.69444, 0, 0],
                      305: [0, 0.43056, 0, 0.02778],
                      567: [0.19444, 0.43056, 0, 0.08334],
                      768: [0, 0.69444, 0, 0],
                      769: [0, 0.69444, 0.09694, 0],
                      770: [0, 0.69444, 0.06646, 0],
                      771: [0, 0.66786, 0.11585, 0],
                      772: [0, 0.56167, 0.10333, 0],
                      774: [0, 0.69444, 0.10806, 0],
                      775: [0, 0.66786, 0.11752, 0],
                      776: [0, 0.66786, 0.10474, 0],
                      778: [0, 0.69444, 0, 0],
                      779: [0, 0.69444, 0.1225, 0],
                      780: [0, 0.62847, 0.08295, 0],
                      915: [0, 0.68333, 0.13305, 0],
                      916: [0, 0.68333, 0, 0],
                      920: [0, 0.68333, 0.09403, 0],
                      923: [0, 0.68333, 0, 0],
                      926: [0, 0.68333, 0.15294, 0],
                      928: [0, 0.68333, 0.16389, 0],
                      931: [0, 0.68333, 0.12028, 0],
                      933: [0, 0.68333, 0.11111, 0],
                      934: [0, 0.68333, 0.05986, 0],
                      936: [0, 0.68333, 0.11111, 0],
                      937: [0, 0.68333, 0.10257, 0],
                      8211: [0, 0.43056, 0.09208, 0],
                      8212: [0, 0.43056, 0.09208, 0],
                      8216: [0, 0.69444, 0.12417, 0],
                      8217: [0, 0.69444, 0.12417, 0],
                      8220: [0, 0.69444, 0.1685, 0],
                      8221: [0, 0.69444, 0.06961, 0],
                      8463: [0, 0.68889, 0, 0],
                    },
                    "Main-Regular": {
                      32: [0, 0, 0, 0],
                      33: [0, 0.69444, 0, 0],
                      34: [0, 0.69444, 0, 0],
                      35: [0.19444, 0.69444, 0, 0],
                      36: [0.05556, 0.75, 0, 0],
                      37: [0.05556, 0.75, 0, 0],
                      38: [0, 0.69444, 0, 0],
                      39: [0, 0.69444, 0, 0],
                      40: [0.25, 0.75, 0, 0],
                      41: [0.25, 0.75, 0, 0],
                      42: [0, 0.75, 0, 0],
                      43: [0.08333, 0.58333, 0, 0],
                      44: [0.19444, 0.10556, 0, 0],
                      45: [0, 0.43056, 0, 0],
                      46: [0, 0.10556, 0, 0],
                      47: [0.25, 0.75, 0, 0],
                      48: [0, 0.64444, 0, 0],
                      49: [0, 0.64444, 0, 0],
                      50: [0, 0.64444, 0, 0],
                      51: [0, 0.64444, 0, 0],
                      52: [0, 0.64444, 0, 0],
                      53: [0, 0.64444, 0, 0],
                      54: [0, 0.64444, 0, 0],
                      55: [0, 0.64444, 0, 0],
                      56: [0, 0.64444, 0, 0],
                      57: [0, 0.64444, 0, 0],
                      58: [0, 0.43056, 0, 0],
                      59: [0.19444, 0.43056, 0, 0],
                      60: [0.0391, 0.5391, 0, 0],
                      61: [-0.13313, 0.36687, 0, 0],
                      62: [0.0391, 0.5391, 0, 0],
                      63: [0, 0.69444, 0, 0],
                      64: [0, 0.69444, 0, 0],
                      65: [0, 0.68333, 0, 0],
                      66: [0, 0.68333, 0, 0],
                      67: [0, 0.68333, 0, 0],
                      68: [0, 0.68333, 0, 0],
                      69: [0, 0.68333, 0, 0],
                      70: [0, 0.68333, 0, 0],
                      71: [0, 0.68333, 0, 0],
                      72: [0, 0.68333, 0, 0],
                      73: [0, 0.68333, 0, 0],
                      74: [0, 0.68333, 0, 0],
                      75: [0, 0.68333, 0, 0],
                      76: [0, 0.68333, 0, 0],
                      77: [0, 0.68333, 0, 0],
                      78: [0, 0.68333, 0, 0],
                      79: [0, 0.68333, 0, 0],
                      80: [0, 0.68333, 0, 0],
                      81: [0.19444, 0.68333, 0, 0],
                      82: [0, 0.68333, 0, 0],
                      83: [0, 0.68333, 0, 0],
                      84: [0, 0.68333, 0, 0],
                      85: [0, 0.68333, 0, 0],
                      86: [0, 0.68333, 0.01389, 0],
                      87: [0, 0.68333, 0.01389, 0],
                      88: [0, 0.68333, 0, 0],
                      89: [0, 0.68333, 0.025, 0],
                      90: [0, 0.68333, 0, 0],
                      91: [0.25, 0.75, 0, 0],
                      92: [0.25, 0.75, 0, 0],
                      93: [0.25, 0.75, 0, 0],
                      94: [0, 0.69444, 0, 0],
                      95: [0.31, 0.12056, 0.02778, 0],
                      96: [0, 0.69444, 0, 0],
                      97: [0, 0.43056, 0, 0],
                      98: [0, 0.69444, 0, 0],
                      99: [0, 0.43056, 0, 0],
                      100: [0, 0.69444, 0, 0],
                      101: [0, 0.43056, 0, 0],
                      102: [0, 0.69444, 0.07778, 0],
                      103: [0.19444, 0.43056, 0.01389, 0],
                      104: [0, 0.69444, 0, 0],
                      105: [0, 0.66786, 0, 0],
                      106: [0.19444, 0.66786, 0, 0],
                      107: [0, 0.69444, 0, 0],
                      108: [0, 0.69444, 0, 0],
                      109: [0, 0.43056, 0, 0],
                      110: [0, 0.43056, 0, 0],
                      111: [0, 0.43056, 0, 0],
                      112: [0.19444, 0.43056, 0, 0],
                      113: [0.19444, 0.43056, 0, 0],
                      114: [0, 0.43056, 0, 0],
                      115: [0, 0.43056, 0, 0],
                      116: [0, 0.61508, 0, 0],
                      117: [0, 0.43056, 0, 0],
                      118: [0, 0.43056, 0.01389, 0],
                      119: [0, 0.43056, 0.01389, 0],
                      120: [0, 0.43056, 0, 0],
                      121: [0.19444, 0.43056, 0.01389, 0],
                      122: [0, 0.43056, 0, 0],
                      123: [0.25, 0.75, 0, 0],
                      124: [0.25, 0.75, 0, 0],
                      125: [0.25, 0.75, 0, 0],
                      126: [0.35, 0.31786, 0, 0],
                      160: [0, 0, 0, 0],
                      168: [0, 0.66786, 0, 0],
                      172: [0, 0.43056, 0, 0],
                      175: [0, 0.56778, 0, 0],
                      176: [0, 0.69444, 0, 0],
                      177: [0.08333, 0.58333, 0, 0],
                      180: [0, 0.69444, 0, 0],
                      215: [0.08333, 0.58333, 0, 0],
                      247: [0.08333, 0.58333, 0, 0],
                      305: [0, 0.43056, 0, 0],
                      567: [0.19444, 0.43056, 0, 0],
                      710: [0, 0.69444, 0, 0],
                      711: [0, 0.62847, 0, 0],
                      713: [0, 0.56778, 0, 0],
                      714: [0, 0.69444, 0, 0],
                      715: [0, 0.69444, 0, 0],
                      728: [0, 0.69444, 0, 0],
                      729: [0, 0.66786, 0, 0],
                      730: [0, 0.69444, 0, 0],
                      732: [0, 0.66786, 0, 0],
                      768: [0, 0.69444, 0, 0],
                      769: [0, 0.69444, 0, 0],
                      770: [0, 0.69444, 0, 0],
                      771: [0, 0.66786, 0, 0],
                      772: [0, 0.56778, 0, 0],
                      774: [0, 0.69444, 0, 0],
                      775: [0, 0.66786, 0, 0],
                      776: [0, 0.66786, 0, 0],
                      778: [0, 0.69444, 0, 0],
                      779: [0, 0.69444, 0, 0],
                      780: [0, 0.62847, 0, 0],
                      824: [0.19444, 0.69444, 0, 0],
                      915: [0, 0.68333, 0, 0],
                      916: [0, 0.68333, 0, 0],
                      920: [0, 0.68333, 0, 0],
                      923: [0, 0.68333, 0, 0],
                      926: [0, 0.68333, 0, 0],
                      928: [0, 0.68333, 0, 0],
                      931: [0, 0.68333, 0, 0],
                      933: [0, 0.68333, 0, 0],
                      934: [0, 0.68333, 0, 0],
                      936: [0, 0.68333, 0, 0],
                      937: [0, 0.68333, 0, 0],
                      8211: [0, 0.43056, 0.02778, 0],
                      8212: [0, 0.43056, 0.02778, 0],
                      8216: [0, 0.69444, 0, 0],
                      8217: [0, 0.69444, 0, 0],
                      8220: [0, 0.69444, 0, 0],
                      8221: [0, 0.69444, 0, 0],
                      8224: [0.19444, 0.69444, 0, 0],
                      8225: [0.19444, 0.69444, 0, 0],
                      8230: [0, 0.12, 0, 0],
                      8242: [0, 0.55556, 0, 0],
                      8407: [0, 0.71444, 0.15382, 0],
                      8463: [0, 0.68889, 0, 0],
                      8465: [0, 0.69444, 0, 0],
                      8467: [0, 0.69444, 0, 0.11111],
                      8472: [0.19444, 0.43056, 0, 0.11111],
                      8476: [0, 0.69444, 0, 0],
                      8501: [0, 0.69444, 0, 0],
                      8592: [-0.13313, 0.36687, 0, 0],
                      8593: [0.19444, 0.69444, 0, 0],
                      8594: [-0.13313, 0.36687, 0, 0],
                      8595: [0.19444, 0.69444, 0, 0],
                      8596: [-0.13313, 0.36687, 0, 0],
                      8597: [0.25, 0.75, 0, 0],
                      8598: [0.19444, 0.69444, 0, 0],
                      8599: [0.19444, 0.69444, 0, 0],
                      8600: [0.19444, 0.69444, 0, 0],
                      8601: [0.19444, 0.69444, 0, 0],
                      8614: [0.011, 0.511, 0, 0],
                      8617: [0.011, 0.511, 0, 0],
                      8618: [0.011, 0.511, 0, 0],
                      8636: [-0.13313, 0.36687, 0, 0],
                      8637: [-0.13313, 0.36687, 0, 0],
                      8640: [-0.13313, 0.36687, 0, 0],
                      8641: [-0.13313, 0.36687, 0, 0],
                      8652: [0.011, 0.671, 0, 0],
                      8656: [-0.13313, 0.36687, 0, 0],
                      8657: [0.19444, 0.69444, 0, 0],
                      8658: [-0.13313, 0.36687, 0, 0],
                      8659: [0.19444, 0.69444, 0, 0],
                      8660: [-0.13313, 0.36687, 0, 0],
                      8661: [0.25, 0.75, 0, 0],
                      8704: [0, 0.69444, 0, 0],
                      8706: [0, 0.69444, 0.05556, 0.08334],
                      8707: [0, 0.69444, 0, 0],
                      8709: [0.05556, 0.75, 0, 0],
                      8711: [0, 0.68333, 0, 0],
                      8712: [0.0391, 0.5391, 0, 0],
                      8715: [0.0391, 0.5391, 0, 0],
                      8722: [0.08333, 0.58333, 0, 0],
                      8723: [0.08333, 0.58333, 0, 0],
                      8725: [0.25, 0.75, 0, 0],
                      8726: [0.25, 0.75, 0, 0],
                      8727: [-0.03472, 0.46528, 0, 0],
                      8728: [-0.05555, 0.44445, 0, 0],
                      8729: [-0.05555, 0.44445, 0, 0],
                      8730: [0.2, 0.8, 0, 0],
                      8733: [0, 0.43056, 0, 0],
                      8734: [0, 0.43056, 0, 0],
                      8736: [0, 0.69224, 0, 0],
                      8739: [0.25, 0.75, 0, 0],
                      8741: [0.25, 0.75, 0, 0],
                      8743: [0, 0.55556, 0, 0],
                      8744: [0, 0.55556, 0, 0],
                      8745: [0, 0.55556, 0, 0],
                      8746: [0, 0.55556, 0, 0],
                      8747: [0.19444, 0.69444, 0.11111, 0],
                      8764: [-0.13313, 0.36687, 0, 0],
                      8768: [0.19444, 0.69444, 0, 0],
                      8771: [-0.03625, 0.46375, 0, 0],
                      8773: [-0.022, 0.589, 0, 0],
                      8776: [-0.01688, 0.48312, 0, 0],
                      8781: [-0.03625, 0.46375, 0, 0],
                      8784: [-0.133, 0.67, 0, 0],
                      8800: [0.215, 0.716, 0, 0],
                      8801: [-0.03625, 0.46375, 0, 0],
                      8804: [0.13597, 0.63597, 0, 0],
                      8805: [0.13597, 0.63597, 0, 0],
                      8810: [0.0391, 0.5391, 0, 0],
                      8811: [0.0391, 0.5391, 0, 0],
                      8826: [0.0391, 0.5391, 0, 0],
                      8827: [0.0391, 0.5391, 0, 0],
                      8834: [0.0391, 0.5391, 0, 0],
                      8835: [0.0391, 0.5391, 0, 0],
                      8838: [0.13597, 0.63597, 0, 0],
                      8839: [0.13597, 0.63597, 0, 0],
                      8846: [0, 0.55556, 0, 0],
                      8849: [0.13597, 0.63597, 0, 0],
                      8850: [0.13597, 0.63597, 0, 0],
                      8851: [0, 0.55556, 0, 0],
                      8852: [0, 0.55556, 0, 0],
                      8853: [0.08333, 0.58333, 0, 0],
                      8854: [0.08333, 0.58333, 0, 0],
                      8855: [0.08333, 0.58333, 0, 0],
                      8856: [0.08333, 0.58333, 0, 0],
                      8857: [0.08333, 0.58333, 0, 0],
                      8866: [0, 0.69444, 0, 0],
                      8867: [0, 0.69444, 0, 0],
                      8868: [0, 0.69444, 0, 0],
                      8869: [0, 0.69444, 0, 0],
                      8872: [0.249, 0.75, 0, 0],
                      8900: [-0.05555, 0.44445, 0, 0],
                      8901: [-0.05555, 0.44445, 0, 0],
                      8902: [-0.03472, 0.46528, 0, 0],
                      8904: [0.005, 0.505, 0, 0],
                      8942: [0.03, 0.9, 0, 0],
                      8943: [-0.19, 0.31, 0, 0],
                      8945: [-0.1, 0.82, 0, 0],
                      8968: [0.25, 0.75, 0, 0],
                      8969: [0.25, 0.75, 0, 0],
                      8970: [0.25, 0.75, 0, 0],
                      8971: [0.25, 0.75, 0, 0],
                      8994: [-0.14236, 0.35764, 0, 0],
                      8995: [-0.14236, 0.35764, 0, 0],
                      9136: [0.244, 0.744, 0, 0],
                      9137: [0.244, 0.744, 0, 0],
                      9651: [0.19444, 0.69444, 0, 0],
                      9657: [-0.03472, 0.46528, 0, 0],
                      9661: [0.19444, 0.69444, 0, 0],
                      9667: [-0.03472, 0.46528, 0, 0],
                      9711: [0.19444, 0.69444, 0, 0],
                      9824: [0.12963, 0.69444, 0, 0],
                      9825: [0.12963, 0.69444, 0, 0],
                      9826: [0.12963, 0.69444, 0, 0],
                      9827: [0.12963, 0.69444, 0, 0],
                      9837: [0, 0.75, 0, 0],
                      9838: [0.19444, 0.69444, 0, 0],
                      9839: [0.19444, 0.69444, 0, 0],
                      10216: [0.25, 0.75, 0, 0],
                      10217: [0.25, 0.75, 0, 0],
                      10222: [0.244, 0.744, 0, 0],
                      10223: [0.244, 0.744, 0, 0],
                      10229: [0.011, 0.511, 0, 0],
                      10230: [0.011, 0.511, 0, 0],
                      10231: [0.011, 0.511, 0, 0],
                      10232: [0.024, 0.525, 0, 0],
                      10233: [0.024, 0.525, 0, 0],
                      10234: [0.024, 0.525, 0, 0],
                      10236: [0.011, 0.511, 0, 0],
                      10815: [0, 0.68333, 0, 0],
                      10927: [0.13597, 0.63597, 0, 0],
                      10928: [0.13597, 0.63597, 0, 0],
                    },
                    "Math-BoldItalic": {
                      47: [0.19444, 0.69444, 0, 0],
                      65: [0, 0.68611, 0, 0],
                      66: [0, 0.68611, 0.04835, 0],
                      67: [0, 0.68611, 0.06979, 0],
                      68: [0, 0.68611, 0.03194, 0],
                      69: [0, 0.68611, 0.05451, 0],
                      70: [0, 0.68611, 0.15972, 0],
                      71: [0, 0.68611, 0, 0],
                      72: [0, 0.68611, 0.08229, 0],
                      73: [0, 0.68611, 0.07778, 0],
                      74: [0, 0.68611, 0.10069, 0],
                      75: [0, 0.68611, 0.06979, 0],
                      76: [0, 0.68611, 0, 0],
                      77: [0, 0.68611, 0.11424, 0],
                      78: [0, 0.68611, 0.11424, 0],
                      79: [0, 0.68611, 0.03194, 0],
                      80: [0, 0.68611, 0.15972, 0],
                      81: [0.19444, 0.68611, 0, 0],
                      82: [0, 0.68611, 0.00421, 0],
                      83: [0, 0.68611, 0.05382, 0],
                      84: [0, 0.68611, 0.15972, 0],
                      85: [0, 0.68611, 0.11424, 0],
                      86: [0, 0.68611, 0.25555, 0],
                      87: [0, 0.68611, 0.15972, 0],
                      88: [0, 0.68611, 0.07778, 0],
                      89: [0, 0.68611, 0.25555, 0],
                      90: [0, 0.68611, 0.06979, 0],
                      97: [0, 0.44444, 0, 0],
                      98: [0, 0.69444, 0, 0],
                      99: [0, 0.44444, 0, 0],
                      100: [0, 0.69444, 0, 0],
                      101: [0, 0.44444, 0, 0],
                      102: [0.19444, 0.69444, 0.11042, 0],
                      103: [0.19444, 0.44444, 0.03704, 0],
                      104: [0, 0.69444, 0, 0],
                      105: [0, 0.69326, 0, 0],
                      106: [0.19444, 0.69326, 0.0622, 0],
                      107: [0, 0.69444, 0.01852, 0],
                      108: [0, 0.69444, 0.0088, 0],
                      109: [0, 0.44444, 0, 0],
                      110: [0, 0.44444, 0, 0],
                      111: [0, 0.44444, 0, 0],
                      112: [0.19444, 0.44444, 0, 0],
                      113: [0.19444, 0.44444, 0.03704, 0],
                      114: [0, 0.44444, 0.03194, 0],
                      115: [0, 0.44444, 0, 0],
                      116: [0, 0.63492, 0, 0],
                      117: [0, 0.44444, 0, 0],
                      118: [0, 0.44444, 0.03704, 0],
                      119: [0, 0.44444, 0.02778, 0],
                      120: [0, 0.44444, 0, 0],
                      121: [0.19444, 0.44444, 0.03704, 0],
                      122: [0, 0.44444, 0.04213, 0],
                      915: [0, 0.68611, 0.15972, 0],
                      916: [0, 0.68611, 0, 0],
                      920: [0, 0.68611, 0.03194, 0],
                      923: [0, 0.68611, 0, 0],
                      926: [0, 0.68611, 0.07458, 0],
                      928: [0, 0.68611, 0.08229, 0],
                      931: [0, 0.68611, 0.05451, 0],
                      933: [0, 0.68611, 0.15972, 0],
                      934: [0, 0.68611, 0, 0],
                      936: [0, 0.68611, 0.11653, 0],
                      937: [0, 0.68611, 0.04835, 0],
                      945: [0, 0.44444, 0, 0],
                      946: [0.19444, 0.69444, 0.03403, 0],
                      947: [0.19444, 0.44444, 0.06389, 0],
                      948: [0, 0.69444, 0.03819, 0],
                      949: [0, 0.44444, 0, 0],
                      950: [0.19444, 0.69444, 0.06215, 0],
                      951: [0.19444, 0.44444, 0.03704, 0],
                      952: [0, 0.69444, 0.03194, 0],
                      953: [0, 0.44444, 0, 0],
                      954: [0, 0.44444, 0, 0],
                      955: [0, 0.69444, 0, 0],
                      956: [0.19444, 0.44444, 0, 0],
                      957: [0, 0.44444, 0.06898, 0],
                      958: [0.19444, 0.69444, 0.03021, 0],
                      959: [0, 0.44444, 0, 0],
                      960: [0, 0.44444, 0.03704, 0],
                      961: [0.19444, 0.44444, 0, 0],
                      962: [0.09722, 0.44444, 0.07917, 0],
                      963: [0, 0.44444, 0.03704, 0],
                      964: [0, 0.44444, 0.13472, 0],
                      965: [0, 0.44444, 0.03704, 0],
                      966: [0.19444, 0.44444, 0, 0],
                      967: [0.19444, 0.44444, 0, 0],
                      968: [0.19444, 0.69444, 0.03704, 0],
                      969: [0, 0.44444, 0.03704, 0],
                      977: [0, 0.69444, 0, 0],
                      981: [0.19444, 0.69444, 0, 0],
                      982: [0, 0.44444, 0.03194, 0],
                      1009: [0.19444, 0.44444, 0, 0],
                      1013: [0, 0.44444, 0, 0],
                    },
                    "Math-Italic": {
                      47: [0.19444, 0.69444, 0, 0],
                      65: [0, 0.68333, 0, 0.13889],
                      66: [0, 0.68333, 0.05017, 0.08334],
                      67: [0, 0.68333, 0.07153, 0.08334],
                      68: [0, 0.68333, 0.02778, 0.05556],
                      69: [0, 0.68333, 0.05764, 0.08334],
                      70: [0, 0.68333, 0.13889, 0.08334],
                      71: [0, 0.68333, 0, 0.08334],
                      72: [0, 0.68333, 0.08125, 0.05556],
                      73: [0, 0.68333, 0.07847, 0.11111],
                      74: [0, 0.68333, 0.09618, 0.16667],
                      75: [0, 0.68333, 0.07153, 0.05556],
                      76: [0, 0.68333, 0, 0.02778],
                      77: [0, 0.68333, 0.10903, 0.08334],
                      78: [0, 0.68333, 0.10903, 0.08334],
                      79: [0, 0.68333, 0.02778, 0.08334],
                      80: [0, 0.68333, 0.13889, 0.08334],
                      81: [0.19444, 0.68333, 0, 0.08334],
                      82: [0, 0.68333, 0.00773, 0.08334],
                      83: [0, 0.68333, 0.05764, 0.08334],
                      84: [0, 0.68333, 0.13889, 0.08334],
                      85: [0, 0.68333, 0.10903, 0.02778],
                      86: [0, 0.68333, 0.22222, 0],
                      87: [0, 0.68333, 0.13889, 0],
                      88: [0, 0.68333, 0.07847, 0.08334],
                      89: [0, 0.68333, 0.22222, 0],
                      90: [0, 0.68333, 0.07153, 0.08334],
                      97: [0, 0.43056, 0, 0],
                      98: [0, 0.69444, 0, 0],
                      99: [0, 0.43056, 0, 0.05556],
                      100: [0, 0.69444, 0, 0.16667],
                      101: [0, 0.43056, 0, 0.05556],
                      102: [0.19444, 0.69444, 0.10764, 0.16667],
                      103: [0.19444, 0.43056, 0.03588, 0.02778],
                      104: [0, 0.69444, 0, 0],
                      105: [0, 0.65952, 0, 0],
                      106: [0.19444, 0.65952, 0.05724, 0],
                      107: [0, 0.69444, 0.03148, 0],
                      108: [0, 0.69444, 0.01968, 0.08334],
                      109: [0, 0.43056, 0, 0],
                      110: [0, 0.43056, 0, 0],
                      111: [0, 0.43056, 0, 0.05556],
                      112: [0.19444, 0.43056, 0, 0.08334],
                      113: [0.19444, 0.43056, 0.03588, 0.08334],
                      114: [0, 0.43056, 0.02778, 0.05556],
                      115: [0, 0.43056, 0, 0.05556],
                      116: [0, 0.61508, 0, 0.08334],
                      117: [0, 0.43056, 0, 0.02778],
                      118: [0, 0.43056, 0.03588, 0.02778],
                      119: [0, 0.43056, 0.02691, 0.08334],
                      120: [0, 0.43056, 0, 0.02778],
                      121: [0.19444, 0.43056, 0.03588, 0.05556],
                      122: [0, 0.43056, 0.04398, 0.05556],
                      915: [0, 0.68333, 0.13889, 0.08334],
                      916: [0, 0.68333, 0, 0.16667],
                      920: [0, 0.68333, 0.02778, 0.08334],
                      923: [0, 0.68333, 0, 0.16667],
                      926: [0, 0.68333, 0.07569, 0.08334],
                      928: [0, 0.68333, 0.08125, 0.05556],
                      931: [0, 0.68333, 0.05764, 0.08334],
                      933: [0, 0.68333, 0.13889, 0.05556],
                      934: [0, 0.68333, 0, 0.08334],
                      936: [0, 0.68333, 0.11, 0.05556],
                      937: [0, 0.68333, 0.05017, 0.08334],
                      945: [0, 0.43056, 0.0037, 0.02778],
                      946: [0.19444, 0.69444, 0.05278, 0.08334],
                      947: [0.19444, 0.43056, 0.05556, 0],
                      948: [0, 0.69444, 0.03785, 0.05556],
                      949: [0, 0.43056, 0, 0.08334],
                      950: [0.19444, 0.69444, 0.07378, 0.08334],
                      951: [0.19444, 0.43056, 0.03588, 0.05556],
                      952: [0, 0.69444, 0.02778, 0.08334],
                      953: [0, 0.43056, 0, 0.05556],
                      954: [0, 0.43056, 0, 0],
                      955: [0, 0.69444, 0, 0],
                      956: [0.19444, 0.43056, 0, 0.02778],
                      957: [0, 0.43056, 0.06366, 0.02778],
                      958: [0.19444, 0.69444, 0.04601, 0.11111],
                      959: [0, 0.43056, 0, 0.05556],
                      960: [0, 0.43056, 0.03588, 0],
                      961: [0.19444, 0.43056, 0, 0.08334],
                      962: [0.09722, 0.43056, 0.07986, 0.08334],
                      963: [0, 0.43056, 0.03588, 0],
                      964: [0, 0.43056, 0.1132, 0.02778],
                      965: [0, 0.43056, 0.03588, 0.02778],
                      966: [0.19444, 0.43056, 0, 0.08334],
                      967: [0.19444, 0.43056, 0, 0.05556],
                      968: [0.19444, 0.69444, 0.03588, 0.11111],
                      969: [0, 0.43056, 0.03588, 0],
                      977: [0, 0.69444, 0, 0.08334],
                      981: [0.19444, 0.69444, 0, 0.08334],
                      982: [0, 0.43056, 0.02778, 0],
                      1009: [0.19444, 0.43056, 0, 0.08334],
                      1013: [0, 0.43056, 0, 0.05556],
                    },
                    "Math-Regular": {
                      65: [0, 0.68333, 0, 0.13889],
                      66: [0, 0.68333, 0.05017, 0.08334],
                      67: [0, 0.68333, 0.07153, 0.08334],
                      68: [0, 0.68333, 0.02778, 0.05556],
                      69: [0, 0.68333, 0.05764, 0.08334],
                      70: [0, 0.68333, 0.13889, 0.08334],
                      71: [0, 0.68333, 0, 0.08334],
                      72: [0, 0.68333, 0.08125, 0.05556],
                      73: [0, 0.68333, 0.07847, 0.11111],
                      74: [0, 0.68333, 0.09618, 0.16667],
                      75: [0, 0.68333, 0.07153, 0.05556],
                      76: [0, 0.68333, 0, 0.02778],
                      77: [0, 0.68333, 0.10903, 0.08334],
                      78: [0, 0.68333, 0.10903, 0.08334],
                      79: [0, 0.68333, 0.02778, 0.08334],
                      80: [0, 0.68333, 0.13889, 0.08334],
                      81: [0.19444, 0.68333, 0, 0.08334],
                      82: [0, 0.68333, 0.00773, 0.08334],
                      83: [0, 0.68333, 0.05764, 0.08334],
                      84: [0, 0.68333, 0.13889, 0.08334],
                      85: [0, 0.68333, 0.10903, 0.02778],
                      86: [0, 0.68333, 0.22222, 0],
                      87: [0, 0.68333, 0.13889, 0],
                      88: [0, 0.68333, 0.07847, 0.08334],
                      89: [0, 0.68333, 0.22222, 0],
                      90: [0, 0.68333, 0.07153, 0.08334],
                      97: [0, 0.43056, 0, 0],
                      98: [0, 0.69444, 0, 0],
                      99: [0, 0.43056, 0, 0.05556],
                      100: [0, 0.69444, 0, 0.16667],
                      101: [0, 0.43056, 0, 0.05556],
                      102: [0.19444, 0.69444, 0.10764, 0.16667],
                      103: [0.19444, 0.43056, 0.03588, 0.02778],
                      104: [0, 0.69444, 0, 0],
                      105: [0, 0.65952, 0, 0],
                      106: [0.19444, 0.65952, 0.05724, 0],
                      107: [0, 0.69444, 0.03148, 0],
                      108: [0, 0.69444, 0.01968, 0.08334],
                      109: [0, 0.43056, 0, 0],
                      110: [0, 0.43056, 0, 0],
                      111: [0, 0.43056, 0, 0.05556],
                      112: [0.19444, 0.43056, 0, 0.08334],
                      113: [0.19444, 0.43056, 0.03588, 0.08334],
                      114: [0, 0.43056, 0.02778, 0.05556],
                      115: [0, 0.43056, 0, 0.05556],
                      116: [0, 0.61508, 0, 0.08334],
                      117: [0, 0.43056, 0, 0.02778],
                      118: [0, 0.43056, 0.03588, 0.02778],
                      119: [0, 0.43056, 0.02691, 0.08334],
                      120: [0, 0.43056, 0, 0.02778],
                      121: [0.19444, 0.43056, 0.03588, 0.05556],
                      122: [0, 0.43056, 0.04398, 0.05556],
                      915: [0, 0.68333, 0.13889, 0.08334],
                      916: [0, 0.68333, 0, 0.16667],
                      920: [0, 0.68333, 0.02778, 0.08334],
                      923: [0, 0.68333, 0, 0.16667],
                      926: [0, 0.68333, 0.07569, 0.08334],
                      928: [0, 0.68333, 0.08125, 0.05556],
                      931: [0, 0.68333, 0.05764, 0.08334],
                      933: [0, 0.68333, 0.13889, 0.05556],
                      934: [0, 0.68333, 0, 0.08334],
                      936: [0, 0.68333, 0.11, 0.05556],
                      937: [0, 0.68333, 0.05017, 0.08334],
                      945: [0, 0.43056, 0.0037, 0.02778],
                      946: [0.19444, 0.69444, 0.05278, 0.08334],
                      947: [0.19444, 0.43056, 0.05556, 0],
                      948: [0, 0.69444, 0.03785, 0.05556],
                      949: [0, 0.43056, 0, 0.08334],
                      950: [0.19444, 0.69444, 0.07378, 0.08334],
                      951: [0.19444, 0.43056, 0.03588, 0.05556],
                      952: [0, 0.69444, 0.02778, 0.08334],
                      953: [0, 0.43056, 0, 0.05556],
                      954: [0, 0.43056, 0, 0],
                      955: [0, 0.69444, 0, 0],
                      956: [0.19444, 0.43056, 0, 0.02778],
                      957: [0, 0.43056, 0.06366, 0.02778],
                      958: [0.19444, 0.69444, 0.04601, 0.11111],
                      959: [0, 0.43056, 0, 0.05556],
                      960: [0, 0.43056, 0.03588, 0],
                      961: [0.19444, 0.43056, 0, 0.08334],
                      962: [0.09722, 0.43056, 0.07986, 0.08334],
                      963: [0, 0.43056, 0.03588, 0],
                      964: [0, 0.43056, 0.1132, 0.02778],
                      965: [0, 0.43056, 0.03588, 0.02778],
                      966: [0.19444, 0.43056, 0, 0.08334],
                      967: [0.19444, 0.43056, 0, 0.05556],
                      968: [0.19444, 0.69444, 0.03588, 0.11111],
                      969: [0, 0.43056, 0.03588, 0],
                      977: [0, 0.69444, 0, 0.08334],
                      981: [0.19444, 0.69444, 0, 0.08334],
                      982: [0, 0.43056, 0.02778, 0],
                      1009: [0.19444, 0.43056, 0, 0.08334],
                      1013: [0, 0.43056, 0, 0.05556],
                    },
                    "SansSerif-Regular": {
                      33: [0, 0.69444, 0, 0],
                      34: [0, 0.69444, 0, 0],
                      35: [0.19444, 0.69444, 0, 0],
                      36: [0.05556, 0.75, 0, 0],
                      37: [0.05556, 0.75, 0, 0],
                      38: [0, 0.69444, 0, 0],
                      39: [0, 0.69444, 0, 0],
                      40: [0.25, 0.75, 0, 0],
                      41: [0.25, 0.75, 0, 0],
                      42: [0, 0.75, 0, 0],
                      43: [0.08333, 0.58333, 0, 0],
                      44: [0.125, 0.08333, 0, 0],
                      45: [0, 0.44444, 0, 0],
                      46: [0, 0.08333, 0, 0],
                      47: [0.25, 0.75, 0, 0],
                      48: [0, 0.65556, 0, 0],
                      49: [0, 0.65556, 0, 0],
                      50: [0, 0.65556, 0, 0],
                      51: [0, 0.65556, 0, 0],
                      52: [0, 0.65556, 0, 0],
                      53: [0, 0.65556, 0, 0],
                      54: [0, 0.65556, 0, 0],
                      55: [0, 0.65556, 0, 0],
                      56: [0, 0.65556, 0, 0],
                      57: [0, 0.65556, 0, 0],
                      58: [0, 0.44444, 0, 0],
                      59: [0.125, 0.44444, 0, 0],
                      61: [-0.13, 0.37, 0, 0],
                      63: [0, 0.69444, 0, 0],
                      64: [0, 0.69444, 0, 0],
                      65: [0, 0.69444, 0, 0],
                      66: [0, 0.69444, 0, 0],
                      67: [0, 0.69444, 0, 0],
                      68: [0, 0.69444, 0, 0],
                      69: [0, 0.69444, 0, 0],
                      70: [0, 0.69444, 0, 0],
                      71: [0, 0.69444, 0, 0],
                      72: [0, 0.69444, 0, 0],
                      73: [0, 0.69444, 0, 0],
                      74: [0, 0.69444, 0, 0],
                      75: [0, 0.69444, 0, 0],
                      76: [0, 0.69444, 0, 0],
                      77: [0, 0.69444, 0, 0],
                      78: [0, 0.69444, 0, 0],
                      79: [0, 0.69444, 0, 0],
                      80: [0, 0.69444, 0, 0],
                      81: [0.125, 0.69444, 0, 0],
                      82: [0, 0.69444, 0, 0],
                      83: [0, 0.69444, 0, 0],
                      84: [0, 0.69444, 0, 0],
                      85: [0, 0.69444, 0, 0],
                      86: [0, 0.69444, 0.01389, 0],
                      87: [0, 0.69444, 0.01389, 0],
                      88: [0, 0.69444, 0, 0],
                      89: [0, 0.69444, 0.025, 0],
                      90: [0, 0.69444, 0, 0],
                      91: [0.25, 0.75, 0, 0],
                      93: [0.25, 0.75, 0, 0],
                      94: [0, 0.69444, 0, 0],
                      95: [0.35, 0.09444, 0.02778, 0],
                      97: [0, 0.44444, 0, 0],
                      98: [0, 0.69444, 0, 0],
                      99: [0, 0.44444, 0, 0],
                      100: [0, 0.69444, 0, 0],
                      101: [0, 0.44444, 0, 0],
                      102: [0, 0.69444, 0.06944, 0],
                      103: [0.19444, 0.44444, 0.01389, 0],
                      104: [0, 0.69444, 0, 0],
                      105: [0, 0.67937, 0, 0],
                      106: [0.19444, 0.67937, 0, 0],
                      107: [0, 0.69444, 0, 0],
                      108: [0, 0.69444, 0, 0],
                      109: [0, 0.44444, 0, 0],
                      110: [0, 0.44444, 0, 0],
                      111: [0, 0.44444, 0, 0],
                      112: [0.19444, 0.44444, 0, 0],
                      113: [0.19444, 0.44444, 0, 0],
                      114: [0, 0.44444, 0.01389, 0],
                      115: [0, 0.44444, 0, 0],
                      116: [0, 0.57143, 0, 0],
                      117: [0, 0.44444, 0, 0],
                      118: [0, 0.44444, 0.01389, 0],
                      119: [0, 0.44444, 0.01389, 0],
                      120: [0, 0.44444, 0, 0],
                      121: [0.19444, 0.44444, 0.01389, 0],
                      122: [0, 0.44444, 0, 0],
                      126: [0.35, 0.32659, 0, 0],
                      305: [0, 0.44444, 0, 0],
                      567: [0.19444, 0.44444, 0, 0],
                      768: [0, 0.69444, 0, 0],
                      769: [0, 0.69444, 0, 0],
                      770: [0, 0.69444, 0, 0],
                      771: [0, 0.67659, 0, 0],
                      772: [0, 0.60889, 0, 0],
                      774: [0, 0.69444, 0, 0],
                      775: [0, 0.67937, 0, 0],
                      776: [0, 0.67937, 0, 0],
                      778: [0, 0.69444, 0, 0],
                      779: [0, 0.69444, 0, 0],
                      780: [0, 0.63194, 0, 0],
                      915: [0, 0.69444, 0, 0],
                      916: [0, 0.69444, 0, 0],
                      920: [0, 0.69444, 0, 0],
                      923: [0, 0.69444, 0, 0],
                      926: [0, 0.69444, 0, 0],
                      928: [0, 0.69444, 0, 0],
                      931: [0, 0.69444, 0, 0],
                      933: [0, 0.69444, 0, 0],
                      934: [0, 0.69444, 0, 0],
                      936: [0, 0.69444, 0, 0],
                      937: [0, 0.69444, 0, 0],
                      8211: [0, 0.44444, 0.02778, 0],
                      8212: [0, 0.44444, 0.02778, 0],
                      8216: [0, 0.69444, 0, 0],
                      8217: [0, 0.69444, 0, 0],
                      8220: [0, 0.69444, 0, 0],
                      8221: [0, 0.69444, 0, 0],
                    },
                    "Script-Regular": {
                      65: [0, 0.7, 0.22925, 0],
                      66: [0, 0.7, 0.04087, 0],
                      67: [0, 0.7, 0.1689, 0],
                      68: [0, 0.7, 0.09371, 0],
                      69: [0, 0.7, 0.18583, 0],
                      70: [0, 0.7, 0.13634, 0],
                      71: [0, 0.7, 0.17322, 0],
                      72: [0, 0.7, 0.29694, 0],
                      73: [0, 0.7, 0.19189, 0],
                      74: [0.27778, 0.7, 0.19189, 0],
                      75: [0, 0.7, 0.31259, 0],
                      76: [0, 0.7, 0.19189, 0],
                      77: [0, 0.7, 0.15981, 0],
                      78: [0, 0.7, 0.3525, 0],
                      79: [0, 0.7, 0.08078, 0],
                      80: [0, 0.7, 0.08078, 0],
                      81: [0, 0.7, 0.03305, 0],
                      82: [0, 0.7, 0.06259, 0],
                      83: [0, 0.7, 0.19189, 0],
                      84: [0, 0.7, 0.29087, 0],
                      85: [0, 0.7, 0.25815, 0],
                      86: [0, 0.7, 0.27523, 0],
                      87: [0, 0.7, 0.27523, 0],
                      88: [0, 0.7, 0.26006, 0],
                      89: [0, 0.7, 0.2939, 0],
                      90: [0, 0.7, 0.24037, 0],
                    },
                    "Size1-Regular": {
                      40: [0.35001, 0.85, 0, 0],
                      41: [0.35001, 0.85, 0, 0],
                      47: [0.35001, 0.85, 0, 0],
                      91: [0.35001, 0.85, 0, 0],
                      92: [0.35001, 0.85, 0, 0],
                      93: [0.35001, 0.85, 0, 0],
                      123: [0.35001, 0.85, 0, 0],
                      125: [0.35001, 0.85, 0, 0],
                      710: [0, 0.72222, 0, 0],
                      732: [0, 0.72222, 0, 0],
                      770: [0, 0.72222, 0, 0],
                      771: [0, 0.72222, 0, 0],
                      8214: [-99e-5, 0.601, 0, 0],
                      8593: [1e-5, 0.6, 0, 0],
                      8595: [1e-5, 0.6, 0, 0],
                      8657: [1e-5, 0.6, 0, 0],
                      8659: [1e-5, 0.6, 0, 0],
                      8719: [0.25001, 0.75, 0, 0],
                      8720: [0.25001, 0.75, 0, 0],
                      8721: [0.25001, 0.75, 0, 0],
                      8730: [0.35001, 0.85, 0, 0],
                      8739: [-0.00599, 0.606, 0, 0],
                      8741: [-0.00599, 0.606, 0, 0],
                      8747: [0.30612, 0.805, 0.19445, 0],
                      8748: [0.306, 0.805, 0.19445, 0],
                      8749: [0.306, 0.805, 0.19445, 0],
                      8750: [0.30612, 0.805, 0.19445, 0],
                      8896: [0.25001, 0.75, 0, 0],
                      8897: [0.25001, 0.75, 0, 0],
                      8898: [0.25001, 0.75, 0, 0],
                      8899: [0.25001, 0.75, 0, 0],
                      8968: [0.35001, 0.85, 0, 0],
                      8969: [0.35001, 0.85, 0, 0],
                      8970: [0.35001, 0.85, 0, 0],
                      8971: [0.35001, 0.85, 0, 0],
                      9168: [-99e-5, 0.601, 0, 0],
                      10216: [0.35001, 0.85, 0, 0],
                      10217: [0.35001, 0.85, 0, 0],
                      10752: [0.25001, 0.75, 0, 0],
                      10753: [0.25001, 0.75, 0, 0],
                      10754: [0.25001, 0.75, 0, 0],
                      10756: [0.25001, 0.75, 0, 0],
                      10758: [0.25001, 0.75, 0, 0],
                    },
                    "Size2-Regular": {
                      40: [0.65002, 1.15, 0, 0],
                      41: [0.65002, 1.15, 0, 0],
                      47: [0.65002, 1.15, 0, 0],
                      91: [0.65002, 1.15, 0, 0],
                      92: [0.65002, 1.15, 0, 0],
                      93: [0.65002, 1.15, 0, 0],
                      123: [0.65002, 1.15, 0, 0],
                      125: [0.65002, 1.15, 0, 0],
                      710: [0, 0.75, 0, 0],
                      732: [0, 0.75, 0, 0],
                      770: [0, 0.75, 0, 0],
                      771: [0, 0.75, 0, 0],
                      8719: [0.55001, 1.05, 0, 0],
                      8720: [0.55001, 1.05, 0, 0],
                      8721: [0.55001, 1.05, 0, 0],
                      8730: [0.65002, 1.15, 0, 0],
                      8747: [0.86225, 1.36, 0.44445, 0],
                      8748: [0.862, 1.36, 0.44445, 0],
                      8749: [0.862, 1.36, 0.44445, 0],
                      8750: [0.86225, 1.36, 0.44445, 0],
                      8896: [0.55001, 1.05, 0, 0],
                      8897: [0.55001, 1.05, 0, 0],
                      8898: [0.55001, 1.05, 0, 0],
                      8899: [0.55001, 1.05, 0, 0],
                      8968: [0.65002, 1.15, 0, 0],
                      8969: [0.65002, 1.15, 0, 0],
                      8970: [0.65002, 1.15, 0, 0],
                      8971: [0.65002, 1.15, 0, 0],
                      10216: [0.65002, 1.15, 0, 0],
                      10217: [0.65002, 1.15, 0, 0],
                      10752: [0.55001, 1.05, 0, 0],
                      10753: [0.55001, 1.05, 0, 0],
                      10754: [0.55001, 1.05, 0, 0],
                      10756: [0.55001, 1.05, 0, 0],
                      10758: [0.55001, 1.05, 0, 0],
                    },
                    "Size3-Regular": {
                      40: [0.95003, 1.45, 0, 0],
                      41: [0.95003, 1.45, 0, 0],
                      47: [0.95003, 1.45, 0, 0],
                      91: [0.95003, 1.45, 0, 0],
                      92: [0.95003, 1.45, 0, 0],
                      93: [0.95003, 1.45, 0, 0],
                      123: [0.95003, 1.45, 0, 0],
                      125: [0.95003, 1.45, 0, 0],
                      710: [0, 0.75, 0, 0],
                      732: [0, 0.75, 0, 0],
                      770: [0, 0.75, 0, 0],
                      771: [0, 0.75, 0, 0],
                      8730: [0.95003, 1.45, 0, 0],
                      8968: [0.95003, 1.45, 0, 0],
                      8969: [0.95003, 1.45, 0, 0],
                      8970: [0.95003, 1.45, 0, 0],
                      8971: [0.95003, 1.45, 0, 0],
                      10216: [0.95003, 1.45, 0, 0],
                      10217: [0.95003, 1.45, 0, 0],
                    },
                    "Size4-Regular": {
                      40: [1.25003, 1.75, 0, 0],
                      41: [1.25003, 1.75, 0, 0],
                      47: [1.25003, 1.75, 0, 0],
                      91: [1.25003, 1.75, 0, 0],
                      92: [1.25003, 1.75, 0, 0],
                      93: [1.25003, 1.75, 0, 0],
                      123: [1.25003, 1.75, 0, 0],
                      125: [1.25003, 1.75, 0, 0],
                      710: [0, 0.825, 0, 0],
                      732: [0, 0.825, 0, 0],
                      770: [0, 0.825, 0, 0],
                      771: [0, 0.825, 0, 0],
                      8730: [1.25003, 1.75, 0, 0],
                      8968: [1.25003, 1.75, 0, 0],
                      8969: [1.25003, 1.75, 0, 0],
                      8970: [1.25003, 1.75, 0, 0],
                      8971: [1.25003, 1.75, 0, 0],
                      9115: [0.64502, 1.155, 0, 0],
                      9116: [1e-5, 0.6, 0, 0],
                      9117: [0.64502, 1.155, 0, 0],
                      9118: [0.64502, 1.155, 0, 0],
                      9119: [1e-5, 0.6, 0, 0],
                      9120: [0.64502, 1.155, 0, 0],
                      9121: [0.64502, 1.155, 0, 0],
                      9122: [-99e-5, 0.601, 0, 0],
                      9123: [0.64502, 1.155, 0, 0],
                      9124: [0.64502, 1.155, 0, 0],
                      9125: [-99e-5, 0.601, 0, 0],
                      9126: [0.64502, 1.155, 0, 0],
                      9127: [1e-5, 0.9, 0, 0],
                      9128: [0.65002, 1.15, 0, 0],
                      9129: [0.90001, 0, 0, 0],
                      9130: [0, 0.3, 0, 0],
                      9131: [1e-5, 0.9, 0, 0],
                      9132: [0.65002, 1.15, 0, 0],
                      9133: [0.90001, 0, 0, 0],
                      9143: [0.88502, 0.915, 0, 0],
                      10216: [1.25003, 1.75, 0, 0],
                      10217: [1.25003, 1.75, 0, 0],
                      57344: [-0.00499, 0.605, 0, 0],
                      57345: [-0.00499, 0.605, 0, 0],
                      57680: [0, 0.12, 0, 0],
                      57681: [0, 0.12, 0, 0],
                      57682: [0, 0.12, 0, 0],
                      57683: [0, 0.12, 0, 0],
                    },
                    "Typewriter-Regular": {
                      33: [0, 0.61111, 0, 0],
                      34: [0, 0.61111, 0, 0],
                      35: [0, 0.61111, 0, 0],
                      36: [0.08333, 0.69444, 0, 0],
                      37: [0.08333, 0.69444, 0, 0],
                      38: [0, 0.61111, 0, 0],
                      39: [0, 0.61111, 0, 0],
                      40: [0.08333, 0.69444, 0, 0],
                      41: [0.08333, 0.69444, 0, 0],
                      42: [0, 0.52083, 0, 0],
                      43: [-0.08056, 0.53055, 0, 0],
                      44: [0.13889, 0.125, 0, 0],
                      45: [-0.08056, 0.53055, 0, 0],
                      46: [0, 0.125, 0, 0],
                      47: [0.08333, 0.69444, 0, 0],
                      48: [0, 0.61111, 0, 0],
                      49: [0, 0.61111, 0, 0],
                      50: [0, 0.61111, 0, 0],
                      51: [0, 0.61111, 0, 0],
                      52: [0, 0.61111, 0, 0],
                      53: [0, 0.61111, 0, 0],
                      54: [0, 0.61111, 0, 0],
                      55: [0, 0.61111, 0, 0],
                      56: [0, 0.61111, 0, 0],
                      57: [0, 0.61111, 0, 0],
                      58: [0, 0.43056, 0, 0],
                      59: [0.13889, 0.43056, 0, 0],
                      60: [-0.05556, 0.55556, 0, 0],
                      61: [-0.19549, 0.41562, 0, 0],
                      62: [-0.05556, 0.55556, 0, 0],
                      63: [0, 0.61111, 0, 0],
                      64: [0, 0.61111, 0, 0],
                      65: [0, 0.61111, 0, 0],
                      66: [0, 0.61111, 0, 0],
                      67: [0, 0.61111, 0, 0],
                      68: [0, 0.61111, 0, 0],
                      69: [0, 0.61111, 0, 0],
                      70: [0, 0.61111, 0, 0],
                      71: [0, 0.61111, 0, 0],
                      72: [0, 0.61111, 0, 0],
                      73: [0, 0.61111, 0, 0],
                      74: [0, 0.61111, 0, 0],
                      75: [0, 0.61111, 0, 0],
                      76: [0, 0.61111, 0, 0],
                      77: [0, 0.61111, 0, 0],
                      78: [0, 0.61111, 0, 0],
                      79: [0, 0.61111, 0, 0],
                      80: [0, 0.61111, 0, 0],
                      81: [0.13889, 0.61111, 0, 0],
                      82: [0, 0.61111, 0, 0],
                      83: [0, 0.61111, 0, 0],
                      84: [0, 0.61111, 0, 0],
                      85: [0, 0.61111, 0, 0],
                      86: [0, 0.61111, 0, 0],
                      87: [0, 0.61111, 0, 0],
                      88: [0, 0.61111, 0, 0],
                      89: [0, 0.61111, 0, 0],
                      90: [0, 0.61111, 0, 0],
                      91: [0.08333, 0.69444, 0, 0],
                      92: [0.08333, 0.69444, 0, 0],
                      93: [0.08333, 0.69444, 0, 0],
                      94: [0, 0.61111, 0, 0],
                      95: [0.09514, 0, 0, 0],
                      96: [0, 0.61111, 0, 0],
                      97: [0, 0.43056, 0, 0],
                      98: [0, 0.61111, 0, 0],
                      99: [0, 0.43056, 0, 0],
                      100: [0, 0.61111, 0, 0],
                      101: [0, 0.43056, 0, 0],
                      102: [0, 0.61111, 0, 0],
                      103: [0.22222, 0.43056, 0, 0],
                      104: [0, 0.61111, 0, 0],
                      105: [0, 0.61111, 0, 0],
                      106: [0.22222, 0.61111, 0, 0],
                      107: [0, 0.61111, 0, 0],
                      108: [0, 0.61111, 0, 0],
                      109: [0, 0.43056, 0, 0],
                      110: [0, 0.43056, 0, 0],
                      111: [0, 0.43056, 0, 0],
                      112: [0.22222, 0.43056, 0, 0],
                      113: [0.22222, 0.43056, 0, 0],
                      114: [0, 0.43056, 0, 0],
                      115: [0, 0.43056, 0, 0],
                      116: [0, 0.55358, 0, 0],
                      117: [0, 0.43056, 0, 0],
                      118: [0, 0.43056, 0, 0],
                      119: [0, 0.43056, 0, 0],
                      120: [0, 0.43056, 0, 0],
                      121: [0.22222, 0.43056, 0, 0],
                      122: [0, 0.43056, 0, 0],
                      123: [0.08333, 0.69444, 0, 0],
                      124: [0.08333, 0.69444, 0, 0],
                      125: [0.08333, 0.69444, 0, 0],
                      126: [0, 0.61111, 0, 0],
                      127: [0, 0.61111, 0, 0],
                      305: [0, 0.43056, 0, 0],
                      567: [0.22222, 0.43056, 0, 0],
                      768: [0, 0.61111, 0, 0],
                      769: [0, 0.61111, 0, 0],
                      770: [0, 0.61111, 0, 0],
                      771: [0, 0.61111, 0, 0],
                      772: [0, 0.56555, 0, 0],
                      774: [0, 0.61111, 0, 0],
                      776: [0, 0.61111, 0, 0],
                      778: [0, 0.61111, 0, 0],
                      780: [0, 0.56597, 0, 0],
                      915: [0, 0.61111, 0, 0],
                      916: [0, 0.61111, 0, 0],
                      920: [0, 0.61111, 0, 0],
                      923: [0, 0.61111, 0, 0],
                      926: [0, 0.61111, 0, 0],
                      928: [0, 0.61111, 0, 0],
                      931: [0, 0.61111, 0, 0],
                      933: [0, 0.61111, 0, 0],
                      934: [0, 0.61111, 0, 0],
                      936: [0, 0.61111, 0, 0],
                      937: [0, 0.61111, 0, 0],
                      2018: [0, 0.61111, 0, 0],
                      2019: [0, 0.61111, 0, 0],
                      8242: [0, 0.61111, 0, 0],
                    },
                  };
                },
                {},
              ],
              43: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  function r(e, n, r) {
                    "string" == typeof e && (e = [e]),
                      "number" == typeof n && (n = { numArgs: n });
                    for (
                      var i = {
                          numArgs: n.numArgs,
                          argTypes: n.argTypes,
                          greediness:
                            n.greediness === undefined ? 1 : n.greediness,
                          allowedInText: !!n.allowedInText,
                          allowedInMath: n.allowedInMath,
                          numOptionalArgs: n.numOptionalArgs || 0,
                          infix: !!n.infix,
                          handler: r,
                        },
                        a = 0;
                      a < e.length;
                      ++a
                    )
                      t.exports[e[a]] = i;
                  }
                  var i = n(e("./utils")),
                    a = n(e("./ParseError")),
                    o = n(e("./ParseNode")),
                    s = function (e) {
                      return "ordgroup" === e.type ? e.value : [e];
                    };
                  r(
                    "\\sqrt",
                    { numArgs: 1, numOptionalArgs: 1 },
                    function (e, t) {
                      var n = t[0];
                      return { type: "sqrt", body: t[1], index: n };
                    },
                  );
                  var l = {
                    "\\text": undefined,
                    "\\textrm": "mathrm",
                    "\\textsf": "mathsf",
                    "\\texttt": "mathtt",
                    "\\textnormal": "mathrm",
                    "\\textbf": "mathbf",
                    "\\textit": "textit",
                  };
                  r(
                    [
                      "\\text",
                      "\\textrm",
                      "\\textsf",
                      "\\texttt",
                      "\\textnormal",
                      "\\textbf",
                      "\\textit",
                    ],
                    {
                      numArgs: 1,
                      argTypes: ["text"],
                      greediness: 2,
                      allowedInText: !0,
                    },
                    function (e, t) {
                      var n = t[0];
                      return { type: "text", body: s(n), style: l[e.funcName] };
                    },
                  ),
                    r(
                      "\\textcolor",
                      {
                        numArgs: 2,
                        allowedInText: !0,
                        greediness: 3,
                        argTypes: ["color", "original"],
                      },
                      function (e, t) {
                        var n = t[0],
                          r = t[1];
                        return { type: "color", color: n.value, value: s(r) };
                      },
                    ),
                    r(
                      "\\color",
                      {
                        numArgs: 1,
                        allowedInText: !0,
                        greediness: 3,
                        argTypes: ["color"],
                      },
                      null,
                    ),
                    r("\\overline", { numArgs: 1 }, function (e, t) {
                      return { type: "overline", body: t[0] };
                    }),
                    r("\\underline", { numArgs: 1 }, function (e, t) {
                      return { type: "underline", body: t[0] };
                    }),
                    r(
                      "\\rule",
                      {
                        numArgs: 2,
                        numOptionalArgs: 1,
                        argTypes: ["size", "size", "size"],
                      },
                      function (e, t) {
                        var n = t[0],
                          r = t[1],
                          i = t[2];
                        return {
                          type: "rule",
                          shift: n && n.value,
                          width: r.value,
                          height: i.value,
                        };
                      },
                    ),
                    r(
                      ["\\kern", "\\mkern"],
                      { numArgs: 1, argTypes: ["size"] },
                      function (e, t) {
                        return { type: "kern", dimension: t[0].value };
                      },
                    ),
                    r("\\KaTeX", { numArgs: 0 }, function () {
                      return { type: "katex" };
                    }),
                    r("\\phantom", { numArgs: 1 }, function (e, t) {
                      var n = t[0];
                      return { type: "phantom", value: s(n) };
                    }),
                    r(
                      [
                        "\\mathord",
                        "\\mathbin",
                        "\\mathrel",
                        "\\mathopen",
                        "\\mathclose",
                        "\\mathpunct",
                        "\\mathinner",
                      ],
                      { numArgs: 1 },
                      function (e, t) {
                        var n = t[0];
                        return {
                          type: "mclass",
                          mclass: "m" + e.funcName.substr(5),
                          value: s(n),
                        };
                      },
                    ),
                    r("\\stackrel", { numArgs: 2 }, function (e, t) {
                      var n = t[0],
                        r = t[1],
                        i = new o["default"](
                          "op",
                          {
                            type: "op",
                            limits: !0,
                            alwaysHandleSupSub: !0,
                            symbol: !1,
                            value: s(r),
                          },
                          r.mode,
                        );
                      return {
                        type: "mclass",
                        mclass: "mrel",
                        value: [
                          new o["default"](
                            "supsub",
                            { base: i, sup: n, sub: null },
                            n.mode,
                          ),
                        ],
                      };
                    }),
                    r("\\bmod", { numArgs: 0 }, function () {
                      return { type: "mod", modType: "bmod", value: null };
                    }),
                    r(
                      ["\\pod", "\\pmod", "\\mod"],
                      { numArgs: 1 },
                      function (e, t) {
                        var n = t[0];
                        return {
                          type: "mod",
                          modType: e.funcName.substr(1),
                          value: s(n),
                        };
                      },
                    );
                  var u = {
                      "\\bigl": { mclass: "mopen", size: 1 },
                      "\\Bigl": { mclass: "mopen", size: 2 },
                      "\\biggl": { mclass: "mopen", size: 3 },
                      "\\Biggl": { mclass: "mopen", size: 4 },
                      "\\bigr": { mclass: "mclose", size: 1 },
                      "\\Bigr": { mclass: "mclose", size: 2 },
                      "\\biggr": { mclass: "mclose", size: 3 },
                      "\\Biggr": { mclass: "mclose", size: 4 },
                      "\\bigm": { mclass: "mrel", size: 1 },
                      "\\Bigm": { mclass: "mrel", size: 2 },
                      "\\biggm": { mclass: "mrel", size: 3 },
                      "\\Biggm": { mclass: "mrel", size: 4 },
                      "\\big": { mclass: "mord", size: 1 },
                      "\\Big": { mclass: "mord", size: 2 },
                      "\\bigg": { mclass: "mord", size: 3 },
                      "\\Bigg": { mclass: "mord", size: 4 },
                    },
                    d = [
                      "(",
                      ")",
                      "[",
                      "\\lbrack",
                      "]",
                      "\\rbrack",
                      "\\{",
                      "\\lbrace",
                      "\\}",
                      "\\rbrace",
                      "\\lfloor",
                      "\\rfloor",
                      "\\lceil",
                      "\\rceil",
                      "<",
                      ">",
                      "\\langle",
                      "\\rangle",
                      "\\lt",
                      "\\gt",
                      "\\lvert",
                      "\\rvert",
                      "\\lVert",
                      "\\rVert",
                      "\\lgroup",
                      "\\rgroup",
                      "\\lmoustache",
                      "\\rmoustache",
                      "/",
                      "\\backslash",
                      "|",
                      "\\vert",
                      "\\|",
                      "\\Vert",
                      "\\uparrow",
                      "\\Uparrow",
                      "\\downarrow",
                      "\\Downarrow",
                      "\\updownarrow",
                      "\\Updownarrow",
                      ".",
                    ],
                    c = {
                      "\\Bbb": "\\mathbb",
                      "\\bold": "\\mathbf",
                      "\\frak": "\\mathfrak",
                    };
                  r(
                    [
                      "\\blue",
                      "\\orange",
                      "\\pink",
                      "\\red",
                      "\\green",
                      "\\gray",
                      "\\purple",
                      "\\blueA",
                      "\\blueB",
                      "\\blueC",
                      "\\blueD",
                      "\\blueE",
                      "\\tealA",
                      "\\tealB",
                      "\\tealC",
                      "\\tealD",
                      "\\tealE",
                      "\\greenA",
                      "\\greenB",
                      "\\greenC",
                      "\\greenD",
                      "\\greenE",
                      "\\goldA",
                      "\\goldB",
                      "\\goldC",
                      "\\goldD",
                      "\\goldE",
                      "\\redA",
                      "\\redB",
                      "\\redC",
                      "\\redD",
                      "\\redE",
                      "\\maroonA",
                      "\\maroonB",
                      "\\maroonC",
                      "\\maroonD",
                      "\\maroonE",
                      "\\purpleA",
                      "\\purpleB",
                      "\\purpleC",
                      "\\purpleD",
                      "\\purpleE",
                      "\\mintA",
                      "\\mintB",
                      "\\mintC",
                      "\\grayA",
                      "\\grayB",
                      "\\grayC",
                      "\\grayD",
                      "\\grayE",
                      "\\grayF",
                      "\\grayG",
                      "\\grayH",
                      "\\grayI",
                      "\\kaBlue",
                      "\\kaGreen",
                    ],
                    { numArgs: 1, allowedInText: !0, greediness: 3 },
                    function (e, t) {
                      var n = t[0];
                      return {
                        type: "color",
                        color: "katex-" + e.funcName.slice(1),
                        value: s(n),
                      };
                    },
                  ),
                    r(
                      [
                        "\\arcsin",
                        "\\arccos",
                        "\\arctan",
                        "\\arctg",
                        "\\arcctg",
                        "\\arg",
                        "\\ch",
                        "\\cos",
                        "\\cosec",
                        "\\cosh",
                        "\\cot",
                        "\\cotg",
                        "\\coth",
                        "\\csc",
                        "\\ctg",
                        "\\cth",
                        "\\deg",
                        "\\dim",
                        "\\exp",
                        "\\hom",
                        "\\ker",
                        "\\lg",
                        "\\ln",
                        "\\log",
                        "\\sec",
                        "\\sin",
                        "\\sinh",
                        "\\sh",
                        "\\tan",
                        "\\tanh",
                        "\\tg",
                        "\\th",
                      ],
                      { numArgs: 0 },
                      function (e) {
                        return {
                          type: "op",
                          limits: !1,
                          symbol: !1,
                          body: e.funcName,
                        };
                      },
                    ),
                    r(
                      [
                        "\\det",
                        "\\gcd",
                        "\\inf",
                        "\\lim",
                        "\\liminf",
                        "\\limsup",
                        "\\max",
                        "\\min",
                        "\\Pr",
                        "\\sup",
                      ],
                      { numArgs: 0 },
                      function (e) {
                        return {
                          type: "op",
                          limits: !0,
                          symbol: !1,
                          body: e.funcName,
                        };
                      },
                    ),
                    r(
                      ["\\int", "\\iint", "\\iiint", "\\oint"],
                      { numArgs: 0 },
                      function (e) {
                        return {
                          type: "op",
                          limits: !1,
                          symbol: !0,
                          body: e.funcName,
                        };
                      },
                    ),
                    r(
                      [
                        "\\coprod",
                        "\\bigvee",
                        "\\bigwedge",
                        "\\biguplus",
                        "\\bigcap",
                        "\\bigcup",
                        "\\intop",
                        "\\prod",
                        "\\sum",
                        "\\bigotimes",
                        "\\bigoplus",
                        "\\bigodot",
                        "\\bigsqcup",
                        "\\smallint",
                      ],
                      { numArgs: 0 },
                      function (e) {
                        return {
                          type: "op",
                          limits: !0,
                          symbol: !0,
                          body: e.funcName,
                        };
                      },
                    ),
                    r("\\mathop", { numArgs: 1 }, function (e, t) {
                      var n = t[0];
                      return {
                        type: "op",
                        limits: !1,
                        symbol: !1,
                        value: s(n),
                      };
                    }),
                    r(
                      [
                        "\\dfrac",
                        "\\frac",
                        "\\tfrac",
                        "\\dbinom",
                        "\\binom",
                        "\\tbinom",
                        "\\\\atopfrac",
                      ],
                      { numArgs: 2, greediness: 2 },
                      function (e, t) {
                        var n = t[0],
                          r = t[1],
                          i = void 0,
                          a = null,
                          o = null,
                          s = "auto";
                        switch (e.funcName) {
                          case "\\dfrac":
                          case "\\frac":
                          case "\\tfrac":
                            i = !0;
                            break;
                          case "\\\\atopfrac":
                            i = !1;
                            break;
                          case "\\dbinom":
                          case "\\binom":
                          case "\\tbinom":
                            (i = !1), (a = "("), (o = ")");
                            break;
                          default:
                            throw new Error("Unrecognized genfrac command");
                        }
                        switch (e.funcName) {
                          case "\\dfrac":
                          case "\\dbinom":
                            s = "display";
                            break;
                          case "\\tfrac":
                          case "\\tbinom":
                            s = "text";
                        }
                        return {
                          type: "genfrac",
                          numer: n,
                          denom: r,
                          hasBarLine: i,
                          leftDelim: a,
                          rightDelim: o,
                          size: s,
                        };
                      },
                    ),
                    r(
                      ["\\llap", "\\rlap"],
                      { numArgs: 1, allowedInText: !0 },
                      function (e, t) {
                        var n = t[0];
                        return { type: e.funcName.slice(1), body: n };
                      },
                    );
                  var h = function (e, t) {
                    if (i["default"].contains(d, e.value)) return e;
                    throw new a["default"](
                      "Invalid delimiter: '" +
                        e.value +
                        "' after '" +
                        t.funcName +
                        "'",
                      e,
                    );
                  };
                  r(
                    [
                      "\\bigl",
                      "\\Bigl",
                      "\\biggl",
                      "\\Biggl",
                      "\\bigr",
                      "\\Bigr",
                      "\\biggr",
                      "\\Biggr",
                      "\\bigm",
                      "\\Bigm",
                      "\\biggm",
                      "\\Biggm",
                      "\\big",
                      "\\Big",
                      "\\bigg",
                      "\\Bigg",
                    ],
                    { numArgs: 1 },
                    function (e, t) {
                      var n = h(t[0], e);
                      return {
                        type: "delimsizing",
                        size: u[e.funcName].size,
                        mclass: u[e.funcName].mclass,
                        value: n.value,
                      };
                    },
                  ),
                    r(["\\left", "\\right"], { numArgs: 1 }, function (e, t) {
                      return { type: "leftright", value: h(t[0], e).value };
                    }),
                    r("\\middle", { numArgs: 1 }, function (e, t) {
                      var n = h(t[0], e);
                      if (!e.parser.leftrightDepth)
                        throw new a["default"](
                          "\\middle without preceding \\left",
                          n,
                        );
                      return { type: "middle", value: n.value };
                    }),
                    r(
                      [
                        "\\tiny",
                        "\\scriptsize",
                        "\\footnotesize",
                        "\\small",
                        "\\normalsize",
                        "\\large",
                        "\\Large",
                        "\\LARGE",
                        "\\huge",
                        "\\Huge",
                      ],
                      0,
                      null,
                    ),
                    r(
                      [
                        "\\displaystyle",
                        "\\textstyle",
                        "\\scriptstyle",
                        "\\scriptscriptstyle",
                      ],
                      0,
                      null,
                    ),
                    r(["\\rm", "\\sf", "\\tt", "\\bf", "\\it"], 0, null),
                    r(
                      [
                        "\\mathrm",
                        "\\mathit",
                        "\\mathbf",
                        "\\mathbb",
                        "\\mathcal",
                        "\\mathfrak",
                        "\\mathscr",
                        "\\mathsf",
                        "\\mathtt",
                        "\\Bbb",
                        "\\bold",
                        "\\frak",
                      ],
                      { numArgs: 1, greediness: 2 },
                      function (e, t) {
                        var n = t[0],
                          r = e.funcName;
                        return (
                          r in c && (r = c[r]),
                          { type: "font", font: r.slice(1), body: n }
                        );
                      },
                    ),
                    r(
                      [
                        "\\acute",
                        "\\grave",
                        "\\ddot",
                        "\\tilde",
                        "\\bar",
                        "\\breve",
                        "\\check",
                        "\\hat",
                        "\\vec",
                        "\\dot",
                        "\\widehat",
                        "\\widetilde",
                        "\\overrightarrow",
                        "\\overleftarrow",
                        "\\Overrightarrow",
                        "\\overleftrightarrow",
                        "\\overgroup",
                        "\\overlinesegment",
                        "\\overleftharpoon",
                        "\\overrightharpoon",
                      ],
                      { numArgs: 1 },
                      function (e, t) {
                        var n = t[0],
                          r = !i["default"].contains(
                            [
                              "\\acute",
                              "\\grave",
                              "\\ddot",
                              "\\tilde",
                              "\\bar",
                              "\\breve",
                              "\\check",
                              "\\hat",
                              "\\vec",
                              "\\dot",
                            ],
                            e.funcName,
                          ),
                          a =
                            !r ||
                            i["default"].contains(
                              ["\\widehat", "\\widetilde"],
                              e.funcName,
                            );
                        return {
                          type: "accent",
                          label: e.funcName,
                          isStretchy: r,
                          isShifty: a,
                          value: s(n),
                          base: n,
                        };
                      },
                    ),
                    r(
                      [
                        "\\'",
                        "\\`",
                        "\\^",
                        "\\~",
                        "\\=",
                        "\\u",
                        "\\.",
                        '\\"',
                        "\\r",
                        "\\H",
                        "\\v",
                      ],
                      { numArgs: 1, allowedInText: !0, allowedInMath: !1 },
                      function (e, t) {
                        var n = t[0];
                        return {
                          type: "accent",
                          label: e.funcName,
                          isStretchy: !1,
                          isShifty: !0,
                          value: s(n),
                          base: n,
                        };
                      },
                    ),
                    r(
                      ["\\overbrace", "\\underbrace"],
                      { numArgs: 1 },
                      function (e, t) {
                        var n = t[0];
                        return {
                          type: "horizBrace",
                          label: e.funcName,
                          isOver: /^\\over/.test(e.funcName),
                          base: n,
                        };
                      },
                    ),
                    r(
                      [
                        "\\underleftarrow",
                        "\\underrightarrow",
                        "\\underleftrightarrow",
                        "\\undergroup",
                        "\\underlinesegment",
                        "\\undertilde",
                      ],
                      { numArgs: 1 },
                      function (e, t) {
                        var n = t[0];
                        return {
                          type: "accentUnder",
                          label: e.funcName,
                          value: s(n),
                          body: n,
                        };
                      },
                    ),
                    r(
                      [
                        "\\xleftarrow",
                        "\\xrightarrow",
                        "\\xLeftarrow",
                        "\\xRightarrow",
                        "\\xleftrightarrow",
                        "\\xLeftrightarrow",
                        "\\xhookleftarrow",
                        "\\xhookrightarrow",
                        "\\xmapsto",
                        "\\xrightharpoondown",
                        "\\xrightharpoonup",
                        "\\xleftharpoondown",
                        "\\xleftharpoonup",
                        "\\xrightleftharpoons",
                        "\\xleftrightharpoons",
                        "\\xLongequal",
                        "\\xtwoheadrightarrow",
                        "\\xtwoheadleftarrow",
                        "\\xLongequal",
                        "\\xtofrom",
                      ],
                      { numArgs: 1, numOptionalArgs: 1 },
                      function (e, t) {
                        var n = t[0],
                          r = t[1];
                        return {
                          type: "xArrow",
                          label: e.funcName,
                          body: r,
                          below: n,
                        };
                      },
                    ),
                    r(
                      [
                        "\\cancel",
                        "\\bcancel",
                        "\\xcancel",
                        "\\sout",
                        "\\fbox",
                      ],
                      { numArgs: 1 },
                      function (e, t) {
                        var n = t[0];
                        return { type: "enclose", label: e.funcName, body: n };
                      },
                    ),
                    r(
                      ["\\over", "\\choose", "\\atop"],
                      { numArgs: 0, infix: !0 },
                      function (e) {
                        var t = void 0;
                        switch (e.funcName) {
                          case "\\over":
                            t = "\\frac";
                            break;
                          case "\\choose":
                            t = "\\binom";
                            break;
                          case "\\atop":
                            t = "\\\\atopfrac";
                            break;
                          default:
                            throw new Error(
                              "Unrecognized infix genfrac command",
                            );
                        }
                        return {
                          type: "infix",
                          replaceWith: t,
                          token: e.token,
                        };
                      },
                    ),
                    r(
                      ["\\\\", "\\cr"],
                      { numArgs: 0, numOptionalArgs: 1, argTypes: ["size"] },
                      function (e, t) {
                        return { type: "cr", size: t[0] };
                      },
                    ),
                    r(
                      ["\\begin", "\\end"],
                      { numArgs: 1, argTypes: ["text"] },
                      function (e, t) {
                        var n = t[0];
                        if ("ordgroup" !== n.type)
                          throw new a["default"]("Invalid environment name", n);
                        for (var r = "", i = 0; i < n.value.length; ++i)
                          r += n.value[i].value;
                        return { type: "environment", name: r, nameGroup: n };
                      },
                    );
                },
                { "./ParseError": 29, "./ParseNode": 30, "./utils": 51 },
              ],
              44: [
                function (e, t) {
                  function n(e, n) {
                    t.exports[e] = n;
                  }
                  n("\\bgroup", "{"),
                    n("\\egroup", "}"),
                    n("\\begingroup", "{"),
                    n("\\endgroup", "}"),
                    n("\\mkern", "\\kern"),
                    n("\\overset", "\\mathop{#2}\\limits^{#1}"),
                    n("\\underset", "\\mathop{#2}\\limits_{#1}"),
                    n("\\boxed", "\\fbox{\\displaystyle{#1}}"),
                    n("\\iff", "\\;\\Longleftrightarrow\\;"),
                    n("\\implies", "\\;\\Longrightarrow\\;"),
                    n("\\impliedby", "\\;\\Longleftarrow\\;"),
                    n("\\ordinarycolon", ":"),
                    n("\\vcentcolon", "\\mathrel{\\mathop\\ordinarycolon}"),
                    n(
                      "\\dblcolon",
                      "\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon",
                    ),
                    n("\\coloneqq", "\\vcentcolon\\mathrel{\\mkern-1.2mu}="),
                    n("\\Coloneqq", "\\dblcolon\\mathrel{\\mkern-1.2mu}="),
                    n(
                      "\\coloneq",
                      "\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}",
                    ),
                    n(
                      "\\Coloneq",
                      "\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}",
                    ),
                    n("\\eqqcolon", "=\\mathrel{\\mkern-1.2mu}\\vcentcolon"),
                    n("\\Eqqcolon", "=\\mathrel{\\mkern-1.2mu}\\dblcolon"),
                    n(
                      "\\eqcolon",
                      "\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon",
                    ),
                    n(
                      "\\Eqcolon",
                      "\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon",
                    ),
                    n(
                      "\\colonapprox",
                      "\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx",
                    ),
                    n(
                      "\\Colonapprox",
                      "\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx",
                    ),
                    n(
                      "\\colonsim",
                      "\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim",
                    ),
                    n("\\Colonsim", "\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim"),
                    n("\\ratio", "\\vcentcolon"),
                    n("\\coloncolon", "\\dblcolon"),
                    n("\\colonequals", "\\coloneqq"),
                    n("\\coloncolonequals", "\\Coloneqq"),
                    n("\\equalscolon", "\\eqqcolon"),
                    n("\\equalscoloncolon", "\\Eqqcolon"),
                    n("\\colonminus", "\\coloneq"),
                    n("\\coloncolonminus", "\\Coloneq"),
                    n("\\minuscolon", "\\eqcolon"),
                    n("\\minuscoloncolon", "\\Eqcolon"),
                    n("\\coloncolonapprox", "\\Colonapprox"),
                    n("\\coloncolonsim", "\\Colonsim"),
                    n(
                      "\\simcolon",
                      "\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon",
                    ),
                    n(
                      "\\simcoloncolon",
                      "\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon",
                    ),
                    n(
                      "\\approxcolon",
                      "\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon",
                    ),
                    n(
                      "\\approxcoloncolon",
                      "\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon",
                    );
                },
                {},
              ],
              45: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = n(e("babel-runtime/helpers/classCallCheck")),
                    i = n(e("babel-runtime/helpers/createClass")),
                    a = n(e("./utils")),
                    o = (function () {
                      function e(t, n) {
                        (0, r["default"])(this, e),
                          (this.type = t),
                          (this.attributes = {}),
                          (this.children = n || []);
                      }
                      return (
                        (0, i["default"])(e, [
                          {
                            key: "setAttribute",
                            value: function (e, t) {
                              this.attributes[e] = t;
                            },
                          },
                          {
                            key: "toNode",
                            value: function () {
                              var e = document.createElementNS(
                                "http://www.w3.org/1998/Math/MathML",
                                this.type,
                              );
                              for (var t in this.attributes)
                                Object.prototype.hasOwnProperty.call(
                                  this.attributes,
                                  t,
                                ) && e.setAttribute(t, this.attributes[t]);
                              for (var n = 0; n < this.children.length; n++)
                                e.appendChild(this.children[n].toNode());
                              return e;
                            },
                          },
                          {
                            key: "toMarkup",
                            value: function () {
                              var e = "<" + this.type;
                              for (var t in this.attributes)
                                Object.prototype.hasOwnProperty.call(
                                  this.attributes,
                                  t,
                                ) &&
                                  ((e += " " + t + '="'),
                                  (e += a["default"].escape(
                                    this.attributes[t],
                                  )),
                                  (e += '"'));
                              e += ">";
                              for (var n = 0; n < this.children.length; n++)
                                e += this.children[n].toMarkup();
                              return (e += "</" + this.type + ">");
                            },
                          },
                        ]),
                        e
                      );
                    })(),
                    s = (function () {
                      function e(t) {
                        (0, r["default"])(this, e), (this.text = t);
                      }
                      return (
                        (0, i["default"])(e, [
                          {
                            key: "toNode",
                            value: function () {
                              return document.createTextNode(this.text);
                            },
                          },
                          {
                            key: "toMarkup",
                            value: function () {
                              return a["default"].escape(this.text);
                            },
                          },
                        ]),
                        e
                      );
                    })();
                  t.exports = { MathNode: o, TextNode: s };
                },
                {
                  "./utils": 51,
                  "babel-runtime/helpers/classCallCheck": 4,
                  "babel-runtime/helpers/createClass": 5,
                },
              ],
              46: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = n(e("./Parser")),
                    i = function (e, t) {
                      if (!("string" == typeof e || e instanceof String))
                        throw new TypeError(
                          "KaTeX can only parse string typed expression",
                        );
                      return new r["default"](e, t).parse();
                    };
                  t.exports = i;
                },
                { "./Parser": 31 },
              ],
              47: [
                function (e, t) {
                  var n = e("./buildCommon"),
                    r = e("./mathMLTree"),
                    i = e("./utils"),
                    a = {
                      widehat: "^",
                      widetilde: "~",
                      undertilde: "~",
                      overleftarrow: "\u2190",
                      underleftarrow: "\u2190",
                      xleftarrow: "\u2190",
                      overrightarrow: "\u2192",
                      underrightarrow: "\u2192",
                      xrightarrow: "\u2192",
                      underbrace: "\u23b5",
                      overbrace: "\u23de",
                      overleftrightarrow: "\u2194",
                      underleftrightarrow: "\u2194",
                      xleftrightarrow: "\u2194",
                      Overrightarrow: "\u21d2",
                      xRightarrow: "\u21d2",
                      overleftharpoon: "\u21bc",
                      xleftharpoonup: "\u21bc",
                      overrightharpoon: "\u21c0",
                      xrightharpoonup: "\u21c0",
                      xLeftarrow: "\u21d0",
                      xLeftrightarrow: "\u21d4",
                      xhookleftarrow: "\u21a9",
                      xhookrightarrow: "\u21aa",
                      xmapsto: "\u21a6",
                      xrightharpoondown: "\u21c1",
                      xleftharpoondown: "\u21bd",
                      xrightleftharpoons: "\u21cc",
                      xleftrightharpoons: "\u21cb",
                      xtwoheadleftarrow: "\u219e",
                      xtwoheadrightarrow: "\u21a0",
                      xLongequal: "=",
                      xtofrom: "\u21c4",
                    },
                    o = function (e) {
                      var t = new r.MathNode("mo", [
                        new r.TextNode(a[e.substr(1)]),
                      ]);
                      return t.setAttribute("stretchy", "true"), t;
                    },
                    s = {
                      overleftarrow: [0.522, 0, "leftarrow", 0.5],
                      underleftarrow: [0.522, 0, "leftarrow", 0.5],
                      xleftarrow: [0.261, 0.261, "leftarrow", 0.783],
                      overrightarrow: [0.522, 0, "rightarrow", 0.5],
                      underrightarrow: [0.522, 0, "rightarrow", 0.5],
                      xrightarrow: [0.261, 0.261, "rightarrow", 0.783],
                      overbrace: [0.548, 0, "overbrace", 1.6],
                      underbrace: [0.548, 0, "underbrace", 1.6],
                      overleftrightarrow: [0.522, 0, "leftrightarrow", 0.5],
                      underleftrightarrow: [0.522, 0, "leftrightarrow", 0.5],
                      xleftrightarrow: [0.261, 0.261, "leftrightarrow", 0.783],
                      Overrightarrow: [0.56, 0, "doublerightarrow", 0.5],
                      xLeftarrow: [0.28, 0.28, "doubleleftarrow", 0.783],
                      xRightarrow: [0.28, 0.28, "doublerightarrow", 0.783],
                      xLeftrightarrow: [
                        0.28,
                        0.28,
                        "doubleleftrightarrow",
                        0.955,
                      ],
                      overleftharpoon: [0.522, 0, "leftharpoon", 0.5],
                      overrightharpoon: [0.522, 0, "rightharpoon", 0.5],
                      xleftharpoonup: [0.261, 0.261, "leftharpoon", 0.783],
                      xrightharpoonup: [0.261, 0.261, "rightharpoon", 0.783],
                      xhookleftarrow: [0.261, 0.261, "hookleftarrow", 0.87],
                      xhookrightarrow: [0.261, 0.261, "hookrightarrow", 0.87],
                      overlinesegment: [0.414, 0, "linesegment", 0.5],
                      underlinesegment: [0.414, 0, "linesegment", 0.5],
                      xmapsto: [0.261, 0.261, "mapsto", 0.783],
                      xrightharpoondown: [
                        0.261,
                        0.261,
                        "rightharpoondown",
                        0.783,
                      ],
                      xleftharpoondown: [
                        0.261,
                        0.261,
                        "leftharpoondown",
                        0.783,
                      ],
                      xrightleftharpoons: [
                        0.358,
                        0.358,
                        "rightleftharpoons",
                        0.716,
                      ],
                      xleftrightharpoons: [
                        0.358,
                        0.358,
                        "leftrightharpoons",
                        0.716,
                      ],
                      overgroup: [0.342, 0, "overgroup", 0.87],
                      undergroup: [0.342, 0, "undergroup", 0.87],
                      xtwoheadleftarrow: [
                        0.167,
                        0.167,
                        "twoheadleftarrow",
                        0.86,
                      ],
                      xtwoheadrightarrow: [
                        0.167,
                        0.167,
                        "twoheadrightarrow",
                        0.86,
                      ],
                      xLongequal: [0.167, 0.167, "longequal", 0.5],
                      xtofrom: [0.264, 0.264, "tofrom", 0.86],
                    },
                    l = {
                      doubleleftarrow:
                        "<path d='M262 157\nl10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3\n 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28\n 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5\nc2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5\n 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87\n-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7\n-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z\nm8 0v40h399730v-40zm0 194v40h399730v-40z'/>",
                      doublerightarrow:
                        "<path d='M399738 392l\n-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5\n 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88\n-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68\n-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18\n-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782\nc-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3\n-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z'/>",
                      leftarrow:
                        "<path d='M400000 241H110l3-3c68.7-52.7 113.7-120\n 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8\n-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247\nc-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208\n 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3\n 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202\n l-3-3h399890zM100 241v40h399900v-40z'/>",
                      rightarrow:
                        "<path d='M0 241v40h399891c-47.3 35.3-84 78-110 128\n-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20\n 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7\n 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85\n-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n 151.7 139 205zm0 0v40h399900v-40z'/>",
                    },
                    u = {
                      bcancel:
                        "<line x1='0' y1='0' x2='100%' y2='100%' stroke-width='0.046em'/>",
                      cancel:
                        "<line x1='0' y1='100%' x2='100%' y2='0' stroke-width='0.046em'/>",
                      doubleleftarrow:
                        "><svg viewBox='0 0 400000 549'\npreserveAspectRatio='xMinYMin slice'>" +
                        l.doubleleftarrow +
                        "</svg>",
                      doubleleftrightarrow:
                        "><svg width='50.1%' viewBox='0 0 400000 549'\npreserveAspectRatio='xMinYMin slice'>" +
                        l.doubleleftarrow +
                        "</svg>\n<svg x='50%' width='50%' viewBox='0 0 400000 549' preserveAspectRatio='xMaxYMin\n slice'>" +
                        l.doublerightarrow +
                        "</svg>",
                      doublerightarrow:
                        "><svg viewBox='0 0 400000 549'\npreserveAspectRatio='xMaxYMin slice'>" +
                        l.doublerightarrow +
                        "</svg>",
                      hookleftarrow:
                        "><svg width='50.1%' viewBox='0 0 400000 522'\npreserveAspectRatio='xMinYMin slice'>" +
                        l.leftarrow +
                        "</svg>\n<svg x='50%' width='50%' viewBox='0 0 400000 522' preserveAspectRatio='xMaxYMin\n slice'><path d='M399859 241c-764 0 0 0 0 0 40-3.3 68.7\n -15.7 86-37 10-12 15-25.3 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5\n -23-17.3-1.3-26-8-26-20 0-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21\n 16.7 14 11.2 21 33.5 21 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z\n M0 281v-40h399859v40z'/></svg>",
                      hookrightarrow:
                        "><svg width='50.1%' viewBox='0 0 400000 522'\npreserveAspectRatio='xMinYMin slice'><path d='M400000 281\nH103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5-83.5C70.8 58.2 104 47 142 47\nc16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3-68.7 15.7-86 37-10 12-15 25.3\n-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21 71.5 23h399859zM103 281v-40\nh399897v40z'/></svg><svg x='50%' width='50%' viewBox='0 0 400000 522'\npreserveAspectRatio='xMaxYMin slice'>" +
                        l.rightarrow +
                        "</svg>",
                      leftarrow:
                        "><svg viewBox='0 0 400000 522' preserveAspectRatio='xMinYMin\n slice'>" +
                        l.leftarrow +
                        "</svg>",
                      leftharpoon:
                        "><svg viewBox='0 0 400000 522' preserveAspectRatio='xMinYMin\n slice'><path d='M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3\n-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5\n-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7\n-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z'/></svg>",
                      leftharpoondown:
                        "><svg viewBox='0 0 400000 522'\npreserveAspectRatio='xMinYMin slice'><path d=\"M7 241c-4 4-6.333 8.667-7 14\n 0 5.333.667 9 2 11s5.333 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667\n 6.333 16.333 9 17 2 .667 5 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21\n -32-87.333-82.667-157.667-152-211l-3-3h399907v-40z\nM93 281 H400000 v-40L7 241z\"/></svg>",
                      leftrightarrow:
                        "><svg width='50.1%' viewBox='0 0 400000 522'\npreserveAspectRatio='xMinYMin slice'>" +
                        l.leftarrow +
                        "</svg>\n<svg x='50%' width='50%' viewBox='0 0 400000 522' preserveAspectRatio='xMaxYMin\n slice'>" +
                        l.rightarrow +
                        "</svg>",
                      leftrightharpoons:
                        "><svg width='50.1%' viewBox='0 0 400000 716'\npreserveAspectRatio='xMinYMin slice'><path d='M0 267c.7 5.3\n 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52\n 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8\n 16c-42 98.7-107.3 174.7-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26\nv40h399900v-40zM0 435v40h400000v-40zm0 0v40h400000v-40z'/></svg>\n<svg x='50%' width='50%' viewBox='0 0 400000 716' preserveAspectRatio='xMaxYMin\n slice'><path d='M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8\n 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3\n 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3\n-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z\nm0-194v40h400000v-40zm0 0v40h400000v-40z'/></svg>",
                      linesegment:
                        "><svg width='50.1%' viewBox='0 0 400000 414'\npreserveAspectRatio='xMinYMin slice'><path d='M40 187V40H0\nv334h40V227h399960v-40zm0 0V40H0v334h40V227h399960v-40z'/></svg><svg x='50%'\nwidth='50%' viewBox='0 0 400000 414' preserveAspectRatio='xMaxYMin slice'>\n<path d='M0 187v40h399960v147h40V40h-40v147zm0\n 0v40h399960v147h40V40h-40v147z'/></svg>",
                      longequal:
                        " viewBox='0 0 100 334' preserveAspectRatio='none'>\n<path d='M0 50h100v40H0zm0 194h100v40H0z'/>",
                      mapsto:
                        "><svg width='50.1%' viewBox='0 0 400000 522'\npreserveAspectRatio='xMinYMin slice'><path d='M40 241c740\n 0 0 0 0 0v-75c0-40.7-.2-64.3-.5-71-.3-6.7-2.2-11.7-5.5-15-4-4-8.7-6-14-6-5.3 0\n-10 2-14 6C2.7 83.3.8 91.3.5 104 .2 116.7 0 169 0 261c0 114 .7 172.3 2 175 4 8\n 10 12 18 12 5.3 0 10-2 14-6 3.3-3.3 5.2-8.3 5.5-15 .3-6.7.5-30.3.5-71v-75\nh399960zm0 0v40h399960v-40z'/></svg><svg x='50%' width='50%' viewBox='0 0\n 400000 522' preserveAspectRatio='xMaxYMin slice'>" +
                        l.rightarrow +
                        "</svg>",
                      overbrace:
                        "><svg width='25.5%' viewBox='0 0 400000 548'\npreserveAspectRatio='xMinYMin slice'><path d='M6 548l-6-6\nv-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117-45 179-50h399577v120H403\nc-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7 5-6 9-10 13-.7 1-7.3 1-20 1\nH6z'/></svg><svg x='25%' width='50%' viewBox='0 0 400000 548'\npreserveAspectRatio='xMidYMin slice'><path d='M200428 334\nc-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14\n-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7\n 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11\n 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z'/></svg>\n<svg x='74.9%' width='24.1%' viewBox='0 0 400000 548'\npreserveAspectRatio='xMaxYMin slice'><path d='M400000 542l\n-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5\ns-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1\nc124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z'/></svg>",
                      overgroup:
                        "><svg width='50.1%' viewBox='0 0 400000 342'\npreserveAspectRatio='xMinYMin slice'><path d='M400000 80\nH435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0\n 435 0h399565z'/></svg><svg x='50%' width='50%' viewBox='0 0 400000 342'\npreserveAspectRatio='xMaxYMin slice'><path d='M0 80h399565\nc371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0 3-1 3-3v-38\nc-76-158-257-219-435-219H0z'/></svg>",
                      rightarrow:
                        "><svg viewBox='0 0 400000 522' preserveAspectRatio='xMaxYMin\n slice'>" +
                        l.rightarrow +
                        "</svg>",
                      rightharpoon:
                        "><svg viewBox='0 0 400000 522' preserveAspectRatio='xMaxYMin\n slice'><path d='M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3\n-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2\n-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58\n 69.2 92 94.5zm0 0v40h399900v-40z'/></svg>",
                      rightharpoondown:
                        "><svg viewBox='0 0 400000 522'\npreserveAspectRatio='xMaxYMin slice'><path d='M399747 511\nc0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217\n 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3\n -10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3\n 8.7-5 14-5 16zM0 241v40h399900v-40z'/></svg>",
                      rightleftharpoons:
                        "><svg width='50%' viewBox='0 0 400000 716'\npreserveAspectRatio='xMinYMin slice'><path d='M7 435c-4 4\n-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12 10c90.7 54 156 130 196 228 3.3 10.7 6.3\n 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7\n-157.7-152-211l-3-3h399907v-40H7zm93 0v40h399900v-40zM0 241v40h399900v-40z\nm0 0v40h399900v-40z'/></svg><svg x='50%' width='50%' viewBox='0 0 400000 716'\npreserveAspectRatio='xMaxYMin slice'><path d='M0 241v40\nh399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3\n-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42\n 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5zm0 0v40h399900v-40z\n m100 194v40h399900v-40zm0 0v40h399900v-40z'/></svg>",
                      tilde1:
                        " viewBox='0 0 600 260' preserveAspectRatio='none'>\n<path d='M200 55.538c-77 0-168 73.953-177 73.953-3 0-7\n-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0\n 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0\n 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128\n-68.267.847-113-73.952-191-73.952z'/>",
                      tilde2:
                        " viewBox='0 0 1033 286' preserveAspectRatio='none'>\n<path d='M344 55.266c-142 0-300.638 81.316-311.5 86.418\n-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9\n 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114\nc1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751\n 181.476 676 181.476c-149 0-189-126.21-332-126.21z'/>",
                      tilde3:
                        " viewBox='0 0 2339 306' preserveAspectRatio='none'>\n<path d='M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457\n-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0\n 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697\n 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696\n -338 0-409-156.573-744-156.573z'/>",
                      tilde4:
                        " viewBox='0 0 2340 312' preserveAspectRatio='none'>\n<path d='M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345\n-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409\n 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9\n 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409\n -175.236-744-175.236z'/>",
                      tofrom:
                        "><svg width='50.1%' viewBox='0 0 400000 528'\npreserveAspectRatio='xMinYMin slice'><path d='M0 147h400000\nv40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37\n-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8c28.7-32 52-65.7 70-101 10.7-23.3\n 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3 68 321 0 361zm0-174v-40h399900\nv40zm100 154v40h399900v-40z'/></svg><svg x='50%' width='50%' viewBox='0 0\n 400000 528' preserveAspectRatio='xMaxYMin slice'><path\nd='M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7\n 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32-52 65.7-70 101-10.7\n 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142-167z\n M100 147v40h399900v-40zM0 341v40h399900v-40z'/></svg>",
                      twoheadleftarrow:
                        "><svg viewBox='0 0 400000 334'\npreserveAspectRatio='xMinYMin slice'><path d='M0 167c68 40\n 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69\n-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3\n-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19\n-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101\n 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z'/>\n</svg>",
                      twoheadrightarrow:
                        "><svg viewBox='0 0 400000 334'\npreserveAspectRatio='xMaxYMin slice'><path d='M400000 167\nc-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3\n 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42\n 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333\n-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70\n 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z'/>\n</svg>",
                      underbrace:
                        "><svg width='25.1%' viewBox='0 0 400000 548'\npreserveAspectRatio='xMinYMin slice'><path d='M0 6l6-6h17\nc12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13 35.313 51.3 80.813 93.8 136.5 127.5\n 55.688 33.7 117.188 55.8 184.5 66.5.688 0 2 .3 4 1 18.688 2.7 76 4.3 172 5\nh399450v120H429l-6-1c-124.688-8-235-61.7-331-161C60.687 138.7 32.312 99.3 7 54\nL0 41V6z'/></svg><svg x='25%' width='50%' viewBox='0 0 400000 548'\npreserveAspectRatio='xMidYMin slice'><path d='M199572 214\nc100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14\n 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3\n 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0\n-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z'/></svg>\n<svg x='74.9%' width='25.1%' viewBox='0 0 400000 548'\npreserveAspectRatio='xMaxYMin slice'><path d='M399994 0l6 6\nv35l-6 11c-56 104-135.3 181.3-238 232-57.3 28.7-117 45-179 50H-300V214h399897\nc43.3-7 81-15 113-26 100.7-33 179.7-91 237-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1\nh17z'/></svg>",
                      undergroup:
                        "><svg width='50.1%' viewBox='0 0 400000 342'\npreserveAspectRatio='xMinYMin slice'><path d='M400000 262\nH435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219\n 435 219h399565z'/></svg><svg x='50%' width='50%' viewBox='0 0 400000 342'\npreserveAspectRatio='xMaxYMin slice'><path d='M0 262h399565\nc371 0 266.7-149.4 414-180 5.9-1.2 18 0 18 0 2 0 3 1 3 3v38c-76 158-257\n 219-435 219H0z'/></svg>",
                      widehat1:
                        " viewBox='0 0 1062 239' preserveAspectRatio='none'>\n<path d='M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22\nc-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z'/>",
                      widehat2:
                        " viewBox='0 0 2364 300' preserveAspectRatio='none'>\n<path d='M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z'/>",
                      widehat3:
                        " viewBox='0 0 2364 360' preserveAspectRatio='none'>\n<path d='M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z'/>",
                      widehat4:
                        " viewBox='0 0 2364 420' preserveAspectRatio='none'>\n<path d='M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z'/>",
                      xcancel:
                        "<line x1='0' y1='0' x2='100%' y2='100%' stroke-width='0.046em'/>\n<line x1='0' y1='100%' x2='100%' y2='0' stroke-width='0.046em'/>",
                    },
                    d = function (e, t) {
                      var r = e.value.label.substr(1),
                        a = 0,
                        o = 0,
                        l = "",
                        d = 0;
                      if (
                        i.contains(["widehat", "widetilde", "undertilde"], r)
                      ) {
                        var c = e.value.value.length;
                        if (c > 5)
                          (a = 0.312),
                            (l = ("widehat" === r ? "widehat" : "tilde") + "4");
                        else {
                          var h = [1, 1, 2, 2, 3, 3][c];
                          "widehat" === r
                            ? ((a = [0, 0.24, 0.3, 0.3, 0.36, 0.36][c]),
                              (l = "widehat" + h))
                            : ((a = [0, 0.26, 0.3, 0.3, 0.34, 0.34][c]),
                              (l = "tilde" + h));
                        }
                      } else {
                        var p = s[r];
                        (a = p[0]), (o = p[1]), (l = p[2]), (d = p[3]);
                      }
                      var f = n.makeSpan([], [], t);
                      (f.height = a), (f.depth = o);
                      var m = a + o;
                      return (
                        (f.style.height = m + "em"),
                        d > 0 && (f.style.minWidth = d + "em"),
                        (f.innerHTML =
                          "<svg width='100%' height='" +
                          m +
                          "em'" +
                          u[l] +
                          "</svg>"),
                        f
                      );
                    },
                    c = function (e, t, r, i) {
                      var a = void 0,
                        o = e.height + e.depth + 2 * r;
                      return (
                        "fbox" === t
                          ? ((a = n.makeSpan(["stretchy", t], [], i)),
                            i.color && (a.style.borderColor = i.getColor()))
                          : ((a = n.makeSpan([], [], i)).innerHTML =
                              "<svg width='100%' height='" +
                              o +
                              "em'>" +
                              u[t] +
                              "</svg>"),
                        (a.height = o),
                        (a.style.height = o + "em"),
                        a
                      );
                    };
                  t.exports = { encloseSpan: c, mathMLnode: o, svgSpan: d };
                },
                { "./buildCommon": 34, "./mathMLTree": 45, "./utils": 51 },
              ],
              48: [
                function (e, t) {
                  function n(e, n, r, i, a, o) {
                    (t.exports[e][a] = { font: n, group: r, replace: i }),
                      o && (t.exports[e][i] = t.exports[e][a]);
                  }
                  t.exports = { math: {}, text: {} };
                  var r = "math",
                    i = "text",
                    a = "main",
                    o = "ams",
                    s = "accent",
                    l = "bin",
                    u = "close",
                    d = "inner",
                    c = "mathord",
                    h = "op",
                    p = "open",
                    f = "punct",
                    m = "rel",
                    g = "spacing",
                    v = "textord";
                  n(r, a, m, "\u2261", "\\equiv"),
                    n(r, a, m, "\u227a", "\\prec"),
                    n(r, a, m, "\u227b", "\\succ"),
                    n(r, a, m, "\u223c", "\\sim"),
                    n(r, a, m, "\u22a5", "\\perp"),
                    n(r, a, m, "\u2aaf", "\\preceq"),
                    n(r, a, m, "\u2ab0", "\\succeq"),
                    n(r, a, m, "\u2243", "\\simeq"),
                    n(r, a, m, "\u2223", "\\mid"),
                    n(r, a, m, "\u226a", "\\ll"),
                    n(r, a, m, "\u226b", "\\gg"),
                    n(r, a, m, "\u224d", "\\asymp"),
                    n(r, a, m, "\u2225", "\\parallel"),
                    n(r, a, m, "\u22c8", "\\bowtie"),
                    n(r, a, m, "\u2323", "\\smile"),
                    n(r, a, m, "\u2291", "\\sqsubseteq"),
                    n(r, a, m, "\u2292", "\\sqsupseteq"),
                    n(r, a, m, "\u2250", "\\doteq"),
                    n(r, a, m, "\u2322", "\\frown"),
                    n(r, a, m, "\u220b", "\\ni"),
                    n(r, a, m, "\u221d", "\\propto"),
                    n(r, a, m, "\u22a2", "\\vdash"),
                    n(r, a, m, "\u22a3", "\\dashv"),
                    n(r, a, m, "\u220b", "\\owns"),
                    n(r, a, f, ".", "\\ldotp"),
                    n(r, a, f, "\u22c5", "\\cdotp"),
                    n(r, a, v, "#", "\\#"),
                    n(i, a, v, "#", "\\#"),
                    n(r, a, v, "&", "\\&"),
                    n(i, a, v, "&", "\\&"),
                    n(r, a, v, "\u2135", "\\aleph"),
                    n(r, a, v, "\u2200", "\\forall"),
                    n(r, a, v, "\u210f", "\\hbar"),
                    n(r, a, v, "\u2203", "\\exists"),
                    n(r, a, v, "\u2207", "\\nabla"),
                    n(r, a, v, "\u266d", "\\flat"),
                    n(r, a, v, "\u2113", "\\ell"),
                    n(r, a, v, "\u266e", "\\natural"),
                    n(r, a, v, "\u2663", "\\clubsuit"),
                    n(r, a, v, "\u2118", "\\wp"),
                    n(r, a, v, "\u266f", "\\sharp"),
                    n(r, a, v, "\u2662", "\\diamondsuit"),
                    n(r, a, v, "\u211c", "\\Re"),
                    n(r, a, v, "\u2661", "\\heartsuit"),
                    n(r, a, v, "\u2111", "\\Im"),
                    n(r, a, v, "\u2660", "\\spadesuit"),
                    n(r, a, v, "\u2020", "\\dag"),
                    n(i, a, v, "\u2020", "\\dag"),
                    n(i, a, v, "\u2020", "\\textdagger"),
                    n(r, a, v, "\u2021", "\\ddag"),
                    n(i, a, v, "\u2021", "\\ddag"),
                    n(i, a, v, "\u2020", "\\textdaggerdbl"),
                    n(r, a, u, "\u23b1", "\\rmoustache"),
                    n(r, a, p, "\u23b0", "\\lmoustache"),
                    n(r, a, u, "\u27ef", "\\rgroup"),
                    n(r, a, p, "\u27ee", "\\lgroup"),
                    n(r, a, l, "\u2213", "\\mp"),
                    n(r, a, l, "\u2296", "\\ominus"),
                    n(r, a, l, "\u228e", "\\uplus"),
                    n(r, a, l, "\u2293", "\\sqcap"),
                    n(r, a, l, "\u2217", "\\ast"),
                    n(r, a, l, "\u2294", "\\sqcup"),
                    n(r, a, l, "\u25ef", "\\bigcirc"),
                    n(r, a, l, "\u2219", "\\bullet"),
                    n(r, a, l, "\u2021", "\\ddagger"),
                    n(r, a, l, "\u2240", "\\wr"),
                    n(r, a, l, "\u2a3f", "\\amalg"),
                    n(r, a, m, "\u27f5", "\\longleftarrow"),
                    n(r, a, m, "\u21d0", "\\Leftarrow"),
                    n(r, a, m, "\u27f8", "\\Longleftarrow"),
                    n(r, a, m, "\u27f6", "\\longrightarrow"),
                    n(r, a, m, "\u21d2", "\\Rightarrow"),
                    n(r, a, m, "\u27f9", "\\Longrightarrow"),
                    n(r, a, m, "\u2194", "\\leftrightarrow"),
                    n(r, a, m, "\u27f7", "\\longleftrightarrow"),
                    n(r, a, m, "\u21d4", "\\Leftrightarrow"),
                    n(r, a, m, "\u27fa", "\\Longleftrightarrow"),
                    n(r, a, m, "\u21a6", "\\mapsto"),
                    n(r, a, m, "\u27fc", "\\longmapsto"),
                    n(r, a, m, "\u2197", "\\nearrow"),
                    n(r, a, m, "\u21a9", "\\hookleftarrow"),
                    n(r, a, m, "\u21aa", "\\hookrightarrow"),
                    n(r, a, m, "\u2198", "\\searrow"),
                    n(r, a, m, "\u21bc", "\\leftharpoonup"),
                    n(r, a, m, "\u21c0", "\\rightharpoonup"),
                    n(r, a, m, "\u2199", "\\swarrow"),
                    n(r, a, m, "\u21bd", "\\leftharpoondown"),
                    n(r, a, m, "\u21c1", "\\rightharpoondown"),
                    n(r, a, m, "\u2196", "\\nwarrow"),
                    n(r, a, m, "\u21cc", "\\rightleftharpoons"),
                    n(r, o, m, "\u226e", "\\nless"),
                    n(r, o, m, "\ue010", "\\nleqslant"),
                    n(r, o, m, "\ue011", "\\nleqq"),
                    n(r, o, m, "\u2a87", "\\lneq"),
                    n(r, o, m, "\u2268", "\\lneqq"),
                    n(r, o, m, "\ue00c", "\\lvertneqq"),
                    n(r, o, m, "\u22e6", "\\lnsim"),
                    n(r, o, m, "\u2a89", "\\lnapprox"),
                    n(r, o, m, "\u2280", "\\nprec"),
                    n(r, o, m, "\u22e0", "\\npreceq"),
                    n(r, o, m, "\u22e8", "\\precnsim"),
                    n(r, o, m, "\u2ab9", "\\precnapprox"),
                    n(r, o, m, "\u2241", "\\nsim"),
                    n(r, o, m, "\ue006", "\\nshortmid"),
                    n(r, o, m, "\u2224", "\\nmid"),
                    n(r, o, m, "\u22ac", "\\nvdash"),
                    n(r, o, m, "\u22ad", "\\nvDash"),
                    n(r, o, m, "\u22ea", "\\ntriangleleft"),
                    n(r, o, m, "\u22ec", "\\ntrianglelefteq"),
                    n(r, o, m, "\u228a", "\\subsetneq"),
                    n(r, o, m, "\ue01a", "\\varsubsetneq"),
                    n(r, o, m, "\u2acb", "\\subsetneqq"),
                    n(r, o, m, "\ue017", "\\varsubsetneqq"),
                    n(r, o, m, "\u226f", "\\ngtr"),
                    n(r, o, m, "\ue00f", "\\ngeqslant"),
                    n(r, o, m, "\ue00e", "\\ngeqq"),
                    n(r, o, m, "\u2a88", "\\gneq"),
                    n(r, o, m, "\u2269", "\\gneqq"),
                    n(r, o, m, "\ue00d", "\\gvertneqq"),
                    n(r, o, m, "\u22e7", "\\gnsim"),
                    n(r, o, m, "\u2a8a", "\\gnapprox"),
                    n(r, o, m, "\u2281", "\\nsucc"),
                    n(r, o, m, "\u22e1", "\\nsucceq"),
                    n(r, o, m, "\u22e9", "\\succnsim"),
                    n(r, o, m, "\u2aba", "\\succnapprox"),
                    n(r, o, m, "\u2246", "\\ncong"),
                    n(r, o, m, "\ue007", "\\nshortparallel"),
                    n(r, o, m, "\u2226", "\\nparallel"),
                    n(r, o, m, "\u22af", "\\nVDash"),
                    n(r, o, m, "\u22eb", "\\ntriangleright"),
                    n(r, o, m, "\u22ed", "\\ntrianglerighteq"),
                    n(r, o, m, "\ue018", "\\nsupseteqq"),
                    n(r, o, m, "\u228b", "\\supsetneq"),
                    n(r, o, m, "\ue01b", "\\varsupsetneq"),
                    n(r, o, m, "\u2acc", "\\supsetneqq"),
                    n(r, o, m, "\ue019", "\\varsupsetneqq"),
                    n(r, o, m, "\u22ae", "\\nVdash"),
                    n(r, o, m, "\u2ab5", "\\precneqq"),
                    n(r, o, m, "\u2ab6", "\\succneqq"),
                    n(r, o, m, "\ue016", "\\nsubseteqq"),
                    n(r, o, l, "\u22b4", "\\unlhd"),
                    n(r, o, l, "\u22b5", "\\unrhd"),
                    n(r, o, m, "\u219a", "\\nleftarrow"),
                    n(r, o, m, "\u219b", "\\nrightarrow"),
                    n(r, o, m, "\u21cd", "\\nLeftarrow"),
                    n(r, o, m, "\u21cf", "\\nRightarrow"),
                    n(r, o, m, "\u21ae", "\\nleftrightarrow"),
                    n(r, o, m, "\u21ce", "\\nLeftrightarrow"),
                    n(r, o, m, "\u25b3", "\\vartriangle"),
                    n(r, o, v, "\u210f", "\\hslash"),
                    n(r, o, v, "\u25bd", "\\triangledown"),
                    n(r, o, v, "\u25ca", "\\lozenge"),
                    n(r, o, v, "\u24c8", "\\circledS"),
                    n(r, o, v, "\xae", "\\circledR"),
                    n(i, o, v, "\xae", "\\circledR"),
                    n(r, o, v, "\u2221", "\\measuredangle"),
                    n(r, o, v, "\u2204", "\\nexists"),
                    n(r, o, v, "\u2127", "\\mho"),
                    n(r, o, v, "\u2132", "\\Finv"),
                    n(r, o, v, "\u2141", "\\Game"),
                    n(r, o, v, "k", "\\Bbbk"),
                    n(r, o, v, "\u2035", "\\backprime"),
                    n(r, o, v, "\u25b2", "\\blacktriangle"),
                    n(r, o, v, "\u25bc", "\\blacktriangledown"),
                    n(r, o, v, "\u25a0", "\\blacksquare"),
                    n(r, o, v, "\u29eb", "\\blacklozenge"),
                    n(r, o, v, "\u2605", "\\bigstar"),
                    n(r, o, v, "\u2222", "\\sphericalangle"),
                    n(r, o, v, "\u2201", "\\complement"),
                    n(r, o, v, "\xf0", "\\eth"),
                    n(r, o, v, "\u2571", "\\diagup"),
                    n(r, o, v, "\u2572", "\\diagdown"),
                    n(r, o, v, "\u25a1", "\\square"),
                    n(r, o, v, "\u25a1", "\\Box"),
                    n(r, o, v, "\u25ca", "\\Diamond"),
                    n(r, o, v, "\xa5", "\\yen"),
                    n(r, o, v, "\u2713", "\\checkmark"),
                    n(i, o, v, "\u2713", "\\checkmark"),
                    n(r, o, v, "\u2136", "\\beth"),
                    n(r, o, v, "\u2138", "\\daleth"),
                    n(r, o, v, "\u2137", "\\gimel"),
                    n(r, o, v, "\u03dd", "\\digamma"),
                    n(r, o, v, "\u03f0", "\\varkappa"),
                    n(r, o, p, "\u250c", "\\ulcorner"),
                    n(r, o, u, "\u2510", "\\urcorner"),
                    n(r, o, p, "\u2514", "\\llcorner"),
                    n(r, o, u, "\u2518", "\\lrcorner"),
                    n(r, o, m, "\u2266", "\\leqq"),
                    n(r, o, m, "\u2a7d", "\\leqslant"),
                    n(r, o, m, "\u2a95", "\\eqslantless"),
                    n(r, o, m, "\u2272", "\\lesssim"),
                    n(r, o, m, "\u2a85", "\\lessapprox"),
                    n(r, o, m, "\u224a", "\\approxeq"),
                    n(r, o, l, "\u22d6", "\\lessdot"),
                    n(r, o, m, "\u22d8", "\\lll"),
                    n(r, o, m, "\u2276", "\\lessgtr"),
                    n(r, o, m, "\u22da", "\\lesseqgtr"),
                    n(r, o, m, "\u2a8b", "\\lesseqqgtr"),
                    n(r, o, m, "\u2251", "\\doteqdot"),
                    n(r, o, m, "\u2253", "\\risingdotseq"),
                    n(r, o, m, "\u2252", "\\fallingdotseq"),
                    n(r, o, m, "\u223d", "\\backsim"),
                    n(r, o, m, "\u22cd", "\\backsimeq"),
                    n(r, o, m, "\u2ac5", "\\subseteqq"),
                    n(r, o, m, "\u22d0", "\\Subset"),
                    n(r, o, m, "\u228f", "\\sqsubset"),
                    n(r, o, m, "\u227c", "\\preccurlyeq"),
                    n(r, o, m, "\u22de", "\\curlyeqprec"),
                    n(r, o, m, "\u227e", "\\precsim"),
                    n(r, o, m, "\u2ab7", "\\precapprox"),
                    n(r, o, m, "\u22b2", "\\vartriangleleft"),
                    n(r, o, m, "\u22b4", "\\trianglelefteq"),
                    n(r, o, m, "\u22a8", "\\vDash"),
                    n(r, o, m, "\u22aa", "\\Vvdash"),
                    n(r, o, m, "\u2323", "\\smallsmile"),
                    n(r, o, m, "\u2322", "\\smallfrown"),
                    n(r, o, m, "\u224f", "\\bumpeq"),
                    n(r, o, m, "\u224e", "\\Bumpeq"),
                    n(r, o, m, "\u2267", "\\geqq"),
                    n(r, o, m, "\u2a7e", "\\geqslant"),
                    n(r, o, m, "\u2a96", "\\eqslantgtr"),
                    n(r, o, m, "\u2273", "\\gtrsim"),
                    n(r, o, m, "\u2a86", "\\gtrapprox"),
                    n(r, o, l, "\u22d7", "\\gtrdot"),
                    n(r, o, m, "\u22d9", "\\ggg"),
                    n(r, o, m, "\u2277", "\\gtrless"),
                    n(r, o, m, "\u22db", "\\gtreqless"),
                    n(r, o, m, "\u2a8c", "\\gtreqqless"),
                    n(r, o, m, "\u2256", "\\eqcirc"),
                    n(r, o, m, "\u2257", "\\circeq"),
                    n(r, o, m, "\u225c", "\\triangleq"),
                    n(r, o, m, "\u223c", "\\thicksim"),
                    n(r, o, m, "\u2248", "\\thickapprox"),
                    n(r, o, m, "\u2ac6", "\\supseteqq"),
                    n(r, o, m, "\u22d1", "\\Supset"),
                    n(r, o, m, "\u2290", "\\sqsupset"),
                    n(r, o, m, "\u227d", "\\succcurlyeq"),
                    n(r, o, m, "\u22df", "\\curlyeqsucc"),
                    n(r, o, m, "\u227f", "\\succsim"),
                    n(r, o, m, "\u2ab8", "\\succapprox"),
                    n(r, o, m, "\u22b3", "\\vartriangleright"),
                    n(r, o, m, "\u22b5", "\\trianglerighteq"),
                    n(r, o, m, "\u22a9", "\\Vdash"),
                    n(r, o, m, "\u2223", "\\shortmid"),
                    n(r, o, m, "\u2225", "\\shortparallel"),
                    n(r, o, m, "\u226c", "\\between"),
                    n(r, o, m, "\u22d4", "\\pitchfork"),
                    n(r, o, m, "\u221d", "\\varpropto"),
                    n(r, o, m, "\u25c0", "\\blacktriangleleft"),
                    n(r, o, m, "\u2234", "\\therefore"),
                    n(r, o, m, "\u220d", "\\backepsilon"),
                    n(r, o, m, "\u25b6", "\\blacktriangleright"),
                    n(r, o, m, "\u2235", "\\because"),
                    n(r, o, m, "\u22d8", "\\llless"),
                    n(r, o, m, "\u22d9", "\\gggtr"),
                    n(r, o, l, "\u22b2", "\\lhd"),
                    n(r, o, l, "\u22b3", "\\rhd"),
                    n(r, o, m, "\u2242", "\\eqsim"),
                    n(r, a, m, "\u22c8", "\\Join"),
                    n(r, o, m, "\u2251", "\\Doteq"),
                    n(r, o, l, "\u2214", "\\dotplus"),
                    n(r, o, l, "\u2216", "\\smallsetminus"),
                    n(r, o, l, "\u22d2", "\\Cap"),
                    n(r, o, l, "\u22d3", "\\Cup"),
                    n(r, o, l, "\u2a5e", "\\doublebarwedge"),
                    n(r, o, l, "\u229f", "\\boxminus"),
                    n(r, o, l, "\u229e", "\\boxplus"),
                    n(r, o, l, "\u22c7", "\\divideontimes"),
                    n(r, o, l, "\u22c9", "\\ltimes"),
                    n(r, o, l, "\u22ca", "\\rtimes"),
                    n(r, o, l, "\u22cb", "\\leftthreetimes"),
                    n(r, o, l, "\u22cc", "\\rightthreetimes"),
                    n(r, o, l, "\u22cf", "\\curlywedge"),
                    n(r, o, l, "\u22ce", "\\curlyvee"),
                    n(r, o, l, "\u229d", "\\circleddash"),
                    n(r, o, l, "\u229b", "\\circledast"),
                    n(r, o, l, "\u22c5", "\\centerdot"),
                    n(r, o, l, "\u22ba", "\\intercal"),
                    n(r, o, l, "\u22d2", "\\doublecap"),
                    n(r, o, l, "\u22d3", "\\doublecup"),
                    n(r, o, l, "\u22a0", "\\boxtimes"),
                    n(r, o, m, "\u21e2", "\\dashrightarrow"),
                    n(r, o, m, "\u21e0", "\\dashleftarrow"),
                    n(r, o, m, "\u21c7", "\\leftleftarrows"),
                    n(r, o, m, "\u21c6", "\\leftrightarrows"),
                    n(r, o, m, "\u21da", "\\Lleftarrow"),
                    n(r, o, m, "\u219e", "\\twoheadleftarrow"),
                    n(r, o, m, "\u21a2", "\\leftarrowtail"),
                    n(r, o, m, "\u21ab", "\\looparrowleft"),
                    n(r, o, m, "\u21cb", "\\leftrightharpoons"),
                    n(r, o, m, "\u21b6", "\\curvearrowleft"),
                    n(r, o, m, "\u21ba", "\\circlearrowleft"),
                    n(r, o, m, "\u21b0", "\\Lsh"),
                    n(r, o, m, "\u21c8", "\\upuparrows"),
                    n(r, o, m, "\u21bf", "\\upharpoonleft"),
                    n(r, o, m, "\u21c3", "\\downharpoonleft"),
                    n(r, o, m, "\u22b8", "\\multimap"),
                    n(r, o, m, "\u21ad", "\\leftrightsquigarrow"),
                    n(r, o, m, "\u21c9", "\\rightrightarrows"),
                    n(r, o, m, "\u21c4", "\\rightleftarrows"),
                    n(r, o, m, "\u21a0", "\\twoheadrightarrow"),
                    n(r, o, m, "\u21a3", "\\rightarrowtail"),
                    n(r, o, m, "\u21ac", "\\looparrowright"),
                    n(r, o, m, "\u21b7", "\\curvearrowright"),
                    n(r, o, m, "\u21bb", "\\circlearrowright"),
                    n(r, o, m, "\u21b1", "\\Rsh"),
                    n(r, o, m, "\u21ca", "\\downdownarrows"),
                    n(r, o, m, "\u21be", "\\upharpoonright"),
                    n(r, o, m, "\u21c2", "\\downharpoonright"),
                    n(r, o, m, "\u21dd", "\\rightsquigarrow"),
                    n(r, o, m, "\u21dd", "\\leadsto"),
                    n(r, o, m, "\u21db", "\\Rrightarrow"),
                    n(r, o, m, "\u21be", "\\restriction"),
                    n(r, a, v, "\u2018", "`"),
                    n(r, a, v, "$", "\\$"),
                    n(i, a, v, "$", "\\$"),
                    n(i, a, v, "$", "\\textdollar"),
                    n(r, a, v, "%", "\\%"),
                    n(i, a, v, "%", "\\%"),
                    n(r, a, v, "_", "\\_"),
                    n(i, a, v, "_", "\\_"),
                    n(i, a, v, "_", "\\textunderscore"),
                    n(r, a, v, "\u2220", "\\angle"),
                    n(r, a, v, "\u221e", "\\infty"),
                    n(r, a, v, "\u2032", "\\prime"),
                    n(r, a, v, "\u25b3", "\\triangle"),
                    n(r, a, v, "\u0393", "\\Gamma", !0),
                    n(r, a, v, "\u0394", "\\Delta", !0),
                    n(r, a, v, "\u0398", "\\Theta", !0),
                    n(r, a, v, "\u039b", "\\Lambda", !0),
                    n(r, a, v, "\u039e", "\\Xi", !0),
                    n(r, a, v, "\u03a0", "\\Pi", !0),
                    n(r, a, v, "\u03a3", "\\Sigma", !0),
                    n(r, a, v, "\u03a5", "\\Upsilon", !0),
                    n(r, a, v, "\u03a6", "\\Phi", !0),
                    n(r, a, v, "\u03a8", "\\Psi", !0),
                    n(r, a, v, "\u03a9", "\\Omega", !0),
                    n(r, a, v, "\xac", "\\neg"),
                    n(r, a, v, "\xac", "\\lnot"),
                    n(r, a, v, "\u22a4", "\\top"),
                    n(r, a, v, "\u22a5", "\\bot"),
                    n(r, a, v, "\u2205", "\\emptyset"),
                    n(r, o, v, "\u2205", "\\varnothing"),
                    n(r, a, c, "\u03b1", "\\alpha", !0),
                    n(r, a, c, "\u03b2", "\\beta", !0),
                    n(r, a, c, "\u03b3", "\\gamma", !0),
                    n(r, a, c, "\u03b4", "\\delta", !0),
                    n(r, a, c, "\u03f5", "\\epsilon", !0),
                    n(r, a, c, "\u03b6", "\\zeta", !0),
                    n(r, a, c, "\u03b7", "\\eta", !0),
                    n(r, a, c, "\u03b8", "\\theta", !0),
                    n(r, a, c, "\u03b9", "\\iota", !0),
                    n(r, a, c, "\u03ba", "\\kappa", !0),
                    n(r, a, c, "\u03bb", "\\lambda", !0),
                    n(r, a, c, "\u03bc", "\\mu", !0),
                    n(r, a, c, "\u03bd", "\\nu", !0),
                    n(r, a, c, "\u03be", "\\xi", !0),
                    n(r, a, c, "\u03bf", "\\omicron", !0),
                    n(r, a, c, "\u03c0", "\\pi", !0),
                    n(r, a, c, "\u03c1", "\\rho", !0),
                    n(r, a, c, "\u03c3", "\\sigma", !0),
                    n(r, a, c, "\u03c4", "\\tau", !0),
                    n(r, a, c, "\u03c5", "\\upsilon", !0),
                    n(r, a, c, "\u03d5", "\\phi", !0),
                    n(r, a, c, "\u03c7", "\\chi", !0),
                    n(r, a, c, "\u03c8", "\\psi", !0),
                    n(r, a, c, "\u03c9", "\\omega", !0),
                    n(r, a, c, "\u03b5", "\\varepsilon", !0),
                    n(r, a, c, "\u03d1", "\\vartheta", !0),
                    n(r, a, c, "\u03d6", "\\varpi", !0),
                    n(r, a, c, "\u03f1", "\\varrho", !0),
                    n(r, a, c, "\u03c2", "\\varsigma", !0),
                    n(r, a, c, "\u03c6", "\\varphi", !0),
                    n(r, a, l, "\u2217", "*"),
                    n(r, a, l, "+", "+"),
                    n(r, a, l, "\u2212", "-"),
                    n(r, a, l, "\u22c5", "\\cdot"),
                    n(r, a, l, "\u2218", "\\circ"),
                    n(r, a, l, "\xf7", "\\div"),
                    n(r, a, l, "\xb1", "\\pm"),
                    n(r, a, l, "\xd7", "\\times"),
                    n(r, a, l, "\u2229", "\\cap"),
                    n(r, a, l, "\u222a", "\\cup"),
                    n(r, a, l, "\u2216", "\\setminus"),
                    n(r, a, l, "\u2227", "\\land"),
                    n(r, a, l, "\u2228", "\\lor"),
                    n(r, a, l, "\u2227", "\\wedge"),
                    n(r, a, l, "\u2228", "\\vee"),
                    n(r, a, v, "\u221a", "\\surd"),
                    n(r, a, p, "(", "("),
                    n(r, a, p, "[", "["),
                    n(r, a, p, "\u27e8", "\\langle"),
                    n(r, a, p, "\u2223", "\\lvert"),
                    n(r, a, p, "\u2225", "\\lVert"),
                    n(r, a, u, ")", ")"),
                    n(r, a, u, "]", "]"),
                    n(r, a, u, "?", "?"),
                    n(r, a, u, "!", "!"),
                    n(r, a, u, "\u27e9", "\\rangle"),
                    n(r, a, u, "\u2223", "\\rvert"),
                    n(r, a, u, "\u2225", "\\rVert"),
                    n(r, a, m, "=", "="),
                    n(r, a, m, "<", "<"),
                    n(r, a, m, ">", ">"),
                    n(r, a, m, ":", ":"),
                    n(r, a, m, "\u2248", "\\approx"),
                    n(r, a, m, "\u2245", "\\cong"),
                    n(r, a, m, "\u2265", "\\ge"),
                    n(r, a, m, "\u2265", "\\geq"),
                    n(r, a, m, "\u2190", "\\gets"),
                    n(r, a, m, ">", "\\gt"),
                    n(r, a, m, "\u2208", "\\in"),
                    n(r, a, m, "\u2209", "\\notin"),
                    n(r, a, m, "\u0338", "\\not"),
                    n(r, a, m, "\u2282", "\\subset"),
                    n(r, a, m, "\u2283", "\\supset"),
                    n(r, a, m, "\u2286", "\\subseteq"),
                    n(r, a, m, "\u2287", "\\supseteq"),
                    n(r, o, m, "\u2288", "\\nsubseteq"),
                    n(r, o, m, "\u2289", "\\nsupseteq"),
                    n(r, a, m, "\u22a8", "\\models"),
                    n(r, a, m, "\u2190", "\\leftarrow"),
                    n(r, a, m, "\u2264", "\\le"),
                    n(r, a, m, "\u2264", "\\leq"),
                    n(r, a, m, "<", "\\lt"),
                    n(r, a, m, "\u2260", "\\ne"),
                    n(r, a, m, "\u2260", "\\neq"),
                    n(r, a, m, "\u2192", "\\rightarrow"),
                    n(r, a, m, "\u2192", "\\to"),
                    n(r, o, m, "\u2271", "\\ngeq"),
                    n(r, o, m, "\u2270", "\\nleq"),
                    n(r, a, g, null, "\\!"),
                    n(r, a, g, "\xa0", "\\ "),
                    n(r, a, g, "\xa0", "~"),
                    n(r, a, g, null, "\\,"),
                    n(r, a, g, null, "\\:"),
                    n(r, a, g, null, "\\;"),
                    n(r, a, g, null, "\\enspace"),
                    n(r, a, g, null, "\\qquad"),
                    n(r, a, g, null, "\\quad"),
                    n(r, a, g, "\xa0", "\\space"),
                    n(r, a, f, ",", ","),
                    n(r, a, f, ";", ";"),
                    n(r, a, f, ":", "\\colon"),
                    n(r, o, l, "\u22bc", "\\barwedge"),
                    n(r, o, l, "\u22bb", "\\veebar"),
                    n(r, a, l, "\u2299", "\\odot"),
                    n(r, a, l, "\u2295", "\\oplus"),
                    n(r, a, l, "\u2297", "\\otimes"),
                    n(r, a, v, "\u2202", "\\partial"),
                    n(r, a, l, "\u2298", "\\oslash"),
                    n(r, o, l, "\u229a", "\\circledcirc"),
                    n(r, o, l, "\u22a1", "\\boxdot"),
                    n(r, a, l, "\u25b3", "\\bigtriangleup"),
                    n(r, a, l, "\u25bd", "\\bigtriangledown"),
                    n(r, a, l, "\u2020", "\\dagger"),
                    n(r, a, l, "\u22c4", "\\diamond"),
                    n(r, a, l, "\u22c6", "\\star"),
                    n(r, a, l, "\u25c3", "\\triangleleft"),
                    n(r, a, l, "\u25b9", "\\triangleright"),
                    n(r, a, p, "{", "\\{"),
                    n(i, a, v, "{", "\\{"),
                    n(i, a, v, "{", "\\textbraceleft"),
                    n(r, a, u, "}", "\\}"),
                    n(i, a, v, "}", "\\}"),
                    n(i, a, v, "}", "\\textbraceright"),
                    n(r, a, p, "{", "\\lbrace"),
                    n(r, a, u, "}", "\\rbrace"),
                    n(r, a, p, "[", "\\lbrack"),
                    n(r, a, u, "]", "\\rbrack"),
                    n(i, a, v, "<", "\\textless"),
                    n(i, a, v, ">", "\\textgreater"),
                    n(r, a, p, "\u230a", "\\lfloor"),
                    n(r, a, u, "\u230b", "\\rfloor"),
                    n(r, a, p, "\u2308", "\\lceil"),
                    n(r, a, u, "\u2309", "\\rceil"),
                    n(r, a, v, "\\", "\\backslash"),
                    n(r, a, v, "\u2223", "|"),
                    n(r, a, v, "\u2223", "\\vert"),
                    n(i, a, v, "|", "\\textbar"),
                    n(r, a, v, "\u2225", "\\|"),
                    n(r, a, v, "\u2225", "\\Vert"),
                    n(i, a, v, "\u2225", "\\textbardbl"),
                    n(r, a, m, "\u2191", "\\uparrow"),
                    n(r, a, m, "\u21d1", "\\Uparrow"),
                    n(r, a, m, "\u2193", "\\downarrow"),
                    n(r, a, m, "\u21d3", "\\Downarrow"),
                    n(r, a, m, "\u2195", "\\updownarrow"),
                    n(r, a, m, "\u21d5", "\\Updownarrow"),
                    n(r, a, h, "\u2210", "\\coprod"),
                    n(r, a, h, "\u22c1", "\\bigvee"),
                    n(r, a, h, "\u22c0", "\\bigwedge"),
                    n(r, a, h, "\u2a04", "\\biguplus"),
                    n(r, a, h, "\u22c2", "\\bigcap"),
                    n(r, a, h, "\u22c3", "\\bigcup"),
                    n(r, a, h, "\u222b", "\\int"),
                    n(r, a, h, "\u222b", "\\intop"),
                    n(r, a, h, "\u222c", "\\iint"),
                    n(r, a, h, "\u222d", "\\iiint"),
                    n(r, a, h, "\u220f", "\\prod"),
                    n(r, a, h, "\u2211", "\\sum"),
                    n(r, a, h, "\u2a02", "\\bigotimes"),
                    n(r, a, h, "\u2a01", "\\bigoplus"),
                    n(r, a, h, "\u2a00", "\\bigodot"),
                    n(r, a, h, "\u222e", "\\oint"),
                    n(r, a, h, "\u2a06", "\\bigsqcup"),
                    n(r, a, h, "\u222b", "\\smallint"),
                    n(i, a, d, "\u2026", "\\textellipsis"),
                    n(r, a, d, "\u2026", "\\mathellipsis"),
                    n(i, a, d, "\u2026", "\\ldots", !0),
                    n(r, a, d, "\u2026", "\\ldots", !0),
                    n(r, a, d, "\u22ef", "\\cdots", !0),
                    n(r, a, d, "\u22f1", "\\ddots", !0),
                    n(r, a, v, "\u22ee", "\\vdots", !0),
                    n(r, a, s, "\xb4", "\\acute"),
                    n(r, a, s, "`", "\\grave"),
                    n(r, a, s, "\xa8", "\\ddot"),
                    n(r, a, s, "~", "\\tilde"),
                    n(r, a, s, "\xaf", "\\bar"),
                    n(r, a, s, "\u02d8", "\\breve"),
                    n(r, a, s, "\u02c7", "\\check"),
                    n(r, a, s, "^", "\\hat"),
                    n(r, a, s, "\u20d7", "\\vec"),
                    n(r, a, s, "\u02d9", "\\dot"),
                    n(r, a, c, "\u0131", "\\imath"),
                    n(r, a, c, "\u0237", "\\jmath"),
                    n(i, a, s, "\u02ca", "\\'"),
                    n(i, a, s, "\u02cb", "\\`"),
                    n(i, a, s, "\u02c6", "\\^"),
                    n(i, a, s, "\u02dc", "\\~"),
                    n(i, a, s, "\u02c9", "\\="),
                    n(i, a, s, "\u02d8", "\\u"),
                    n(i, a, s, "\u02d9", "\\."),
                    n(i, a, s, "\u02da", "\\r"),
                    n(i, a, s, "\u02c7", "\\v"),
                    n(i, a, s, "\xa8", '\\"'),
                    n(i, a, s, "\u030b", "\\H"),
                    n(i, a, v, "\u2013", "--"),
                    n(i, a, v, "\u2013", "\\textendash"),
                    n(i, a, v, "\u2014", "---"),
                    n(i, a, v, "\u2014", "\\textemdash"),
                    n(i, a, v, "\u2018", "`"),
                    n(i, a, v, "\u2018", "\\textquoteleft"),
                    n(i, a, v, "\u2019", "'"),
                    n(i, a, v, "\u2019", "\\textquoteright"),
                    n(i, a, v, "\u201c", "``"),
                    n(i, a, v, "\u201c", "\\textquotedblleft"),
                    n(i, a, v, "\u201d", "''"),
                    n(i, a, v, "\u201d", "\\textquotedblright"),
                    n(r, a, v, "\xb0", "\\degree"),
                    n(i, a, v, "\xb0", "\\degree"),
                    n(r, a, c, "\xa3", "\\pounds"),
                    n(r, a, c, "\xa3", "\\mathsterling"),
                    n(i, a, c, "\xa3", "\\pounds"),
                    n(i, a, c, "\xa3", "\\textsterling"),
                    n(r, o, v, "\u2720", "\\maltese"),
                    n(i, o, v, "\u2720", "\\maltese"),
                    n(i, a, g, "\xa0", "\\ "),
                    n(i, a, g, "\xa0", " "),
                    n(i, a, g, "\xa0", "~");
                  for (var b = '0123456789/@."', y = 0; y < b.length; y++) {
                    var x = b.charAt(y);
                    n(r, a, v, x, x);
                  }
                  for (
                    var w = '0123456789!@*()-=+[]<>|";:?/.,', k = 0;
                    k < w.length;
                    k++
                  ) {
                    var M = w.charAt(k);
                    n(i, a, v, M, M);
                  }
                  for (
                    var S =
                        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
                      z = 0;
                    z < S.length;
                    z++
                  ) {
                    var A = S.charAt(z);
                    n(r, a, c, A, A), n(i, a, v, A, A);
                  }
                  for (var C = 192; C <= 214; C++) {
                    var T = String.fromCharCode(C);
                    n(r, a, c, T, T), n(i, a, v, T, T);
                  }
                  for (var N = 216; N <= 246; N++) {
                    var E = String.fromCharCode(N);
                    n(r, a, c, E, E), n(i, a, v, E, E);
                  }
                  for (var R = 248; R <= 255; R++) {
                    var L = String.fromCharCode(R);
                    n(r, a, c, L, L), n(i, a, v, L, L);
                  }
                  for (var O = 1040; O <= 1103; O++) {
                    var q = String.fromCharCode(O);
                    n(i, a, v, q, q);
                  }
                  n(i, a, v, "\u2013", "\u2013"),
                    n(i, a, v, "\u2014", "\u2014"),
                    n(i, a, v, "\u2018", "\u2018"),
                    n(i, a, v, "\u2019", "\u2019"),
                    n(i, a, v, "\u201c", "\u201c"),
                    n(i, a, v, "\u201d", "\u201d");
                },
                {},
              ],
              49: [
                function (e, t) {
                  var n = /[\uAC00-\uD7AF]/,
                    r =
                      /[\u3000-\u30FF\u4E00-\u9FAF\uAC00-\uD7AF\uFF00-\uFF60]/;
                  t.exports = { cjkRegex: r, hangulRegex: n };
                },
                {},
              ],
              50: [
                function (e, t) {
                  function n(e) {
                    return e && e.__esModule ? e : { default: e };
                  }
                  var r = n(e("./ParseError")),
                    i = {
                      pt: 1,
                      mm: 7227 / 2540,
                      cm: 7227 / 254,
                      in: 72.27,
                      bp: 1.00375,
                      pc: 12,
                      dd: 1238 / 1157,
                      cc: 14856 / 1157,
                      nd: 685 / 642,
                      nc: 1370 / 107,
                      sp: 1 / 65536,
                      px: 1.00375,
                    },
                    a = { ex: !0, em: !0, mu: !0 },
                    o = function (e) {
                      return (
                        e.unit && (e = e.unit), e in i || e in a || "ex" === e
                      );
                    },
                    s = function (e, t) {
                      var n = void 0;
                      if (e.unit in i)
                        n =
                          i[e.unit] /
                          t.fontMetrics().ptPerEm /
                          t.sizeMultiplier;
                      else if ("mu" === e.unit) n = t.fontMetrics().cssEmPerMu;
                      else {
                        var a = void 0;
                        if (
                          ((a = t.style.isTight()
                            ? t.havingStyle(t.style.text())
                            : t),
                          "ex" === e.unit)
                        )
                          n = a.fontMetrics().xHeight;
                        else {
                          if ("em" !== e.unit)
                            throw new r["default"](
                              "Invalid unit: '" + e.unit + "'",
                            );
                          n = a.fontMetrics().quad;
                        }
                        a !== t && (n *= a.sizeMultiplier / t.sizeMultiplier);
                      }
                      return e.number * n;
                    };
                  t.exports = { validUnit: o, calculateSize: s };
                },
                { "./ParseError": 29 },
              ],
              51: [
                function (e, t) {
                  function n(e) {
                    return c[e];
                  }
                  function r(e) {
                    return ("" + e).replace(h, n);
                  }
                  function i(e) {
                    p(e, "");
                  }
                  var a = Array.prototype.indexOf,
                    o = function (e, t) {
                      if (null == e) return -1;
                      if (a && e.indexOf === a) return e.indexOf(t);
                      for (var n = e.length, r = 0; r < n; r++)
                        if (e[r] === t) return r;
                      return -1;
                    },
                    s = function (e, t) {
                      return -1 !== o(e, t);
                    },
                    l = function (e, t) {
                      return e === undefined ? t : e;
                    },
                    u = /([A-Z])/g,
                    d = function (e) {
                      return e.replace(u, "-$1").toLowerCase();
                    },
                    c = {
                      "&": "&amp;",
                      ">": "&gt;",
                      "<": "&lt;",
                      '"': "&quot;",
                      "'": "&#x27;",
                    },
                    h = /[&><"']/g,
                    p = void 0;
                  if ("undefined" != typeof document) {
                    var f = document.createElement("span");
                    p =
                      "textContent" in f
                        ? function (e, t) {
                            e.textContent = t;
                          }
                        : function (e, t) {
                            e.innerText = t;
                          };
                  }
                  t.exports = {
                    contains: s,
                    deflt: l,
                    escape: r,
                    hyphenate: d,
                    indexOf: o,
                    setTextContent: p,
                    clearNode: i,
                  };
                },
                {},
              ],
            },
            {},
            [1],
          )(1);
        }),
          (e.exports = t());
      }),
    );
  // Copyright 2018 The Distill Template Authors
  const ae = function (e, t, n) {
      let r = n,
        i = 0;
      const a = e.length;
      for (; r < t.length; ) {
        const n = t[r];
        if (i <= 0 && t.slice(r, r + a) === e) return r;
        "\\" === n ? r++ : "{" === n ? i++ : "}" === n && i--, r++;
      }
      return -1;
    },
    oe = function (e, t, n, r) {
      const i = [];
      for (let a = 0; a < e.length; a++)
        if ("text" === e[a].type) {
          const o = e[a].data;
          let s,
            l = !0,
            u = 0;
          for (
            -1 !== (s = o.indexOf(t)) &&
            ((u = s), i.push({ type: "text", data: o.slice(0, u) }), (l = !1));
            ;

          ) {
            if (l) {
              if (-1 === (s = o.indexOf(t, u))) break;
              i.push({ type: "text", data: o.slice(u, s) }), (u = s);
            } else {
              if (-1 === (s = ae(n, o, u + t.length))) break;
              i.push({
                type: "math",
                data: o.slice(u + t.length, s),
                rawData: o.slice(u, s + n.length),
                display: r,
              }),
                (u = s + n.length);
            }
            l = !l;
          }
          i.push({ type: "text", data: o.slice(u) });
        } else i.push(e[a]);
      return i;
    },
    se = function (e, t) {
      let n = [{ type: "text", data: e }];
      for (let e = 0; e < t.length; e++) {
        const r = t[e];
        n = oe(n, r.left, r.right, r.display || !1);
      }
      return n;
    },
    le = function (e, t) {
      const n = se(e, t.delimiters),
        r = document.createDocumentFragment();
      for (let e = 0; e < n.length; e++)
        if ("text" === n[e].type)
          r.appendChild(document.createTextNode(n[e].data));
        else {
          const a = document.createElement("d-math"),
            o = n[e].data;
          t.displayMode = n[e].display;
          try {
            (a.textContent = o), t.displayMode && a.setAttribute("block", "");
          } catch (i) {
            if (!(i instanceof katex.ParseError)) throw i;
            t.errorCallback(
              "KaTeX auto-render: Failed to parse `" + n[e].data + "` with ",
              i,
            ),
              r.appendChild(document.createTextNode(n[e].rawData));
            continue;
          }
          r.appendChild(a);
        }
      return r;
    },
    ue = function (e, t) {
      for (let n = 0; n < e.childNodes.length; n++) {
        const r = e.childNodes[n];
        if (3 === r.nodeType) {
          const i = r.textContent;
          if (t.mightHaveMath(i)) {
            const a = le(i, t);
            (n += a.childNodes.length - 1), e.replaceChild(a, r);
          }
        } else if (1 === r.nodeType) {
          -1 === t.ignoredTags.indexOf(r.nodeName.toLowerCase()) && ue(r, t);
        }
      }
    },
    de = {
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
      errorCallback: function (e, t) {
        console.error(e, t);
      },
    },
    ce = function (e, t) {
      if (!e) throw new Error("No element provided to render");
      const n = Object.assign({}, de, t),
        r = n.delimiters.flatMap((e) => [e.left, e.right]),
        i = (e) => r.some((t) => -1 !== e.indexOf(t));
      (n.mightHaveMath = i), ue(e, n);
    };
  var he =
      "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA99JREFUeNrsG4t1ozDMzQSM4A2ODUonKBucN2hugtIJ6E1AboLcBiQTkJsANiAb9OCd/OpzMWBJBl5TvaeXPiiyJetry0J8wW3D3QpjRh3GjneXDq+fSQA9s2mH9x3KDhN4foJfCb8N/Jrv+2fnDn8vLRQOplWHVYdvHZYdZsBcZP1vBmh/n8DzEmhUQDPaOuP9pFuY+JwJHwHnCLQE2tnWBGEyXozY9xCUgHMhhjE2I4heVWtgIkZ83wL6Qgxj1obfWBxymPwe+b00BCCRNPbwfb60yleAkkBHGT5AEehIYz7eJrFDMF9CvH4wwhcGHiHMneFvLDQwlwvMLQq58trRcYBWfYn0A0OgHWQUSu25mE+BnoYKnnEJoeIWAifzOv7vLWd2ZKRfWAIme3tOiUaQ3UnLkb0xj1FxRIeEGKaGIHOs9nEgLaaA9i0JRYo1Ic67wJW86KSKE/ZAM8KuVMk8ITVhmxUxJ3Cl2xlm9Vtkeju1+mpCQNxaEGNCY8bs9X2YqwNoQeGjBWut/ma0QAWy/TqAsHx9wSya3I5IRxOfTC+leG+kA/4vSeEcGBtNUN6byhu3+keEZCQJUNh8MAO7HL6H8pQLnsW/Hd4T4lv93TPjfM7A46iEEqbB5EDOvwYNW6tGNZzT/o+CZ6sqZ6wUtR/wf7mi/VL8iNciT6rHih48Y55b4nKCHJCCzb4y0nwFmin3ZEMIoLfZF8F7nncFmvnWBaBj7CGAYA/WGJsUwHdYqVDwAmNsUgAx4CGgAA7GOOxADYOFWOaIKifuVYzmOpREqA21Mo7aPsgiY1PhOMAmxtR+AUbYH3Id2wc0SAFIQTsn9IUGWR8k9jx3vtXSiAacFxTAGakBk9UudkNECd6jLe+6HrshshvIuC6IlLMRy7er+JpcKma24SlE4cFZSZJDGVVrsNvitQhQrDhW0jfiOLfFd47C42eHT56D/BK0To+58Ahj+cAT8HT1UWlfLZCCd/uKawzU0Rh2EyIX/Icqth3niG8ybNroezwe6khdCNxRN+l4XGdOLVLlOOt2hTRJlr1ETIuMAltVTMz70mJrkdGAaZLSmnBEqmAE32JCMmuTlCnRgsBENtOUpHhvvsYIL0ibnBkaC6QvKcR7738GKp0AKnim7xgUSNv1bpS8QwhBt8r+EP47v/oyRK/S34yJ9nT+AN0Tkm4OdB9E4BsmXM3SnMlRFUrtp6IDpV2eKzdYvF3etm3KhQksbOLChGkSmcBdmcEwvqkrMy5BzL00NZeu3qPYJOOuCc+5NjcWKXQxFvTa3NoXJ4d8in7fiAUuTt781dkvuHX4K8AA2Usy7yNKLy0AAAAASUVORK5CYII=\n",
    pe = /["'&<>]/,
    fe = C;
  /*!
   * escape-html
   * Copyright(c) 2012-2013 TJ Holowaychuk
   * Copyright(c) 2015 Andreas Lubbe
   * Copyright(c) 2015 Tiancheng "Timothy" Gu
   * MIT Licensed
   */
  // Copyright 2018 The Distill Template Authors
  const me =
      '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nhtml {\n  font-size: 14px;\n\tline-height: 1.6em;\n  /* font-family: "Libre Franklin", "Helvetica Neue", sans-serif; */\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif;\n  /*, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";*/\n  text-size-adjust: 100%;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%;\n}\n\n@media(min-width: 768px) {\n  html {\n    font-size: 16px;\n  }\n}\n\nbody {\n  margin: 0;\n}\n\na {\n  color: #004276;\n}\n\nfigure {\n  margin: 0;\n}\n\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}\n\ntable th {\n\ttext-align: left;\n}\n\ntable thead {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n\ntable thead th {\n  padding-bottom: 0.5em;\n}\n\ntable tbody :first-child td {\n  padding-top: 0.5em;\n}\n\npre {\n  overflow: auto;\n  max-width: 100%;\n}\n\np {\n  margin-top: 0;\n  margin-bottom: 1em;\n}\n\nsup, sub {\n  vertical-align: baseline;\n  position: relative;\n  top: -0.4em;\n  line-height: 1em;\n}\n\nsub {\n  top: 0.4em;\n}\n\n.kicker,\n.marker {\n  font-size: 15px;\n  font-weight: 600;\n  color: rgba(0, 0, 0, 0.5);\n}\n\n\n/* Headline */\n\n@media(min-width: 1024px) {\n  d-title h1 span {\n    display: block;\n  }\n}\n\n/* Figure */\n\nfigure {\n  position: relative;\n  margin-bottom: 2.5em;\n  margin-top: 1.5em;\n}\n\nfigcaption+figure {\n\n}\n\nfigure img {\n  width: 100%;\n}\n\nfigure svg text,\nfigure svg tspan {\n}\n\nfigcaption,\n.figcaption {\n  color: rgba(0, 0, 0, 0.6);\n  font-size: 12px;\n  line-height: 1.5em;\n}\n\n@media(min-width: 1024px) {\nfigcaption,\n.figcaption {\n    font-size: 13px;\n  }\n}\n\nfigure.external img {\n  background: white;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);\n  padding: 18px;\n  box-sizing: border-box;\n}\n\nfigcaption a {\n  color: rgba(0, 0, 0, 0.6);\n}\n\nfigcaption b,\nfigcaption strong, {\n  font-weight: 600;\n  color: rgba(0, 0, 0, 1.0);\n}\n' +
      '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n@supports not (display: grid) {\n  .base-grid,\n  distill-header,\n  d-title,\n  d-abstract,\n  d-article,\n  d-appendix,\n  distill-appendix,\n  d-byline,\n  d-footnote-list,\n  d-citation-list,\n  distill-footer {\n    display: block;\n    padding: 8px;\n  }\n}\n\n.base-grid,\ndistill-header,\nd-title,\nd-abstract,\nd-article,\nd-appendix,\ndistill-appendix,\nd-byline,\nd-footnote-list,\nd-citation-list,\ndistill-footer {\n  display: grid;\n  justify-items: stretch;\n  grid-template-columns: [screen-start] 8px [page-start kicker-start text-start gutter-start middle-start] 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr [text-end page-end gutter-end kicker-end middle-end] 8px [screen-end];\n  grid-column-gap: 8px;\n}\n\n.grid {\n  display: grid;\n  grid-column-gap: 8px;\n}\n\n@media(min-width: 768px) {\n  .base-grid,\n  distill-header,\n  d-title,\n  d-abstract,\n  d-article,\n  d-appendix,\n  distill-appendix,\n  d-byline,\n  d-footnote-list,\n  d-citation-list,\n  distill-footer {\n    grid-template-columns: [screen-start] 1fr [page-start kicker-start middle-start text-start] 45px 45px 45px 45px 45px 45px 45px 45px [ kicker-end text-end gutter-start] 45px [middle-end] 45px [page-end gutter-end] 1fr [screen-end];\n    grid-column-gap: 16px;\n  }\n\n  .grid {\n    grid-column-gap: 16px;\n  }\n}\n\n@media(min-width: 1000px) {\n  .base-grid,\n  distill-header,\n  d-title,\n  d-abstract,\n  d-article,\n  d-appendix,\n  distill-appendix,\n  d-byline,\n  d-footnote-list,\n  d-citation-list,\n  distill-footer {\n    grid-template-columns: [screen-start] 1fr [page-start kicker-start] 50px [middle-start] 50px [text-start kicker-end] 50px 50px 50px 50px 50px 50px 50px 50px [text-end gutter-start] 50px [middle-end] 50px [page-end gutter-end] 1fr [screen-end];\n    grid-column-gap: 16px;\n  }\n\n  .grid {\n    grid-column-gap: 16px;\n  }\n}\n\n@media(min-width: 1180px) {\n  .base-grid,\n  distill-header,\n  d-title,\n  d-abstract,\n  d-article,\n  d-appendix,\n  distill-appendix,\n  d-byline,\n  d-footnote-list,\n  d-citation-list,\n  distill-footer {\n    grid-template-columns: [screen-start] 1fr [page-start kicker-start] 60px [middle-start] 60px [text-start kicker-end] 60px 60px 60px 60px 60px 60px 60px 60px [text-end gutter-start] 60px [middle-end] 60px [page-end gutter-end] 1fr [screen-end];\n    grid-column-gap: 32px;\n  }\n\n  .grid {\n    grid-column-gap: 32px;\n  }\n}\n\n\n\n\n.base-grid {\n  grid-column: screen;\n}\n\n/* .l-body,\nd-article > *  {\n  grid-column: text;\n}\n\n.l-page,\nd-title > *,\nd-figure {\n  grid-column: page;\n} */\n\n.l-gutter {\n  grid-column: gutter;\n}\n\n.l-text,\n.l-body {\n  grid-column: text;\n}\n\n.l-page {\n  grid-column: page;\n}\n\n.l-body-outset {\n  grid-column: middle;\n}\n\n.l-page-outset {\n  grid-column: page;\n}\n\n.l-screen {\n  grid-column: screen;\n}\n\n.l-screen-inset {\n  grid-column: screen;\n  padding-left: 16px;\n  padding-left: 16px;\n}\n\n\n/* Aside */\n\nd-article aside {\n  grid-column: gutter;\n  font-size: 12px;\n  line-height: 1.6em;\n  color: rgba(0, 0, 0, 0.6)\n}\n\n@media(min-width: 768px) {\n  aside {\n    grid-column: gutter;\n  }\n\n  .side {\n    grid-column: gutter;\n  }\n}\n' +
      '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nd-title {\n  padding: 2rem 0 1.5rem;\n  contain: layout style;\n  overflow-x: hidden;\n}\n\n@media(min-width: 768px) {\n  d-title {\n    padding: 4rem 0 1.5rem;\n  }\n}\n\nd-title h1 {\n  grid-column: text;\n  font-size: 40px;\n  font-weight: 700;\n  line-height: 1.1em;\n  margin: 0 0 0.5rem;\n}\n\n@media(min-width: 768px) {\n  d-title h1 {\n    font-size: 50px;\n  }\n}\n\nd-title p {\n  font-weight: 300;\n  font-size: 1.2rem;\n  line-height: 1.55em;\n  grid-column: text;\n}\n\nd-title .status {\n  margin-top: 0px;\n  font-size: 12px;\n  color: #009688;\n  opacity: 0.8;\n  grid-column: kicker;\n}\n\nd-title .status span {\n  line-height: 1;\n  display: inline-block;\n  padding: 6px 0;\n  border-bottom: 1px solid #80cbc4;\n  font-size: 11px;\n  text-transform: uppercase;\n}\n' +
      '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nd-byline {\n  contain: style;\n  overflow: hidden;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  font-size: 0.8rem;\n  line-height: 1.8em;\n  padding: 1.5rem 0;\n  min-height: 1.8em;\n}\n\n\nd-byline .byline {\n  grid-template-columns: 1fr 1fr;\n  grid-column: text;\n}\n\n@media(min-width: 768px) {\n  d-byline .byline {\n    grid-template-columns: 1fr 1fr 1fr 1fr;\n  }\n}\n\nd-byline .authors-affiliations {\n  grid-column-end: span 2;\n  grid-template-columns: 1fr 1fr;\n  margin-bottom: 1em;\n}\n\n@media(min-width: 768px) {\n  d-byline .authors-affiliations {\n    margin-bottom: 0;\n  }\n}\n\nd-byline h3 {\n  font-size: 0.6rem;\n  font-weight: 400;\n  color: rgba(0, 0, 0, 0.5);\n  margin: 0;\n  text-transform: uppercase;\n}\n\nd-byline p {\n  margin: 0;\n}\n\nd-byline a,\nd-article d-byline a {\n  color: rgba(0, 0, 0, 0.8);\n  text-decoration: none;\n  border-bottom: none;\n}\n\nd-article d-byline a:hover {\n  text-decoration: underline;\n  border-bottom: none;\n}\n\nd-byline p.author {\n  font-weight: 500;\n}\n\nd-byline .affiliations {\n\n}\n' +
      '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nd-article {\n  contain: layout style;\n  overflow-x: hidden;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  padding-top: 2rem;\n  color: rgba(0, 0, 0, 0.8);\n}\n\nd-article > * {\n  grid-column: text;\n}\n\n@media(min-width: 768px) {\n  d-article {\n    font-size: 16px;\n  }\n}\n\n@media(min-width: 1024px) {\n  d-article {\n    font-size: 1.06rem;\n    line-height: 1.7em;\n  }\n}\n\n\n/* H2 */\n\n\nd-article .marker {\n  text-decoration: none;\n  border: none;\n  counter-reset: section;\n  grid-column: kicker;\n  line-height: 1.7em;\n}\n\nd-article .marker:hover {\n  border: none;\n}\n\nd-article .marker span {\n  padding: 0 3px 4px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.2);\n  position: relative;\n  top: 4px;\n}\n\nd-article .marker:hover span {\n  color: rgba(0, 0, 0, 0.7);\n  border-bottom: 1px solid rgba(0, 0, 0, 0.7);\n}\n\nd-article h2 {\n  font-weight: 600;\n  font-size: 24px;\n  line-height: 1.25em;\n  margin: 2rem 0 1.5rem 0;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n  padding-bottom: 1rem;\n}\n\n@media(min-width: 1024px) {\n  d-article h2 {\n    font-size: 36px;\n  }\n}\n\n/* H3 */\n\nd-article h3 {\n  font-weight: 700;\n  font-size: 18px;\n  line-height: 1.4em;\n  margin-bottom: 1em;\n  margin-top: 2em;\n}\n\n@media(min-width: 1024px) {\n  d-article h3 {\n    font-size: 20px;\n  }\n}\n\n/* H4 */\n\nd-article h4 {\n  font-weight: 600;\n  text-transform: uppercase;\n  font-size: 14px;\n  line-height: 1.4em;\n}\n\nd-article a {\n  color: inherit;\n}\n\nd-article p,\nd-article ul,\nd-article ol,\nd-article blockquote {\n  margin-top: 0;\n  margin-bottom: 1em;\n  margin-left: 0;\n  margin-right: 0;\n}\n\nd-article blockquote {\n  border-left: 2px solid rgba(0, 0, 0, 0.2);\n  padding-left: 2em;\n  font-style: italic;\n  color: rgba(0, 0, 0, 0.6);\n}\n\nd-article a {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.4);\n  text-decoration: none;\n}\n\nd-article a:hover {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.8);\n}\n\nd-article .link {\n  text-decoration: underline;\n  cursor: pointer;\n}\n\nd-article ul,\nd-article ol {\n  padding-left: 24px;\n}\n\nd-article li {\n  margin-bottom: 1em;\n  margin-left: 0;\n  padding-left: 0;\n}\n\nd-article li:last-child {\n  margin-bottom: 0;\n}\n\nd-article pre {\n  font-size: 14px;\n  margin-bottom: 20px;\n}\n\nd-article hr {\n  grid-column: screen;\n  width: 100%;\n  border: none;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n  margin-top: 60px;\n  margin-bottom: 60px;\n}\n\nd-article section {\n  margin-top: 60px;\n  margin-bottom: 60px;\n}\n\nd-article span.equation-mimic {\n  font-family: georgia;\n  font-size: 115%;\n  font-style: italic;\n}\n\nd-article > d-code,\nd-article section > d-code  {\n  display: block;\n}\n\nd-article > d-math[block],\nd-article section > d-math[block]  {\n  display: block;\n}\n\n@media (max-width: 768px) {\n  d-article > d-code,\n  d-article section > d-code,\n  d-article > d-math[block],\n  d-article section > d-math[block] {\n      overflow-x: scroll;\n      -ms-overflow-style: none;  // IE 10+\n      overflow: -moz-scrollbars-none;  // Firefox\n  }\n\n  d-article > d-code::-webkit-scrollbar,\n  d-article section > d-code::-webkit-scrollbar,\n  d-article > d-math[block]::-webkit-scrollbar,\n  d-article section > d-math[block]::-webkit-scrollbar {\n    display: none;  // Safari and Chrome\n  }\n}\n\nd-article .citation {\n  color: #668;\n  cursor: pointer;\n}\n\nd-include {\n  width: auto;\n  display: block;\n}\n\nd-figure {\n  contain: layout style;\n}\n\n/* KaTeX */\n\n.katex, .katex-prerendered {\n  contain: style;\n  display: inline-block;\n}\n\n/* Tables */\n\nd-article table {\n  border-collapse: collapse;\n  margin-bottom: 1.5rem;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.2);\n}\n\nd-article table th {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.2);\n}\n\nd-article table td {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n\nd-article table tr:last-of-type td {\n  border-bottom: none;\n}\n\nd-article table th,\nd-article table td {\n  font-size: 15px;\n  padding: 2px 8px;\n}\n\nd-article table tbody :first-child td {\n  padding-top: 2px;\n}\n' +
      '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nspan.katex-display {\n  text-align: left;\n  padding: 8px 0 8px 0;\n  margin: 0.5em 0 0.5em 1em;\n}\n\nspan.katex {\n  -webkit-font-smoothing: antialiased;\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 1.18em;\n}\n' +
      '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n@media print {\n\n  @page {\n    size: 8in 11in;\n    @bottom-right {\n      content: counter(page) " of " counter(pages);\n    }\n  }\n\n  html {\n    /* no general margins -- CSS Grid takes care of those */\n  }\n\n  p, code {\n    page-break-inside: avoid;\n  }\n\n  h2, h3 {\n    page-break-after: avoid;\n  }\n\n  d-header {\n    visibility: hidden;\n  }\n\n  d-footer {\n    display: none!important;\n  }\n\n}\n',
    ge =
      "\nwindow.addEventListener('WebComponentsReady', function() {\n  console.warn('WebComponentsReady');\n  const loaderTag = document.createElement('script');\n  loaderTag.src = 'https://distill.pub/template.v2.js';\n  document.head.insertBefore(loaderTag, document.head.firstChild);\n});\n",
    ve =
      "\nd-citation-list {\n  contain: style;\n}\n\nd-citation-list .references {\n  grid-column: text;\n}\n\nd-citation-list .references .title {\n  font-weight: 500;\n}\n";
  var be =
    '<svg viewBox="-607 419 64 64">\n  <path d="M-573.4,478.9c-8,0-14.6-6.4-14.6-14.5s14.6-25.9,14.6-40.8c0,14.9,14.6,32.8,14.6,40.8S-565.4,478.9-573.4,478.9z"/>\n</svg>\n';
  const ye = `\n<style>\ndistill-header {\n  position: relative;\n  height: 60px;\n  background-color: hsl(200, 60%, 15%);\n  width: 100%;\n  box-sizing: border-box;\n  z-index: 2;\n  color: rgba(0, 0, 0, 0.8);\n  border-bottom: 1px solid rgba(0, 0, 0, 0.08);\n  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);\n}\ndistill-header .content {\n  height: 70px;\n  grid-column: page;\n}\ndistill-header a {\n  font-size: 16px;\n  height: 60px;\n  line-height: 60px;\n  text-decoration: none;\n  color: rgba(255, 255, 255, 0.8);\n  padding: 22px 0;\n}\ndistill-header a:hover {\n  color: rgba(255, 255, 255, 1);\n}\ndistill-header svg {\n  width: 24px;\n  position: relative;\n  top: 4px;\n  margin-right: 2px;\n}\n@media(min-width: 1080px) {\n  distill-header {\n    height: 70px;\n  }\n  distill-header a {\n    height: 70px;\n    line-height: 70px;\n    padding: 28px 0;\n  }\n  distill-header .logo {\n  }\n}\ndistill-header svg path {\n  fill: none;\n  stroke: rgba(255, 255, 255, 0.8);\n  stroke-width: 3px;\n}\ndistill-header .logo {\n  font-size: 17px;\n  font-weight: 200;\n}\ndistill-header .nav {\n  float: right;\n  font-weight: 300;\n}\ndistill-header .nav a {\n  font-size: 12px;\n  margin-left: 24px;\n  text-transform: uppercase;\n}\n</style>\n<div class="content">\n  <a href="/" class="logo">\n    ${be}\n    Distill\n  </a>\n  <nav class="nav">\n    <a href="/about/">About</a>\n    <a href="/prize/">Prize</a>\n    <a href="/journal/">Submit</a>\n  </nav>\n</div>\n`,
    xe =
      "\n<style>\n  distill-appendix {\n    contain: layout style;\n  }\n\n  distill-appendix .citation {\n    font-size: 11px;\n    line-height: 15px;\n    border-left: 1px solid rgba(0, 0, 0, 0.1);\n    padding-left: 18px;\n    border: 1px solid rgba(0,0,0,0.1);\n    background: rgba(0, 0, 0, 0.02);\n    padding: 10px 18px;\n    border-radius: 3px;\n    color: rgba(150, 150, 150, 1);\n    overflow: hidden;\n    margin-top: -12px;\n    white-space: pre-wrap;\n    word-wrap: break-word;\n  }\n\n  distill-appendix > * {\n    grid-column: text;\n  }\n</style>\n",
    we = `\n<style>\n\n:host {\n  color: rgba(255, 255, 255, 0.5);\n  font-weight: 300;\n  padding: 2rem 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  background-color: hsl(180, 5%, 15%); /*hsl(200, 60%, 15%);*/\n  text-align: left;\n  contain: content;\n}\n\n.footer-container .logo svg {\n  width: 24px;\n  position: relative;\n  top: 4px;\n  margin-right: 2px;\n}\n\n.footer-container .logo svg path {\n  fill: none;\n  stroke: rgba(255, 255, 255, 0.8);\n  stroke-width: 3px;\n}\n\n.footer-container .logo {\n  font-size: 17px;\n  font-weight: 200;\n  color: rgba(255, 255, 255, 0.8);\n  text-decoration: none;\n  margin-right: 6px;\n}\n\n.footer-container {\n  grid-column: text;\n}\n\n.footer-container .nav {\n  font-size: 0.9em;\n  margin-top: 1.5em;\n}\n\n.footer-container .nav a {\n  color: rgba(255, 255, 255, 0.8);\n  margin-right: 6px;\n  text-decoration: none;\n}\n\n</style>\n\n<div class='footer-container'>\n\n  <a href="/" class="logo">\n    ${be}\n    Distill\n  </a> is dedicated to clear explanations of machine learning\n\n  <div class="nav">\n    <a href="https://distill.pub/about/">About</a>\n    <a href="https://distill.pub/journal/">Submit</a>\n    <a href="https://distill.pub/prize/">Prize</a>\n    <a href="https://distill.pub/archive/">Archive</a>\n    <a href="https://distill.pub/rss.xml">RSS</a>\n    <a href="https://github.com/distillpub">GitHub</a>\n    <a href="https://twitter.com/distillpub">Twitter</a>\n    &nbsp;&nbsp;&nbsp;&nbsp; ISSN 2476-0757\n  </div>\n\n</div>\n\n`,
    ke = new Map([
      ["ExtractFrontmatter", a],
      ["ExtractBibliography", p],
      ["ExtractCitations", w],
    ]),
    Me = new Map([
      ["HTML", k],
      ["makeStyleTag", R],
      ["OptionalComponents", z],
      ["TOC", O],
      ["Byline", S],
      ["Mathematics", A],
      ["Meta", T],
      ["Typeset", q],
      ["Polyfills", I],
      ["CitationList", P],
      ["Reorder", j],
    ]),
    Se = new Map([
      ["DistillHeader", F],
      ["DistillAppendix", U],
      ["DistillFooter", Y],
    ]),
    ze = { extractors: ke, transforms: Me, distillTransforms: Se };
  (e.FrontMatter = ne),
    (e.distillify = G),
    (e.render = V),
    (e.testing = ze),
    (e.usesTemplateV2 = W),
    Object.defineProperty(e, "__esModule", { value: !0 });
});
