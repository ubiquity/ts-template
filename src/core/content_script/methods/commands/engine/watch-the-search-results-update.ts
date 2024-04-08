export default function (signal) {
  const targetNode: HTMLDivElement | null = document.querySelector(
    "#content-main > div.search-content > div"
  );
  const config = { attributes: true, childList: true, subtree: true };

  const observer = new MutationObserver(callback);

  if (targetNode) {
    observer.observe(targetNode, config);
  }

  function callback(mutationsList, observer) {
    let x = mutationsList.length;
    while (x--) {
      const mutation = mutationsList[x];
      if (
        mutation.target &&
        mutation.target.classList &&
        mutation.target.classList.length
      ) {
        const classList = [...mutation.target.classList];
        if (
          classList.includes("presence-indicator") &&
          classList.includes("presence-indicator--size-4") &&
          classList.includes("presence-entity__indicator") &&
          classList.includes("presence-entity__indicator--size-4")
        ) {
          observer.disconnect();
          return signal(mutation);
        }
      }
    }

    if (mutationsList.length === 75) {
      //	Could mean that the page scrolled to the bottom?
      return signal(mutationsList);
    }
  }
}
