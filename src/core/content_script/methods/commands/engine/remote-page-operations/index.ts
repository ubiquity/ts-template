import addFriend from "./add-friend";
import grabAllMetadata from "./grab-all-metadata";
import { AppState } from "../../../../../../@types/AppState";
import Lead from "../../../../../../@types/Lead";
import fetchUrlFromAccountId from "./fetch-url-from-company-id";
import { enrichLead } from "../../database/methods/enrichment";
import { EMAILS_FOUND, TEMP_CREDITS } from "../../../../../utils/constants";
import { isPeopleSearchPage } from "../../../../../utils/domain";
/**
 * Collect their information, and then add them as a friend
 */
export default async function remotePageOperations(
  remoteDocument: HTMLDocument,
  curriedDestroy,
  state: AppState
) {
  let leadInformation = grabAllMetadata(remoteDocument) as Lead;
  const companyUrn = leadInformation?.defaultPosition?.companyUrn;
  if (companyUrn) {
    const urn = companyUrn.split(`:`).pop();
    if (!urn) {
      throw new Error(`Unable to find URN from ${companyUrn}`);
    }
    const websiteUrl = await fetchUrlFromAccountId(urn);
    if (websiteUrl) {
      leadInformation.defaultPositionWebsiteUrl = websiteUrl;
    }
  }
  leadInformation.indexed = new Date().toLocaleString();
  console.log({ leadInformation });
  if (isPeopleSearchPage(location.href) && !leadInformation["email"]) {
    leadInformation = (await enrichLead(leadInformation)) || leadInformation;
    if (leadInformation["email"]) {
      window[EMAILS_FOUND]++;
      window[TEMP_CREDITS]++;
    }
  }
  if (state.mode.connecting)
    addFriend(remoteDocument, curriedDestroy, leadInformation);
  else curriedDestroy();
  return leadInformation;
}
