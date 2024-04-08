import Swal from "sweetalert2";
import { Credits } from "../../../@types/User";
import { getInitialState, state } from "../content_script";
import dbHistory from "./commands/database";
import download from "./commands/download";
import engine from "./commands/engine";
import { fetchUserProfileFullNameV3 as fetchUserProfileFullName } from "./commands/fetch-user-profile-full-name";
import keyUpdate from "./commands/key-update";

export const commandResponders = {
  changeBackground: () => {
    document.body.style.backgroundColor = `invert(${
      state.mode.inverted ? `#000` : `#fff`
    })`;
    document.body.style.filter = `invert(${state.mode.inverted ? 1 : 0})`;
    state.mode.inverted = !state.mode.inverted;
    return "Inverted.";
  },
  startEngine: (credits: Credits) => engine(getInitialState(), credits),
  downloadRaw: () => download(state.buffer),
  downloadPretty: () => download(state.buffer, "pretty"),
  safeMode: () => {
    state.mode.safety = !state.mode.safety;
    const statusInEnglish = state.mode.safety ? "enabled" : "disabled";
    alert(
      `Test mode is ${statusInEnglish}.\n\nTest mode is a feature to only scrape the first result.`
    );
  },
  addMode: () => {
    state.mode.connecting = !state.mode.connecting;
    const statusInEnglish = state.mode.connecting ? "enabled" : "disabled";
    alert(
      `Add mode is ${statusInEnglish}.\n\nAdd mode is a feature to automatically add the scraped profiles as a connection.`
    );
  },
  showModal: (value: { title: string; text: string }) => {
    Swal.fire({ ...value });
    return true;
  },
  closeModal: () => {
    Swal.close();
    return true;
  },
  dbHistory,
  fetchUserProfileFullName,
  keyUpdate,
};
