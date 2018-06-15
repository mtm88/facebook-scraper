function constructOptions() {
  const recordsCountInputValue = document.getElementById("recordsToPullCount");
  const recordsCountApplyButton = document.getElementById("applyButton");
  recordsCountApplyButton.onmouseover = () => recordsCountApplyButton.style.cursor = "pointer";

  recordsCountApplyButton.addEventListener('click', updateRecordsToPullCount);

  chrome.storage.local.get(['recordsToPullCount'], (results) => {
    if (!Object.keys(results).length) {
      chrome.storage.local.set({ recordsToPullCount: 50 });
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
    return chrome.storage.local.set({
      recordsToPullCount: updatedValue,
    }, () => alert('Settings Updated!'));
  }

  return alert("Incorrect field value");
}
