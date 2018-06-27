function injectTestDiv() {
	const hiddenDiv = document.createElement("div");
	hiddenDiv.id = "hiddenDiv";
	hiddenDiv.style.cssText = "width: 1px; height: 1px; display: none; position: absolute; top: 0, right: 0;";
	hiddenDiv.onclick = () => chrome.runtime.sendMessage({ action: "injectSelector" });

	document.body.appendChild(hiddenDiv);
}

injectTestDiv();
