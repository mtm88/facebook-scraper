(() => {
  const currentElementBodyWidth = document.body.clientWidth;
  const calculatedDivWidth = currentElementBodyWidth * 0.7;
  const calculatedDivLeft = (currentElementBodyWidth / 2) - (calculatedDivWidth / 2);
  
  const div = document.createElement("div");
  div.id = "progressWindowDiv";
  div.style.cssText = `display: flex; flex-direction: column; width: ${calculatedDivWidth}px; position: fixed; top: 100px; left: ${calculatedDivLeft}px; z-index: 1000; background-color: #ffffff`;
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
  headerWrapperDiv.style.cssText = "flex: 1; background-color: #ffffff; border: 1px solid rgb(0, 0, 0, 0.35);";
  div.appendChild(headerWrapperDiv);

  const progressSummary = document.createElement("p");
  progressSummary.textContent = "Progress summary:";
  progressSummary.style.cssText = "padding: 10px 20px; font-weight: 800; font-size: 14px;";
  headerWrapperDiv.appendChild(progressSummary);

  chrome.storage.onChanged.addListener((storage) => {
    for (key in storage) {
      switch (key) {
        case "divsWithPostLength": {
          let loadedSoFar = document.getElementById("loadedSoFar");
          const textContent = `Posts loaded: ${storage[key].newValue}`;

          if (!loadedSoFar) {
            loadedSoFar = document.createElement("p");
            loadedSoFar.id = "loadedSoFar";
            loadedSoFar.textContent = "Posts loaded: 0";
            loadedSoFar.style.cssText = "padding-left: 20px; margin-top: 8px; margin-bottom: 20px; font-weight: 500";
            headerWrapperDiv.appendChild(loadedSoFar);
          }
          loadedSoFar.textContent = textContent;
          break;
        }
        case "parsedPosts": {
          const parsedPosts = JSON.parse(storage[key].newValue);

          postsTableFields = [{ label: "Title", flex: 4 }, { label: "Author", flex: 2 }, { label: "Shares", flex: 1 }, { label: "Comments", flex: 1 }, { label: "Reactions", flex: 1 }]


          const parsedPostsWrapper = document.createElement("div");
          parsedPostsWrapper.id = "parsedPostsWrapper";
          parsedPostsWrapper.style.cssText = "flex: 1; background-color: #ffffff; overflow: auto; height: 400px";
          div.appendChild(parsedPostsWrapper);

          const headerFieldsWrapper = document.createElement("div");
          headerFieldsWrapper.id = "headerFieldsWrapper";
          headerFieldsWrapper.style.cssText = "flex: 1; display: flex; flexDirection: row;";
          parsedPostsWrapper.appendChild(headerFieldsWrapper);

          postsTableFields.forEach(({ label, flex }) => {
            const fieldHeader = document.createElement("div");
            fieldHeader.id = `${label.toLowerCase()}Header`;
            fieldHeader.style.cssText = `flex: ${flex}; border-right: solid 1px; border-bottom: solid 2px; border-top: solid 2px; border-color: rgb(0, 0, 0, 0.25); padding: 5px; font-weight: 600;`;
            fieldHeader.textContent = label;
            headerFieldsWrapper.appendChild(fieldHeader);
          });

          Array.from(parsedPosts).forEach((parsedPost) => {
            const postDivWrapper = document.createElement("div");
            postDivWrapper.id = `${parsedPost.contentId}Wrapper`;
            postDivWrapper.style.cssText = "flex: 1; display: flex; flexDirection: row;";

            postsTableFields.forEach(({ label, flex }) => {
              const newCellField = document.createElement("div");
              newCellField.id = `${label}cellField`;
              newCellField.style.cssText = `flex: ${flex}; border-right: solid 1px; border-color: rgb(0, 0, 0, 0.25); padding: 5px;`;
              newCellField.textContent = parsedPost[label.toLowerCase()];
              postDivWrapper.appendChild(newCellField);
            });

            parsedPostsWrapper.appendChild(postDivWrapper);
          });

          // Append the Submit button only when all results were loaded into the table
          const submitButton = document.createElement("div");
          submitButton.id = "submitButton";
          submitButton.style.cssText ="padding: 10px 20px; margin-left: 20px; margin-bottom: 20px; border-radius: 5px; width: 80px; text-align: center; font-size: 14px; background-color: #6699ff";
          submitButton.textContent = "Submit";
          headerWrapperDiv.appendChild(submitButton);
          break;
        }
        default: break;
      }
    }
  });
})();
