var codeBlocks = document.querySelectorAll("pre");
codeBlocks.forEach(function (e) {
  if (
    (e.querySelector("pre:not(.lineno)") || e.querySelector("code")) &&
    e.querySelector("code:not(.language-chartjs)") &&
    e.querySelector("code:not(.language-diff2html)") &&
    e.querySelector("code:not(.language-echarts)") &&
    e.querySelector("code:not(.language-geojson)") &&
    e.querySelector("code:not(.language-mermaid)") &&
    e.querySelector("code:not(.language-vega_lite)")
  ) {
    var o = document.createElement("button");
    (o.className = "copy"),
      (o.type = "button"),
      (o.ariaLabel = "Copy code to clipboard"),
      (o.innerText = "Copy"),
      (o.innerHTML = '<i class="fa-solid fa-clipboard"></i>'),
      o.addEventListener("click", function () {
        if (e.querySelector("pre:not(.lineno)"))
          var r = e.querySelector("pre:not(.lineno)").innerText.trim();
        else r = e.querySelector("code").innerText.trim();
        window.navigator.clipboard.writeText(r),
          (o.innerText = "Copied"),
          (o.innerHTML = '<i class="fa-solid fa-clipboard-check"></i>'),
          setTimeout(function () {
            (o.innerText = "Copy"),
              (o.innerHTML = '<i class="fa-solid fa-clipboard"></i>');
          }, 3e3);
      });
    var r = document.createElement("div");
    (r.className = "code-display-wrapper"),
      e.parentElement.insertBefore(r, e),
      r.append(e),
      r.append(o);
  }
});
