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

describe.only("Facebook scraper", function () {
	it("works", async function () {
		const pluginBuffer = await getPluginBuffer("JSScraper.Facebook.crx");

		const driver = await new Builder()
			.forBrowser("chrome")
			.setChromeOptions(new chrome.Options()
				.addArguments([
					"--disable-notifications",
					"--start-maximized",
					"--force-dev-mode-highlighting",
				])
				.addExtensions(pluginBuffer)
			)
			.build();
		try {
			await driver.get("http://facebook.com");

			const emailElement = await driver.findElement(By.id("email"));
			await emailElement.sendKeys("michal.tara@crispthinking.com");

			const passwordElement = await driver.findElement(By.id("pass"));
			await passwordElement.sendKeys("crisp11");

			const loginButton = await driver.findElement(By.id("loginbutton"));
			await loginButton.click();

			await driver.get("http://www.facebook.com/search/str/lego/stories-keyword/stories-public");
			driver.executeScript(() => document.getElementById("hiddenDiv").click());

			const alertPresent = await driver.wait(until.alertIsPresent());
			
			expect(alertPresent).to.exist;
		} catch (error) {
			console.log(error);
		} finally {
			await driver.quit();
		}
	});
});
