import { DataModel } from "./../../../src/js/helpers/dataModel.js";
import { expect } from "chai";

const mockedData = {
	title: "Test Title",
	content: "Test content",
};
const mockedPageDetails = {
	settings: {
		pageId: 1,
		recordsToCollect: 20,
		collectorName: "test.content.type",
	},
};

describe("Data Model", () => {
	beforeEach(function instiantiateModel() {
		this.modelInstance = new DataModel(mockedData, mockedPageDetails);
	});
	afterEach(function cleanModelInstance() {
		this.modelInstance = null;
	});
	describe("Data Model constructor", () => {
		it("Properly initialises with passed parameters", function () {
			expect(this.modelInstance.parsedData).to.exist;
			expect(this.modelInstance.data).to.deep.eq(mockedData);
			expect(this.modelInstance.selectedPageDetails).to.deep.eq(mockedPageDetails);
		});
	});

	describe("#parseDataForPublish", () => {
		it("Properly sets required request parameters on the model instance", function () {
			this.modelInstance.parseDataForPublish();
			const { parsedData } = this.modelInstance;
			expect(parsedData).to.have.property("ApiKey");
			expect(parsedData).to.have.property("contentID");
			expect(parsedData).to.have.property("contentType");
			expect(parsedData).to.have.property("Author");

			expect(parsedData.contentType).to.eq("test.content.type");
		});

		it("Sets the Author name to 'Unknown' if not included in data object", function () {
			this.modelInstance.parseDataForPublish();

			expect(this.modelInstance.parsedData.Author).to.eq("Unknown");
		});
	});

	describe("#addField", () => {
		it("properly extends 'parsedPost.fields' array with passed data", function () {
			this.modelInstance.addField("testName", "testContent", 0, "testType", false);

			const { parsedData: { fields: [{ fieldname, content, index, type, filtered }] } } = this.modelInstance;
			
			expect(fieldname).to.eq("testName");
			expect(content).to.eq("testContent");
			expect(index).to.eq(0);
			expect(type).to.eq("testType");
			expect(filtered).to.be.false;
		});
	});
});
