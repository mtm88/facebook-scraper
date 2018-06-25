import "chromedriver";
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

describe.only("Facebook scraper", function () {
	it("works", async function () {
		const driver = await new Builder()
			.forBrowser("chrome")
			.setChromeOptions(new chrome.Options()
				.addArguments([
					"--disable-notifications",
					// "--load-extension C:/Repos/JSScraper.Facebook/JSScraper.Facebook.crx"
				])
				.addExtensions(".\\..\\..\\Repos\\JSScraper.Facebook\\JSScraper.Facebook.crx")
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
			driver.sleep(1000);
			queryElement.submit();
		} catch (error) {
			console.log(error);
			debugger;
		} finally {
			// await driver.quit();
		}
	});
});
