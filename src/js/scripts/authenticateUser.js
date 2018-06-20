function authenticateUser() {
	scriptHelpers.displayAuthenticatingWindow();
	const xhr = new XMLHttpRequest();
	debugger;
	return chrome.storage.sync.get(["userLogin", "userPassword"], ({ userLogin, userPassword }) => {
		if (!userLogin || !userPassword) {
			const errorMessage = "Please insert your Login & Password in the plugin options";
			alert(errorMessage);
			scriptHelpers.hideAuthenticationWindow();
			throw new Error(errorMessage);
		}

		let url = opts.config.APIconfig.authenticationURL;
		url = url.replace("<userLogin>", userLogin);
		url = url.replace("<userPassword>", userPassword);

		xhr.onreadystatechange = () => updateReqStatus(xhr);
		xhr.open("POST",url, true);
		xhr.send();
	});

	function updateReqStatus({ readyState, status, responseText }) {
		if (readyState === 4 && status === 200) {
			scriptHelpers.hideAuthenticationWindow();
			const { Token } = JSON.parse(responseText);
			return chrome.storage.sync.set({ isAuthed: true, token: Token }, () => chrome.runtime.sendMessage({ action: "injectSelector" }));
		} else if (readyState === 4) {
			scriptHelpers.hideAuthenticationWindow();
			const errorMessage = "Sorry, incorrect login details";
			alert(errorMessage);
			throw new Error(errorMessage);
		}
	}
}

authenticateUser();
