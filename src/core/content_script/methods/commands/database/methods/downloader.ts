import download from "../../download";

function downloadSession(id: string, type: string): void {
  chrome.storage.local.get([id], (result) => {
    download(result[id].buffer, type, "pretty");
  }); // download as CSV
}

export async function selectDownloadStyle(
  e: MouseEvent,
  id: string,
  type: string
) {
  if (e.altKey) {
    chrome.storage.local.get([id], (result) => {
      download(result[id].buffer, type);
    });
  } else {
    chrome.storage.local.get([id], (result) => {
      download(result[id].buffer, type, "pretty");
    });
  }
}

export async function downloadSelectedSessions() {
  const sessions = Array.from(document.querySelectorAll("#output session"));
  sessions.forEach((session) => {
    if (
      (session.querySelector("input[type=checkbox]") as HTMLInputElement)
        .checked
    ) {
      const dataId = session.getAttribute("data-id");
      const type = session.getAttribute("data-type");
      if (dataId && type) {
        downloadSession(dataId, type);
      }
    }
  });
}
