export const SALES_NAV_SEARCH_PAGE = {
  DEFAULT: "https://www.linkedin.com/sales/search/",
  get PEOPLE() {
    return `${this.DEFAULT}people`;
  },
  get COMPANY() {
    return `${this.DEFAULT}company`;
  },
};

export const MAX_SCRAPES = "maxScrapes";
export const CREDITS_CHUNK_SIZE = 10; // credits chunk size to be decreased
export const EMAILS_FOUND = "emailsFound";
export const TEMP_CREDITS = "tempCredits";

export const STORAGE_USER_KEYS: {
  [key: string]: string;
} = {
  USER_ID: "userId",
  USER_CREDITS: "userCredits",
  USER_ID_TOKEN: "userIdToken",
  REFRESH_TOKEN: "refreshToken",
};
