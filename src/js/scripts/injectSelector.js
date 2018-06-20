function injectSelectionMenu() {
	const scrollableArea = document.getElementsByClassName("uiScrollableAreaWrap scrollable");
	const existingSelectionDiv = document.getElementById("selectionInjectorDiv");
	const userSeesModal = !!scrollableArea.length;

	/* facebook messenger overlay uses the same scrollableArea classes,
  if there's a message awaiting the array will have 1 more element */
	const correctModalIndex = scrollableArea.length > 1 ? 1 : 0;

	if (!existingSelectionDiv) {
		const div = opts.scriptHelpers.buildInjectionDiv(scrollableArea, userSeesModal, correctModalIndex);
		div.appendChild(opts.scriptHelper.buildCloseButtonDiv());
		div.appendChild(opts.scriptHelper.buildMessageParagraph());

		if (opts && opts.pages && opts.pages.length) {
			div.appendChild(opts.scriptHelper.buildContentDiv());
		}

		if (userSeesModal) {
			return scrollableArea[correctModalIndex].appendChild(div);
		}
		return document.body.appendChild(div);
	}
}

injectSelectionMenu();
