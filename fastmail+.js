
var colorHash = new ColorHash(),
    cssForLabel = (label) => {
      var color = colorHash.hex(label.toUpperCase());
      if (label[0] == label[0].toLowerCase()) {
        return {
          color: color,
          textDecoration: "underline",
          fontWeight: "bold",
        };
      } else {
        return {
          color: "#fff",
          backgroundColor: color,
          fontWeight: "bold",
        };
      }
    };

var upd = window.upd = function () {

  $(".v-MailboxItem-subject").each(function() {
    if ($(this).find(".fmp-label").length > 0) { return; }

    var subj_line = $(this),
        href = $(this).closest("a.app-listItem-link").attr("href");

    if (href) {
      var id = href.match(/([0-9a-z]+-f[0-9a-z]+)/)[1],
          label = localStorage.getItem("label-for:" + id) || "...",
          el = $("<span class='fmp-label'>" + label + "</span>")
            .prependTo(subj_line)
            .css((label == "..." || label.length == 0) ? {} : cssForLabel(label))
            .toggleClass("empty", label == "...")
            .on("click", function () {
              var newlabel = prompt("New label?", label);
              if (newlabel !== null) {
                localStorage.setItem("label-for:" + id, newlabel);
                el.remove();
                setTimeout(upd, 50);
              }
              return false;
            });
    }
  });

  $("button.app-listItem-pinButton").each(function () {
    if ($(this).find(".fmp-pin-overlay").length > 0) { return; }

    var overlay = $("<span class='fmp-pin-overlay'>").appendTo(this);
  });
};


jQuery(function ($) {

  var style = document.createElement("link");
  style.rel = "stylesheet";
  style.type = "text/css";
  style.href = chrome.extension.getURL("fastmail+.css");
  (document.head || document.documentElement).appendChild(style);

  document.onwheel = upd;
  setInterval(upd, 500);

  $("body").on("click", ".fmp-pin-overlay", function (e) {
    console.log("click pin overlay!");
    e.stopPropagation();
    $(this).parent().click();
    return false;
  });

});
