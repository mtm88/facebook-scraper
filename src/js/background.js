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
	buildParsedPostsWrapper,
} from "./helpers/progressWindowHelpers.js";
import { removeInjection } from "./scripts/removeInjection.js";
import { DataModel } from "./helpers/dataModel.js";
import { parseQueryParams } from "./helpers/backgroundHelper.js";

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

chrome.runtime.onMessage.addListener(function ({ action, payload: { pageId, recordsToPull, fetchComments } = {} }) {
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

					return chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
						if (tabs && tabs[0]) {
							const tabURL = tabs[0].url;
							const { page, recordsToPull = 50 } = parseQueryParams(tabURL);
							let { fetchComments } = parseQueryParams(tabURL);
							fetchComments = fetchComments ? fetchComments !== "false" : false;

							if (page) {
								const selectedPageDetails = pages.find(({ name }) => name === page);

								if (selectedPageDetails) {
									return setupAndRunContentScraper({ pageId: selectedPageDetails.settings.pageId, recordsToPull, fetchComments });
								}
								alert("Sorry, requested Page couldn't be found. Check your URL and try again.");
							}
							return scriptRunner("injectSelector", { pages, fetchComments });
						}
					});
				}));
			});
		}
		case "userSelectedPage": {
			return setupAndRunContentScraper({ pageId, recordsToPull, fetchComments });
		}
		case "displayProgressWindow": {
			return chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				if (tabs && tabs[0]) {
					const tabURL = tabs[0].url;
					let { fetchComments = false } = parseQueryParams(tabURL);
					fetchComments = fetchComments ? fetchComments !== "false" : false;

					return scriptRunner("progressWindow", { fetchComments });
				}
			});
		}
		case "publishPosts": {
			return chrome.storage.sync.get(["token"], ({ token }) => scriptRunner("publishPosts", { token }));
		}
		default: break;
	}
});

// only for Selenium needs to trick browser into starting the plugin
chrome.tabs.onUpdated.addListener(async (tabId, info, { url }) => {
	if (url.includes("TEST_ENV=true")) {
		chrome.storage.local.set({ TEST_ENV: true });
		return scriptRunner("injectTestDiv");
	}

	return chrome.storage.local.get(["TEST_ENV"], ({ TEST_ENV }) => TEST_ENV ? scriptRunner("injectTestDiv") : null);
});

function setupAndRunContentScraper({ pageId, recordsToPull, fetchComments }) {
	return chrome.storage.local.set({
		parsedPosts: [],
		divsWithPostLength: 0,
		selectedPageId: pageId,
		recordsToPull,
		fetchComments,
	}, () => scriptRunner("contentScraper"));
}

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
					 DataModel: ${DataModel},
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
						buildParsedPostsWrapper: ${buildParsedPostsWrapper},
					}`,
			}, () => chrome.tabs.executeScript(id, { file: `./src/js/scripts/${fileName}.js` }));
		}
		return alert("Sorry, it looks like you have no tabs opened in your browser! :-(");
	});
}
