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
        closeSelector();
      }
      case "userSelectedPage": {
        chrome.storage.sync.set({ selectedPageId: payload.id }, () => {
          startScraper();
        });
        // closeSelector();
      }
    }
  }
);

// Tab is selected more than once, extract it?
function closeSelector() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs.length) {
      chrome.tabs.executeScript(tabs[0].id, { file: "./src/js/scripts/closeSelector.js" });
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
