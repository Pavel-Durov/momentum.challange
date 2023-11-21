export enum ScrapingError {
  Empty = 'EmptyFile',
  Load = 'LoadError',
  None = 'None'
}

export enum ChatType {
  None = 'None',
  Salesforce = 'Salesforce',
  Drift = 'Drift'
}

export enum Strategy {
  None = 'None',
  IncludedScriptDomain = 'IncludedScriptDomain',
  GlobalVar = 'GlobalVar',
  IframeMatch = 'IframeMatch'
}

export interface ScrapeClassification {
  strategy: Strategy;
  class: ChatType;
}

export type CompanyName = string;

export interface CompanyInfo {
  companyName: CompanyName;
  chatType: ChatType;
}

export interface ScrapedCompanyInfo extends CompanyInfo {
  timestamp: Date;
  filePath: string;
  error: ScrapingError;
  classifications: ScrapeClassification[];
}
