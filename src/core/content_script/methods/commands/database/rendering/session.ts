import Account from "../../../../../../@types/Account";
import Lead from "../../../../../../@types/Lead";
import {
  BufferType,
  DatabaseResult,
  DatabaseResultRenderReady,
} from "../../../../../../@types/database";
import { pluck } from "../methods/render";

export function streamlineRenderResults(
  session: DatabaseResult
): DatabaseResultRenderReady {
  const type: BufferType = identifyBufferType(session.buffer);
  return {
    id: session.dbKey,
    exported: session.timestampHuman,
    count: session.buffer.length,
    type,
    preview: generatePreview(session.buffer, type).filter((e) => e.length),
    enrichedCount: session.enrichedCount,
  };
}
export function leadPreview(lead: Lead) {
  const results = {
    firstName: pluck("firstName", lead),
    companyName: pluck("companyName", lead && lead.defaultPosition),
    title: pluck("title", lead && lead.defaultPosition),
  };
  const sentenceParts = [
    results.firstName ? `${results.firstName}, ` : ``,
    results.title ? `${results.title}@` : ``,
    results.companyName ? `${results.companyName}` : ``,
  ];
  return sentenceParts.join("");
}
export function accountPreview(account: Account) {
  const results = {
    name: pluck("name", account),
    location: pluck("location", account),
    industry: pluck("industry", account),
  };
  const sentenceParts = [
    results.name ? `${results.name}` : ``,
    results.industry ? `, a ${results.industry.toLowerCase()} company` : ``,
    results.location ? ` in ${results.location}` : ``,
  ];
  return sentenceParts.join("");
}

export function generateHTML({
  renderPayload,
  enrichedCountIsNumber,
  renderEnrichedNumber,
}: {
  renderPayload: DatabaseResultRenderReady;
  enrichedCountIsNumber: boolean;
  renderEnrichedNumber: (enrichedCount?: number) => string | false;
}): string {
  return `\
<session data-id="${renderPayload.id}" data-type="${
    renderPayload.type
  }" data-enriched="${(enrichedCountIsNumber && true) || false}">\
<input type="checkbox" id="${renderPayload.id}-checkbox">\
<label for="${renderPayload.id}-checkbox"></label>\
<div class="info">\
<h2>${renderPayload.count} ${renderPayload.type}</h2>\
<date>${renderPayload.exported}</date>\
<date class="enriched">${
    renderEnrichedNumber(renderPayload.enrichedCount) || ""
  }</date>\
</div><ul class="preview">\
<li>${renderPayload.preview.join("</li><li>")}</li>\
</ul><div class="actions">\
<button data-action="delete">Delete</button>\
<button data-action="download">Download</button>
</div>\
<progress></progress> \
</session>`;
}

export function generatePreview(buffer: any[], type: BufferType) {
  const pluckFirst = (buffer: any[]) => buffer.shift();
  const pluckMiddle = (buffer: string | any[]) =>
    buffer[(buffer.length / 2) | 0];
  const pluckLast = (buffer: any[]) => buffer.pop();
  const first = pluckFirst(buffer);
  const middle = pluckMiddle(buffer);
  const last = pluckLast(buffer);
  if (type === BufferType.Leads) {
    return [first, middle, last].map(leadPreview);
  }
  if (type === BufferType.Accounts) {
    return [first, middle, last].map(accountPreview);
  }
  console.error(
    `Unidentified object type when generating preview. This should be either "leads" or "accounts"`
  );
  return [`Preview not supported with this type.`];
}

export function identifyBufferType(
  buffer: Account[] | Lead[] | unknown[]
): BufferType {
  const isAccount = (input: Account | Lead | unknown): input is Account =>
    (input as Account).employeesResolutionResults !== undefined;
  const isLead = (input: Account | Lead | unknown): input is Lead =>
    (input as Lead).fullName !== undefined;
  const sample = buffer[0]; // Just test the first result
  if (isAccount(sample)) {
    buffer.forEach(
      (account) => ((account as Account).employeesResolutionResults = null)
    ); //  Clean this mess. This expands into hundreds of columns when rendered as spreadsheet.
    return BufferType.Accounts;
  }
  if (isLead(sample)) {
    return BufferType.Leads;
  }
  return BufferType.Unknown;
}
