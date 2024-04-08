import firebase from "firebase";
import Swal, { SweetAlertResult } from "sweetalert2";
import firebaseConfig from "../../popup/utils/firebase-config.json";

export const verifyEmailLinkSignIn = async (): Promise<void> => {
  firebase.initializeApp(firebaseConfig);
  if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    const storedObject = new Promise((resolve, reject) => {
      chrome.storage.local.get(["emailLinkEmailRequest"], (value) => {
        resolve(value);
      });
    }) as Promise<{ [key: string]: any }>;
    const storedEmail: string | null = Object.values(await storedObject)[0] as
      | string
      | null;
    let email: string | null = storedEmail;
    if (!email) {
      // fallback in case for any reason the email wasn't stored
      const emailPrompt: SweetAlertResult<string> = await Swal.fire({
        title: `Email verification`,
        text: "Please provide your email for confirmation.",
        input: "email",
        showCancelButton: true,
        inputAttributes: {
          min: "1",
        },
        confirmButtonText: "Ok",
        allowOutsideClick: false,
      });
      if (emailPrompt.isConfirmed && emailPrompt.value) {
        email = emailPrompt.value;
      }
    }
    if (!email) {
      Swal.fire({
        title: `Email verification aborted.`,
        text: `Email not confirmed, please reload the page and try again.`,
      });
      return;
    }
    const signInEmailLink: { email: string; url: string } = {
      email,
      url: window.location.href,
    };
    chrome.storage.local.set({ signInEmailLink }, () => {
      if (window.history.replaceState) {
        window.history.replaceState(
          {},
          document.title,
          `https://www.linkedin.com/sales/search/people?`
        );
      }
      Swal.fire({
        title: `Open the popup to complete the verification`,
        text: `It may take some few seconds for the verification to be completed.`,
      });
    });
  }
};
