import Swal from "sweetalert2";
import { AppState } from "../../../../../@types/AppState";
import { Credits } from "../../../../../@types/User";
import { goToUpgradePage, checkURN } from "../../../../popup/utils/message";
import { trackScrapeRelatedEvent } from "../../../../utils/analytics/track-scrape-related-event";
import { DATABASE_KEY_SIGNATURE } from "../../../content_script";
import {
  shouldShowUpgradePopup,
  updateUpgradeOfferTime,
} from "../database/rendering/database";
import searchResultsController from "./controller-to-navigate-the-search-results";
import { MAX_SCRAPES, EMAILS_FOUND } from "../../../../utils/constants";
import { fetchUserProfileInfo } from "../fetch-user-profile-full-name";

const opportunisticUpsellCheckPoint = 0.8;

const selectors = {
  individualSearchResult: "article > section.result-lockup > div dl > dt > a",
  nextSearchResultsPage: "button.search-results__pagination-next-button",
  finalAnchor:
    "#content-main > div.profile-topcard.full-width.pb5 > div.container > div > div.profile-topcard__right-column.flex-column.pt6 > div.profile-topcard__contact-info.mt5 > dl > dd:nth-child(2) > a",
};

const isSearchResultPage: () => boolean = () => {
  const listItems: NodeListOf<Element> = document.querySelectorAll(
    selectors.individualSearchResult
  );
  if (listItems.length > 0) {
    return true;
  }
  return false;
};

/**
 * @export
 * @param {AppState} state	App state
 * @param {string} [source]	Source is a temporary implementation
 * *	to allow for the engine to source from either the rendered search
 * *	results' URLs, or from a user entered list of URLs.
 */
export default async function engine(
  state: AppState,
  credits: Credits,
  source?: string[]
) {
  if (state.mode.safety)
    console.warn(`safety mode enabled...only scraping a one or two`);

  state.buffer = [];
  state.id = `${Date.now()}${DATABASE_KEY_SIGNATURE}`;
  state.url = {
    pathname: window.location.pathname,
    search: window.location.search,
  };

  if (!isSearchResultPage()) {
    await Swal.fire({
      title:
        "There are no search results.\nPlease start a new search before scraping.",
      width: 480,
    });
    return;
  }

  if (!credits) {
    return;
  }
  const { total, available }: Credits = credits;
  if (available <= 0) {
    trackScrapeRelatedEvent({ type: "not enough credits" });
    await Swal.fire({
      title: "You don't have enough credits",
      width: 480,
    });
    return;
  }

  let SCRAPES = 0;
  let shouldRepeat = true;
  const currentCredits = `${available}`;

  while (shouldRepeat) {
    const promptResult = await Swal.fire({
      title: `How many do you want to scrape?\n${currentCredits} remaining`,
      html: '<p>Enter a number here e.g. "25".</p><p>LinkedIn seems to cap each search query at around 1000 per day.</p>',
      input: "number",
      showCancelButton: true,
      showDenyButton: true,
      preDeny: () => {
        const inputEl = document.querySelector("input.ob-swal2-input-number");
        if (inputEl) {
          inputEl["value"] = available;
        }
        return false;
      },
      inputAttributes: {
        min: "1",
      },
      inputValidator: (result) => {
        const inputValue = parseInt(result);
        if (
          isNaN(inputValue) ||
          inputValue < 1 ||
          parseFloat(result) !== inputValue // doesn't allow decimal
        ) {
          trackScrapeRelatedEvent({
            type: "tried input invalid number",
            number: result,
          });
          return "Please enter valid number!";
        }
        return null;
      },
      confirmButtonText: "Ok",
      denyButtonText: `Max(${currentCredits})`,
      allowOutsideClick: false,
      width: 480,
      customClass: {
        input: "ob-swal2-input-number",
        confirmButton: "order-3",
        cancelButton: "order-2",
        denyButton: "order-1",
      },
    });

    if (!promptResult.isConfirmed) {
      trackScrapeRelatedEvent({
        type: "cancelled scraping",
      });
      return;
    } else {
      SCRAPES = parseInt(promptResult.value);
    }

    if (!SCRAPES || SCRAPES < 0) return;

    if (SCRAPES > available) {
      trackScrapeRelatedEvent({
        type: "tried scraping more than available",
        scrapes: SCRAPES,
        available,
      });
      const confirmResult = await Swal.fire({
        title: `Please enter valid number less than ${available}\nDo you want to try again?`,
        showCancelButton: true,
        allowOutsideClick: false,
        width: 480,
      });
      if (!confirmResult.isConfirmed) {
        return;
      }
    } else {
      shouldRepeat = false;
    }
  }

  const profileInfo = fetchUserProfileInfo();
  if (!profileInfo || !profileInfo.fullName || !profileInfo.objectUrn) {
    await Swal.fire({
      title:
        "Something went wrong in parsing profile information!\nPlease try again later.",
      width: 480,
    });
    return;
  }
  const urnCheckResult = await checkURN(profileInfo.objectUrn);
  if (!urnCheckResult) {
    await Swal.fire({
      title: `You must be logged into Linkedin as ${profileInfo.fullName} to use the extension.\nPlease log into that account.`,
      width: 480,
    });
    return;
  }

  trackScrapeRelatedEvent({
    type: "started scraping",
    scrapes: SCRAPES,
    available,
    url: window.location.href,
  });
  // Opportunistic Upsell Check
  if (
    (total - available + SCRAPES) / total >= opportunisticUpsellCheckPoint &&
    (await shouldShowUpgradePopup())
  ) {
    const upgradeConfirmResult = await Swal.fire({
      title: `You are close to your credits limit!\nDo you want to upgrade now?`,
      confirmButtonText: "Upgrade",
      cancelButtonText: "Not Now",
      showCancelButton: true,
      allowOutsideClick: false,
      width: 480,
    });
    await updateUpgradeOfferTime();
    if (upgradeConfirmResult.isConfirmed) {
      goToUpgradePage();
      return;
    }
  }

  window[MAX_SCRAPES] = SCRAPES;
  window[EMAILS_FOUND] = 0;

  const framesLoading = { accountView: 0 };

  const stayOnThisPage = true;

  searchResultsController(
    state,
    framesLoading,
    selectors,
    stayOnThisPage,
    source
  ); //	grab from page selectors
}
