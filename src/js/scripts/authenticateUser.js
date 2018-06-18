(() => {
	displayAuthenticatingWindow();

	const xhr = new XMLHttpRequest();

	return chrome.storage.sync.get(["userLogin", "userPassword"], ({ userLogin, userPassword }) => {
		if (!userLogin || !userPassword) {
			const errorMessage = "Please insert your Login & Password in the plugin options";
			alert(errorMessage);
			throw new Error(errorMessage);
		}

		xhr.onreadystatechange = () => updateReqStatus(xhr);
		xhr.open("POST", `http://soc2.app.ondemand.crisp/service.svc/json/session/netmodlogin?username=${userLogin}&password=${userPassword}`, true);
		xhr.send();
	});

	function updateReqStatus({ readyState, status, responseText }) {
		if (readyState === 4 && status === 200) {
			const { Token } = JSON.parse(responseText);
			hideAuthenticationWindow();
			return chrome.storage.sync.set({ isAuthed: true, token: Token }, () => chrome.runtime.sendMessage({ action: "injectSelector" }));
		} else if (readyState === 4) {
			const errorMessage = "Sorry, incorrect login details";
			alert(errorMessage);
			throw new Error(errorMessage);
		}
	}

	function displayAuthenticatingWindow() {
		const currentElementBodyWidth = document.body.clientWidth;
		const calculatedDivWidth = currentElementBodyWidth * 0.3;
		const calculatedDivLeft = (currentElementBodyWidth / 2) - (calculatedDivWidth / 2);

		const div = document.createElement("div");
		div.id = "authenticatingWindowDiv";
		div.style.cssText = `display: flex; flex-direction: column; width: ${calculatedDivWidth}px; position: fixed; top: 100px; left: ${calculatedDivLeft}px; z-index: 1000; background-color: #ffffff; border: 1px solid rgb(0, 0, 0, 0.25)`;
		document.body.appendChild(div);

		const closeDiv = document.createElement("div");
		closeDiv.id = "closeButtonDiv";
		closeDiv.style.cssText = "position: absolute; top: 0; right: 0; padding: 8px 10px; font-size: 15px;";
		closeDiv.textContent = "X";
		div.appendChild(closeDiv);

		closeDiv.onmouseover = () => closeDiv.style.cursor = "pointer";
		closeDiv.onclick = () => chrome.runtime.sendMessage({ action: "removeInjection", payload: { id: "authenticatingWindowDiv" } });

		const authMessage = document.createElement("p");
		authMessage.textContent = "Authenticating with the server...";
		authMessage.style.cssText = "padding: 10px 20px; font-weight: 600; font-size: 12px;";
		div.appendChild(authMessage);
	}

	function hideAuthenticationWindow() {
		chrome.runtime.sendMessage({ action: "removeInjection", payload: { id: "authenticatingWindowDiv" } });
	}
})();
