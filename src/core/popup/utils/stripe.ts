import { loadStripe, Stripe } from "@stripe/stripe-js";
import { getStripeSessionId } from "./api";

const initStripe: () => Promise<Stripe | null> = async () => {
  const isDevEnvironment = process.env.NODE_ENV === "development";
  const striplePublishKey: string | undefined = isDevEnvironment
    ? process.env.STRIPE_PUBLISH_KEY_DEV
    : process.env.STRIPE_PUBLISH_KEY;
  if (!striplePublishKey) {
    throw new Error(
      `Please set STRIPE_PUBLISH_KEY${
        isDevEnvironment ? "_DEV" : ""
      } environment variable`
    );
  }
  return loadStripe(striplePublishKey);
};

const initCheckout: () => Promise<void> = async () => {
  const stripe = await initStripe();
  const sessionId = await getStripeSessionId();
  if (sessionId) {
    await stripe?.redirectToCheckout({ sessionId });
  }
};

export { initCheckout };
