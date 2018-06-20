function contentScraper() {
	const scrollableArea = document.getElementsByClassName("uiScrollableAreaWrap scrollable");
	const userSeesModal = !!scrollableArea.length;

	/* facebook messenger overlay uses the same scrollableArea classes,
  if there's a message awaiting the array will have 1 more element */
	const correctModalIndex = scrollableArea.length > 1 ? 1 : 0;

	if (userSeesModal) {
		chrome.runtime.sendMessage({ action: "displayProgressWindow" });
		return fetchContentPosts(userSeesModal, 0, correctModalIndex);
	} else {
		return alert("Please open Public Posts before proceeding");
	}
}

contentScraper();

function fetchContentPosts(userSeesModal, scrollCounter = 0, correctModalIndex) {
	const scrollableArea = document.getElementsByClassName("uiScrollableAreaWrap scrollable");
	divsWithPost = scrollableArea[correctModalIndex].getElementsByClassName("userContentWrapper") || [];

	chrome.storage.local.set({ divsWithPost, divsWithPostLength: divsWithPost.length });

	chrome.storage.local.get(["recordsToPullCount"], (results) => {
		if (divsWithPost.length >= results.recordsToPullCount) {
			// slice the array if we've pulled more than we require
			if (divsWithPost.length > results.recordsToPullCount) {
				divsWithPost = Array.from(divsWithPost).slice(0, results.recordsToPullCount);
			}

			return helpers.parseContentPosts(divsWithPost);
		}

		if (scrollCounter > 10) {
			return alert("There seems to be a problem with fetching the requested number of posts. Please try again.");
		}

		scrollDown(userSeesModal, scrollableArea, scrollCounter, correctModalIndex);
	});
}

function scrollDown(userSeesModal, scrollableArea, scrollCounter, correctModalIndex) {
	if (userSeesModal) {
		scrollableArea[correctModalIndex].scrollTop = scrollableArea[correctModalIndex].scrollHeight;

		setTimeout(() => {
			scrollCounter++;
			fetchContentPosts(userSeesModal, scrollCounter, correctModalIndex);
		}, 3000);
	}
}
