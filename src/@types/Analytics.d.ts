// https://segment.com/docs/connections/spec/identify/
export type Traits = {
  createdAt?: number;
  lastSignInTime?: number;
  email: string;
  build: string;
};
