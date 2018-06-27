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

describe.only("Facebook Scraper functionality", function () {
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
				])
				.addExtensions(pluginBuffer)
			)
			.build();
	});

	it("Logins to Facebook and gets 'You must authenticate' message from the plugin", async () => {
		try {
			await driver.get("http://facebook.com");

			const emailElement = await driver.findElement(By.id("email"));
			await emailElement.sendKeys("michal.tara@crispthinking.com");

			const passwordElement = await driver.findElement(By.id("pass"));
			await passwordElement.sendKeys("crisp11");

			const loginButton = await driver.findElement(By.id("loginbutton"));
			await loginButton.click();

			// await driver.get("http://www.facebook.com/search/str/lego/stories-keyword/stories-public");
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
		await driver.get("chrome://extensions");
		const itemsContainer = await driver.wait(until.elementLocated(By.id("devModeLabel")));
		debugger;
	});
});
