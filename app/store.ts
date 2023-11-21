import { CompanyName, ScrapedCompanyInfo } from './domain';

export class CompanyStore {
  private store: Map<CompanyName, ScrapedCompanyInfo>;

  constructor() {
    this.store = new Map<CompanyName, ScrapedCompanyInfo>();
  }

  insert(info: ScrapedCompanyInfo): void {
    this.store.set(info.companyName, info);
  }

  getAll(): ScrapedCompanyInfo[] {
    return [...this.store.entries()].map(function (entry) {
      return entry[1];
    });
  }
}
