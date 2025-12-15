const TARGETS = [
    { target: '#contents', fullDomain: 'https://www.youtube.com/' },
    { target: '[aria-label="Main Feed"]', fullDomain: 'https://www.linkedin.com/' }
  ];
  
  const style = document.createElement("style");
  
  style.dataset.feedKiller = "true";
  
  function updateCSS(enabled) {
    const currentDomain = window.location.origin + '/';
    style.textContent = enabled
      ? TARGETS
          .filter(item => item.fullDomain === currentDomain)
          .map(item => `${item.target}{display:none!important;}`)
          .join("\n")
      : "";
  }
  
  chrome.storage.local.get("enabled", ({ enabled = true }) => {
    updateCSS(enabled);
  });
  
  chrome.storage.onChanged.addListener(changes => {
    if (changes.enabled) {
      updateCSS(changes.enabled.newValue);
    }
  });
  
  document.documentElement.appendChild(style);
  