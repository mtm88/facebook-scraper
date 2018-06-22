import {
	parsePostWithContent,
	parsedSearchURL,
	fieldParser,
	userSeesPublicStories,
	userSeesPublicPostsModal,
} from "./../../../src/js/helpers/parsingHelpers.js";
import { expect } from "chai";
import fs from "fs";
import jsdom from "jsdom";
const { JSDOM } = jsdom;

describe("Parsing Helpers", () => {
	describe("#parsePostWithContent", () => {
		beforeEach(() => {
			global.opts = {
				currentURL: "https://www.facebook.com/search/top/?q=asda",
			};
			global.chrome = {
				storage: {
					local: {
						get: (fieldsToGet, getCb) => getCb({}),
						set: (fieldsToSet, setCb) => setCb(),
					},
				},
			};
		});
		it("properly parses raw post to expected format", () => {
			const rawPost = JSDOM.fragment(fs.readFileSync("./test/mocks/raw_post_mock.html", "utf-8"));
			parsePostWithContent.apply({ parsedSearchURL, fieldParser }, [rawPost])
				.then((parsedPost) => {
					expect(parsedPost).to.be.an("object");

					expect(parsedPost.author.replace(/(\r\n\t|\n|\r\t)/gm, "").trim()).to.eq("ITV News");
					expect(parsedPost).to.have.property("comments", 889);
					expect(parsedPost).to.have.property("contentId", "10155949582962672");
					expect(parsedPost).to.have.property("link", null);
					expect(parsedPost).to.have.property("reactions", 393);
					expect(parsedPost).to.have.property("searchURL", "https://www.facebook.com/search/top/");
					expect(parsedPost).to.have.property("shares", 283);
					expect(parsedPost).to.have.property("timeAdded", "20/06/2018 09:30");
					expect(parsedPost.title.replace(/(\r\n\t|\n|\r\t)/gm, "").trim()).to.eq("The bosses of				ASDA and Sainsbury's are questioned by MPs on their proposed merger");
				});
		});
	});

	describe("#parsedSearchURL", () => {
		it("properly parses passed URL", () => {
			expect(parsedSearchURL({ currentURL: "https://www.facebook.com/search/top/?q=asda" })).to.eq("https://www.facebook.com/search/top/");
		});

		it("doesn't throw an error when no URL passed", () => expect(parsedSearchURL()).to.eq(null));
	});

	describe("#userSeesPublicStories", () => {
		it("returns with FALSE when User doesn't see Public Stories as embedded content", () => expect(userSeesPublicStories()).to.eq(false));
		it("returns with TRUE when User sees Public Posts as embedded content", () => {
			global.opts.currentURL = "https://www.facebook.com/search/str/volvo/stories-keyword/stories-public";
			expect(userSeesPublicStories()).to.eq(true);
		});
	});

	describe("#userSeesPublicPostsModal", () => {
		it("returns with TRUE and correct Modal Index when User sees a Modal without message in the background", () => {
			const mockedPage = new JSDOM("<div class='uiScrollableAreaWrap scrollable'></div>");
			global.document = mockedPage.window.document;

			expect(userSeesPublicPostsModal()).to.deep.eq({ userSeesModal: true, correctModalIndex: 0 });
		});
		it("returns with TRUE and correct Modal Index when User sees a Modal with message in the background", () => {
			const mockedPage = new JSDOM("<div class='uiScrollableAreaWrap scrollable'></div><div class='uiScrollableAreaWrap scrollable'></div>");
			global.document = mockedPage.window.document;

			expect(userSeesPublicPostsModal()).to.deep.eq({ userSeesModal: true, correctModalIndex: 1 });
		});
		it("returns with FALSE when User doesn't see a Modal", () => {
			const mockedPage = new JSDOM("<div></div>");
			global.document = mockedPage.window.document;

			expect(userSeesPublicPostsModal()).to.deep.eq({ userSeesModal: false, correctModalIndex: false });
		});
	});
});
