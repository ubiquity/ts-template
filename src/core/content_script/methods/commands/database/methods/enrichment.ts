import Lead, {
  EnrichmentResult,
  LeadEnriched,
} from "../../../../../../@types/Lead";
import { UserIdToken } from "../../../../../../@types/User";
import { STORAGE_USER_KEYS } from "../../../../../utils/constants";
import { getUserIdToken } from "../../../../../utils/storage";
import { getNewToken } from "../../../utils/get-new-token";
import { LOCAL_OR_REMOTE_URI } from "./render";

async function fetchEnrichmentApi(
  domain: string,
  first_name: string,
  last_name: string,
  userIdToken: UserIdToken
): Promise<EnrichmentResult | void> {
  const res = await fetch(
    `https://${LOCAL_OR_REMOTE_URI}/api/enrich?domain=${domain}&first_name=${first_name}&last_name=${last_name}&token=${userIdToken}`
  );
  if (res.status === 200) {
    const enrichmentResult: EnrichmentResult = await res.json();
    return enrichmentResult;
  } else if (res.status === 401) {
    chrome.storage.local.get(
      [STORAGE_USER_KEYS.REFRESH_TOKEN],
      async (refreshToken) => {
        const newUserIdToken = await getNewToken(refreshToken.refreshToken);
        if (!newUserIdToken) {
          return;
        }
        const enrichmentResult = (await fetchEnrichmentApi(
          domain,
          first_name,
          last_name,
          newUserIdToken
        )) as EnrichmentResult | void;
        return enrichmentResult;
      }
    );
  } else {
    return;
  }
}

export async function enrichLead(lead: Lead): Promise<Lead | LeadEnriched> {
  const { domain, first_name, last_name } = await getLeadWebsiteAndDomain(lead);
  if (!domain || !first_name || !last_name) {
    return lead;
  }
  const userIdToken: UserIdToken = await getUserIdToken();
  const enrichmentResult = (await fetchEnrichmentApi(
    domain,
    first_name,
    last_name,
    userIdToken
  )) as EnrichmentResult | void;
  if (enrichmentResult) {
    const leadEnriched: LeadEnriched = {
      ...lead,
      ...enrichmentResult,
    };
    return leadEnriched;
  } else {
    return lead;
  }
}

export async function readEnrichHistory() {
  try {
    return new Promise((resolve) => {
      chrome.storage.local.get(["nvli-enrich"], (result) => {
        resolve(result);
      });
    });
  } catch (e) {
    return new Promise((resolve) => resolve({}));
  }
}

async function getLeadWebsiteAndDomain(
  lead: Lead
): Promise<{ domain: string; first_name: string; last_name: string }> {
  const domain = lead.defaultPositionWebsiteUrl;
  // const name = lead.fullName;
  const first_name = lead.firstName;
  const last_name = lead.lastName;
  return { domain, first_name, last_name };
}
