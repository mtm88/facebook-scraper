const startCollectionButton = document.getElementById('startCollectionButton');

startCollectionButton.onclick = function (element) {
  let color = element.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs.length) {
      chrome.runtime.sendMessage({ action: "injectSelector" });
    }
  });
};
