function injectSelectionMenu() {
	const scrollableArea = document.getElementsByClassName("uiScrollableAreaWrap scrollable");
	const existingSelectionDiv = document.getElementById("selectionInjectorDiv");
	const userSeesModal = !!scrollableArea.length;

	/* facebook messenger overlay uses the same scrollableArea classes,
  if there's a message awaiting the array will have 1 more element */
	const correctModalIndex = scrollableArea.length > 1 ? 1 : 0;

	if (!existingSelectionDiv) {
		const div = scriptHelpers.buildInjectionDiv(scrollableArea, userSeesModal, correctModalIndex);
		div.appendChild(scriptHelpers.buildCloseButtonDiv("selectionInjectorDiv"));
		div.appendChild(scriptHelpers.buildMessageParagraph());

		if (opts && opts.pages && opts.pages.length) {
			div.appendChild(scriptHelpers.buildContentDiv());
		}

		if (userSeesModal) {
			return scrollableArea[correctModalIndex].appendChild(div);
		}
		return document.body.appendChild(div);
	}
}

injectSelectionMenu();
