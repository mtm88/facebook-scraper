import { parseContentPosts, parsedSearchURL } from "./../../src/js/helpers.js";
import { expect } from "chai";

const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe("#parseContentPosts", () => {
	beforeEach(() => {
		global.opts = {
			currentURL: "https://www.facebook.com/search/top/?q=asda",
		};
		global.chrome = {
			storage: {
				local: {
					set: () => true,
				},
			},
		};
	});
	it("properly parses raw post to expected format", () => {
		const rawPost = JSDOM.fragment(fs.readFileSync("./test/mocks/raw_post_mock.html", "utf-8"));
		const parsedPosts = parseContentPosts.apply({ parsedSearchURL }, [[rawPost]]);

		expect(parsedPosts).to.be.an("array");
		expect(parsedPosts).to.have.length(1);

		const selectedPost = parsedPosts[0];
		expect(selectedPost.author.replace(/(\r\n\t|\n|\r\t)/gm, "").trim()).to.eq("ITV News");
		expect(selectedPost).to.have.property("comments", 889);
		expect(selectedPost).to.have.property("contentId", "10155949582962672");
		expect(selectedPost).to.have.property("link", null);
		expect(selectedPost).to.have.property("reactions", 393);
		expect(selectedPost).to.have.property("searchURL", "https://www.facebook.com/search/top/");
		expect(selectedPost).to.have.property("shares", 283);
		expect(selectedPost).to.have.property("timeAdded", "20/06/2018 09:30");
		expect(selectedPost.title.replace(/(\r\n\t|\n|\r\t)/gm,"").trim()).to.eq("The bosses of				ASDA and Sainsbury's are questioned by MPs on their proposed merger");
	});
});