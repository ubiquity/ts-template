export type HunterResponse = {
  statusCode: number;
  hunterResponse: HunterOK | HunterError;
};

export interface HunterError {
  errors: [
    {
      id: "domain_invalid";
      code: 400;
      details: "This domain name cannot receive emails.";
    }
  ];
}
export interface HunterOK {
  data: {
    first_name: "Dustin";
    last_name: "Moskovitz";
    email: "dustin@asana.com";
    score: 96;
    domain: "asana.com";
    accept_all: false;
    position: "Cofounder";
    twitter: "";
    linkedin_url: "";
    phone_number: "";
    company: "Asana";
    sources: [
      {
        domain: "hunter.io";
        uri: "http://hunter.io/api-documentation/v2";
        extracted_on: "2020-03-31";
        last_seen_on: "2020-11-15";
        still_on_page: true;
      },
      {
        domain: "hunter.io";
        uri: "http://hunter.io/api/email-finder";
        extracted_on: "2019-06-02";
        last_seen_on: "2020-11-15";
        still_on_page: true;
      },
      {
        domain: "hunter.io";
        uri: "http://hunter.io/api/v2/docs";
        extracted_on: "2016-10-24";
        last_seen_on: "2020-11-14";
        still_on_page: true;
      },
      {
        domain: "dev.stackstack.com";
        uri: "http://dev.stackstack.com/asana";
        extracted_on: "2017-08-04";
        last_seen_on: "2017-11-04";
        still_on_page: false;
      },
      {
        domain: "api.hunter.io";
        uri: "http://api.hunter.io/api";
        extracted_on: "2017-02-16";
        last_seen_on: "2019-05-15";
        still_on_page: false;
      },
      {
        domain: "api.hunter.io";
        uri: "http://api.hunter.io/api/v2/docs";
        extracted_on: "2017-02-16";
        last_seen_on: "2019-07-31";
        still_on_page: false;
      },
      {
        domain: "hunter.io";
        uri: "http://hunter.io/api";
        extracted_on: "2016-10-24";
        last_seen_on: "2019-05-14";
        still_on_page: false;
      },
      {
        domain: "emailhunter.co";
        uri: "http://emailhunter.co/api/docs";
        extracted_on: "2015-10-11";
        last_seen_on: "2019-05-14";
        still_on_page: false;
      }
    ];
    verification: {
      date: "2020-11-17";
      status: "valid";
    };
  };
  meta: {
    params: {
      first_name: "Dustin";
      last_name: "Moskovitz";
      full_name: null;
      domain: "asana.com";
      company: null;
    };
  };
}
