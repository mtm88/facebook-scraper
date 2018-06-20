function contentScraper() {
	/* facebook messenger overlay uses the same scrollableArea classes,
  if there's a message awaiting the array will have 1 more element */
	const { userSeesModal, correctModalIndex } = helpers.userSeesPublicPostsModal();
	let parentElement;

	chrome.runtime.sendMessage({ action: "displayProgressWindow" });

	if (userSeesModal) {
		parentElement = document.getElementsByClassName("uiScrollableAreaWrap scrollable")[correctModalIndex];
	} else if (helpers.userSeesPublicStories()) {
		parentElement = document.getElementById("browse_result_area");
	} else {
		return alert("Please open Public Posts before proceeding");
	}
	return fetchContentPosts(parentElement, 0, userSeesModal);
}

contentScraper();

function fetchContentPosts(parentElement, scrollCounter = 0, userSeesModal) {
	divsWithPost = parentElement.getElementsByClassName("userContentWrapper") || [];
	chrome.storage.local.set({ divsWithPost, divsWithPostLength: divsWithPost.length });

	chrome.storage.local.get(["recordsToPull"], ({ recordsToPull = 50 }) => {
		if (divsWithPost.length >= recordsToPull) {
			// slice the array if we've pulled more than we require
			if (divsWithPost.length > recordsToPull) {
				divsWithPost = Array.from(divsWithPost).slice(0, recordsToPull);
			}

			return helpers.parseContentPosts(divsWithPost);
		}

		if (scrollCounter > 10) {
			return alert("There seems to be a problem with fetching the requested number of posts. Please try again.");
		}

		scrollDown(parentElement, scrollCounter, userSeesModal);
	});
}

function scrollDown(parentElement, scrollCounter, userSeesModal) {
	if (userSeesModal) {
		parentElement.scrollTop = parentElement.scrollHeight;
	} else {
		window.scrollTo({ top: parentElement.scrollHeight });
	}

	setTimeout(() => {
		scrollCounter++;
		fetchContentPosts(parentElement, scrollCounter, userSeesModal);
	}, 3000);
}
