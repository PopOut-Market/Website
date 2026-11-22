(() => {
  const root = document.documentElement;
  if (!root.dataset.downloadDevice) {
    const ua = navigator.userAgent;
    const mobile = navigator.userAgentData?.mobile || /Android|iPhone|iPod|iPad/i.test(ua)
      || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
    if (mobile) root.dataset.downloadDevice = "mobile";
    else if (/Macintosh|Windows NT|X11|CrOS/.test(ua)) root.dataset.downloadDevice = "desktop";
  }
  const menu = document.querySelector(".dl-languages");
  if (!menu) return;
  document.addEventListener("pointerdown", (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener("keydown", (event) => {
    if (menu.open && event.key === "Escape") {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });
})();
