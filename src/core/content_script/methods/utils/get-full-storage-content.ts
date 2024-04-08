export const getFullStorageContent = async (): Promise<{
  [key: string]: any;
}> => {
  return new Promise((resolve, reject): void => {
    try {
      chrome.storage.local.get(null, (fullStorage) => {
        resolve(fullStorage);
      });
    } catch (error) {
      reject(false);
    }
  });
};
