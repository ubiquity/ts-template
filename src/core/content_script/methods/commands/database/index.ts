import { state } from "../../../content_script";
import renderDatabase from "./methods/render";

export default function dbHistory() {
  if (!state.database.visible) {
    return showDatabase();
  }
  return hideDatabase();
}

export function hideDatabase() {
  const database: HTMLElement | null = state.database.element;
  if (database) {
    database.classList.remove(`visible`);
    state.database.visible = false;
  } else {
    throw new Error(`Database is not visible`);
  }
}

function showDatabase() {
  state.database.visible = true;
  state.database.deleteQueue = [];
  renderDatabase();
  return requestAnimationFrame(() => {
    const elementCheckingTimer = setInterval(() => {
      if (state?.database?.element?.classList) {
        clearInterval(elementCheckingTimer);
        state.database.element.classList.add(`visible`);
      }
    }, 10);
  });
}
