import firebase from "firebase";
import { showLoading } from "./utils/dom";

export const signInWithEmailLink = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(["signInEmailLink"], (result) => {
        if (!result.signInEmailLink) {
          return;
        }
        showLoading(true);
        const signinResult = firebase
          .auth()
          .signInWithEmailLink(
            result.signInEmailLink.email,
            result.signInEmailLink.url
          )
          .then((res) => {
            console.log(res);
            chrome.storage.local.remove(["signInEmailLink"], () => {
              resolve(true);
            });
          })
          .catch((error) => {
            console.log(error);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              const active = tabs[0].id;
              if (!active) {
                throw new Error(`No active tab found`);
              }
              const message = {
                command: "showModal",
                value: {
                  title: `Error validating email.`,
                  text: `Something went wrong with the email verification, please open the popup and try again.`,
                },
              };
              chrome.tabs.sendMessage(active, message, (msg: string) => {
                chrome.storage.local.remove(["signInEmailLink"], () => {
                  showLoading(false);
                  resolve(false);
                });
                return true;
              });
            });
          });
      });
    } catch (error) {
      console.log(error);
      showLoading(false);
      resolve(false);
    }
  });
};
