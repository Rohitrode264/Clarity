chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "get_url") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentURL = tabs[0]?.url || "No active tab";
      sendResponse({ url: currentURL });
    });
    return true; // Keeps the message channel open for async response
  }
});
