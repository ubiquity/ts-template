import { AppState } from "../../../../../../@types/AppState";
import {
  DatabaseResult,
  DatabaseResultRenderReady,
} from "../../../../../../@types/database";
import { getFullStorageContent } from "../../../utils/get-full-storage-content";
import {
  triggerDeleteGuard,
  undelete,
  undoDeleteGuard,
} from "../methods/delete";
import { selectDownloadStyle } from "../methods/downloader";
import { generateHTML } from "./session";

export function renderUI(
  sessions: DatabaseResultRenderReady[]
): DocumentFragment {
  const dfg = document.createDocumentFragment();
  const domparser = new DOMParser();
  sessions.forEach(sessionHTML);
  return dfg;

  function sessionHTML(renderPayload: DatabaseResultRenderReady) {
    const session: Element = generateSessionElement();
    return addEventsToSession(session);
    function renderEnrichedNumber(enrichedCount?: number) {
      if (enrichedCount) {
        return enrichedCount.toString();
      }
      return false;
    }

    function generateSessionElement(): Element {
      const enrichedCountIsNumber =
        typeof renderPayload.enrichedCount === "number";
      const HTML = generateHTML({
        renderPayload,
        enrichedCountIsNumber,
        renderEnrichedNumber,
      });
      const session: Element = domparser.parseFromString(HTML, `text/html`).body
        .children[0];
      return session;
    }

    function addEventsToSession(session: Element | HTMLElement) {
      session.addEventListener(
        "click",
        (e) => undoDeleteGuard(e, renderPayload.id),
        true
      );
      session.addEventListener("click", undelete, true); //  @TODO: Consolidate

      const downloadButton: HTMLButtonElement | null = session.querySelector(
        `[data-action="download"]`
      );
      downloadButton?.addEventListener(
        "click",
        (e) => selectDownloadStyle(e, renderPayload.id, renderPayload.type),
        true
      );

      const deleteButton: HTMLButtonElement | null = session.querySelector(
        `[data-action="delete"]`
      );
      (deleteButton as HTMLButtonElement).addEventListener(
        "click",
        function (e) {
          triggerDeleteGuard(e, renderPayload.id, this);
        },
        true
      );

      const checkboxButton: HTMLInputElement | null = session.querySelector(
        `input[type="checkbox"]`
      );
      (checkboxButton as HTMLInputElement).addEventListener(
        "change",
        refreshDBActionContainerStatus,
        true
      );
      dfg.appendChild(session);
    }
  }
}

function toggleDBActionContainer(toggle: boolean): void {
  const container: HTMLDivElement | null = document.querySelector("#dbaction");
  if (container) {
    const action = toggle ? "flex" : "none";
    container.style.display = action;
  }
}

export const refreshDBActionContainerStatus: () => void = () => {
  const sessions: HTMLElement[] = Array.from(
    document.querySelectorAll("#output session")
  );
  const shouldShow: boolean = sessions.some(function (
    session: HTMLElement
  ): boolean {
    return (session.querySelector("input[type=checkbox]") as HTMLInputElement)
      .checked;
  });
  toggleDBActionContainer(shouldShow);
};

const PREVIOUS_UPGRADE_OFFER_TIME_KEY = "PREVIOUS_UPGRADE_OFFER_TIME_KEY";

export async function shouldShowUpgradePopup(): Promise<boolean> {
  const now = Date.now();
  const offerDelay = 10 * 60 * 1000; // 10 mins
  const previousUpgradeOfferTime: number = await new Promise((resolve) => {
    chrome.storage.local.get([PREVIOUS_UPGRADE_OFFER_TIME_KEY], (result) => {
      resolve(result[PREVIOUS_UPGRADE_OFFER_TIME_KEY]);
    });
  });
  if (previousUpgradeOfferTime && now - previousUpgradeOfferTime < offerDelay) {
    return false;
  }
  return true;
}

export async function updateUpgradeOfferTime(): Promise<void> {
  new Promise((resolve) => {
    chrome.storage.local.set(
      { [PREVIOUS_UPGRADE_OFFER_TIME_KEY]: Date.now() },
      () => {
        resolve(PREVIOUS_UPGRADE_OFFER_TIME_KEY);
      }
    );
  });
}

export async function readDatabase(): Promise<DatabaseResult[]> {
  const databaseResults = [] as DatabaseResult[];
  const fullStorage = await getFullStorageContent();
  const sessionSaves = Object.keys(fullStorage).filter((key) =>
    key.match(/\d+?\-nvli\-session/gim)
  );
  sessionSaves.forEach(fetchSessions);
  return databaseResults.sort(sorter);
  function fetchSessions(value: string, index: number, array: string[]) {
    const databaseReadResults = fullStorage[array[index]] as AppState;
    const databaseReadResultsBuffer: unknown[] = databaseReadResults.buffer;
    if (
      databaseReadResultsBuffer &&
      Array.isArray(databaseReadResultsBuffer) &&
      databaseReadResultsBuffer.length
    ) {
      const matches = value.match(/^\d+/g);
      let posixTime;
      if (matches) {
        posixTime = matches.shift();
      }

      const databaseResult = {
        dbKey: value,
        buffer: databaseReadResultsBuffer,
        enrichedCount: databaseReadResults.mode.enrichedCount,
      } as DatabaseResult;

      if (posixTime) {
        databaseResult.timestampHuman = new Date(+posixTime).toLocaleString();
        databaseResult.timestampPosix = +posixTime;
      } else {
        databaseResult.timestampHuman = `No timestamp available`;
        databaseResult.timestampPosix = 0;
      }
      databaseResults.push(databaseResult);
    }
  }
  function sorter(a: DatabaseResult, b: DatabaseResult) {
    if (a.timestampPosix > b.timestampPosix) return 1;
    if (a.timestampPosix < b.timestampPosix) return -1;
    return 0;
  }
}
