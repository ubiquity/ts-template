import { hideDatabase } from "..";
import { state } from "../../../../content_script";
import { DatabaseResult } from "../../../../../../@types/database";
import { readDatabase, renderUI } from "../rendering/database";
import { saveChanges, deleteSelectedSessions } from "./delete";
import { downloadSelectedSessions } from "./downloader";
import { streamlineRenderResults } from "../rendering/session";

export const LOCAL_OR_REMOTE_URI = "enrichment.orion.black";

export default async function renderInit() {
  const renderResultsRaw: DatabaseResult[] = await readDatabase();
  const renderPayload = renderResultsRaw.map(streamlineRenderResults);
  const dbHistoryEl = document.getElementById("dbHistory");
  if (!dbHistoryEl) {
    document.body.insertAdjacentHTML(
      `beforeend`,
      `<div id="dbHistory">
        <div>
          <div id="output"></div>
          <div id="dbaction">
            <button data-action="delete"></button>
            <button data-action="download"></button>
          </div>
        </div>
        <div id="dbui">
          <button data-action="confirm"></button>
        </div>
      </div>`
    );
  }
  const confirmButton: HTMLButtonElement | null = document.querySelector(
    `[data-action="confirm"]`
  );
  (confirmButton as HTMLButtonElement).addEventListener(
    "click",
    (e) => saveChanges(e),
    true
  );
  const deleteButton: HTMLButtonElement | null = document.querySelector(
    `#dbaction button[data-action="delete"]`
  );
  (deleteButton as HTMLButtonElement).addEventListener(
    "click",
    (e) => deleteSelectedSessions(e),
    true
  );
  const downloadButton: HTMLButtonElement | null = document.querySelector(
    `#dbaction button[data-action="download"]`
  );
  (downloadButton as HTMLButtonElement).removeEventListener(
    "click",
    downloadSelectedSessions,
    true
  );
  (downloadButton as HTMLButtonElement).addEventListener(
    "click",
    downloadSelectedSessions,
    true
  );
  const output = document.getElementById(`output`) as HTMLDivElement;
  if (output && output.lastElementChild) {
    let childEl = output.lastElementChild;
    while (childEl) {
      output.removeChild(childEl);
      childEl = output.lastElementChild;
    }
  }
  const outputContents = renderUI(renderPayload);

  state.database.rendered = true;
  state.database.element = document.getElementById(`dbHistory`);

  document.body.addEventListener(`click`, clickOffUICheck);

  output.appendChild(outputContents);
}

export function pluck(target: string, object: any) {
  if (object && object[target]) {
    return object[target];
  }
  return null;
}
function clickOffUICheck(e: MouseEvent) {
  // @ts-ignore
  const uiFoundInPath = e.path.some(
    (value, index, array) => value.id == `dbHistory`
  );
  if (!uiFoundInPath) hideDatabase();
}
