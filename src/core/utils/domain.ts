import { SALES_NAV_SEARCH_PAGE } from "./constants";

const isSalesNav: (url: string) => boolean = (url) => {
  return url.includes(SALES_NAV_SEARCH_PAGE.DEFAULT);
};

const isCompanySearchPage: (url: string) => boolean = (url) => {
  return url.includes(SALES_NAV_SEARCH_PAGE.COMPANY);
};

const isPeopleSearchPage: (url: string) => boolean = (url) => {
  return url.includes(SALES_NAV_SEARCH_PAGE.PEOPLE);
};

export { isSalesNav, isCompanySearchPage, isPeopleSearchPage };
