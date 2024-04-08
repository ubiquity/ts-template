const searchResultSelectors = [
  "main div div div div ol li div div div div div div div div div a", // update 15 march 2022
  "article > section.result-lockup > div dl > dt > a", // 2021
];

const nextPageSelectors = ["button.search-results__pagination-next-button"];

const finalSelectors = [
  "#content-main > div.profile-topcard.full-width.pb5 > div.container > div > div.profile-topcard__right-column.flex-column.pt6 > div.profile-topcard__contact-info.mt5 > dl > dd:nth-child(2) > a",
];

// export multiple selectors to fallback to old ones.

export default {
  individualSearchResult: searchResultSelectors,
  nextSearchResultsPage: nextPageSelectors,
  finalAnchor: finalSelectors,
};
