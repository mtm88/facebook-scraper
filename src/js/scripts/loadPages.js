function loadPages() {
	const xhr = new XMLHttpRequest();

	return chrome.storage.sync.get(["isAuthed", "token"], ({ isAuthed, token }) => {
		if (!isAuthed || !token) {
			// doubled security to ensure user went through authentication before trying to pull pages
			return chrome.runtime.sendMessage({ action: "injectSelector" });
		}

		xhr.onreadystatechange = () => updateReqStatus(xhr);
		xhr.open("GET", opts.config.APIconfig.pagesURL, true);
		xhr.setRequestHeader("Authorization", `Token ${token}`);
		return xhr.send();
	});

	function updateReqStatus({ readyState, status, responseText }) {
		if (readyState === 4 && status === 200) {
			let pages = JSON.parse(responseText);

			return chrome.storage.local.set({ pages }, () => chrome.runtime.sendMessage({ action: "injectSelector" }));
		} else if (readyState === 4) {
			const errorMessage = "Sorry, failed to fetch Pages. Please try again";
			alert(errorMessage);
			throw new Error(errorMessage);
		}
	}
}

loadPages();
