function constructOptions() {
  const recordsCountInputValue = document.getElementById("recordsToPullCount");
  const recordsCountApplyButton = document.getElementById("applyButton");
  recordsCountApplyButton.onmouseover = () => recordsCountApplyButton.style.cursor = "pointer";

  recordsCountApplyButton.addEventListener('click', updateRecordsToPullCount);

  chrome.storage.sync.get(['recordsToPullCount'], (results) => {
    if (!Object.keys(results).length) {
      chrome.storage.sync.set({ recordsToPullCount: 50 });
    } else {
      recordsCountInputValue.value = results.recordsToPullCount;
    }
  });
}

constructOptions();

function updateRecordsToPullCount() {
  const recordsCountInputValue = document.getElementById("recordsToPullCount");
  const updatedValue = recordsCountInputValue.value;
  const valueIsNumber = !isNaN(updatedValue);

  if (valueIsNumber) {
    return chrome.storage.sync.set({
      recordsToPullCount: updatedValue,
    }, () => alert('Settings Updated!'));
  }

  return alert("Incorrect field value");
}
