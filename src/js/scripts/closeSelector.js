(function () {
  const injectedSelectorDiv = document.getElementById("selectionInjectorDiv");
  const scrollableArea = document.getElementsByClassName("uiScrollableAreaWrap scrollable");

  if (injectedSelectorDiv) {
    injectedSelectorDiv.outerHTML = "";
  }
})();
