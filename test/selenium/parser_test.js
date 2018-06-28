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

import { userConfig } from "./../../src/js/config.js";
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

describe("Facebook Scraper functionality", function () {
	let driver;

	before(async () => {
		const pluginBuffer = await getPluginBuffer("JSScraper.Facebook.crx");

		driver = await new Builder()
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

	it("Logins to Facebook and gets 'You must authenticate' message from the plugin", async () => {
		try {
			await driver.get("http://facebook.com");

			const emailElement = await driver.findElement(By.id("email"));
			await emailElement.sendKeys(userConfig.fbUsername);

			const passwordElement = await driver.findElement(By.id("pass"));
			await passwordElement.sendKeys(userConfig.fbPassword);

			const loginButton = await driver.findElement(By.id("loginbutton"));
			await loginButton.click();

			await driver.wait(until.elementLocated(By.name("q")));
			await driver.executeScript(() => document.getElementById("hiddenDiv").click());

			const alertPresent = await driver.wait(until.alertIsPresent());

			expect(alertPresent).to.exist;
			alertPresent.getText().then((alertMessage) => {
				expect(alertMessage).to.eq("Please insert your Login & Password in the plugin options");
				alertPresent.dismiss();
			});

		} catch (error) {
			console.log(error);
		}
	});

	it("goes to options page and sets up authentication", async () => {
		const pluginId = await driver.findElement(By.id("hiddenDiv")).getAttribute("textContent");
		await driver.get(`chrome-extension://${pluginId}/src/html/options.html`);

		const optionsWindow = await driver.findElement(By.id("optionsWrapper"));
		expect(optionsWindow).to.exist;

		const loginInput = await driver.findElement(By.id("userLogin"));
		await loginInput.sendKeys(userConfig.username);

		const passwordInput = await driver.findElement(By.id("userPassword"));
		await passwordInput.sendKeys(userConfig.password);

		const submitButton = await driver.findElement(By.id("applyButton"));
		await submitButton.click();

		const alertPresent = await driver.wait(until.alertIsPresent());

		expect(alertPresent).to.exist;
		alertPresent.getText().then((alertMessage) => {
			expect(alertMessage).to.eq("Settings Updated!");
			alertPresent.dismiss();
		});
	});

	it("opens Page Selector window once authenticated", async () => {
		await driver.get("http://www.facebook.com/search/str/lego/stories-keyword/stories-public");
		await driver.wait(until.elementLocated(By.id("BrowseResultsContainer")));

		await driver.executeScript(() => document.getElementById("hiddenDiv").click());

		const selectionInjectorDiv = await driver.wait(until.elementLocated(By.id("selectionInjectorDiv")));
		expect(selectionInjectorDiv).to.exist;
	});

	it("selects the Page and starts the Scraper", async () => {
		const pageDiv = await driver.findElement(By.id("211538576062206"));
		await pageDiv.click();

		const progressSummaryDiv = await driver.wait(until.elementLocated(By.id("progressWindowDiv")));
		expect(progressSummaryDiv).to.exist;
	});

	it("checks the Posts Wrapper div for existance", async () => {
		const parsedPostsWrapper = await driver.findElement(By.id("parsedPostsWrapper"));
		expect(parsedPostsWrapper).to.exist;
	});

	it("checks the Scraper for progress", () => {
		return new Promise(async (resolve) => {
			const parsedPostsWrapper = await driver.findElement(By.id("parsedPostsWrapper"));
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
				const currentLoadedCount = await driver.findElement(By.id("loadedSoFar")).getAttribute("textContent");

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

	it("Injects 'Submit' button once content was scraped", async () => {
		const submitButton = await driver.findElement(By.id("submitButton"));
		submitButton.click();

		expect(submitButton).to.exist;
	});

	it("displays 'Job done' message once the content was sent", async () => {
		return new Promise((resolve) => {
			async function checkForFinishedWork() {
				try {
					const sentRequestsP = await driver.findElement(By.id("sentRequestsP")).getAttribute("textContent");
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

	it("closes the 'Progress Summary' window on 'X' click", async () => {
		const closeButtonDiv = await driver.findElement(By.id("closeButtonDiv"));
		
		await closeButtonDiv.click();
		
		try {
			await driver.findElement(By.id("progressWindowDiv"));
		} catch (error) {
			expect(error).to.exist;
		}
	});
});
