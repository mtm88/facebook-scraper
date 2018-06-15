(() => {
  const div = document.createElement("div");

  const currentElementBodyWidth = document.body.clientWidth;
  const calculatedDivWidth = currentElementBodyWidth * 0.3;
  const calculatedDivLeft = (currentElementBodyWidth / 2) - (calculatedDivWidth / 2);

  div.id = "progressWindowDiv";
  div.style.display = "flex";
  div.style.flexDirection = "column";
  div.style.width = `${calculatedDivWidth}px`;
  div.style.minHeight = "100px";
  div.style.position = "fixed";
  div.style.top = "100px";
  div.style.left = `${calculatedDivLeft}px`;
  div.style["border-style"] = "solid";
  div.style["border-width"] = "1px";
  div.style["z-index"] = 1000;
  div.style.backgroundColor = "#ffffff";

  document.body.appendChild(div);

  const progressSummary = document.createElement("p");
  progressSummary.textContent = "Progress summary:";
  progressSummary.style.padding = "10px 20px";
  progressSummary.style.fontWeight = 800;
  progressSummary.style.fontSize = "14px";

  div.appendChild(progressSummary);

  const loadedSoFar = document.createElement("p");
  loadedSoFar.textContent = "Posts loaded so far: 0";
  loadedSoFar.style.paddingLeft = "20px";
  loadedSoFar.style.marginTop = "8px";
  loadedSoFar.style.marginBottom = "20px";
  loadedSoFar.style.fontWeight = 500;

  div.appendChild(loadedSoFar);

  const parsedPostsWrapper = document.createElement("div");
  div.style.flex = "1";
  div.style.backgroundColor = "gray";

  div.appendChild(parsedPostsWrapper);
  chrome.storage.onChanged.addListener((storage) => {
    for (key in storage) {
      switch (key) {
        case "divsWithPostLength": {
          loadedSoFar.textContent = `Posts loaded so far: ${storage[key].newValue}`;
          break;
        }
        case "parsedPosts": {

          break;
        }
        default: break;
      }
    }
  });
})();
