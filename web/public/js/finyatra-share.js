// Requires html2canvas to be loaded on the page.
(function () {
  async function copyCanvasToClipboard(canvas) {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Could not create image blob");

    if (!navigator.clipboard || !window.ClipboardItem) {
      // Fallback: download
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "finyatra.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return "download";
    }

    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return "clipboard";
  }

  window.FinYatraShare = {
    async copyElementPng(elementId) {
      const el = document.getElementById(elementId);
      if (!el) throw new Error("Element not found: " + elementId);
      if (!window.html2canvas) throw new Error("html2canvas not loaded");

      // Ensure dropdowns don't overlay captures.
      document.querySelectorAll(".fy-nav-group[open]").forEach((d) => d.removeAttribute("open"));

      const canvas = await window.html2canvas(el, {
        backgroundColor: "#ffffff",
        scale: Math.min(2, window.devicePixelRatio || 1),
        useCORS: true
      });

      return await copyCanvasToClipboard(canvas);
    },

    async copyText(text) {
      const value = String(text ?? "");
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
          return "clipboard";
        }
      } catch (_e) {
        // fall through to legacy path
      }

      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } finally {
        ta.remove();
      }
      return "clipboard";
    }
  };
})();

