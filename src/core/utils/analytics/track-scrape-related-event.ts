import { analytics } from "./analytics";
import { getUserId } from "../storage";
import { commit } from "../../../commit.json";

type ScrapeTrackingProperties = {
  type:
    | "not enough credits"
    | "tried input invalid number"
    | "cancelled scraping"
    | "tried scraping more than available"
    | "started scraping";
  [key: string]: string | number;
};

export const trackScrapeRelatedEvent = async (
  properties: ScrapeTrackingProperties
): Promise<void> => {
  const userId = (await getUserId()) as string;
  properties.build = commit;
  analytics.track({
    userId,
    event: "Scrape Related Event",
    timestamp: new Date(),
    properties,
  });
};
