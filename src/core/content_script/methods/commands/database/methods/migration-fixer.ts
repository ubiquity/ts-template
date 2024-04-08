export const migrationFixer = () => {
  chrome.storage.local.get(null, (storedObject) => {
    Object.keys(storedObject).forEach((key) => {
      if (key.endsWith("-nvli-session")) {
        try {
          chrome.storage.local.set({ [key]: JSON.parse(storedObject[key]) });
        } catch (error) {}
      }
    });
  });
};
