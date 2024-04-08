import observeDomMutations from "./watch-the-search-results-update";
import {
  default as scrapeEachLead,
  ScraperSettings,
  PendingFrames,
} from "./controller-for-crawling-lead-profiles";
import { AppState } from "../../../../../@types/AppState";
import { MAX_SCRAPES } from "../../../../utils/constants";

export interface Selectors {
  individualSearchResult: string;
  nextSearchResultsPage: string;
  finalAnchor: string;
}

export default async function searchResultsController(
  state: AppState,
  loadingFrames: PendingFrames,
  selectors: Selectors,
  stayOnThisPage: boolean,
  source?: string[]
) {
  const scrapeSettings = {
    state,
    loadingFrames,
    selectors,
    pendingFrames: { accountView: 0 },
    document,
    lastPage: false, //	This is to tell the callbacks to break the scrape cycle when we're on the last page of search results.
    source,
  } as ScraperSettings;
  if (state.mode.safety) return scrapeEachLead(scrapeSettings);
  if (!source || !source.length) {
    /**
     * This is focusing on the search results pagination, where there exists a button to proceed to the next search results page.
     * This isn't important if the user is bringing their own direct list of URLs to scrape.
     */
    const nextPageButton: HTMLButtonElement | null = document.querySelector(
      selectors.nextSearchResultsPage
    );
    if (!nextPageButton)
      throw new Error(
        `It looks like it's time to update your selectors. No DOM elements were selected.`
      );
    if (nextPageButton.disabled) scrapeSettings.lastPage = true;
    if (!stayOnThisPage && window[MAX_SCRAPES] > 0) {
      //	"Don't stay on this page"
      await new Promise((resolve) => {
        observeDomMutations(() => {
          resolve(true);
        });
        nextPageButton.click();
      });
    }
  }
  return scrapeEachLead(scrapeSettings);
  // ========================================================= @RETURN ===
  // Do we still need to use this callback?
  function callback() {
    const viewport = document.scrollingElement || document.body;
    viewport.scrollTop = viewport.scrollHeight;
    observeDomMutations(function afterScroll() {
      return searchResultsController(
        state,
        loadingFrames,
        selectors,
        (stayOnThisPage = true),
        source
      );
    });
  }
}
