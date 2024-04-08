import Analytics from "analytics-node";

const segmentKey = process.env.SEGMENT_KEY as string;
if (!segmentKey) {
  throw new Error(`SEGMENT_KEY environment variable is not defined.`);
}
export const analytics = new Analytics(segmentKey);

export const attributeDataTracking = "data-t";
