import * as webdriver from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

describe.skip("Facebook scraper", () => {
	before(() => {
		this.driver = new webdriver.Builder().forBrowser("chrome").build();
	});
	it("works", () => {
		this.driver.get("https://facebook.com");
		this.driver.getTitle().then((results) => {
			debugger;
		});
	});
});
