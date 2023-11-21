import { basename } from 'path';
import { ScrapeClassification, ScrapingError, ScrapedCompanyInfo } from './domain';

export function classify(filePath: string, classifications: ScrapeClassification[]): ScrapedCompanyInfo {
  // TODO: decide oin classificationm strategy here. For now, just take the first one
  const chatType = classifications[0].class;
  return {
    companyName: basename(filePath),
    chatType,
    classifications,
    filePath,
    error: ScrapingError.None, // TODO: add data error handling and monitoring
    timestamp: new Date()
  };
}
