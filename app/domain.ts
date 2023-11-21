export enum Chat {
  None = 'None',
  Salesforce = 'Salesforce',
  Drift = 'Drift'
}

export enum Strategy {
  None = 'None'
}

export enum ScrapingError {
  None = 'None'
}

export interface Classification {
  strategy: Strategy;
  class: Chat;
}

export type CompanyName = string;

export interface CompanyInfo {
  companyName: CompanyName;
  chatType: Chat;
}

export interface ScrapedCompanyInfo extends CompanyInfo {
  timestamp: Date;
  filePath: string;
  error: ScrapingError;
  classifications: Classification[];
}
