import {
	buildInjectionDiv,
	buildMessageParagraph,
	buildCloseButtonDiv,
	buildContentDiv,
} from "./../../../src/js/helpers/injectSelectorHelper";
import { expect } from "chai";

import jsdom from "jsdom";

const { JSDOM } = jsdom;

describe("Inject Selector Helpers", () => {
	beforeEach(() => {
		global.window = new JSDOM("<body></body>").window;
		global.document = window.document;
	});
	describe("#buildInjectionDiv", () => {
		it("returns a proper DIV element formatted for Modal View", () => {
			const newDiv = window.document.createElement("div");
			newDiv.class = "uiScrollableAreaWrap scrollable";
			window.document.body.appendChild(newDiv);

			const scrollableArea = window.document.getElementsByClassName("uiScrollableAreaWrap scrollable");
			const divToInject = buildInjectionDiv([scrollableArea], true, 0);

			expect(divToInject.outerHTML).to.eq(`<div id="selectionInjectorDiv" style="display: flex; flex-direction: column; position: fixed; top: 100px; z-index: 1000; background-color: rgb(255, 255, 255);"></div>`); // eslint-disable-line quotes
		});
		it("returns a proper DIV element formatted for Embedded View", () => {
			const newDiv = window.document.createElement("div");
			newDiv.class = "uiScrollableAreaWrap scrollable";
			window.document.body.appendChild(newDiv);

			const scrollableArea = window.document.getElementsByClassName("uiScrollableAreaWrap scrollable");
			const divToInject = buildInjectionDiv([scrollableArea], false, 0);
			expect(divToInject.outerHTML).to.eq(`<div id="selectionInjectorDiv" style="display: flex; flex-direction: column; width: 0px; position: fixed; top: 100px; left: 0px; z-index: 1000; background-color: rgb(255, 255, 255);"></div>`); // eslint-disable-line quotes
		});
	});

	describe("buildMesssageParagraph", () => {
		it("returns a properly formatted Paragraph element", () => {
			const paragraphToInject = buildMessageParagraph();
			expect(paragraphToInject.outerHTML).to.eq(`<div id="paragraphDiv" style="padding-left: 20px; margin-top: 10px;"><p>Please select the page you would like to collect from: </p></div>`);  // eslint-disable-line quotes
		});
	});

	describe("#buildCloseButtonDiv", () => {
		it("returns a properly formatted Paragraph element", () => {
			const closeDivToInject = buildCloseButtonDiv();
			expect(closeDivToInject.outerHTML).to.eq(`<div id="closeButtonDiv" style="position: absolute; top: 0px; right: 0px; padding: 8px 10px; font-size: 15px;">X</div>`);  // eslint-disable-line quotes
		});
	});

	describe("#buildContentDiv", () => {
		before(() => {
			global.opts = {
				pages: [
					{
						settings: {
							pageId: 0,
							recordsToPull: 50,
						},
					},
				],
			};
		});
		it("returns a properly formatted content DIV element", () => {
			const contentDivToInject = buildContentDiv();
			expect(contentDivToInject.outerHTML).to.eq(`<div id="contentDiv" style="display: flex; flex-wrap: wrap; justify-content: center; align-content: flex-start; margin: 0px 5px 30px;"><div id="0" style="padding: 10px 20px; margin: 10px; border: 1px solid; border-radius: 3px;"></div></div>`);  // eslint-disable-line quotes
		});
	});
});
