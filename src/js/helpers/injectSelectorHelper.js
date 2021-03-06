function buildInjectionDiv(scrollableArea, userSeesModal, correctModalIndex) {
	const div = document.createElement("div");

	const currentElementBodyWidth = userSeesModal ? scrollableArea[correctModalIndex].clientWidth : document.body.clientWidth;
	const calculatedDivWidth = (currentElementBodyWidth * (userSeesModal ? 0.6 : 0.4));
	const calculatedDivLeft = userSeesModal ? ((document.body.clientWidth - currentElementBodyWidth) / 2) + (currentElementBodyWidth / 2 - 250) : (currentElementBodyWidth / 2) - (calculatedDivWidth / 2);

	div.id = "selectionInjectorDiv";
	div.style.cssText = `display: flex; flex-direction: column; width: ${calculatedDivWidth}px; position: fixed; top: 100px; left: ${calculatedDivLeft}px; border: 2px solid rgb(0, 0, 0, 0.2); z-index: 1000; background-color: #ffffff`;
	return div;
}

function buildMessageParagraph() {
	const paragraphDiv = document.createElement("div");
	paragraphDiv.id = "paragraphDiv";
	paragraphDiv.style.cssText = "flex: 1; padding-left: 20px; margin-top: 10px;";

	const messageParagraph = document.createElement("p");
	messageParagraph.textContent = "Please select the page you would like to collect from: ";

	paragraphDiv.appendChild(messageParagraph);

	return paragraphDiv;
}

function buildCloseButtonDiv(divId) {
	const closeDiv = document.createElement("div");
	closeDiv.id = "closeButtonDiv";
	closeDiv.style.cssText = "position: absolute; top: 0; right: 0; padding: 8px 10px; font-size: 15px;";
	closeDiv.textContent = "X";

	closeDiv.onmouseover = () => closeDiv.style.cursor = "pointer";
	closeDiv.onclick = () => {
		helpers.removeInjection("sentRequestsP");
		helpers.removeInjection(divId);
	};

	return closeDiv;
}

function buildContentDiv({ opts: { pages, fetchComments } = {} }) {
	const contentDiv = document.createElement("div");
	contentDiv.id = "contentDiv";
	contentDiv.style.cssText = "display: flex; flex-wrap: wrap; justify-content: center; align-content: flex-start; margin: 0px 5px 30px;";

	pages.forEach(({ settings: { pageId, recordsToPull = 50 }, name, }) => {
		const pageDiv = document.createElement("div");

		pageDiv.id = pageId;
		pageDiv.style.cssText = "padding: 10px 20px; margin: 10px; border: solid 1px; border-color: rgb(0, 0, 0, 0.25); border-radius: 3px";
		pageDiv.textContent = name;

		pageDiv.onmouseover = () => {
			pageDiv.style.cursor = "pointer";
			pageDiv.style["background-color"] = "#55e89a";
		};

		pageDiv.onmouseleave = () => {
			pageDiv.style["background-color"] = "#ffffff";
		};

		pageDiv.onclick = () => chrome.runtime.sendMessage({ action: "userSelectedPage", payload: { pageId, recordsToPull, fetchComments } });

		contentDiv.appendChild(pageDiv);
	});

	return contentDiv;
}

export {
	buildInjectionDiv,
	buildMessageParagraph,
	buildCloseButtonDiv,
	buildContentDiv,
};
