(function () {
  const div = buildInjectionDiv();
  div.appendChild(buildCloseButtonDiv());
  div.appendChild(buildMessageParagraph());
  div.appendChild(buildContentDiv());

  document.body.appendChild(div);
})();

function buildInjectionDiv() {
  const div = document.createElement("div");

  const documentBodyWidth = document.body.clientWidth;
  const calculatedDivLeft = (documentBodyWidth / 2) - 250;
  const calculatedDivWidth = (documentBodyWidth * 0.3);

  div.id = "selectionInjectorDiv";
  div.style.display = "flex";
  div.style.flexDirection = "column";
  div.style.width = `${calculatedDivWidth}px`;
  div.style.position = "fixed";
  div.style.top = "100px";
  div.style.left = `${calculatedDivLeft}px`;
  div.style["border-style"] = "solid";
  div.style["border-width"] = "1px";
  div.style["z-index"] = 1000;
  div.style.backgroundColor = "#ffffff";

  return div;
}

function buildMessageParagraph() {
  const paragraphDiv = document.createElement("div");
  paragraphDiv.id = "paragraphDiv";
  paragraphDiv.style.flex = 1;
  paragraphDiv.style.paddingLeft = "20px";
  paragraphDiv.style.marginTop = "10px";

  const messageParagraph = document.createElement("p");
  messageParagraph.textContent = "Please select the page you would like to collect from: ";

  paragraphDiv.appendChild(messageParagraph);

  return paragraphDiv;
}

function buildCloseButtonDiv() {
  const closeDiv = document.createElement("div");

  closeDiv.id = "closeButtonDiv";
  closeDiv.style.position = "absolute";
  closeDiv.style.top = 0;
  closeDiv.style.right = 0;
  closeDiv.style.padding = "8px 10px";
  closeDiv.style.fontSize = "15px";
  closeDiv.textContent = "X";

  closeDiv.onmouseover = () => closeDiv.style.cursor = "pointer";
  closeDiv.onclick = () => chrome.runtime.sendMessage({ action: "close" });

  return closeDiv;
}

function buildContentDiv() {
  const contentDiv = document.createElement("div");

  contentDiv.id = "contentDiv";
  contentDiv.style.display = "flex";
  contentDiv.style["flex-wrap"] = "wrap";
  contentDiv.style["justify-content"] = "center";
  contentDiv.style["align-content"] = "flex-start";
  contentDiv.style.margin = "0px 5px 30px";

  const collectPages = mockedCollectPages();
  collectPages.forEach(({ id, label }) => {
    const pageDiv = document.createElement("div");

    pageDiv.id = id;
    pageDiv.style.padding = "10px 20px";
    pageDiv.style.margin = "10px";
    pageDiv.style["border-style"] = "solid";
    pageDiv.style["border-color"] = "rgb(0, 0, 0, 0.25)";
    pageDiv.style["border-width"] = "1px";
    pageDiv.style["border-radius"] = "1px";
    
    pageDiv.textContent = `Page ${id}`;
    
    pageDiv.onmouseover = () => {
      pageDiv.style.cursor = "pointer";
      pageDiv.style["background-color"] = "#55e89a";
    }
    
    pageDiv.onmouseleave = () => {
      pageDiv.style["background-color"] = "#ffffff";
    }

    contentDiv.appendChild(pageDiv);
  });

  return contentDiv;
}

function mockedCollectPages() {
  const mockedResultsCount = 10;
  let mockedArray = [];

  for (let i = 0; i <= mockedResultsCount; i += 1) {
    mockedArray.push({ id: i, label: `Page ${i}` });
  }

  return mockedArray;
}
