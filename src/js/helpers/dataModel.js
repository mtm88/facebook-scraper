class DataModel {
	constructor(post, selectedPageDetails) {
		this.data = post;
		this.selectedPageDetails = selectedPageDetails;
		this.parsedData = {
			fields: [],
		};
	}

	parseDataForPublish() {
		this.parsedData = {
			...this.parsedData,
			ApiKey: "794467c0-5ca5-437a-acec-93838c4b352b",
			// ApiKey: this.selectedPageDetails.settings.collectionTokens[0],
			contentID: this.data.contentId,
			contentType: this.selectedPageDetails.settings.collectorName,
			Author: this.data.author || "Unknown",
		};
	}

	addField(fieldName, content, index, type, filtered) {
		if (content) {
			this.parsedData.fields = [
				...this.parsedData.fields,
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

export {
	DataModel,
};
