function publishPosts() {
	return chrome.storage.local.get(["parsedPosts"], ({ parsedPosts }) => {
		if (parsedPosts && JSON.parse(parsedPosts).length) {
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = () => updateReqStatus(xhr);
			xhr.open("POST", config.APIconfig.publishURL, true);
			// xhr.setRequestHeader("Authorization", `Token ${token}`);
			xhr.setRequestHeader("Content-Type", "application/json");

			// xhr.send({
			// 	ApiKey: 123,
			// 	ContentType: "content type",
			// 	ContentId: 123,
			// 	Author: "author",
			// 	Text: "Text",
			// });
		} else {
			return alert("Sorry, it seems there's no Public Posts to publish!");
		}
	});
}

function updateReqStatus({ readyState, status, responseText }) {
	if (readyState === 4 && status === 200) {
		const response = JSON.parse(responseText);
		// return chrome.storage.sync.set({ isAuthed: true, token: Token }, () => chrome.runtime.sendMessage({ action: "injectSelector" }));
	} else if (readyState === 4) {
		const errorMessage = "Sorry, something went wrong while publishing the content";
		alert(errorMessage);
		throw new Error(errorMessage);
	}
}


publishPosts();
