import { UserIdToken } from "../../../../@types/User";
import firebaseConfig from "../../../popup/utils/firebase-config.json";

export const getNewToken = async (
  refresh_token: string
): Promise<UserIdToken | null> => {
  const apiKey = firebaseConfig.apiKey;
  const url = `https://securetoken.googleapis.com/v1/token?key=${apiKey}`;
  const fetchResult = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });
  const result = await fetchResult.json();
  if (!result.id_token) {
    return null;
  }
  const userIdToken: UserIdToken = result.id_token;
  await new Promise((resolve) =>
    chrome.storage.local.set({ userIdToken }, () => resolve({ userIdToken }))
  );
  return userIdToken;
};
