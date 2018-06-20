function loadPages() {
	const xhr = new XMLHttpRequest();

	return chrome.storage.sync.get(["isAuthed", "token"], ({ isAuthed, token }) => {
		if (!isAuthed || !token) {
			// doubled security to ensure user went through authentication before trying to pull pages
			chrome.runtime.sendMessage({ action: "injectSelector" });
		}

		xhr.onreadystatechange = () => updateReqStatus(xhr);
		xhr.open("GET", config.APIconfig.pagesURL, true);
		xhr.setRequestHeader("Authorization", `Token ${token}`);
		xhr.send();
	});

	function updateReqStatus({ readyState, status, responseText }) {
		if (readyState === 4 && status === 200) {
			let pages = JSON.parse(responseText);

			// temporary mock - waiting for channel to fill up
			if (pages && !pages.length) {
				pages = mockedCollectPages();
			}

			return chrome.storage.sync.set({ pages }, () => chrome.runtime.sendMessage({ action: "injectSelector" }));
		} else if (readyState === 4) {
			const errorMessage = "Sorry, failed to fetch Pages. Please try again";
			alert(errorMessage);
			throw new Error(errorMessage);
		}
	}

	function mockedCollectPages() {
		const mockedResultsCount = 10;
		let mockedArray = [];

		for (let i = 0; i <= mockedResultsCount; i += 1) {
			mockedArray.push({ id: i, label: `Page ${i}` });
		}

		return mockedArray;
	}
}

loadPages();
