function injectSelectionMenu() {
	const scrollableArea = document.getElementsByClassName("uiScrollableAreaWrap scrollable");
	const existingSelectionDiv = document.getElementById("selectionInjectorDiv");
	const userSeesModal = !!scrollableArea.length;

	/* facebook messenger overlay uses the same scrollableArea classes,
  if there's a message awaiting the array will have 1 more element */
	const correctModalIndex = scrollableArea.length > 1 ? 1 : 0;

	if (!existingSelectionDiv) {
		const div = buildInjectionDiv(scrollableArea, userSeesModal, correctModalIndex);
		div.appendChild(buildCloseButtonDiv());
		div.appendChild(buildMessageParagraph());

		if (opts && opts.pages && opts.pages.length) {
			div.appendChild(buildContentDiv());
		}

		if (userSeesModal) {
			return scrollableArea[correctModalIndex].appendChild(div);
		}
		return document.body.appendChild(div);
	}
}

injectSelectionMenu();

function buildInjectionDiv(scrollableArea, userSeesModal, correctModalIndex) {
	const div = document.createElement("div");

	const currentElementBodyWidth = userSeesModal ? scrollableArea[correctModalIndex].clientWidth : document.body.clientWidth;
	const calculatedDivLeft = userSeesModal ? ((document.body.clientWidth - currentElementBodyWidth) / 2) + (currentElementBodyWidth / 2 - 250) : (currentElementBodyWidth / 2) - 250;
	const calculatedDivWidth = (currentElementBodyWidth * (userSeesModal ? 0.6 : 0.3));

	div.id = "selectionInjectorDiv";
	div.style.cssText = `display: flex; flex-direction: column; width: ${calculatedDivWidth}px; position: fixed; top: 100px; left: ${calculatedDivLeft}px; border-style: solid 1px; z-index: 1000; background-color: #ffffff`;
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

function buildCloseButtonDiv() {
	const closeDiv = document.createElement("div");
	closeDiv.id = "closeButtonDiv";
	closeDiv.style.cssText = "position: absolute; top: 0; right: 0; padding: 8px 10px; font-size: 15px;";
	closeDiv.textContent = "X";

	closeDiv.onmouseover = () => closeDiv.style.cursor = "pointer";
	closeDiv.onclick = () => chrome.runtime.sendMessage({ action: "removeInjection", payload: { id: "selectionInjectorDiv" } });

	return closeDiv;
}

function buildContentDiv() {
	const contentDiv = document.createElement("div");
	contentDiv.id = "contentDiv";
	contentDiv.style.cssText = "display: flex; flex-wrap: wrap; justify-content: center; align-content: flex-start; margin: 0px 5px 30px;";

	opts.pages.forEach(({ id }) => {
		const pageDiv = document.createElement("div");

		pageDiv.id = id;
		pageDiv.style.cssText = "padding: 10px 20px; margin: 10px; border: solid 1px; border-color: rgb(0, 0, 0, 0.25); border-radius: 3px";
		pageDiv.textContent = `Page ${id}`;

		pageDiv.onmouseover = () => {
			pageDiv.style.cursor = "pointer";
			pageDiv.style["background-color"] = "#55e89a";
		};

		pageDiv.onmouseleave = () => {
			pageDiv.style["background-color"] = "#ffffff";
		};

		pageDiv.onclick = () => chrome.runtime.sendMessage({ action: "userSelectedPage", payload: { id, divId: "selectionInjectorDiv" } });

		contentDiv.appendChild(pageDiv);
	});

	return contentDiv;
}
