/*
  Language for the WalletMon site. Every page carries both Turkish and English;
  the inline script in <head> picks one before first paint (?lang=, then the
  visitor's last choice, then the browser language), and this file wires the
  TR/EN switch and keeps internal links in the chosen language.

  The app opens these pages with ?lang=tr or ?lang=en, so they match the
  language the app is in.
*/
(function () {
  var root = document.documentElement;

  function rememberChoice(lang) {
    try { localStorage.setItem("lang", lang); } catch (e) { /* private mode */ }
  }

  function updateInternalLinks(lang) {
    var links = document.querySelectorAll('a[href^="/"]');
    for (var i = 0; i < links.length; i++) {
      try {
        var url = new URL(links[i].getAttribute("href"), location.origin);
        url.searchParams.set("lang", lang);
        links[i].setAttribute("href", url.pathname + url.search + url.hash);
      } catch (e) { /* leave the link as written */ }
    }
  }

  function apply(lang) {
    root.setAttribute("data-lang", lang);
    root.lang = lang;
    var title = root.getAttribute("data-title-" + lang);
    if (title) { document.title = title; }
    var buttons = document.querySelectorAll(".lang-switch button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-pressed", String(buttons[i].getAttribute("data-set-lang") === lang));
    }
    updateInternalLinks(lang);
  }

  function choose(lang) {
    apply(lang);
    rememberChoice(lang);
    try {
      var url = new URL(location.href);
      url.searchParams.set("lang", lang);
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (e) { /* the page still switched */ }
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest ? event.target.closest("[data-set-lang]") : null;
    if (!button) { return; }
    choose(button.getAttribute("data-set-lang"));
  });

  apply(root.getAttribute("data-lang") === "tr" ? "tr" : "en");

  var year = document.querySelectorAll("[data-year]");
  for (var y = 0; y < year.length; y++) { year[y].textContent = String(new Date().getFullYear()); }
})();
