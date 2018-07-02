import "chromedriver";
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { expect } from "chai";
import { getPluginBuffer } from "./../utils.js";
import {
	buildInjectionDiv,
	buildMessageParagraph,
	buildCloseButtonDiv,
	buildContentDiv,
} from "./../../src/js/helpers/injectSelectorHelper.js";

import * as shared from "./../shared/selenium_shared_tests.js";

global.scriptHelpers = {
	buildInjectionDiv,
	buildMessageParagraph,
	buildCloseButtonDiv,
	buildContentDiv,
};


describe("Scraping functionality without query params", async function () {
	before(async function () {
		const pluginBuffer = await getPluginBuffer("JSScraper.Facebook.crx");

		this.driver = await new Builder()
			.forBrowser("chrome")
			.setChromeOptions(new chrome.Options()
				.addArguments([
					"--disable-notifications",
					"--start-maximized",
					"--force-dev-mode-highlighting",
					"--allow-running-insecure-content",
				])
				.addExtensions(pluginBuffer)
			)
			.build();
	});

	shared.authenticateWithPlugin();

	describe("Scraping data without query parameters in URL", function () {
		it("opens Page Selector window when starting the Plugin", async function () {
			await this.driver.get("http://www.facebook.com/search/str/lego/stories-keyword/stories-public");
			await this.driver.wait(until.elementLocated(By.id("BrowseResultsContainer")));

			await this.driver.executeScript(() => document.getElementById("hiddenDiv").click());

			const selectionInjectorDiv = await this.driver.wait(until.elementLocated(By.id("selectionInjectorDiv")));
			expect(selectionInjectorDiv).to.exist;
		});

		it("selects the Page and starts the Scraper", async function () {
			const pageDiv = await this.driver.findElement(By.id("0"));
			await pageDiv.click();
			const progressSummaryDiv = await this.driver.wait(until.elementLocated(By.id("progressWindowDiv")));

			expect(progressSummaryDiv).to.exist;
		});

		shared.checkScrapingProgress();
		shared.checkPublishingFunctionality();
	});
});
