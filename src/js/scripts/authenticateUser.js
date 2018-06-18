(() => {
  const xhr = new XMLHttpRequest();

  return chrome.storage.sync.get(['userLogin', 'userPassword'], ({ userLogin, userPassword }) => {
    if (!userLogin || !userPassword) {
      const errorMessage = "Please insert your Login & Password in the plugin options";
      alert(errorMessage)
      throw new Error(errorMessage);
    }

    xhr.onreadystatechange = () => updateReqStatus(xhr);
    xhr.open("POST", `http://soc2.app.ondemand.crisp/service.svc/json/session/netmodlogin?username=${userLogin}&password=${userPassword}`, true);
    xhr.send();
  });

  function updateReqStatus({ readyState, status, responseText }) {
    if (readyState === 4 && status === 200) {
      const { Token } = JSON.parse(responseText);
      return chrome.storage.sync.set({ isAuthed: true, token: Token }, () => chrome.runtime.sendMessage({ action: "injectSelector" }));
    } else if (readyState === 4) {
      const errorMessage = "Sorry, incorrect login details";
      alert(errorMessage);
      throw new Error(errorMessage);
    }
  }
})();
