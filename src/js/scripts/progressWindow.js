
function displayProgressWindow() {
	const currentElementBodyWidth = document.body.clientWidth;
	const calculatedDivWidth = currentElementBodyWidth * 0.7;
	const calculatedDivLeft = (currentElementBodyWidth / 2) - (calculatedDivWidth / 2);

	const div = document.createElement("div");
	div.id = "progressWindowDiv";
	div.style.cssText = `display: flex; flex-direction: column; width: ${calculatedDivWidth}px; position: fixed; top: 100px; left: ${calculatedDivLeft}px; z-index: 1000; background-color: #ffffff; overflow: hidden; border: 2px solid rgb(0, 0, 0, 0.2)`;
	document.body.appendChild(div);

	const closeDiv = document.createElement("div");
	closeDiv.id = "closeButtonDiv";
	closeDiv.style.cssText = "position: absolute; top: 0; right: 0; padding: 8px 10px; font-size: 15px;";
	closeDiv.textContent = "X";
	div.appendChild(closeDiv);

	closeDiv.onmouseover = () => closeDiv.style.cursor = "pointer";
	closeDiv.onclick = () => chrome.runtime.sendMessage({ action: "removeInjection", payload: { id: "progressWindowDiv" } });

	const headerWrapperDiv = document.createElement("div");
	headerWrapperDiv.id = "headerWrapperDiv";
	headerWrapperDiv.style.cssText = "flex: 1; background-color: #ffffff;";
	div.appendChild(headerWrapperDiv);

	const progressSummary = document.createElement("p");
	progressSummary.textContent = "Progress summary";
	progressSummary.style.cssText = "padding: 10px 20px; font-weight: 800; font-size: 14px;";
	headerWrapperDiv.appendChild(progressSummary);

	loadedSoFar = document.createElement("p");
	loadedSoFar.id = "loadedSoFar";
	loadedSoFar.textContent = "Posts loaded: 0";
	loadedSoFar.style.cssText = "padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-weight: 500";
	headerWrapperDiv.appendChild(loadedSoFar);

	parsedSoFar = document.createElement("p");
	parsedSoFar.id = "parsedSoFar";
	parsedSoFar.textContent = "Posts processed: 0";
	parsedSoFar.style.cssText = "padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-weight: 500";
	headerWrapperDiv.appendChild(parsedSoFar);

	userInfo = document.createElement("p");
	userInfo.id = "userInfo";
	userInfo.textContent = "Please don't manipulate the website while scraper is working. If you see no progress in the number of posts parsed for a long time, please restart the process.";
	userInfo.style.cssText = "padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-style: italic; font-size: 10px; color: #FF0000";
	headerWrapperDiv.appendChild(userInfo);

	const headerFieldsWrapper = document.createElement("div");
	headerFieldsWrapper.id = "headerFieldsWrapper";
	headerFieldsWrapper.style.cssText = "flex: 1; display: flex; flexDirection: row;";
	div.appendChild(headerFieldsWrapper);

	const parsedPostsWrapper = document.createElement("div");
	parsedPostsWrapper.id = "parsedPostsWrapper";
	parsedPostsWrapper.style.cssText = "flex: 1; background-color: #ffffff; height: 400px; overflow-y: scroll; margin-right: -17px";
	div.appendChild(parsedPostsWrapper);


	postsTableFields = [
		{ id: "title", label: "Title", flex: 4 },
		{ id: "author", label: "Author", flex: 2 },
		{ id: "shares", label: "Shares", flex: 1 },
		{ id: "comments", label: "Comments", flex: 1 },
		{ id: "commentsContent", label: "Comments & Responses scraped", flex: 1, opts: { length: true } },
		{ id: "reactions", label: "Reactions", flex: 1 },
	];

	postsTableFields.forEach(({ label, flex }) => {
		const fieldHeader = document.createElement("div");
		fieldHeader.id = `${label.toLowerCase()}Header`;
		fieldHeader.style.cssText = `flex: ${flex}; border-right: solid 1px; border-bottom: solid 1px; border-top: solid 1px; border-color: rgb(0, 0, 0, 0.25); padding: 5px; font-weight: 600;`;
		fieldHeader.textContent = label;
		headerFieldsWrapper.appendChild(fieldHeader);
	});

	chrome.storage.onChanged.addListener((storage) => {
		for (key in storage) {
			switch (key) {
			case "divsWithPostLength": {
				const loadedSoFar = document.getElementById("loadedSoFar");
				const textContent = `Posts loaded: ${storage[key].newValue}`;
				loadedSoFar.textContent = textContent;
				break;
			}
			case "parsedPosts": {
				const parsedPosts = storage[key].newValue;
					
				// check if anything changed before updating the summary
				if (parsedPosts) {
					const alreadyInjectedPosts = parsedPostsWrapper.children.length;
					const postsToInject = parsedPosts.slice(alreadyInjectedPosts);
						
					const parsedSoFar = document.getElementById("parsedSoFar");
					const textContent = `Posts processed: ${parsedPosts.length}`;
					parsedSoFar.textContent = textContent;

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
						
					chrome.storage.local.get(["recordsToPull"], ({ recordsToPull = 5 }) => {
						recordsToPull = 5;
						if (recordsToPull && recordsToPull === parsedPosts.length) {
							// remove user information div
							const userInfoDiv = document.getElementById("userInfo");
							userInfoDiv.outerHTML = "";
							// Append the Submit button only when all results were loaded into the table
							const submitButton = document.createElement("div");
							submitButton.id = "submitButton";
							submitButton.style.cssText = "padding: 10px 20px; margin-left: 20px; margin-bottom: 20px; border-radius: 5px; width: 80px; text-align: center; font-size: 14px; background-color: #6699ff";
							submitButton.textContent = "Submit";
							submitButton.onmouseover = () => closeDiv.style.cursor = "pointer";
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
	});
}

displayProgressWindow();
