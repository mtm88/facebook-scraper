import "chromedriver";
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import fs from "fs";
import path from "path";
import { expect } from "chai";

import {
	buildInjectionDiv,
	buildMessageParagraph,
	buildCloseButtonDiv,
	buildContentDiv,
} from "./../../src/js/helpers/injectSelectorHelper.js";

import * as shared from "./../shared/selenium_authentication_test.js";

global.scriptHelpers = {
	buildInjectionDiv,
	buildMessageParagraph,
	buildCloseButtonDiv,
	buildContentDiv,
};

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


async function getPluginBuffer(fileName) {
	return new Promise((resolve, reject) => {
		return fs.readFile(path.resolve(__dirname, `../../${fileName}`), "base64", (error, results) => {
			if (!error) {
				return resolve(results);
			}
			return reject(error);
		});
	});
}

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

	describe("Plugin scraping functionality", function () {
		it("opens Page Selector window once authenticated", async function () {
			await this.driver.get("http://www.facebook.com/search/str/lego/stories-keyword/stories-public");
			await this.driver.wait(until.elementLocated(By.id("BrowseResultsContainer")));

			await this.driver.executeScript(() => document.getElementById("hiddenDiv").click());

			const selectionInjectorDiv = await this.driver.wait(until.elementLocated(By.id("selectionInjectorDiv")));
			expect(selectionInjectorDiv).to.exist;
		});

		it("selects the Page and starts the Scraper", async function () {
			const pageDiv = await this.driver.findElement(By.id("211538576062206"));
			await pageDiv.click();

			const progressSummaryDiv = await this.driver.wait(until.elementLocated(By.id("progressWindowDiv")));
			expect(progressSummaryDiv).to.exist;
		});

		it("checks the Posts Wrapper div for existance", async function () {
			const parsedPostsWrapper = await this.driver.findElement(By.id("parsedPostsWrapper"));
			expect(parsedPostsWrapper).to.exist;
		});

		it("checks the Scraper for progress", function () {
			return new Promise(async (resolve) => {
				const parsedPostsWrapper = await this.driver.findElement(By.id("parsedPostsWrapper"));
				const defaultCount = 10;

				async function checkForProgress() {
					const wrapperChildren = await parsedPostsWrapper.findElements(By.id("TitlecellField"));

					try {
						expect(wrapperChildren.length).to.eq(defaultCount);
						return resolve();
					} catch (error) {
						setTimeout(() => {
							return checkForProgress();
						}, 2000);
					}
				}

				async function checkForLoadedContent() {
					const currentLoadedCount = await this.driver.findElement(By.id("loadedSoFar")).getAttribute("textContent");

					try {
						expect(currentLoadedCount).to.include(defaultCount);
						return checkForProgress();
					} catch (error) {
						setTimeout(() => {
							return checkForLoadedContent();
						}, 1000);
					}
				}

				return checkForLoadedContent();
			});
		});

		it("Injects 'Submit' button once content was scraped", async function () {
			const submitButton = await this.driver.findElement(By.id("submitButton"));
			submitButton.click();

			expect(submitButton).to.exist;
		});

		it("displays 'Job done' message once the content was sent", async function () {
			return new Promise((resolve) => {
				async function checkForFinishedWork() {
					try {
						const sentRequestsP = await this.driver.findElement(By.id("sentRequestsP")).getAttribute("textContent");
						expect(sentRequestsP).to.exist;
						expect(sentRequestsP).to.eq("All posts have been successfully published");
						return resolve();
					} catch (e) {
						setTimeout(() => {
							checkForFinishedWork();
						}, 2000);
					}
				}

				checkForFinishedWork();
			});
		});

		it("closes the 'Progress Summary' window on 'X' click", async function () {
			const closeButtonDiv = await this.driver.findElement(By.id("closeButtonDiv"));

			await closeButtonDiv.click();

			try {
				await this.driver.findElement(By.id("progressWindowDiv"));
			} catch (error) {
				expect(error).to.exist;
				this.driver.quit();
			}
		});
	});
});
