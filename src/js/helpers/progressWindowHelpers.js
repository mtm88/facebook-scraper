function buildProgressWindowDiv(calculatedDivWidth, calculatedDivLeft) {
	const progressWindowDiv = document.createElement("div");
	progressWindowDiv.id = "progressWindowDiv";
	progressWindowDiv.style.cssText = `display: flex; flex-direction: column; width: ${calculatedDivWidth}px; position: fixed; top: 100px; left: ${calculatedDivLeft}px; z-index: 1000; background-color: #ffffff; overflow: hidden; border: 2px solid rgb(0, 0, 0, 0.2)`;

	return progressWindowDiv;
}

function buildHeaderWrapperDiv() {
	const headerWrapperDiv = document.createElement("div");
	headerWrapperDiv.id = "headerWrapperDiv";
	headerWrapperDiv.style.cssText = "flex: 1; background-color: #ffffff;";

	return headerWrapperDiv;
}

function buildProgressSummaryParagraph() {
	const progressSummary = document.createElement("p");
	progressSummary.textContent = "Progress summary";
	progressSummary.style.cssText = "padding: 10px 20px; font-weight: 800; font-size: 14px;";

	return progressSummary;
}

function buildLoadedSoFarParagraph() {
	return new Promise((resolve) => {
		const loadedSoFar = document.createElement("p");
		loadedSoFar.id = "loadedSoFar";
		loadedSoFar.textContent = "Posts loaded: 0";
		loadedSoFar.style.cssText = "padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-weight: 500";

		return chrome.storage.local.get(["divsWithPostLength"], (({ divsWithPostLength }) => {
			loadedSoFar.textContent = `Posts loaded: ${divsWithPostLength}`;
			return resolve(loadedSoFar);
		}));
	});
}

function buildParsedSoFarParagraph() {
	const parsedSoFar = document.createElement("p");
	parsedSoFar.id = "parsedSoFar";
	parsedSoFar.textContent = "Posts processed: 0";
	parsedSoFar.style.cssText = "padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-weight: 500";

	return parsedSoFar;
}

function buildUserInfoParagraph() {
	const userInfo = document.createElement("p");
	userInfo.id = "userInfo";
	userInfo.textContent = "Please don't manipulate the website while scraper is working. If you see no progress in the number of posts parsed for a long time, please restart the scraper.";
	userInfo.style.cssText = "padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-size: 10px";

	return userInfo;
}

function buildUserWarningParagraph() {
	const userWarning = document.createElement("p");
	userWarning.id = "userWarning";
	userWarning.textContent = "This browser tab has to stay ACTIVE during this process";
	userWarning.style.cssText = "padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-style: italic; font-size: 10px; color: #FF0000";

	return userWarning;
}

function buildHeaderFieldsWrapper() {
	const headerFieldsWrapper = document.createElement("div");
	headerFieldsWrapper.id = "headerFieldsWrapper";
	headerFieldsWrapper.style.cssText = "flex: 1; display: flex; flexDirection: row;";

	return headerFieldsWrapper;
}

function buildParsedPostsWrapper() {
	const parsedPostsWrapper = document.createElement("div");
	parsedPostsWrapper.id = "parsedPostsWrapper";
	parsedPostsWrapper.style.cssText = "flex: 1; background-color: #ffffff; height: 400px; overflow-y: scroll; margin-right: -17px";
	
	return parsedPostsWrapper;
}

export {
	buildProgressWindowDiv,
	buildHeaderWrapperDiv,
	buildProgressSummaryParagraph,
	buildLoadedSoFarParagraph,
	buildParsedSoFarParagraph,
	buildUserInfoParagraph,
	buildUserWarningParagraph,
	buildHeaderFieldsWrapper,
	buildParsedPostsWrapper,
};
