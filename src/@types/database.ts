import Lead from "./Lead";
import Account from "./Account";

export interface DatabaseResult {
  timestampHuman: string;
  timestampPosix: number;
  dbKey: string;
  buffer: Account[] | Lead[] | unknown[];
  enrichedCount?: number;
}
export enum BufferType {
  Leads = "leads",
  Accounts = "accounts",
  Unknown = "unknown",
}
export interface Session {
  dbKey: string;
  timestampHuman: string;
  buffer: Account[] | Lead[];
}
export interface DatabaseResultRenderReady {
  id: string;
  exported: string;
  count: number;
  type: BufferType;
  preview: string[];
  enrichedCount?: number;
}
