import firebase from "firebase/app";

type UserId = string | undefined;
type UserIdToken = string | undefined;

type FirebaseUser = firebase.User;

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

type User = {
  email: string;
  fullName: string;
  product: string;
  userId: UserId;
  credits: Credits;
};

type Credits = {
  currentPeriodEnd: number;
  total: number;
  available: number;
};

type LinkedInUser = {
  entityUrn: string;
  firstName: string;
  fullName: string;
  headline: string;
  lastName: string;
  objectUrn: string;
};

export {
  FirebaseUser,
  FirebaseConfig,
  User,
  UserId,
  UserIdToken,
  Credits,
  LinkedInUser,
};
