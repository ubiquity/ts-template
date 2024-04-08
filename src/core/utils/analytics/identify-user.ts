import { Traits } from "../../../@types/Analytics";
import { FirebaseUser } from "../../../@types/User";
import { analytics } from "./analytics";
import { commit } from "../../../commit.json";

export const identifyUser = (userId: string, traits: Traits): void => {
  analytics.identify({
    userId,
    traits,
  });
};

export const identifyFirebaseUser = (firebaseUser: FirebaseUser): void => {
  identifyUser(firebaseUser.uid, getTraitsFromFirebaseUser(firebaseUser));
};

export const getTraitsFromFirebaseUser = (
  firebaseUser: FirebaseUser
): Traits => {
  const traits: Traits = {
    email: firebaseUser.email as string, // we let the users sign-in only using providers requiring an email address, so we know for sure that a string is returned
    build: commit,
    createdAt: Date.parse(firebaseUser.metadata.creationTime as string),
    lastSignInTime: Date.parse(firebaseUser.metadata.lastSignInTime as string),
  };
  return traits;
};
