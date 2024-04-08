import { UserId, UserIdToken, Credits } from "../../@types/User";
import { STORAGE_USER_KEYS } from "./constants";

const getUserId: () => Promise<UserId> = () => {
  return new Promise((resolve) => {
    const key = STORAGE_USER_KEYS.USER_ID;
    chrome.storage.local.get([key], (storage) => {
      resolve(storage[key]);
    });
  });
};

const getUserIdToken: () => Promise<UserIdToken> = () => {
  return new Promise((resolve) => {
    const key = STORAGE_USER_KEYS.USER_ID_TOKEN;
    chrome.storage.local.get([key], (storage) => {
      resolve(storage[key]);
    });
  });
};

const getLocalCredits: () => Promise<Credits> = () => {
  return new Promise((resolve) => {
    const key = STORAGE_USER_KEYS.USER_CREDITS;
    chrome.storage.local.get([key], (storage) => {
      resolve(storage[key]);
    });
  });
};

const setLocalCredits: (userCredits: Credits) => Promise<Credits> = (
  userCredits
) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ userCredits }, () => {
      resolve(userCredits);
    });
  });
};

const clearLocalUserInformation: () => Promise<void> = () => {
  return new Promise((resolve) => {
    chrome.storage.local.remove([...Object.values(STORAGE_USER_KEYS)], () => {
      console.log("user information was removed from the storage!");
      resolve();
    });
  });
};

export {
  getUserId,
  getUserIdToken,
  getLocalCredits,
  setLocalCredits,
  clearLocalUserInformation,
};
