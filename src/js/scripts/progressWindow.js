
async function activateProgressWindow() {
	await displayProgressWindow();

	postsTableFields = [
		{ id: "title", label: "Title", flex: 4 },
		{ id: "author", label: "Author", flex: 2 },
		{ id: "shares", label: "Shares", flex: 1 },
		{ id: "comments", label: "Comments", flex: 1 },
		{ id: "commentsContent", label: "Comments & Responses scraped", flex: 1, opts: { length: true } },
		{ id: "reactions", label: "Reactions", flex: 1 },
	];

	const headerFieldsWrapper = document.getElementById("headerFieldsWrapper");

	postsTableFields.forEach(({ label, flex }) => {
		const fieldHeader = document.createElement("div");
		fieldHeader.id = `${label.toLowerCase()}Header`;
		fieldHeader.style.cssText = `flex: ${flex}; border-right: solid 1px; border-bottom: solid 1px; border-top: solid 1px; border-color: rgb(0, 0, 0, 0.25); padding: 5px; font-weight: 600;`;
		fieldHeader.textContent = label;
		headerFieldsWrapper.appendChild(fieldHeader);
	});

	chrome.storage.onChanged.addListener((storage) => storageChangeListener(storage));
}

activateProgressWindow();

function storageChangeListener(storage) {
	for (key in storage) {
		switch (key) {
			case "divsWithPostLength": {
				const loadedSoFar = document.getElementById("loadedSoFar");
				if (loadedSoFar) {
					loadedSoFar.textContent = `Posts loaded: ${storage[key].newValue}`;
				}
				break;
			}
			case "parsedPosts": {
				const parsedPosts = storage[key].newValue;
				const parsedPostsWrapper = document.getElementById("parsedPostsWrapper");
				const headerWrapperDiv = document.getElementById("headerWrapperDiv");

				// check if anything changed before updating the summary
				if (parsedPosts && parsedPosts.length) {
					const alreadyInjectedPosts = parsedPostsWrapper.children.length;
					const postsToInject = parsedPosts.slice(alreadyInjectedPosts);

					const parsedSoFar = document.getElementById("parsedSoFar");
					parsedSoFar.textContent = `Posts processed: ${parsedPosts.length}`;

					postsToInject.forEach((parsedPost) => {
						const postDivWrapper = document.createElement("div");
						postDivWrapper.id = `${parsedPost.contentId}Wrapper`;
						postDivWrapper.style.cssText = "flex: 1; display: flex; flexDirection: row;";

						postsTableFields.forEach(({ id, label, flex, opts = {} }) => {
							const newCellField = document.createElement("div");
							newCellField.id = `${label}cellField`;
							newCellField.style.cssText = `flex: ${flex}; border-right: solid 1px; border-color: rgb(0, 0, 0, 0.25); border-bottom: solid 1px rgb(0, 0, 0, 0.2); padding: 5px;`;

							// nested ternary as a guard against null values expected to have 'length' property
							newCellField.textContent = opts.length ? (parsedPost[id] && parsedPost[id].length) : parsedPost[id];
							postDivWrapper.appendChild(newCellField);
						});

						parsedPostsWrapper.prepend(postDivWrapper);
					});

					chrome.storage.local.get(["recordsToPull"], ({ recordsToPull }) => {
						const recordsToPullInt = parseInt(recordsToPull, 10);

						if (recordsToPull && recordsToPullInt === parsedPosts.length) {
							// remove user information & user warning div
							helpers.removeInjection("userInfo");
							helpers.removeInjection("userWarning");
							helpers.removeInjection("submitButton");

							// Append the Submit button only when all results were loaded into the table
							const submitButton = document.createElement("div");
							submitButton.id = "submitButton";
							submitButton.style.cssText = "padding: 10px 20px; margin-left: 20px; margin-bottom: 20px; border-radius: 5px; width: 80px; text-align: center; font-size: 14px; background-color: #6699ff";
							submitButton.textContent = "Submit";
							submitButton.onmouseover = () => submitButton.style.cursor = "pointer";
							submitButton.onclick = () => chrome.runtime.sendMessage({ action: "publishPosts" });

							headerWrapperDiv.appendChild(submitButton);
						}
					});
				}
				break;
			}
			default: break;
		}
	}
}

function displayProgressWindow() {
	return new Promise(async (resolve) => {
		const currentElementBodyWidth = document.body.clientWidth;
		const calculatedDivWidth = currentElementBodyWidth * 0.7;
		const calculatedDivLeft = (currentElementBodyWidth / 2) - (calculatedDivWidth / 2);

		const progressWindowDiv = scriptHelpers.buildProgressWindowDiv(calculatedDivWidth, calculatedDivLeft);

		const { userSeesModal, correctModalIndex } = helpers.userSeesPublicPostsModal();

		// decide where to append the progress window, as injecting outside modal will close it on interaction
		if (userSeesModal) {
			const parentElement = document.getElementsByClassName("uiScrollableAreaWrap scrollable")[correctModalIndex];
			parentElement.appendChild(progressWindowDiv);
		} else {
			document.body.appendChild(progressWindowDiv);
		}

		progressWindowDiv.appendChild(scriptHelpers.buildCloseButtonDiv("progressWindowDiv"));

		const headerWrapperDiv = scriptHelpers.buildHeaderWrapperDiv();
		progressWindowDiv.appendChild(headerWrapperDiv);

		headerWrapperDiv.appendChild(scriptHelpers.buildProgressSummaryParagraph());

		// 'Loaded so far' is a promise because it has to check the value in chrome storage
		try {
			const builtParagraph = await scriptHelpers.buildLoadedSoFarParagraph();
			headerWrapperDiv.appendChild(builtParagraph);
		} catch (error) {
			console.error(error);
		}

		headerWrapperDiv.appendChild(scriptHelpers.buildParsedSoFarParagraph());
		headerWrapperDiv.appendChild(scriptHelpers.buildUserInfoParagraph());
		headerWrapperDiv.appendChild(scriptHelpers.buildUserWarningParagraph());
		progressWindowDiv.appendChild(scriptHelpers.buildHeaderFieldsWrapper());

		const parsedPostsWrapper = document.createElement("div");
		parsedPostsWrapper.id = "parsedPostsWrapper";
		parsedPostsWrapper.style.cssText = "flex: 1; background-color: #ffffff; height: 400px; overflow-y: scroll; margin-right: -17px";
		progressWindowDiv.appendChild(parsedPostsWrapper);

		return resolve();
	});
}
