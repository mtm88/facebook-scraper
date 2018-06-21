function parseContentPosts(divsWithPost) {
	const fieldsToMap = ["title", "author", "timeAdded", "link", "contentId", "comments", "shares", "reactions", "commentsContent"];
	const searchURL = this.parsedSearchURL(opts);

	const fieldParsers = {
		header: ({ post }) => {
			const headerElement = post.children[0].children[1];

			let headerContentIndex;
			// post has a LIKE PAGE button = additional child on top
			if (headerElement.children[0].nodeName === "SPAN") {
				headerContentIndex = 1;
			} else {
				// post hasn't got a LIKE PAGE button
				headerContentIndex = 0;
			}
			return post.children[0].children[1].children[headerContentIndex].children[0].children[1].children[1].children[0].children[0].children[1];
		},
		footer: ({ post }) => post.children[1].children[0].children[3].children[0].children[0].children[0].children[0].children[0].children[0],
		title: ({ post }) => post.children[0].children[1].children[2].children[0].textContent,
		author: ({ header }) => header.children[0].children[0].children[0].children[0].textContent,
		timeAdded: ({ header }) => header.children[1].children[2].children[0].children[0].children[0].getAttribute("title"),
		link: ({ post }) => post.children[0].children[1].children[3].children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[1].getAttribute("href"),
		contentId: ({ post }) => post.children[1].children[0].children[1].getAttribute("value"),
		comments: ({ footer }) => {
			const parsedComments = parseInt(footer.children[0].children[0].children[0].textContent.replace(/\D+/g, ""), 10);
			return isNaN(parsedComments) ? null : parsedComments;
		},
		commentsContent: ({ post }) => {
			const userComments = Array.from(post.userComments);

			return userComments.map((comment) => {
				const commentBody = comment.getElementsByClassName("UFICommentBody")[0];

				return commentBody && commentBody.textContent || null;
			}).filter(Boolean);
		},
		shares: ({ footer }) => {
			const parsedShares = parseInt(footer.children[0].children[1].children[0].textContent.replace(/\D+/g, ""), 10);
			return isNaN(parsedShares) ? null : parsedShares;
		},
		reactions: ({ footer }) => {
			const parsedReactions = parseInt(footer.children[1].children[0].children[0].children[1].children[0].children[0].textContent, 10);
			return isNaN(parsedReactions) ? null : parsedReactions;
		},
	};

	const parsedPosts = Array.from(divsWithPost).map((post) => {
		const parsedPost = { searchURL };

		fieldsToMap.forEach((field) => {
			const header = fieldParsers.header({ post });
			const footer = fieldParsers.footer({ post });

			try {
				parsedPost[field] = fieldParsers[field]({ post, header, footer });
			} catch (error) {
				parsedPost[field] = null;
			}
		});

		return parsedPost;
	});

	// observer in the background.js will pick this up and proceed
	chrome.storage.local.set({ parsedPosts: JSON.stringify(parsedPosts) });
	return parsedPosts;
}

function parsedSearchURL(opts) {
	if (opts && opts.currentURL) {
		return opts.currentURL.slice(0, opts.currentURL.indexOf("?"));
	}
	return null;
}

function userSeesPublicStories() {
	if (opts && opts.currentURL) {
		const definedUrlElements = ["search/str", "stories-keyword", "stories-public"];

		const userOnPublicStories = (definedUrlElements.filter(el => opts.currentURL.indexOf(el) > -1)).length === definedUrlElements.length;
		return userOnPublicStories;
	}
	return false;
}

function userSeesPublicPostsModal() {
	const scrollableArea = document.getElementsByClassName("uiScrollableAreaWrap scrollable");
	const userSeesModal = !!scrollableArea.length;
	const correctModalIndex = scrollableArea.length > 1 ? 1 : 0;

	return { userSeesModal, correctModalIndex: userSeesModal ? correctModalIndex : false };
}

export {
	parseContentPosts,
	parsedSearchURL,
	userSeesPublicStories,
	userSeesPublicPostsModal,
};
