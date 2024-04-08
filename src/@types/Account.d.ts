export default interface Account {
  description: string;
  industry: string;
  employeeCount: number;
  flagshipCompanyUrl: string;
  entityUrn: string;
  employeesSearchPageUrl: string;
  website: string;
  employeesResolutionResults?: {
    [key: string]: {
      //	Dynamic key destroys spreadsheet columns
      firstName: string;
      lastName: string;
      entityUrn: string;
      fullName: string;
      profilePictureDisplayImage: PictureDisplayImage;
      pictureInfo: unknown;
    };
  } | null; //  Support null for CSV export
  companyPictureDisplayImage: PictureDisplayImage;
  pictureInfo: unknown;
  employeeCountRange: string;
  headquarters: {
    country: string;
  };
  employeeDisplayCount: string;
  name: string;
  location: string;
  employees: string[];
  account: {
    listCount: number;
    saved: boolean;
  };
  indexed: string;
}

interface PictureDisplayImage {
  artifacts: unknown[];
  rootUrl: string;
}
