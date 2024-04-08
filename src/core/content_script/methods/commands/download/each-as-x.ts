import RENAMES from "./renames";
import Lead, { LeadEnriched } from "../../../../../@types/Lead";
import Account from "../../../../../@types/Account";
import humanparser from "humanparser";

const USEFUL_COLUMNS = Object.keys(RENAMES);

export const pluckLead = {
  enriched(lead: Lead | LeadEnriched, processing: any) {
    if ((lead as LeadEnriched).email) {
      processing.email = (lead as LeadEnriched).email;
      processing.confidence = (lead as LeadEnriched).confidence;
    }
    return processing;
  },
  educations(lead: Lead, processing: any) {
    const lastEducation = lead.educations.shift();
    const le = lastEducation;
    if (le) {
      processing[`educations.schoolName`] = le.schoolName;
      processing[`educations.degree`] = le.degree;
      if (le.startedOn && le.startedOn.year)
        processing[`educations.startedOn.year`] = le.startedOn.year;
      if (le.endedOn && le.endedOn.year)
        processing[`educations.endedOn.year`] = le.endedOn.year;
      if (le.fieldsOfStudy && le.fieldsOfStudy[0])
        processing[`educations.fieldsOfStudy`] = le.fieldsOfStudy[0];
    }
    return processing;
  },
  defaultPosition(lead: Lead, processing: any) {
    if (lead.defaultPosition) {
      processing[`defaultPosition.location`] = lead.defaultPosition.location;
      processing[`defaultPosition.title`] = lead.defaultPosition.title;
      processing[`defaultPosition.companyName`] =
        lead.defaultPosition.companyName;
      processing[`defaultPosition.current`] = lead.defaultPosition.current;
      processing[`defaultPosition.description`] =
        lead.defaultPosition.description;
      processing[`defaultPosition.new`] = lead.defaultPosition.new;
      if (lead.defaultPosition.startedOn) {
        processing[`defaultPosition.startedOn.month`] =
          lead.defaultPosition.startedOn.month;
        processing[`defaultPosition.startedOn.year`] =
          lead.defaultPosition.startedOn.year;
      }
    }
    return processing;
  },
  contactInfo(lead: Lead, processing: any) {
    if (lead.contactInfo) {
      if (lead.contactInfo.websites)
        processing[`contactInfo.websites`] =
          lead.contactInfo.websites.shift()?.url;
      if (lead.contactInfo.socialHandles) {
        const social = lead.contactInfo.socialHandles.shift();
        processing[`contactInfo.socialHandles.name`] = social?.name;
        processing[`contactInfo.socialHandles.type`] = social?.type;
      }
    }
    return processing;
  },
};

export default {
  leads: (lead: Lead, index: number, buffer: any[]) => {
    let processing = Object.fromEntries(
      USEFUL_COLUMNS.map((key) => [key, lead[key]])
    );
    processing = pluckLead.educations(lead, processing);
    processing = pluckLead.defaultPosition(lead, processing);
    processing = pluckLead.contactInfo(lead, processing);
    processing = pluckLead.enriched(lead, processing);
    processing = renamer(processing, RENAMES);
    processing = reorderer(processing, RENAMES);
    return processing;
  },
  accounts: (account: Account, index: number, buffer: any[]) => buffer, //  @TODO: currently just a passthrough
  unknown: (unknown: unknown, index: number, buffer: any[]) => buffer, //  @TODO: currently just a passthrough
};

export function renamer(plucked, RENAMES) {
  const parsedName = humanparser.parseName(plucked["fullName"]);
  plucked["fullName"] = parsedName.fullName;
  plucked["firstName"] = parsedName.firstName;
  plucked["lastName"] = parsedName.lastName;
  /**
   * Must first be plucked in order to rename @TODO: test this
   */
  const renameKeys = (keysMap, obj) =>
    Object.keys(obj).reduce(
      (acc, key) => ({ ...acc, ...{ [keysMap[key] || key]: obj[key] } }),
      {}
    );
  return renameKeys(RENAMES, plucked);
}
export function reorderer(renamed, RENAMES) {
  /**
   * Must first be renamed to reorder
   */
  const ORDER: string[] = Object.values(RENAMES);
  const newOrder = {};
  ORDER.forEach((key) => (newOrder[key] = renamed[key]));
  return newOrder;
}
