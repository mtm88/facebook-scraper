import {
	buildProgressWindowDiv,
	buildHeaderWrapperDiv,
	buildProgressSummaryParagraph,
	buildLoadedSoFarParagraph,
	buildParsedSoFarParagraph,
	buildUserInfoParagraph,
	buildUserWarningParagraph,
	buildHeaderFieldsWrapper,
} from "./../../../src/js/helpers/progressWindowHelpers";
import { expect } from "chai";

import jsdom from "jsdom";

const { JSDOM } = jsdom;

function mockGlobalDocument() {
	global.window = new JSDOM("<body></body>").window;
	global.document = window.document;
}

mockGlobalDocument();

describe("Progress Window Helper", () => {
	describe("#buildProgressWindowDiv", () => {
		it("returns a proper DIV element scaled according to passed parameters", () => {
			const progressWindowDiv = buildProgressWindowDiv(300, 150);

			expect(progressWindowDiv).to.exist;
			expect(progressWindowDiv.style.width).to.eq("300px");
			expect(progressWindowDiv.style.left).to.eq("150px");
			expect(progressWindowDiv.outerHTML).to.eq(`<div id="progressWindowDiv" style="display: flex; flex-direction: column; width: 300px; position: fixed; top: 100px; left: 150px; z-index: 1000; background-color: rgb(255, 255, 255); overflow: hidden;"></div>`); // eslint-disable-line quotes
		});
	});

	describe("#buildHeaderWrapperDiv", () => {
		it("returns a proper header wrapping DIV element", () => {
			const headerWrapperDiv = buildHeaderWrapperDiv();

			expect(headerWrapperDiv).to.exist;
			expect(headerWrapperDiv.outerHTML).to.eq(`<div id="headerWrapperDiv" style="background-color: rgb(255, 255, 255);"></div>`); // eslint-disable-line quotes
		});
	});

	describe("#buildProgressSummaryParagraph", () => {
		it("returns 'Progress Summary' paragraph", () => {
			const progressSummaryP = buildProgressSummaryParagraph();

			expect(progressSummaryP).to.exist;
			expect(progressSummaryP.outerHTML).to.eq(`<p style="padding: 10px 20px; font-weight: 800; font-size: 14px;">Progress summary</p>`); // eslint-disable-line quotes
		});
	});

	describe("#buildLoadedSoFarParagraph", () => {
		it("returns 'Loaded So Far' paragraph", () => {
			const loadedSoFarP = buildLoadedSoFarParagraph();

			expect(loadedSoFarP).to.exist;
			expect(loadedSoFarP.outerHTML).to.eq(`<p id="loadedSoFar" style="padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-weight: 500;">Posts loaded: 0</p>`);  // eslint-disable-line quotes
		});
	});

	describe("#buildParsedSoFarParagraph", () => {
		it("returns 'Parsed So Far' paragraph", () => {
			const parsedSoFarP = buildParsedSoFarParagraph();

			expect(parsedSoFarP).to.exist;
			expect(parsedSoFarP.outerHTML).to.eq(`<p id="parsedSoFar" style="padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-weight: 500;">Posts processed: 0</p>`); // eslint-disable-line quotes
		});
	});


	describe("#buildUserInfoParagraph", () => {
		it("returns 'User Info' paragraph", () => {
			const userInfoP = buildUserInfoParagraph();

			expect(userInfoP).to.exist;
			expect(userInfoP.outerHTML).to.eq(`<p id="userInfo" style="padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-size: 10px;">Please don't manipulate the website while scraper is working. If you see no progress in the number of posts parsed for a long time, please restart the scraper.</p>`); // eslint-disable-line quotes
		});
	});

	describe("#buildUserWarningParagraph", () => {
		it("returns 'User Warning' paragraph", () => {
			const userWarningP = buildUserWarningParagraph();

			expect(userWarningP).to.exist;
			expect(userWarningP.outerHTML).to.eq(`<p id="userWarning" style="padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-style: italic; font-size: 10px; color: rgb(255, 0, 0);">This browser tab has to stay ACTIVE during this process</p>`); // eslint-disable-line quotes
		});
	});

	describe("#buildUserWarningParagraph", () => {
		it("returns 'User Warning' paragraph", () => {
			const userWarningP = buildUserWarningParagraph();

			expect(userWarningP).to.exist;
			expect(userWarningP.outerHTML).to.eq(`<p id="userWarning" style="padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-style: italic; font-size: 10px; color: rgb(255, 0, 0);">This browser tab has to stay ACTIVE during this process</p>`); // eslint-disable-line quotes
		});
	});

	describe("#buildHeaderFieldsWrapper", () => {
		it("returns proper Header Fields Wrapper DIV element", () => {
			const headerFieldsWrapper = buildHeaderFieldsWrapper();

			expect(headerFieldsWrapper).to.exist;
			expect(headerFieldsWrapper.outerHTML).to.eq(`<div id="headerFieldsWrapper" style="display: flex; flex-direction: row;"></div>`); // eslint-disable-line quotes
		});
	});
});
