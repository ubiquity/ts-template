export interface EmailLookupRequest {
  email: string | void;
  fullname: string | void;
  domain: string | void;
}

export interface ReacherResponse {
  input: string;
  is_reachable: "safe" | "risky" | "invalid" | "unknown";
  misc: {
    is_disposable: boolean;
    is_role_account: boolean;
  };
  mx: {
    accepts_mail: boolean;
    records: string[];
  };
  smtp: {
    can_connect_smtp: boolean;
    has_full_inbox: boolean;
    is_catch_all: boolean;
    is_deliverable: boolean;
    is_disabled: boolean;
  };
  syntax: {
    address: string;
    domain: string;
    is_valid_syntax: boolean;
    username: string;
  };
}

export type MxLookupPromise = Promise<ReacherResponse[]>;
