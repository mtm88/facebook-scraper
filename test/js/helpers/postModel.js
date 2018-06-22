import { PostModel } from "./../../../src/js/helpers/postModel";
import { expect } from "chai";

const mockedPost = {
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

describe("Post Model", () => {
	beforeEach(function instiantiateModel () {
		this.modelInstance = new PostModel(mockedPost, mockedPageDetails);
	});
	afterEach(function cleanModelInstance() {
		this.modelInstance = null;
	});
	describe("Post Model constructor", () => {
		it("Properly initialises with passed parameters", function () {
			expect(this.modelInstance.parsedPost).to.exist;
			expect(this.modelInstance.post).to.deep.eq(mockedPost);
			expect(this.modelInstance.selectedPageDetails).to.deep.eq(mockedPageDetails);
		});
	});

	describe("#parsePostForPublish", () => {
		it("Properly sets required request parameters on the model instance", function () {
			this.modelInstance.parsePostForPublish();
			const { parsedPost } = this.modelInstance;
			expect(parsedPost).to.have.property("ApiKey");
			expect(parsedPost).to.have.property("contentID");
			expect(parsedPost).to.have.property("contentType");
			expect(parsedPost).to.have.property("Author");
			
			expect(parsedPost.contentType).to.eq("test.content.type");
		});
		
		it("Sets the Author name to 'Unknown' if not included in post object", function () {
			this.modelInstance.parsePostForPublish();

			expect(this.modelInstance.parsedPost.Author).to.eq("Unknown");
		});
	});
});
