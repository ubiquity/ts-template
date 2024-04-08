import firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import { FirebaseUser } from "../../../@types/User";
import "../../../assets/css/popup-firebase.css";
import { attributeDataTracking } from "../../utils/analytics/analytics";
import { trackAllButtons } from "../../utils/analytics/track-all-buttons";
import { detectEmailLinkInput } from "./detect-email-link-input";
import firebaseConfig from "./firebase-config.json";

const firebaseUISelector = "#firebaseui-auth-container";

const firebaseUIConfig: firebaseui.auth.Config = {
  signInFlow: "popup",
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      fullLabel: "Google",
    },
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      fullLabel: "Email",
      forceSameDevice: false,
      requireDisplayName: true,
      emailLinkSignIn: () => ({
        url: "https://www.linkedin.com/sales/search/people",
      }),
    },
  ],
  callbacks: {
    signInSuccessWithAuthResult(authResult) {
      console.log(authResult);
      return false;
    },
    uiShown() {
      detectEmailLinkInput();
    },
  },
};

let firebaseUI: firebaseui.auth.AuthUI;

async function init(): Promise<{
  firebase: typeof firebase;
  firebaseUI: firebaseui.auth.AuthUI;
}> {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }
  const auth = firebase.auth();
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  firebaseUI = new firebaseui.auth.AuthUI(auth);
  return { firebase, firebaseUI };
}

const startFirebaseUI = (): void => {
  firebaseUI.start(firebaseUISelector, firebaseUIConfig);

  trackSignInButtons();
};

const resetFirebaseUI = (): void => firebaseUI.reset();

const initAuthChangeEvent = (
  onAuthStateChanged: (user: FirebaseUser | null) => Promise<void>
): firebase.Unsubscribe =>
  firebase.auth().onAuthStateChanged(onAuthStateChanged);

const signOut = (): Promise<void> => firebase.auth().signOut();

function trackSignInButtons() {
  const buttonsSignIn: NodeListOf<HTMLButtonElement> =
    document.querySelectorAll(`button.firebaseui-id-idp-button`);
  buttonsSignIn.forEach((button: HTMLButtonElement): void => {
    const signInText: string = button.querySelector(".firebaseui-idp-text-long")
      ?.innerHTML as string;
    button.setAttribute(attributeDataTracking, signInText);
    const signInId: string = button
      .querySelector(".firebaseui-idp-text-short")
      ?.innerHTML?.toLowerCase() as string;
    button.id = `button-firebase-signin-` + signInId;
  });
  trackAllButtons();
}

const getNewToken = async (): Promise<string | undefined> => {
  const { firebase } = await init();
  const auth = await firebase.auth();
  console.log(auth);
  const token = auth.currentUser?.getIdToken(true);
  return token;
};

export {
  init,
  initAuthChangeEvent,
  startFirebaseUI,
  resetFirebaseUI,
  signOut,
  firebaseUISelector,
  getNewToken,
};
