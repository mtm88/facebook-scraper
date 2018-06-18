function constructOptions() {
  const recordsCountInputValue = document.getElementById("recordsToPullCount");
  const optionsApplyButton = document.getElementById("applyButton");
  optionsApplyButton.onmouseover = () => optionsApplyButton.style.cursor = "pointer";

  optionsApplyButton.addEventListener('click', () => {
    return Promise.all([
      updateRecordsToPullCount(),
      updateLoginPassword(),
    ]).then((results) => alert('Settings Updated!'))
      .catch(error => alert(error));
  });

  chrome.storage.local.get(['recordsToPullCount'], (results) => {
    if (!Object.keys(results).length) {
      chrome.storage.local.set({ recordsToPullCount: 50 });
    } else {
      recordsCountInputValue.value = results.recordsToPullCount;
    }
  });

  chrome.storage.sync.get(['userLogin', 'userPassword'], ({ userLogin, userPassword }) => {
    if (userLogin) {
      const userLoginInput = document.getElementById("userLogin");
      userLoginInput.value = userLogin;
    }

    if (userPassword) {
      const userPasswordInput = document.getElementById("userPassword");
      userPasswordInput.value = userPassword;
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
    });
  }

  return Promise.reject("Incorrect field value");
}

function updateLoginPassword() {
  const userInput = document.getElementById("userLogin");
  const userPassword = document.getElementById("userPassword");

  if (userLogin && userLogin.value && userPassword && userPassword.value) {
    return chrome.storage.sync.set({
      userLogin: userInput.value,
      userPassword: userPassword.value,
    });
  } else {
    return Promise.reject("Username or Password are missing");
  }
}
