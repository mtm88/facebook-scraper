(function () {
  const scrollableArea = document.getElementsByClassName("uiScrollableAreaWrap scrollable");
  const userSeesModal = !!scrollableArea.length;

  const divsWithPost = scrollableArea[0].getElementsByClassName("userContentWrapper") || [];

  const fieldsToMap = ["title", "author", "timeAdded", "link", "contentId", "comments", "shares", "reactions"];

  const fieldParsers = {
    header: ({ post }) => {
      const headerElement = post.children[0].children[1];

      let headerContentIndex;
      // post has a LIKE PAGE button = additional child on top
      if (headerElement.children[0].nodeName === "SPAN") {
        headerContentIndex = 1;
      } else {
        // post hasn't got a LIKE PAGE button
        headerContentIndex = 0;
      }
      return post.children[0].children[1].children[headerContentIndex].children[0].children[1].children[1].children[0].children[0].children[1];
    },
    footer: ({ post }) => post.children[1].children[0].children[3].children[0].children[0].children[0].children[0].children[0].children[0],
    title: ({ post }) => post.children[0].children[1].children[2].children[0].textContent,
    author: ({ header }) => header.children[0].children[0].children[0].children[0].textContent,
    timeAdded: ({ header }) => header.children[1].children[2].children[0].children[0].children[0].getAttribute("title"),
    link: ({ post }) => post.children[0].children[1].children[3].children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[1].getAttribute("href"),
    contentId: ({ post }) => post.children[1].children[0].children[1].getAttribute("value"),
    comments: ({ footer }) => {
      const parsedComments = parseInt(footer.children[0].children[0].children[0].textContent.replace(/\D+/g, ''), 10);
      return isNaN(parsedComments) ? null : parsedComments;
    },
    shares: ({ footer }) => {
      const parsedShares = parseInt(footer.children[0].children[1].children[0].textContent.replace(/\D+/g, ''), 10);
      return isNaN(parsedShares) ? null : parsedShares;
    },
    reactions: ({ footer }) => {
      const parsedReactions = parseInt(footer.children[1].children[0].children[0].children[1].children[0].children[0].textContent, 10);
      return isNaN(parsedReactions) ? null : parsedReactions;
    },
  };

  const parsedPosts = Array.prototype.map.call(divsWithPost, (post) => {
    const parsedPost = {};

    fieldsToMap.forEach((field) => {
      const header = fieldParsers.header({ post });
      const footer = fieldParsers.footer({ post });

      try {
        parsedPost[field] = fieldParsers[field]({ post, header, footer });
      } catch (error) {
        parsedPost[field] = null;
      }
    })
    return parsedPost;
  });

  debugger;

  // WORKS! for later
  // if (userSeesModal) {
  //   // window.scrollTo({ left: 0, top: document.body.clientHeight, behavior: "smooth" });
  //   scrollableArea[0].scrollTop = scrollableArea[0].scrollHeight;
  // }
})();
