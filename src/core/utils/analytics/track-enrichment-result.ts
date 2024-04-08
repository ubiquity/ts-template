import { analytics } from "./analytics";
import { getUserId } from "../storage";
import { commit } from "../../../commit.json";

export const trackEnrichmentResult = async (
  scraped: number,
  enriched: number,
  url: string
): Promise<boolean> => {
  const userId = (await getUserId()) as string;
  const ratio = enriched / scraped;
  return new Promise((resolve, reject) => {
    // if (process.env.NODE_ENV !== 'production') {
    //   resolve(false);
    // }
    analytics.track(
      {
        userId: userId,
        event: "Enrichment results",
        timestamp: new Date(),
        properties: {
          url,
          scraped,
          enriched,
          ratio,
          build: commit,
        },
      },
      (error: Error) => {
        if (error) {
          reject(false);
        }
        resolve(true);
      }
    );
  });
};
