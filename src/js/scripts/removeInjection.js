(() => {
  chrome.storage.local.get(["injectionToRemove"], (results) => {
    if (results.injectionToRemove) {
      const injectedElement = document.getElementById(results.injectionToRemove);

      if (injectedElement) {
        injectedElement.outerHTML = "";
      }
    }

    chrome.storage.local.set({
      injectionToRemove: null,
    });
  });
})();
