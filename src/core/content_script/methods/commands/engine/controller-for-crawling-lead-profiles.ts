import Swal from "sweetalert2";
import { AppState } from "../../../../../@types/AppState";
import { Credits } from "../../../../../@types/User";
import { decreaseCredits, getCredits } from "../../../../popup/utils/api";
import { goToUpgradePage } from "../../../../popup/utils/message";
import { trackEnrichmentResult } from "../../../../utils/analytics/track-enrichment-result";
import { DATABASE_KEY_SIGNATURE } from "../../../content_script";
import { getFullStorageContent } from "../../utils/get-full-storage-content";
import dbHistory from "../database";
import returnControlBackToParent, {
  Selectors,
} from "./controller-to-navigate-the-search-results";
import remotePageOperations from "./remote-page-operations";
import { getLocalCredits, setLocalCredits } from "../../../../utils/storage";
import { isPeopleSearchPage } from "../../../../utils/domain";
import {
  MAX_SCRAPES,
  CREDITS_CHUNK_SIZE,
  EMAILS_FOUND,
  TEMP_CREDITS,
} from "../../../../utils/constants";

export interface PendingFrames {
  accountView: number;
}

export interface ScraperSettings extends ScrapeCommons {
  document: HTMLDocument;
  source: string[];
}

interface ScrapeCommons {
  state: AppState;
  pendingFrames: PendingFrames;
  selectors: Selectors;
  lastPage: boolean; //	lastPage? is a quick fix for the last page of search results.
}

interface IIFrameLoadDependencies extends ScrapeCommons {
  document: Document;
  iframeBuffer: HTMLIFrameElement[];
}

interface ILastPendingFrame extends ScrapeCommons {
  returnControlBackToParent: (
    state: AppState,
    loadingFrames: PendingFrames,
    selectors: Selectors,
    stayOnThisPage: boolean,
    source?: string[] | undefined
  ) => any;
}

let currentCredits: Credits | null;
window[TEMP_CREDITS] = 0; // we use this temp value to decrease the last chunk size of credits when we finish scraping

export default async function profileScrapeController(
  settings: ScraperSettings
) {
  window[TEMP_CREDITS] = 0;
  let URLs = [] as string[];
  if (settings.source) {
    /**
     * source is for user entered URLs. If this is passed in,
     * then we should not parse out the URLs from the search results,
     * but instead use the user entered URLs.
     */
    URLs = settings.source;
  } else {
    const anchors = document.querySelectorAll(
      settings.selectors.individualSearchResult
    );
    let x = anchors.length;
    if (!x) {
      console.warn(
        `No search results were selected. If this keeps happening it may be time to update the search result selectors.`
      );
      return setTimeout(() => profileScrapeController(settings), 3000); //	Lazy way to check again for search results
    }

    currentCredits = await getCredits();

    while (x--) {
      //	Clean up the annoying URL
      const cleanUrl = (anchors[x] as HTMLAnchorElement).href
        .split("?")
        .shift();
      if (cleanUrl) {
        URLs.push(encodeURI(cleanUrl));
      }
    }
  }
  const iframeBuffer: HTMLIFrameElement[] = await prepareAllIFrames(
    URLs,
    settings.state
  );
  const frame = iframeBuffer.shift();
  if (!frame) {
    throw new Error(`No frame was found.`);
  }
  return document.body.appendChild(frame);
  // ========================================================= @RETURN ===
  /**
   * This renders (in memory, not DOM) all the iframe, adds all the necessary functionality, and then places them all into an array for later appendage to the DOM.
   */
  async function prepareAllIFrames(URLs: string[], state: AppState) {
    const iframeBuffer = [] as HTMLIFrameElement[];
    let x = URLs.length;
    const iframeTimeout = x * 30000; //	3 sec per frame average, if they are in series	@TODO: change this back

    if (state.mode.safety) {
      x = 1; //	limit to one.
      settings.pendingFrames.accountView = -2; //	should short circuit continued operations.
    }

    const iFrameDependencies = {
      pendingFrames: settings.pendingFrames,
      state,
      document,
      iframeBuffer,
      selectors: settings.selectors,
      lastPage: settings.lastPage,
    } as IIFrameLoadDependencies;

    const _iframe = document.createElement("iframe");
    _iframe.className = `scraper`;

    while (x--) {
      // @ts-ignore
      const iframe: HTMLIFrameElement = _iframe.cloneNode(); //	Create a new iframe.
      ++settings.pendingFrames.accountView; //	Add to the pending iframes counter.
      iframe.addEventListener(`load`, iFrameLoadCurry(iFrameDependencies)); //	iFrame has been loaded, handler
      iframe.src = URLs[x];
      setTimeout(
        iFrameTimeoutHandler(iframe, destroyViaTimeout, document),
        iframeTimeout
      ); //	Timeout handler to delete it and mitigate mem leaks
      iframeBuffer.push(iframe); //	Prepped and ready to deploy.
    }
    return iframeBuffer; //	Send back the array of prepared iframes.
  }
  async function destroyViaTimeout(
    parent: HTMLBodyElement,
    child: HTMLElement
  ): Promise<ILastPendingFrame | void> {
    try {
      parent.removeChild(child);
    } catch {}

    settings.pendingFrames.accountView--;
    window[MAX_SCRAPES]--;
    if (
      (!isPeopleSearchPage(location.href) || window[EMAILS_FOUND]) &&
      (!settings.pendingFrames.accountView || //	How many are in the current view
        !window[MAX_SCRAPES]) //	Total scrape counter
    ) {
      console.log({ [MAX_SCRAPES]: window[MAX_SCRAPES] });
      if (window[MAX_SCRAPES] <= 0) {
        settings.lastPage = true; //	jank workaround to cut the scrape job
      }

      //	No more results to load on this page.
      const go = {
        state: settings.state,
        pendingFrames: settings.pendingFrames,
        selectors: settings.selectors,
        returnControlBackToParent,
        lastPage: settings.lastPage,
      };
      return await lastPendingFrame(go); //	grab from page selectors
    }
  }
}
/**
 * This is simply to prevent memory leaks. Upon a preset duration, if the iframe is still in the DOM, delete itself.
 */
function iFrameTimeoutHandler(
  iframe: HTMLIFrameElement,
  destroy: (
    parent: HTMLBodyElement,
    child: HTMLIFrameElement
  ) => Promise<ILastPendingFrame | void>,
  document: Document
): TimerHandler {
  return async function timeoutIFrame() {
    console.warn(`Timeout for ${iframe.src}`);
    return await destroy(document.body as HTMLBodyElement, iframe);
  };
}
/**
 * This one gets pretty complicated, but, the idea is to curry a lot of contextual information with the iFrame so that it is able to carry out all the necessary routines upon frame load.
 * function destroyOnMissionComplete provides the iframe a reference to the parent DOM and the frame of the iframe itself in order to remove itself from the parent DOM once it completed its task.
 */
function iFrameLoadCurry({
  pendingFrames,
  state,
  document,
  iframeBuffer,
  selectors,
  lastPage,
}: IIFrameLoadDependencies): EventListenerOrEventListenerObject {
  return async function remotePageLoaded(
    this: HTMLIFrameElement,
    event: Event
  ) {
    const remoteDocument = this.contentDocument || this.contentWindow?.document;
    const curriedDestroy = (function curriedDestroy(parent, child, lastPage) {
      return async function destroyOnMissionComplete() {
        /**
         * This runs after a page has loaded
         */
        console.log(pendingFrames.accountView);
        if (window[MAX_SCRAPES] > 0) window[MAX_SCRAPES]--;
        console.log({ [MAX_SCRAPES]: window[MAX_SCRAPES] });

        pendingFrames.accountView--;
        if (
          (!isPeopleSearchPage(location.href) || window[EMAILS_FOUND] > 0) &&
          (!pendingFrames.accountView || //	How many are in the current view
            window[MAX_SCRAPES] <= 0) //	Total scrape counter
        ) {
          if (window[MAX_SCRAPES] <= 0) {
            lastPage = true; //	jank workaround to cut the scrape job
            pendingFrames.accountView = 0;
            // Make iframeBuffer empty to avoid the remaining iframes to be run
            iframeBuffer.splice(0, iframeBuffer.length);
          }
          //	No more results to load on this page.
          const lastPendingFrameDependencies = {
            state,
            pendingFrames,
            selectors,
            returnControlBackToParent,
            lastPage,
          };
          return await lastPendingFrame(lastPendingFrameDependencies); //	grab from page selectors
        }
        parent.removeChild(child);
        /**
         * This may all be a bad idea below
         * @TODO: test performance
         */
        if (state.database.visible) {
          if (state.database.element && state.database.element.parentElement) {
            state.database.element.parentElement.removeChild(
              state.database.element
            );
          }
          state.database.rendered = false;
          state.database.visible = false;
          dbHistory();
        }
      };
    })(document.body, this, lastPage);
    console.log(
      `${pendingFrames.accountView} · ${this.contentWindow?.location.href}`
    );
    console.log({ state });

    let showUpgradePopup = false;

    if (remoteDocument) {
      const previousEmailsFound = window[EMAILS_FOUND];
      const leadInformation = await remotePageOperations(
        remoteDocument,
        curriedDestroy,
        state
      );
      if (
        isPeopleSearchPage(location.href) &&
        previousEmailsFound !== window[EMAILS_FOUND]
      ) {
        state.mode.enrichedCount = (state.mode.enrichedCount || 0) + 1;
        if (state.mode.enrichedCount % CREDITS_CHUNK_SIZE === 0) {
          currentCredits = await decreaseCredits(CREDITS_CHUNK_SIZE);
          window[TEMP_CREDITS] = 0;
        }
        if (currentCredits && currentCredits.available <= 0) {
          showUpgradePopup = true;
        }
      }
      state.buffer.push(leadInformation);
    }

    const localCredits = await getLocalCredits();
    if (!localCredits || localCredits.available <= 0) {
      showUpgradePopup = true;
    }

    try {
      chrome.storage.local.set({ [state.id]: dedupe(state) }); //	Snapshot to database
    } catch (e) {
      console.error(e);
      await Swal.fire({
        title: `It looks like your cache is full.`,
        text: `Try deleting some of your old scrapes, or clearing all of your cache at once and running it again.

I'm deleting unrelated LinkedIn cache now in order to allow you to finish this session.`,
        width: 480,
      });

      const storageLengthBefore = JSON.stringify(
        await getFullStorageContent()
      ).length;
      await clearUnrelatedCache();
      const storageLengthAfter = JSON.stringify(
        await getFullStorageContent()
      ).length;
      notifyUserOfSavings(storageLengthBefore, storageLengthAfter);
    }

    if (showUpgradePopup) {
      const confirmResult = await Swal.fire({
        title: `You don't have enough credits!\nDo you want to update it now?`,
        showCancelButton: true,
        allowOutsideClick: false,
        width: 480,
      });
      if (confirmResult.isConfirmed) {
        goToUpgradePage();
      } else {
        iframeBuffer.splice(0, iframeBuffer.length);
      }
    }

    if (iframeBuffer.length) {
      const firstIframeBuffer = iframeBuffer.shift();
      if (firstIframeBuffer) {
        document.body.appendChild(firstIframeBuffer);
      }
      return document; //	Process iframes in series.
    }
  };
}

function dedupe(state: AppState) {
  const objectOrEntityUrns: string[] = [];
  const unique = state.buffer.filter(function (lead: any) {
    if (lead) {
      const objectOrEntity = lead["objectUrn"] || lead["entityUrn"];
      if (!objectOrEntityUrns.includes(objectOrEntity)) {
        objectOrEntityUrns.push(lead["objectUrn"]);
        return true;
      }
    }
    return false;
  });
  state.buffer = unique;
  return state;
}

/**
 * We got to the last pending iFrame on the page and are done with it.
 * We will want to hit the next page of search results and start the cycle over again.
 */
async function lastPendingFrame({
  state,
  pendingFrames,
  selectors,
  returnControlBackToParent,
  lastPage,
}: ILastPendingFrame) {
  const iframe: HTMLIFrameElement | null =
    document.querySelector(`iframe.scraper`);
  if (iframe) {
    (iframe.parentElement as HTMLElement).removeChild(iframe);
  }

  if (lastPage) {
    if (window[TEMP_CREDITS] > 0) {
      currentCredits = await decreaseCredits(window[TEMP_CREDITS]);
      if (currentCredits) {
        await setLocalCredits(currentCredits);
      }
    }

    await Swal.fire({
      title: `Scrape complete!`,
      text: `Open the popup and click on "prospects" to see the result.`,
      width: 480,
    });
    const scraped = state.buffer.length;
    const enriched = state.buffer.filter((entry) => entry["email"]).length;
    trackEnrichmentResult(scraped, enriched, window.location.href);
    return;
  }
  const stayOnThisPage = false;
  if (returnControlBackToParent) {
    return returnControlBackToParent(
      state,
      pendingFrames,
      selectors,
      stayOnThisPage
    );
  }
}

async function clearUnrelatedCache() {
  const fullStorage = await getFullStorageContent();
  const keys = Object.keys(fullStorage);
  let x = keys.length;
  while (x--) {
    if (!keys[x].includes(DATABASE_KEY_SIGNATURE)) {
      await new Promise((resolve, reject) => {
        try {
          chrome.storage.local.remove(keys[x], () => {
            resolve(true);
          });
        } catch (error) {
          reject(false);
        }
      });
    }
  }
}

function notifyUserOfSavings(before: number, after: number) {
  console.log(`before: ${before} bytes`);
  console.log(`after: ${after} bytes`);
  console.log(`saved: ${100 * (1 - after / before)}%`);
}
