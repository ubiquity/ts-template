import { analytics, attributeDataTracking } from "./analytics";
import { getUserId } from "../storage";
import { commit } from "../../../commit.json";

export const trackElementClick = async (
  element: HTMLElement
): Promise<void> => {
  const userId = (await getUserId()) as string;
  const action = element.getAttribute(attributeDataTracking) || element.id;
  const attributeTrackedId = "is-a-t";
  if (element.getAttribute(attributeTrackedId)) {
    return;
  }
  element.setAttribute(attributeTrackedId, `true`);
  element.addEventListener("click", (): void => {
    chrome.runtime.sendMessage({
      command: "trackPopupClick",
      content: {
        userId: userId,
        event: "Popup Button Clicked",
        timestamp: new Date(),
        properties: {
          id: element.id,
          action,
          build: commit,
        },
      },
    });
  });
};
