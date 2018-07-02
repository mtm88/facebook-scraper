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

export {
	authenticateWithPlugin,
};
