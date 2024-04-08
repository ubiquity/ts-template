export interface LeadEnriched extends Lead {
  email: string;
  confidence: number;
}
export default interface Lead {
  objectUrn: string;
  contactInfo: {
    socialHandles: SocialHandle[];
    websites: {
      url: string;
    }[];
  };
  crmStatus: {
    imported: boolean;
  };
  educations: Education[];
  inmailRestriction: string;
  unlocked: boolean;
  showTotalConnectionsPage: boolean;
  defaultPosition: Position;
  defaultPositionWebsiteUrl: string;
  noteCount: number;
  degree: number;
  positions: Position[];
  relatedColleagueCompanyId: number;
  savedLead: boolean;
  firstName: string;
  numOfSharedConnections: number;
  memberBadges: {
    premium: boolean;
    openLink: boolean;
    jobSeeker: boolean;
  };
  lastName: string;
  industry: string;
  entityUrn: string;
  numOfConnections: number;
  profilePictureDisplayImage: {
    artifacts: ProfilePictureDisplayImageArtifact[];
    rootUrl: string;
  };
  headline: string;
  profileUnlockInfo: {
    showProfileUnlock: boolean;
  };
  summary: string;
  pendingInvitation: boolean;
  fullName: string;
  pictureInfo: unknown;
  listCount: number;
  flagshipProfileUrl: string;
  location: string;
  indexed: string;
}

interface Position {
  new: boolean;
  companyName: string;
  description: string;
  title: string;
  companyUrn: string;
  posId: number;
  current: true;
  startedOn: MonthAndYear;
  location: string;
}
interface ProfilePictureDisplayImageArtifact {
  width: number;
  fileIdentifyingUrlPathSegment: string;
  height: number;
}
interface SocialHandle {
  name: string;
  type: string;
  dataSource: string;
}

interface MonthAndYear {
  month?: number;
  year: number;
}

interface Education {
  endedOn: MonthAndYear;
  degree: string;
  eduId: number;
  fieldsOfStudy: string[];
  school: string;
  schoolName: string;
  startedOn: MonthAndYear;
}

export type EnrichmentResult = {
  email: string;
  confidence: number;
};
