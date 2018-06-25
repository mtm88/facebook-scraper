import "chromedriver";
import { Builder, Capabilities, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import fs from "fs";
import path from "path";

async function getPluginBuffer(fileName) {
	return new Promise((resolve, reject) => {
		return fs.readFile(path.resolve(__dirname, `../../${fileName}`), (error, results) => {
			if (!error) {
				return resolve(results);
			}
			return reject(error);
		});
	});
}

describe.skip("Facebook scraper", function () {
	it("works", async function () {
		// const pluginBuffer = await getPluginBuffer("JSScraper.Facebook.crx");

		const driver = await new Builder()
			.forBrowser("chrome")
			.setChromeOptions(new chrome.Options()
				.addArguments([
					"--disable-notifications",
				])
				// .addExtensions(pluginBuffer)
			)
			.build();
		try {
			await driver.get("http://facebook.com");

			const emailElement = driver.findElement(By.id("email"));
			emailElement.sendKeys("michal.tara@crispthinking.com");

			const passwordElement = driver.findElement(By.id("pass"));
			passwordElement.sendKeys("crisp11");

			const loginButton = driver.findElement(By.id("loginbutton"));
			loginButton.click();

			await driver.wait(until.elementLocated(By.name("q")), 5000);

			const queryElement = driver.findElement(By.name("q"));
			queryElement.sendKeys("asda");
			// queryElement.submit();
		} catch (error) {
			console.log(error);
			debugger;
		} finally {
			// await driver.quit();
		}
	});
});
