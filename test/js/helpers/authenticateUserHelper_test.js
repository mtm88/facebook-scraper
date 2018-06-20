import {
	displayAuthenticatingWindow,
	hideAuthenticationWindow,
} from "./../../../src/js/helpers/authenticateUserHelper.js";
import { expect } from "chai";

import jsdom from "jsdom";

const { JSDOM } = jsdom;

describe("#displayAuthenticatingWindow", () => {
	it("appends Authenticating Window to the DOM", () => {
		global.document = new JSDOM("").window.document;

		displayAuthenticatingWindow();

		const injectedAuthenticationWindow = document.getElementById("authenticatingWindowDiv");
		expect(injectedAuthenticationWindow).to.be.exist;
		expect(injectedAuthenticationWindow.children[1].textContent).to.eq("Authenticating with the server...");
	});
});

describe("#hideAuthenticationWindow", () => {
	beforeEach(() => {
		global.chrome = {
			runtime: {
				sendMessage: ({ action, payload }) => ({ action, payload }),
			}
		};
	});
	it("sends the right message to background with correct DIV ID", () => expect(hideAuthenticationWindow()).to.deep.eq({ action: "removeInjection", payload: { id: "authenticatingWindowDiv" } }));
});
