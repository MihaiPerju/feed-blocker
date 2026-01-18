const TARGETS = [
    { target: '#contents', fullDomain: 'https://www.youtube.com/' },
    { target: '[aria-label="Main Feed"]', fullDomain: 'https://www.linkedin.com/' }
  ];
  
  const style = document.createElement("style");
  
  style.dataset.feedKiller = "true";
  
  let hideTimer = null;
  let currentEnabled = true;
  const TIMER_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  function updateCSS(enabled) {
    const currentDomain = window.location.origin + '/';
    style.textContent = enabled
      ? TARGETS
          .filter(item => item.fullDomain === currentDomain)
          .map(item => `${item.target}{display:none!important;}`)
          .join("\n")
      : "";
  }
  
  function clearHideTimer() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }
  
  function startHideTimer() {
    clearHideTimer();
    
    // Set a timer to hide elements again after 5 minutes
    hideTimer = setTimeout(() => {
      chrome.storage.local.set({ enabled: true });
      hideTimer = null;
    }, TIMER_DURATION);
  }
  
  function handleEnabledChange(enabled, isInitialLoad = false) {
    const previousEnabled = currentEnabled;
    currentEnabled = enabled;
    
    // Update CSS to show/hide elements
    updateCSS(enabled);
    
    // Handle timer logic
    if (!enabled) {
      // Elements are now unhidden
      // Start timer only when user clicks to unhide (transition from hidden to unhidden)
      if (!isInitialLoad && previousEnabled) {
        // User just clicked to unhide, start the 5-minute timer
        startHideTimer();
      }
    } else {
      // Elements are now hidden, clear any existing timer
      clearHideTimer();
    }
  }
  
  chrome.storage.local.get("enabled", ({ enabled = true }) => {
    handleEnabledChange(enabled, true);
  });
  
  chrome.storage.onChanged.addListener(changes => {
    if (changes.enabled) {
      handleEnabledChange(changes.enabled.newValue, false);
    }
  });
  
  document.documentElement.appendChild(style);
  