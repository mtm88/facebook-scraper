function contentScraper() {
	/* facebook messenger overlay uses the same scrollableArea classes,
  if there's a message awaiting the array will have 1 more element */
	const { userSeesModal, correctModalIndex } = helpers.userSeesPublicPostsModal();
	let parentElement;

	helpers.removeInjection("selectionInjectorDiv");

	if (userSeesModal) {
		parentElement = document.getElementsByClassName("uiScrollableAreaWrap scrollable")[correctModalIndex];
	} else if (helpers.userSeesPublicStories()) {
		parentElement = document.getElementById("browse_result_area");
	} else {
		return alert("Please open Public Posts before proceeding");
	}
	chrome.runtime.sendMessage({ action: "displayProgressWindow" });
	return fetchContentPosts(parentElement, 0, userSeesModal);
}

contentScraper();

function fetchContentPosts(parentElement, scrollCounter = 0, userSeesModal) {
	chrome.storage.local.get(["recordsToPull"], ({ recordsToPull = 50 }) => {
		recordsToPull = 10;
		divsWithPost = parentElement.getElementsByClassName("userContentWrapper") || [];
		const divsWithPostLength = divsWithPost.length;

		// async but we don't need to wait for it to resolve, it only updates the DOM with progress
		chrome.storage.local.set({
			divsWithPost,
			divsWithPostLength: divsWithPostLength > recordsToPull ? recordsToPull : divsWithPostLength,
		});

		if (divsWithPost.length >= recordsToPull) {
			// slice the array if we've pulled more than we require
			if (divsWithPost.length > recordsToPull) {
				divsWithPost = Array.from(divsWithPost).slice(0, recordsToPull);
			}

			const promisesToProcess = Array.from(divsWithPost).map(div => () =>
				fetchPostComments(div).then((postWithContent) => helpers.parsePostWithContent(postWithContent)));

			return promisesToProcess.reduce((div, nextDiv) => div.then(post => nextDiv().then(Array.prototype.concat.bind(post))), Promise.resolve([]));
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

function fetchPostComments(post) {
	try {
		const postFooterElement = post.children[1].children[0].children[3].children[0].children[0].children[0].children[0].children[0].children[0];
		const postCommentsElement = postFooterElement.children[0].children[0].children[0];
		const postHasComments = postCommentsElement.textContent.indexOf("Comment") > -1;

		if (postCommentsElement && postHasComments) {
			postCommentsElement.click();

			return new Promise((resolve) =>
				setTimeout(() =>
					collectComments(post)
						.then((post) => {
							// close the current Comments Block so that we don't slow down DOM
							postCommentsElement.click();

							return resolve(post);
						}), 1000));
		}
		return Promise.resolve(post);
	} catch (error) {
		return Promise.resolve(post);
	}
}

function collectComments(post, collectCounter = 0) {
	return new Promise((resolve) => {
		try {
			if (collectCounter >= 10) {
				return resolve(post);
			}
			const commentsElement = post.getElementsByClassName("UFIList")[0];

			if (commentsElement) {
				const moreCommentsElement = commentsElement.getElementsByClassName("UFIPagerLink")[0];

				// override it every loop in case we will hit the counter limit and resolve with 'post'
				post.userComments = commentsElement.getElementsByClassName("UFICommentContent");

				if (moreCommentsElement) {
					moreCommentsElement.click();

					return setTimeout(() => {
						collectCounter++;
						return resolve(collectComments(post, collectCounter));
					}, 1000);
				}
			}
			return resolve(post);
		} catch (error) {
			return resolve(post);
		}
	});
}
