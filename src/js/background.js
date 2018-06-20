import {
	parseContentPosts,
	parsedSearchURL,
	userSeesPublicStories,
	userSeesPublicPostsModal,
} from "./helpers/parsingHelpers.js";
import {
	displayAuthenticatingWindow,
	hideAuthenticationWindow,
} from "./helpers/authenticateUserHelper.js";
import { APIconfig } from "./config.js";

chrome.runtime.onInstalled.addListener(function () {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: { hostContains: "facebook.com" },
			}),
			],
			actions: [
				new chrome.declarativeContent.ShowPageAction(),
			],
		}]);
	});
});

chrome.runtime.onMessage.addListener(function ({ action, payload }) {
	switch (action) {
	case "injectSelector": {
		return chrome.storage.sync.get(["isAuthed", "token", "pages"], ({ isAuthed, token, pages }) => {
			if (!isAuthed || !token) {
				return scriptRunner("authenticateUser");
			}

			if (!pages) {
				return scriptRunner("loadPages");
			}

			return scriptRunner("injectSelector", { pages });
		});
	}
	case "removeInjection": {
		return chrome.storage.local.set({ injectionToRemove: payload ? payload.id : null }, () => {
			return scriptRunner("removeInjection");
		});
	}
	case "userSelectedPage": {
		return chrome.storage.local.set({
			selectedPageId: payload.id,
			injectionToRemove: payload.divId,
			recordsToPull: payload.recordsToPull,
		}, () => {
			scriptRunner("removeInjection");
			return scriptRunner("contentScraper");
		});
	}
	case "displayProgressWindow": {
		return scriptRunner("progressWindow");
	}
	case "publishPosts": {
		return scriptRunner("publishPosts");
	}
	default: break;
	}
});

function scriptRunner(fileName, opts = {}) {
	return chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs && tabs.length) {
			const { url, id } = tabs[0];

			return chrome.tabs.executeScript(id, {
				code: `opts = ${JSON.stringify({
					currentURL: url,
					config: { APIconfig },
					...opts,
				})};
				helpers = {
					parseContentPosts: ${parseContentPosts},
					 parsedSearchURL: ${parsedSearchURL},
					 userSeesPublicStories: ${userSeesPublicStories},
					 userSeesPublicPostsModal: ${userSeesPublicPostsModal},
					};
					scriptHelpers = {
						displayAuthenticatingWindow: ${displayAuthenticatingWindow},
						hideAuthenticationWindow: ${hideAuthenticationWindow},
					}`,
			}, () => chrome.tabs.executeScript(id, { file: `./src/js/scripts/${fileName}.js` }));
		}
		return alert("Sorry, it looks like you have no tabs opened in your browser! :-(");
	});
}
