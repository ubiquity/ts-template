import Papa from "papaparse";
import { BufferType } from "../../../../../@types/database";
import { identifyBufferType } from "../database/rendering/session";

import eachAs from "./each-as-x";
import Lead from "../../../../../@types/Lead";
import Account from "../../../../../@types/Account";

import flatten from "flat";

export default (
  input: (Account | Lead | unknown)[],
  type: string,
  pretty?: "pretty"
) => {
  type = type === "accounts" ? "companies" : type;
  let name = `${type}-raw-`;
  if (pretty === "pretty") {
    input = prettifier(input);
    name = `${type}-`;
  }
  // @ts-ignore
  const csv = Papa.unparse(input.map(flatten));
  const date = new Date().toLocaleDateString().replace(/\//gim, `-`);
  downloadString(csv, `text/csv`, `${name}${date}.csv`);
  return csv;
};

export function prettifier(input: Lead[] | Account[] | unknown[]) {
  const type: BufferType = identifyBufferType(input);
  const pretty = (input as any[]).map(eachAs[type]); //  Weird syntax workaround. Need to add array methods to input types...
  return pretty;
}

function downloadString(text, fileType, fileName) {
  const blob = new Blob([text], { type: fileType });
  const a = document.createElement("a");
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(",");
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () {
    URL.revokeObjectURL(a.href);
  }, 1500);
}
