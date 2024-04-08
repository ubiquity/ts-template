import { Credits } from "../../../@types/User";

const getCredits: () => Promise<Credits | null> = () => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { command: "getCredits" },
      function (res: Credits | null) {
        resolve(res);
      }
    );
  });
};

const decreaseCredits: (amount: number) => Promise<Credits | null> = (
  amount
) => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { command: "decreaseCredits", amount },
      function (res: Credits | null) {
        resolve(res);
      }
    );
  });
};

const goToUpgradePage: () => void = () => {
  chrome.runtime.sendMessage({ command: "goToUpgradePage" });
};

const checkURN: (urn: string) => Promise<boolean> = (urn) => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { command: "checkURN", urn },
      function (res: boolean) {
        resolve(res);
      }
    );
  });
};

export { getCredits, decreaseCredits, goToUpgradePage, checkURN };
