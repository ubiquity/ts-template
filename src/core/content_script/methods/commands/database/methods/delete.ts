import Swal from "sweetalert2";
import { state } from "../../../../content_script";
import { refreshDBActionContainerStatus } from "../rendering/database";

export function undelete(this: HTMLElement) {
  const dQ = state.database.deleteQueue;
  const id = this.getAttribute(`data-id`);
  if (!id) {
    throw new Error(`No id provided`);
  }
  if (this.classList.contains(`deleted`)) {
    dQ.splice(dQ.indexOf(id), 1);
    this.classList.remove(`deleting`, `deleted`);
    if (!dQ.length) {
      const database = state.database.element;
      database?.classList.remove(`changes`);
    }
  }
}
export function undoDeleteGuard(e: Event, id: string) {
  // @ts-ignore
  if (e.target.tagName === `BUTTON`) {
    return;
  }
  const sessionElements = document.querySelectorAll(
    `session[data-id][class$="deleting"]`
  );
  let x = sessionElements.length;
  while (x--) sessionElements[x].classList.remove(`deleting`);
}
export function triggerDeleteGuard(
  e: Event,
  id: string,
  self: HTMLButtonElement
) {
  const DomElement = document.querySelector(`[data-id="${id}"]`);
  DomElement?.classList.add(`deleted`);
  if (!state.database.deleteQueue.length) {
    const database = state.database.element;
    database?.classList.add(`changes`);
  }
  state.database.deleteQueue.push(id);
}

export function saveChanges(e: MouseEvent) {
  let x = state.database.deleteQueue.length;
  if (!x) {
    return;
  }

  Swal.fire({
    title: `Confirm deletion of ${x} sessions?`,
    showCancelButton: true,
    allowOutsideClick: false,
    width: 480,
  }).then((confirmResult) => {
    if (confirmResult.isConfirmed) {
      const database = state.database.element;
      const sessions = document.getElementById(`output`);
      while (x--) {
        const key = state.database.deleteQueue.shift();
        if (key) {
          chrome.storage.local.remove([key]);
        }
        const session = sessions?.querySelector(`[data-id="${key}"]`);
        if (!session) {
          throw new Error(`No session found with id ${key}`);
        }
        sessions?.removeChild(session);
      }
      database?.classList.remove(`changes`);
      refreshDBActionContainerStatus();
    }
  });
}

export function deleteSelectedSessions(e: MouseEvent) {
  const sessions = Array.from(document.querySelectorAll("#output session"));
  const selectedSessionsIds: string[] = [];
  sessions.forEach((session) => {
    if (
      (session.querySelector("input[type=checkbox]") as HTMLInputElement)
        .checked
    ) {
      const dataId = session.getAttribute("data-id");
      if (dataId) {
        selectedSessionsIds.push(dataId);
      }
    }
  });

  const x = selectedSessionsIds.length;
  if (!x) {
    return;
  }

  Swal.fire({
    title: `Confirm deletion of ${x} sessions?`,
    showCancelButton: true,
    allowOutsideClick: false,
    width: 480,
  }).then((confirmResult) => {
    if (confirmResult.isConfirmed) {
      const sessionContainer = document.getElementById(`output`);
      selectedSessionsIds.forEach((key) => {
        if (key) {
          chrome.storage.local.remove([key]);
        }
        const session = sessionContainer?.querySelector(`[data-id="${key}"]`);
        if (!session) {
          throw new Error(`No session found with id ${key}`);
        }
        sessionContainer?.removeChild(session);
      });
      refreshDBActionContainerStatus();
    }
  });
}
