import {
	parsePostWithContent,
	fieldParser,
	parsedSearchURL,
	userSeesPublicStories,
	userSeesPublicPostsModal,
} from "./helpers/parsingHelpers.js";
import {
	displayAuthenticatingWindow,
	hideAuthenticationWindow,
} from "./helpers/authenticateUserHelper.js";
import {
	buildInjectionDiv,
	buildMessageParagraph,
	buildCloseButtonDiv,
	buildContentDiv,
} from "./helpers/injectSelectorHelper.js";
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
		return chrome.storage.sync.get(["isAuthed", "token"], ({ isAuthed, token }) => {
			if (!isAuthed || !token) {
				return scriptRunner("authenticateUser");
			}

			return chrome.storage.local.get(["pages"], (({ pages }) => {
				if (!pages) {
					return scriptRunner("loadPages");
				}
	
				return scriptRunner("injectSelector", { pages });
			}));
		});
	}
	case "removeInjection": {
		return chrome.storage.local.set({ injectionToRemove: payload ? payload.id : null }, () =>  scriptRunner("removeInjection"));
	}
	case "userSelectedPage": {
		return chrome.storage.local.set({
			parsedPosts: [],
			selectedPageId: payload.pageId,
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
		return chrome.storage.sync.get(["token"], ({ token }) =>  scriptRunner("publishPosts", { token }));
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
					parsePostWithContent: ${parsePostWithContent},
					fieldParser: ${fieldParser},
					 parsedSearchURL: ${parsedSearchURL},
					 userSeesPublicStories: ${userSeesPublicStories},
					 userSeesPublicPostsModal: ${userSeesPublicPostsModal},
					};
					scriptHelpers = {
						displayAuthenticatingWindow: ${displayAuthenticatingWindow},
						hideAuthenticationWindow: ${hideAuthenticationWindow},
						buildInjectionDiv: ${buildInjectionDiv},
						buildMessageParagraph: ${buildMessageParagraph},
						buildCloseButtonDiv: ${buildCloseButtonDiv},
						buildContentDiv: ${buildContentDiv},
					
					}`,
			}, () => chrome.tabs.executeScript(id, { file: `./src/js/scripts/${fileName}.js` }));
		}
		return alert("Sorry, it looks like you have no tabs opened in your browser! :-(");
	});
}
