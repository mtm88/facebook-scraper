function publishPosts() {
	return chrome.storage.local.get(["parsedPosts", "pages", "selectedPageId"], ({ parsedPosts, pages, selectedPageId }) => {
		if (parsedPosts && parsedPosts.length) {
			const selectedPageDetails = pages.find(({ settings: { pageId } }) => pageId === selectedPageId);

			const postModels = parsedPosts.map(post => instanciatePostModel(post, selectedPageDetails));

			const mappedModelRequests = postModels.map(model => () => sendPostRequest(model));

			const results = mappedModelRequests.reduce((promise, modelReq) => promise.then(result => modelReq().then(Array.prototype.concat.bind(result))), Promise.resolve([]));
			debugger;
		} else {
			return alert("Sorry, it seems there's no Public Posts to publish!");
		}
	});
}

function sendPostRequest(model) {
	return new Promise((resolve) => {
		debugger;
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => updateReqStatus(xhr, resolve);
		xhr.open("POST", opts.config.APIconfig.publishURL, true);
		xhr.setRequestHeader("Authorization", `Token ${opts.token}`);
		xhr.setRequestHeader("Content-Type", "application/json");
		return xhr.send(model);
	});
}

function updateReqStatus({ readyState, status, responseText }, resolve) {
	if (readyState === 4 && status === 200) {
		debugger;
		const response = JSON.parse(responseText);
		return resolve();
	} else if (readyState === 4) {
		const errorMessage = "Sorry, something went wrong while publishing the content";
		alert(errorMessage);
		throw new Error(errorMessage);
	}
}

function instanciatePostModel(post, selectedPageDetails) {
	const postModel = new PostModel(post, selectedPageDetails);
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

class PostModel {
	constructor(post, selectedPageDetails) {
		this.post = post;
		this.selectedPageDetails = selectedPageDetails;
		this.parsedPost = {
			fields: [],
		};
	}

	parsePostForPublish() {
		this.parsedPost = {
			...this.parsedPost,
			ApiKey: this.selectedPageDetails.settings.collectionTokens[0],
			contentID: this.post.contentId,
			contentType: this.selectedPageDetails.settings.collectorName,
			Author: this.post.author || "Unknown",
		};
	}

	addField(fieldName, content, index, type, filtered) {
		this.parsedPost.fields = [
			...this.parsedPost.fields,
			{
				fieldname: fieldName,
				content,
				index,
				type,
				filtered,
			},
		];
	}
}

publishPosts();
