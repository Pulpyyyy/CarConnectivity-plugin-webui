// Light/dark theme switcher for the CarConnectivity web UI.
// Plain browser JavaScript: no imports, no build step, classic <script src>.
// Uses the native Bootstrap 5.3 color modes (data-bs-theme on <html>).
// Choice is one of "light", "dark", "auto" (auto follows the OS preference)
// and is persisted in localStorage under "cc-theme". An inline head script
// applies the stored choice before paint; this module wires the switcher and
// keeps "auto" in sync with live OS preference changes.

(function () {
  var KEY = "cc-theme";

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function systemPrefersDark() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  function resolve(choice) {
    if (choice === "light" || choice === "dark") { return choice; }
    return systemPrefersDark() ? "dark" : "light";
  }

  function apply(choice) {
    document.documentElement.setAttribute("data-bs-theme", resolve(choice));
  }

  function reflect(choice) {
    var items = document.querySelectorAll("[data-cc-theme]");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle("active", items[i].getAttribute("data-cc-theme") === choice);
    }
  }

  window.ccTheme = {
    get: function () { return stored() || "auto"; },
    set: function (choice) {
      try { localStorage.setItem(KEY, choice); } catch (e) {}
      apply(choice);
      reflect(choice);
    },
    apply: apply
  };

  // Keep "auto" following the OS preference while the page is open.
  if (window.matchMedia) {
    try {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if ((stored() || "auto") === "auto") { apply("auto"); }
      });
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    var choice = stored() || "auto";
    apply(choice);
    reflect(choice);
    var items = document.querySelectorAll("[data-cc-theme]");
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener("click", function (ev) {
        ev.preventDefault();
        window.ccTheme.set(this.getAttribute("data-cc-theme"));
      });
    }
  });
})();
