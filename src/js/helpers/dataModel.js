class DataModel {
	constructor(data, selectedPageDetails) {
		this.data = data;
		this.selectedPageDetails = selectedPageDetails;
		this.parsedData = {
			fields: [],
		};
	}

	parseDataForPublish() {
		this.parsedData = {
			...this.parsedData,
			// ApiKey: "D85260D6-44AA-46A2-9BA6-6D7AA9F6CB97", // QA
			ApiKey: "794467c0-5ca5-437a-acec-93838c4b352b", // SOC2
			// ApiKey: this.selectedPageDetails..settings.collectionTokens[0],
			contentID: this.data.contentId,
			contentType: "qacovertests.facebook.page.ca93e563-30e3-4581-8bc1-7089d3f63016",
			// contentType: this.selectedPageDetails.settings.collectorName,
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
