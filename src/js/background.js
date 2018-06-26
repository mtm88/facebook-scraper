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
import {
	buildProgressWindowDiv,
	buildHeaderWrapperDiv,
	buildProgressSummaryParagraph,
	buildLoadedSoFarParagraph,
	buildParsedSoFarParagraph,
	buildUserInfoParagraph,
	buildUserWarningParagraph,
	buildHeaderFieldsWrapper,
} from "./helpers/progressWindowHelpers.js";
import { removeInjection } from "./scripts/removeInjection.js";
import { PostModel } from "./helpers/postModel.js";

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
	case "userSelectedPage": {
		return chrome.storage.local.set({
			parsedPosts: [],
			selectedPageId: payload.pageId,
			recordsToPull: payload.recordsToPull,
		}, () => scriptRunner("contentScraper"));
	}
	case "displayProgressWindow": {
		return scriptRunner("progressWindow");
	}
	case "publishPosts": {
		return chrome.storage.sync.get(["token"], ({ token }) => scriptRunner("publishPosts", { token }));
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
					 removeInjection: ${removeInjection},
					 PostModel: ${PostModel},
					};
					scriptHelpers = {
						displayAuthenticatingWindow: ${displayAuthenticatingWindow},
						hideAuthenticationWindow: ${hideAuthenticationWindow},
						buildInjectionDiv: ${buildInjectionDiv},
						buildMessageParagraph: ${buildMessageParagraph},
						buildCloseButtonDiv: ${buildCloseButtonDiv},
						buildContentDiv: ${buildContentDiv},
						buildProgressWindowDiv: ${buildProgressWindowDiv},
						buildHeaderWrapperDiv: ${buildHeaderWrapperDiv},
						buildProgressSummaryParagraph: ${buildProgressSummaryParagraph},
						buildLoadedSoFarParagraph: ${buildLoadedSoFarParagraph},
						buildParsedSoFarParagraph: ${buildParsedSoFarParagraph},
						buildUserInfoParagraph: ${buildUserInfoParagraph},
						buildUserWarningParagraph: ${buildUserWarningParagraph},
						buildHeaderFieldsWrapper: ${buildHeaderFieldsWrapper},
					}`,
			}, () => chrome.tabs.executeScript(id, { file: `./src/js/scripts/${fileName}.js` }));
		}
		return alert("Sorry, it looks like you have no tabs opened in your browser! :-(");
	});
}
