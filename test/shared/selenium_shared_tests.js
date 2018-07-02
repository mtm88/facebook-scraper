import { userConfig } from "./../../src/js/config.js";
import { AssertionError } from "assert";
import { By, until } from "selenium-webdriver";
import { expect } from "chai";

function authenticateWithPlugin() {
	describe("Plugin Authentication functionality", function () {
		it("Logins to Facebook and gets 'You must authenticate' message from the plugin", async function () {
			try {
				await this.driver.get("http://facebook.com");

				const emailElement = await this.driver.findElement(By.id("email"));
				await emailElement.sendKeys(userConfig.fbUsername);

				const passwordElement = await this.driver.findElement(By.id("pass"));
				await passwordElement.sendKeys(userConfig.fbPassword);

				const loginButton = await this.driver.findElement(By.id("loginbutton"));
				await loginButton.click();

				await this.driver.wait(until.elementLocated(By.name("q")));
				await this.driver.executeScript(() => document.getElementById("hiddenDiv").click());

				const alertPresent = await this.driver.wait(until.alertIsPresent());

				expect(alertPresent).to.exist;
				alertPresent.getText().then((alertMessage) => {
					expect(alertMessage).to.eq("Please insert your Login & Password in the plugin options");
					alertPresent.dismiss();
				});

			} catch (error) {
				throw new AssertionError(error);
			}
		});

		it("goes to options page and sets up authentication", async function () {
			const pluginId = await this.driver.findElement(By.id("hiddenDiv")).getAttribute("textContent");
			await this.driver.get(`chrome-extension://${pluginId}/src/html/options.html`);

			const optionsWindow = await this.driver.findElement(By.id("optionsWrapper"));
			expect(optionsWindow).to.exist;

			const loginInput = await this.driver.findElement(By.id("userLogin"));
			await loginInput.sendKeys(userConfig.username);

			const passwordInput = await this.driver.findElement(By.id("userPassword"));
			await passwordInput.sendKeys(userConfig.password);

			const submitButton = await this.driver.findElement(By.id("applyButton"));
			await submitButton.click();

			const alertPresent = await this.driver.wait(until.alertIsPresent());

			expect(alertPresent).to.exist;
			alertPresent.getText().then((alertMessage) => {
				expect(alertMessage).to.eq("Settings Updated!");
				alertPresent.dismiss();
			});
		});
	});
}

function checkScrapingProgress() {
	it("checks the Scraper for progress", function () {
		return new Promise(async (resolve) => {
			const parsedPostsWrapper = await this.driver.wait(until.elementLocated(By.id("parsedPostsWrapper")));
			const defaultCount = this.recordsToPull || 3;

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

			async function checkForLoadedContent(driver) {
				const currentLoadedCount = await driver.findElement(By.id("loadedSoFar")).getAttribute("textContent");

				try {
					expect(currentLoadedCount).to.include(defaultCount);
					return checkForProgress();
				} catch (error) {
					setTimeout(() => {
						return checkForLoadedContent(driver);
					}, 1000);
				}
			}
			return checkForLoadedContent(this.driver);
		});
	});
}

function checkPublishingFunctionality() {
	it("Injects 'Submit' button once content was scraped", async function () {
		const submitButton = await this.driver.findElement(By.id("submitButton"));
		submitButton.click();

		expect(submitButton).to.exist;
	});

	it("displays 'Job done' message once the content was sent", async function () {
		return new Promise((resolve) => {
			async function checkForFinishedWork(driver) {
				try {
					const sentRequestsP = await driver.findElement(By.id("sentRequestsP")).getAttribute("textContent");

					expect(sentRequestsP).to.exist;
					expect(sentRequestsP).to.eq("All posts have been successfully published");

					return resolve();
				} catch (e) {
					setTimeout(function () {
						checkForFinishedWork(driver);
					}, 2000);
				}
			}

			checkForFinishedWork(this.driver);
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
}

export {
	authenticateWithPlugin,
	checkScrapingProgress,
	checkPublishingFunctionality,
};
