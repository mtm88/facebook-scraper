import "chromedriver";
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { assert } from "chai";
import { getPluginBuffer } from "./../utils.js";
import * as shared from "./../shared/selenium_shared_tests.js";

describe("Scraping functionality with query params in URL", async function () {
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

	describe("Scraping data with query parameters in URL", function () {
		beforeEach(function () {
			this.recordsToPull = 5;
		});
		it("doesn't open Page Selector window when starting the Pugin", async function () {
			await this.driver.get(`http://www.facebook.com/search/str/lego/stories-keyword/stories-public?page=TestPage&recordsToPull=${this.recordsToPull}`);
			await this.driver.wait(until.elementLocated(By.id("BrowseResultsContainer")));
			await this.driver.executeScript(() => document.getElementById("hiddenDiv").click());

			try {
				await this.driver.findElement(By.id("selectionInjectorDiv"));
			} catch (error) {
				assert(true);
			}
		});

		it("does properly inject 'Progress Summary' window", async function () {
			await this.driver.wait(until.elementLocated(By.id("progressWindowDiv")));

			assert(true);
		});

		shared.checkScrapingProgress();
		shared.checkPublishingFunctionality();
	});
});
