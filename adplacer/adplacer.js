(function () {
  const containerId = "gantaAdContainer";

  async function loadHTMLAds() {
    try {
      const res = await fetch("https://gantansolutions.com/adplacer/ads.html");
      const html = await res.text();
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = html;
      } else {
        console.warn("Ad container not found: #" + containerId);
      }
    } catch (e) {
      console.error("Failed to load ads.html", e);
    }
  }

  document.addEventListener("DOMContentLoaded", loadHTMLAds);
})();
