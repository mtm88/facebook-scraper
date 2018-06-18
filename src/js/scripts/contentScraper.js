(() => {
  const scrollableArea = document.getElementsByClassName("uiScrollableAreaWrap scrollable");
  const userSeesModal = !!scrollableArea.length;

  /* facebook messenger overlay uses the same scrollableArea classes,
  if there's a message awaiting the array will have 1 more element */
  const correctModalIndex = scrollableArea.length > 1 ? 1 : 0;

  const contentPosts = fetchContentPosts(userSeesModal);

  function parseContentPosts(divsWithPost) {
    const fieldsToMap = ["title", "author", "timeAdded", "link", "contentId", "comments", "shares", "reactions"];
    const searchURL = parsedSearchURL(opts);

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

    const parsedPosts = Array.from(divsWithPost).map((post) => {
      const parsedPost = { searchURL };

      fieldsToMap.forEach((field) => {
        const header = fieldParsers.header({ post });
        const footer = fieldParsers.footer({ post });

        try {
          parsedPost[field] = fieldParsers[field]({ post, header, footer });
        } catch (error) {
          parsedPost[field] = null;
        }
      });

      return parsedPost;
    });

    chrome.storage.local.set({ parsedPosts: JSON.stringify(parsedPosts) });
  }

  function parsedSearchURL(opts) {
    if (opts && opts.currentURL) {
      return opts.currentURL.slice(0, opts.currentURL.indexOf("?"));
    }
    return null;
  }

  function fetchContentPosts(userSeesModal, scrollCounter = 0) {
    let divsWithPost;

    if (userSeesModal) {
      const scrollableArea = document.getElementsByClassName("uiScrollableAreaWrap scrollable");
      divsWithPost = scrollableArea[correctModalIndex].getElementsByClassName("userContentWrapper") || [];
    }

    chrome.storage.local.set({ divsWithPost, divsWithPostLength: divsWithPost.length });

    chrome.storage.local.get(["recordsToPullCount"], (results) => {
      if (divsWithPost.length >= results.recordsToPullCount) {
        // slice the array if we've pulled more than we require
        if (divsWithPost.length > results.recordsToPullCount) {
          divsWithPost = Array.from(divsWithPost).slice(0, results.recordsToPullCount);
        }
        return parseContentPosts(divsWithPost);
      }

      if (scrollCounter > 10) {
        return alert("There seems to be a problem with fetching the requested number of posts. Please try again.");
      }

      scrollDown(userSeesModal, scrollableArea, scrollCounter);
    });
  }

  function scrollDown(userSeesModal, scrollableArea, scrollCounter) {
    if (userSeesModal) {
      scrollableArea[correctModalIndex].scrollTop = scrollableArea[correctModalIndex].scrollHeight;

      setTimeout(() => {
        scrollCounter++;
        fetchContentPosts(userSeesModal, scrollCounter);
      }, 3000);
    }
  }
})();

