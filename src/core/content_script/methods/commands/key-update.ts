export default function keyUpdate(value: string) {
  chrome.storage.local.get([`key`], (result) =>
    console.log(`Value was ${result.key}`)
  );
  if (value && value.length && value.length === 24) {
    chrome.storage.local.set({ key: value }, () =>
      console.log(`Value is set to ${value}`)
    );
  } else {
    throw new Error(
      `Key not set because it appears to be the incorrect length - perhaps this was an accident?`
    );
  }
  chrome.storage.local.get(["key"], (result) =>
    console.log(`Value currently is ${result.key}`)
  );
  return value;
}
