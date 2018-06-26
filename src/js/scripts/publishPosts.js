
function publishPosts() {
	return chrome.storage.local.get(["parsedPosts", "pages", "selectedPageId"], ({ parsedPosts, pages, selectedPageId }) => {

		if (parsedPosts && parsedPosts.length) {
			const selectedPageDetails = pages.find(({ settings: { pageId } }) => pageId === selectedPageId);
			const postModels = parsedPosts.map(post => instanciatePostModel(post, selectedPageDetails));
			const mappedModelRequests = postModels.map(model => () => sendPostRequest(model));

			helpers.removeInjection("submitButton");

			const sendingRequestsParagraph = document.createElement("p");
			sendingRequestsParagraph.id = "sentRequestsP";
			sendingRequestsParagraph.textContent = "Publishing posts...";
			sendingRequestsParagraph.style.cssText = "padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-weight: 500";
			headerWrapperDiv.appendChild(sendingRequestsParagraph);
		
			mappedModelRequests.reduce((promise, modelPostRequest) => promise.then(result => modelPostRequest().then(Array.prototype.concat.bind(result))), Promise.resolve([]))
				.then((/* responses */) => {
					sendingRequestsParagraph.textContent = "All posts have been successfully published";
				});
		} else {
			return alert("Sorry, it seems there's no Public Posts to publish!");
		}
	});
}

function sendPostRequest(model) {
	return new Promise((resolve) => {
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => updateReqStatus(xhr, resolve);
		xhr.open("POST", opts.config.APIconfig.publishURL);
		// xhr.setRequestHeader("Authorization", `Token ${opts.token}`);
		xhr.setRequestHeader("Content-Type", "application/json");
		return xhr.send(model);
	});
}

function updateReqStatus({ readyState, status, responseText }, resolve) {
	if (readyState === 4 && status === 200) {
		const parsedResponse = JSON.parse(responseText);
		return resolve(parsedResponse);
	} else if (readyState === 4) {
		const errorMessage = "Sorry, something went wrong while publishing the content";
		alert(errorMessage);
		throw new Error(errorMessage);
	}
}

function instanciatePostModel(post, selectedPageDetails) {
	const postModel = new helpers.PostModel(post, selectedPageDetails);
	postModel.parsePostForPublish();

	const textType = "text/plain";
	postModel.addField("Title", post.title, 0, textType);
	postModel.addField("Author", post.author, 1, textType);
	postModel.addField("TimeAdded", post.timeAdded, 2, textType);
	postModel.addField("Link", post.link, 3, textType);
	postModel.addField("Comments", post.comments, 4, textType);
	postModel.addField("Shares", post.shares, 5, textType);
	postModel.addField("Reactions", post.reactions, 6, textType);

	return JSON.stringify(postModel.parsedPost);
}

publishPosts();
