chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ enabled: true });
  });
  
  chrome.action.onClicked.addListener(() => {
    chrome.storage.local.get("enabled", ({ enabled }) => {
      chrome.storage.local.set({ enabled: !enabled });
    });
  });
  