$(document).ready(function () {
  var r = $(".grid").masonry({
    gutter: 10,
    horizontalOrder: !0,
    itemSelector: ".grid-item",
  });
  r.imagesLoaded().progress(function () {
    r.masonry("layout");
  });
});
