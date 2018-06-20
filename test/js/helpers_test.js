import { parseContentPosts, parsedSearchURL } from "./../../src/js/helpers.js";
import { expect } from "chai";

const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe("Content Parsers", () => {
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
		const rawPost = JSDOM.fragment(fs.readFileSync("./spec/mocks/mockedPost.html", "utf-8"));
		const parsedPosts = parseContentPosts.apply({ parsedSearchURL }, [[rawPost]]);

		expect(parsedPosts).to.be.an("array");
		expect(parsedPosts).to.have.length(1);

		const selectedPost = parsedPosts[0];
		expect(selectedPost).to.have.property("author", "OK! Magazine UK");
		expect(selectedPost).to.have.property("comments", 306);
		expect(selectedPost).to.have.property("contentId", "1814004135313857");
		expect(selectedPost).to.have.property("link", "https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.ok.co.uk%2Flifestyle%2Fmum-and-baby%2F1398853%2Fasda-george-baby-sale-pushchairs-cribs-car-seats-reduced-half-price&h=AT1W4ZaV4JQWS5o7hfIZr-Nf-O-vbA2yiJnY4uzxgvZLqCN_kfoSbjqJ9l55_-WLZtNjEKJ0a0mQVxugFCIeV1KztkVuZWf1vwfRpFvopBl0y1I64BhB45EdFXL1ZMdXLzVoRSo2i_6kquvfTLPmNr6a");
		expect(selectedPost).to.have.property("reactions", 47);
		expect(selectedPost).to.have.property("searchURL", "https://www.facebook.com/search/top/");
		expect(selectedPost).to.have.property("shares", 49);
		expect(selectedPost).to.have.property("timeAdded", "19/06/2018 12:00");
		expect(selectedPost.title.replace(/(\r\n\t|\n|\r\t)/gm,"").trim()).to.eq("Asda				 have announced a VERY impressive baby and toddler discount - see what's up for grabs");

	});
});
