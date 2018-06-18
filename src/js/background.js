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
        return scriptRunner("removeInjection");
      });
    }
    case "userSelectedPage": {
      return chrome.storage.local.set({ selectedPageId: payload.id, injectionToRemove: payload.divId }, () => {
        scriptRunner("removeInjection");
        scriptRunner("progressWindow");
        return scriptRunner("contentScraper");
      });
    }
    default: break;
  }
}
);

function scriptRunner(fileName, opts = {}) {
  return chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length) {
      const { url, id } = tabs[0];

      return chrome.tabs.executeScript(id, {
        code: `opts = ${JSON.stringify({
          currentURL: url,
        })}`,
      }, () => chrome.tabs.executeScript(id, { file: `./src/js/scripts/${fileName}.js` }));
    }
    return alert("Sorry, it looks like you have no tabs opened in your browser! :-(");
  });
}
