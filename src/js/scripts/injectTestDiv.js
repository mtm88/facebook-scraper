function injectTestDiv() {
	const existingHiddenDiv = document.getElementById("hiddenDiv");

	if (!existingHiddenDiv) {
		const hiddenDiv = document.createElement("div");
		hiddenDiv.id = "hiddenDiv";
		hiddenDiv.style.cssText = "width: 1px; height: 1px; display: none; position: absolute; top: 0, right: 0;";
		hiddenDiv.textContent = chrome.runtime.id;
		hiddenDiv.onclick = () => chrome.runtime.sendMessage({ action: "injectSelector" });

		return chrome.storage.local.set({
			pages: [
				{
					name: "Selenium Test Page",
					settings: {
						pageId: 0,
						recordsToPull: 3,
					},
				},
			],
		}, () => {
			document.body.appendChild(hiddenDiv);
		});
	}
}

injectTestDiv();
