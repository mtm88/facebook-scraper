import { parseQueryParams } from "./../../../src/js/helpers/backgroundHelper.js";
import { expect } from "chai";

describe("Background.js helpers", () => {
	it("returns properly parsed object from raw query string", () => {
		const expectedResult = {
			fetchComments: "true",
			"https://www.facebook.com/search/str/volvo/stories-keyword/stories-public": undefined,
			page: "TestPlugin",
			recordsToPull: "50",
		};
		const rawURL = "https://www.facebook.com/search/str/volvo/stories-keyword/stories-public?page=TestPlugin&recordsToPull=50&fetchComments=true";

		const parsedQuery = parseQueryParams(rawURL);

		expect(parsedQuery).to.deep.eq(expectedResult);
	});
});
