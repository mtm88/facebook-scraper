function displayAuthenticatingWindow() {
	const currentElementBodyWidth = document.body.clientWidth;
	const calculatedDivWidth = currentElementBodyWidth * 0.3;
	const calculatedDivLeft = (currentElementBodyWidth / 2) - (calculatedDivWidth / 2);

	const div = document.createElement("div");
	div.id = "authenticatingWindowDiv";
	div.style.cssText = `display: flex; flex-direction: column; width: ${calculatedDivWidth}px; position: fixed; top: 100px; left: ${calculatedDivLeft}px; z-index: 1000; background-color: #ffffff; border: 1px solid rgb(0, 0, 0, 0.25)`;
	document.body.appendChild(div);

	const closeDiv = document.createElement("div");
	closeDiv.id = "closeButtonDiv";
	closeDiv.style.cssText = "position: absolute; top: 0; right: 0; padding: 8px 10px; font-size: 15px;";
	closeDiv.textContent = "X";
	div.appendChild(closeDiv);

	closeDiv.onmouseover = () => closeDiv.style.cursor = "pointer";
	closeDiv.onclick = () => helpers.removeInjection("authenticatingWindowDiv");

	const authMessage = document.createElement("p");
	authMessage.textContent = "Authenticating with the server...";
	authMessage.style.cssText = "padding: 10px 20px; font-weight: 600; font-size: 12px;";
	div.appendChild(authMessage);
}

function hideAuthenticationWindow() {
	return helpers.removeInjection("authenticatingWindowDiv");
}

export {
	displayAuthenticatingWindow,
	hideAuthenticationWindow,
};
