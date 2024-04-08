import { commandResponders } from "./methods/command-responders";
import { AppState } from "../../@types/AppState";
import { verifyEmailLinkSignIn } from "./methods/verify-email-link-sign-in";
import { migrationFixer } from "./methods/commands/database/methods/migration-fixer";

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  chrome.runtime.sendMessage({ command: "darkMode" });
} else {
  chrome.runtime.sendMessage({ command: "lightMode" });
}

export type NODE_ENV = "development" | "production" | "unknown";
export const DATABASE_KEY_SIGNATURE = `-nvli-session`;
export const state: AppState = {
  // Shared State
  id: `${Date.now()}${DATABASE_KEY_SIGNATURE}`,
  database: {
    visible: false,
    rendered: false,
    element: null,
    deleteQueue: [],
  },
  mode: {
    inverted: false,
    safety: false,
    connecting: false,
    env: process.env.NODE_ENV as NODE_ENV,
  },
  url: {
    pathname: window.location.pathname,
    search: window.location.search,
  },
  buffer: [],
};
export const getInitialState: () => AppState = () => ({
  // New State
  id: `${Date.now()}${DATABASE_KEY_SIGNATURE}`,
  database: {
    visible: false,
    rendered: false,
    element: null,
    deleteQueue: [],
  },
  mode: {
    inverted: false,
    safety: false,
    connecting: false,
    env: process.env.NODE_ENV as NODE_ENV,
  },
  url: {
    pathname: window.location.pathname,
    search: window.location.search,
  },
  buffer: [],
});

chrome.runtime.onMessage.addListener(messageHandler);

function messageHandler(
  msg: { command: string; value: string },
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
) {
  if (msg.command) {
    console.log(msg);
    if (commandResponders[msg.command]) {
      const response = commandResponders[msg.command](
        msg.value ? msg.value : undefined
      );
      sendResponse(response);
    } else {
      console.error(`No ${msg.command} in ${commandResponders}`);
    }
  }
}

if (module.hot) {
  module.hot.accept();
}
verifyEmailLinkSignIn();
migrationFixer();
