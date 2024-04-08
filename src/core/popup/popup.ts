import {
  init as initFirebase,
  startFirebaseUI,
  resetFirebaseUI,
  initAuthChangeEvent,
  signOut,
} from "./utils/firebase";
import { initCheckout } from "./utils/stripe";
import { getUser, getStripePotalSessionUrl } from "./utils/api";
import {
  getUserId,
  getLocalCredits,
  clearLocalUserInformation,
} from "../utils/storage";
import { showLoading } from "./utils/dom";
import { Credits, FirebaseUser } from "../../@types/User";
import { identifyFirebaseUser } from "../utils/analytics/identify-user";
import { trackAllButtons } from "../utils/analytics/track-all-buttons";
import { SALES_NAV_SEARCH_PAGE } from "../utils/constants";
import { isSalesNav } from "../utils/domain";
import { commit } from "../../commit.json";

import { signInWithEmailLink } from "./sign-in-with-email-link";

checkCurrentURL();
trackAllButtons();

const initAuthUI = async () => {
  const userId = await getUserId();
  const userCredits: Credits = await getLocalCredits();
  initFirebase();
  initAuthChangeEvent(onAuthStateChanged);
  if (userId && userCredits && userCredits.available > 0) {
    setupButtons(userCredits, ["signOut"]);
    enableExtension();
  } else {
    await signInWithEmailLink();
  }
};

function onSalesNav() {
  initAuthUI();
  disableExtension();
}

async function onAuthStateChanged(
  firebaseUser: FirebaseUser | null
): Promise<void> {
  if (firebaseUser) {
    identifyFirebaseUser(firebaseUser);
    const userId = firebaseUser.uid;
    const userIdToken = await firebaseUser.getIdToken(true);
    const refreshToken = await firebaseUser.refreshToken;
    await new Promise((resolve) =>
      chrome.storage.local.set({ userId, userIdToken, refreshToken }, () =>
        resolve({ userId, userIdToken, refreshToken })
      )
    );
    const user = await getUser();
    if (user && user.credits) {
      const userCredits = user.credits;
      await new Promise((resolve) =>
        chrome.storage.local.set({ userCredits }, () =>
          resolve({ userCredits })
        )
      );
      showLoading(false);
      setupButtons(user.credits);
    }
    resetFirebaseUI(); // TODO: let's see if this is the best place to call this function, maybe on signout?
    enableExtension();
  } else {
    startFirebaseUI();
    disableExtension();
  }
}

function notOnSalesNav() {
  document.body.className = "not-on-sales-nav";
  document.querySelector(`footer a`)?.addEventListener(`click`, () => {
    chrome.tabs.create({ active: true, url: SALES_NAV_SEARCH_PAGE.DEFAULT });
  });

  document
    .querySelector(`footer #dashboardNotOnLinkedIn`)
    ?.addEventListener(`click`, () => goToStripePortal());
  removeLoading();
}

function checkCurrentURL() {
  if (location.hash === "#checkout") {
    new Promise(async () => {
      if (!chrome.extension) {
        location.reload();
      } else {
        await initCheckout();
      }
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const pageUrl = tabs[0].url;
      if (pageUrl && isSalesNav(pageUrl)) {
        return onSalesNav();
      }
      return notOnSalesNav();
    });
  }
}

function goToStripePortal() {
  showLoading(true);
  getStripePotalSessionUrl().then((url) => {
    showLoading(false);
    if (url) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const active = tabs[0].id;
        if (!active) {
          throw new Error(`No active tab found`);
        }
        chrome.tabs.create({ active: true, url });
      });
    }
  });
}

function setupButtons(credits: Credits, exclude: string[] = []) {
  const buttons: NodeListOf<HTMLButtonElement> =
    document.querySelectorAll(`button`);
  let x = buttons.length;
  while (x--) {
    const button = buttons[x];
    if (exclude.includes(button.id)) {
      button.disabled = true;
      continue;
    }
    button.disabled = false;
    button.onclick = function () {
      const that = this as HTMLButtonElement;
      switch (that.id) {
        case "signOut":
          signOut().then(() => {
            clearLocalUserInformation();
          });
          break;
        case "upgrade":
          goToStripePortal();
          break;
        case "dashboard":
          goToStripePortal();
          break;
        case "help":
          window.open(
            "https://blog.orion.black/frequently-asked-questions",
            "_blank"
          );
          break;

        default:
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const active = tabs[0].id;
            if (!active) {
              throw new Error(`No active tab found`);
            }
            const message = { command: that.id, value: credits };

            chrome.tabs.sendMessage(active, message, (msg: string) => {
              console.log("result message:", msg);
              return true;
            });
          });
          break;
      }
    };
  }
}

function removeLoading(): void {
  document.querySelector("#loading")?.remove();
}
function enableExtension(MESSAGE_TO_USER?: string) {
  document.body.classList.add(`validated`);
  if (MESSAGE_TO_USER && MESSAGE_TO_USER.trim().length) {
    document.body.setAttribute(`data-message`, MESSAGE_TO_USER);
  }
}
function disableExtension() {
  document.body.className = ``;
}

function renderVersion() {
  if (process.env.NODE_ENV === "development") {
    document.body.setAttribute(`data-version`, commit);
  }
  // document.body.setAttribute(`data-environment`, process.env.NODE_ENV || "");
}

window.onload = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const active = tabs[0].id;
    if (!active) {
      throw new Error(`No active tab found`);
    }
    const message = { command: "closeModal", value: null };

    chrome.tabs.sendMessage(active, message, (msg: string) => {
      console.log("result message:", msg);
      return true;
    });
  });
};
