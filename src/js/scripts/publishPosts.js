
function publishPosts() {
	return chrome.storage.local.get(["parsedPosts", "pages", "selectedPageId"], ({ parsedPosts, pages, selectedPageId }) => {

		if (parsedPosts && parsedPosts.length) {
			const selectedPageDetails = pages.find(({ settings: { pageId } }) => pageId === selectedPageId);
			const dataModels = parsedPosts.map(post => instanciateModels(post, selectedPageDetails));
			const mappedModelRequests = [];
			
			dataModels.forEach(({ parsedPostModel, parsedCommentModels = [] }) => {
				mappedModelRequests.push(() => sendPostRequest(parsedPostModel));
				parsedCommentModels.forEach((parsedCommentModel) => mappedModelRequests.push(() => sendPostRequest(parsedCommentModel)));
			});

			helpers.removeInjection("submitButton");

			const pStyle = "padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-weight: 500";
			const sendingRequestsP = document.createElement("p");
			sendingRequestsP.id = "sendingRequestsP";
			sendingRequestsP.textContent = "Sending data...";
			sendingRequestsP.style.cssText = pStyle;
			const sentRequestsP = document.createElement("p");
			sentRequestsP.id = "sentRequestsP";
			sentRequestsP.textContent = 0;
			sentRequestsP.style.cssText = pStyle;
			headerWrapperDiv.appendChild(sendingRequestsP);
			headerWrapperDiv.appendChild(sentRequestsP);

			mappedModelRequests.reduce((promise, modelPostRequest) => promise.then(result => modelPostRequest().then(Array.prototype.concat.bind(result))), Promise.resolve([]))
				.then((/* responses */) => {
					helpers.removeInjection("sendingRequestsP");
					sentRequestsP.style.fontWeight = 600;
					sentRequestsP.textContent = "All posts have been successfully published";
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

		const sentRequestsP = document.getElementById("sentRequestsP");
		sentRequestsP.textContent = parseInt(sentRequestsP.textContent, 10) + 1;

		return resolve(parsedResponse);
	} else if (readyState === 4) {
		const errorMessage = "Sorry, something went wrong while publishing the content";
		alert(errorMessage);
		throw new Error(errorMessage);
	}
}

function instanciateModels(post, selectedPageDetails) {
	const parsedPostModel = parsePostModel(post, selectedPageDetails);
	const parsedCommentModels = post.commentsContent ? parseCommentModels(post, selectedPageDetails) : [];

	return { parsedPostModel, parsedCommentModels };
}

function parsePostModel(post, selectedPageDetails) {
	const postModel = new helpers.DataModel(post, selectedPageDetails);
	postModel.parseDataForPublish();

	const textType = "text/plain";
	postModel.addField("Title", post.title, 0, textType);
	postModel.addField("Author", post.author, 1, textType);
	postModel.addField("TimeAdded", post.timeAdded, 2, textType);
	postModel.addField("Link", post.link, 3, textType);
	postModel.addField("Comments", post.comments, 4, textType);
	postModel.addField("Shares", post.shares, 5, textType);
	postModel.addField("Reactions", post.reactions, 6, textType);

	return JSON.stringify(postModel.parsedData);
}

function parseCommentModels({ commentsContent = [] }, selectedPageDetails) {
	return commentsContent.map((comment) => {
		const commentModel = new helpers.DataModel(comment, selectedPageDetails);
		commentModel.parseDataForPublish();

		const textType = "text/plain";
		commentModel.addField("Author", comment.author, 0, textType);
		commentModel.addField("Link", comment.link, 1, textType);
		commentModel.addField("Comment", comment.commentBody, 2, textType);

		return JSON.stringify(commentModel.parsedData);
	});
}

publishPosts();
