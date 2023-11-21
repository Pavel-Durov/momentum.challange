import { describe, expect, it } from '@jest/globals';
import { CompanyStore } from '../app/store';
import { Chat, ScrapedCompanyInfo, ScrapingError } from '../app/domain';


describe('CompanyStore', () => {

  it('expected to return empty list', async () => {
    const store = new CompanyStore()
    expect(store.getAll()).toEqual([]);
  });

  it('expected to return list with single item', async () => {
    const store = new CompanyStore()
    const record: ScrapedCompanyInfo = {
      companyName: 'test',
      chatType: Chat.Drift,
      filePath: 'file://test',
      timestamp: new Date(),
      error: ScrapingError.None,
      classifications: []
    }
    store.insert(record);
    expect(store.getAll()).toEqual([record]);
  });

});