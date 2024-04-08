import Account from "./Account";
import Lead, { LeadEnriched } from "./Lead";
import { NODE_ENV } from "../core/content_script/content_script";

export type Buffer = Account | Lead | LeadEnriched;

export interface AppState {
  id: string;
  database: {
    visible: boolean;
    rendered: boolean;
    element: HTMLElement | null;
    deleteQueue: string[];
  };
  mode: {
    safety: boolean;
    inverted: boolean;
    connecting: boolean;
    enrichedCount?: number;
    env: NODE_ENV;
  };
  url: {
    pathname: string;
    search: string;
  };
  buffer: Buffer[];
}
