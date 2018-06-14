(function () {
  const scrollableArea = document.getElementsByClassName("uiScrollableAreaWrap scrollable");
  const userSeesModal = !!scrollableArea.length;

  const divsWithPost = scrollableArea[0].getElementsByClassName("userContentWrapper") || [];

  const parsedPosts = [];

  Array.prototype.forEach.call(divsWithPost, (post) => {
    try {
      const header = divsWithPost[1].children[0].children[1].children[1].children[0].children[1].children[1].children[0].children[0].children[1];
      const author = header.children[0].children[0].children[0].children[0].textContent;
      const timeAdded = header.children[1].children[2].children[0].children[0].children[0].getAttribute("title");
      const title = post.children[0].children[1].children[2].children[0].textContent;

      return parsedPosts.push({ title, author, timeAdded });
    } catch (error) {
      return console.error(error);
    }
  });

  debugger;

  // WORKS! for later
  // if (userSeesModal) {
  //   // window.scrollTo({ left: 0, top: document.body.clientHeight, behavior: "smooth" });
  //   scrollableArea[0].scrollTop = scrollableArea[0].scrollHeight;
  // }
})();
