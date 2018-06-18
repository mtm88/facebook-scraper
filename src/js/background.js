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

chrome.runtime.onMessage.addListener(function ({ action, payload }, sender, sendResponse) {
  switch (action) {
    case "removeInjection": {
      return chrome.storage.local.set({ injectionToRemove: payload ? payload.id : null }, () => {
        return executeScript("removeInjection");
      });
    }
    case "userSelectedPage": {
      return chrome.storage.local.set({ selectedPageId: payload.id, injectionToRemove: payload.divId }, () => {
        executeScript("removeInjection");
        executeScript("progressWindow");
        return executeScript("contentScraper");
      });
    }
    default: break;
  }
}
);

function executeScript(fileName) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length) {
      chrome.tabs.executeScript(tabs[0].id, { file: `./src/js/scripts/${fileName}.js` });
    }
  });
}
