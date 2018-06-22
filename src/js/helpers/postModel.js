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
			ApiKey: "794467c0-5ca5-437a-acec-93838c4b352b",
			// ApiKey: this.selectedPageDetails.settings.collectionTokens[0],
			contentID: this.post.contentId,
			contentType: this.selectedPageDetails.settings.collectorName,
			Author: this.post.author || "Unknown",
		};
	}

	addField(fieldName, content, index, type, filtered) {
		if (content) {
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
}

export { PostModel };
