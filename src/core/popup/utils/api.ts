import { UserId, User, Credits } from "../../../@types/User";
import { getUserId } from "../../utils/storage";

const baseUrl = "https://core.orion.black/api/v1/li_scraper";

type GenericObject = Record<string, unknown>; // {}

const request: (url: string, data?: GenericObject) => Promise<Response> =
  async (url: string, data = {}): Promise<Response> => {
    const params = (data.params || {}) as Record<string, string>;
    if (process.env.NODE_ENV === "development") {
      params.mode = "dev";
    }
    return await fetch(`${baseUrl}${url}?${new URLSearchParams(params)}`, {
      ...data,
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
    });
  };

const getUser: () => Promise<User | null> = async () => {
  const userId: UserId = await getUserId();
  if (userId) {
    const res = await request(`/user/${userId}`, { method: "GET" });
    if (res.status === 200) {
      const user: User = await res.json();
      return user;
    }
  }
  return null;
};

const getCredits: () => Promise<Credits | null> = async () => {
  const userId = await getUserId();
  if (userId) {
    const res = await request(`/user/${userId}/credits`, { method: "GET" });
    if (res.status === 200) {
      const credits = await res.json();
      return credits;
    }
  }
  return null;
};

const decreaseCredits: (amount: number) => Promise<Credits | null> = async (
  amount
) => {
  const userId = await getUserId();
  if (userId) {
    const res = await request(`/user/${userId}/credits/decrease`, {
      method: "PUT",
      body: JSON.stringify({
        amount,
      }),
    });
    if (res.status === 200) {
      const updatedCredits = await res.json();
      return updatedCredits;
    }
  }
  return null;
};

const checkURN: (urn: string) => Promise<boolean> = async (urn) => {
  const userId = await getUserId();
  if (userId) {
    const res = await request(`/user/${userId}/checkURN`, {
      method: "GET",
      params: {
        "li-urn": urn,
      },
    });
    if (res.status === 200) {
      const checkResult = await res.json();
      if (checkResult.matching) {
        return true;
      }
    }
  }
  return false;
};

const getStripeSessionId: () => Promise<string | null> = async () => {
  const userId = await getUserId();
  if (userId) {
    const params = {
      priceId:
        process.env.NODE_ENV === "development"
          ? process.env.STRIPE_PRICE_ID_DEV
          : process.env.STRIPE_PRICE_ID,
    };
    const res = await request(`/user/${userId}/checkout`, {
      method: "POST",
      params,
    });
    if (res.status === 201) {
      const stripeSession = await res.json();
      return stripeSession.id;
    }
  }
  return null;
};

const getStripePotalSessionUrl: () => Promise<string | null> = async () => {
  const userId = await getUserId();
  if (userId) {
    const res = await request(`/user/${userId}/portal`, {
      method: "POST",
    });
    if (res.status === 201) {
      const portalSession = await res.json();
      return portalSession.url;
    }
  }
  return null;
};

export {
  getUser,
  getCredits,
  decreaseCredits,
  checkURN,
  getStripeSessionId,
  getStripePotalSessionUrl,
};
