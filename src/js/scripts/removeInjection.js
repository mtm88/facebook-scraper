function removeInjection(injectionToRemove) {
	if (injectionToRemove) {
		const injectedElement = document.getElementById(injectionToRemove);

		if (injectedElement) {
			injectedElement.outerHTML = "";
		}
	}
}

export { removeInjection };
