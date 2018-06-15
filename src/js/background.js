chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostContains: 'facebook.com' },
      })
      ],
      actions: [
        new chrome.declarativeContent.ShowPageAction(),
      ]
    }]);
  });
});

chrome.runtime.onMessage.addListener(
  ({ action, payload }, sender, sendResponse) => {
    switch (action) {
      case "closeSelector": {
        return closeSelector();
      }
      case "removeInjection": {
        return chrome.storage.local.set({ injectionToRemove: payload ? payload.id : null }, () => {
          return removeInjection();
        });
      }
      case "userSelectedPage": {
        return chrome.storage.local.set({ selectedPageId: payload.id, injectionToRemove: payload.divId }, () => {
          removeInjection();
          injectProgressWindow();
          return startScraper();
        });
      }
      default: break;
    }
  }
);

// Tab is selected more than once, extract it?
function removeInjection() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs.length) {
      chrome.tabs.executeScript(tabs[0].id, { file: "./src/js/scripts/removeInjection.js" });
    }
  });
}

function startScraper() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs.length) {
      chrome.tabs.executeScript(tabs[0].id, { file: "./src/js/scripts/contentScraper.js" });
    }
  });
}

function injectProgressWindow() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs.length) {
      chrome.tabs.executeScript(tabs[0].id, { file: "./src/js/scripts/progressWindow.js" });
    }
  });
}
