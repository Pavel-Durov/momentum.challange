import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import { Scraper } from '../app/scraper';
import { ChatType, Strategy, } from '../app/domain';
import { join } from 'path';


const engine: Scraper = new Scraper()


beforeAll(async () => {
  await engine.init();
})

afterAll(async () => {
  await engine.close();
})

describe('Scraper', () => {
  it('expected to scrape Drift classification (fieldnation.html)', async () => {
    const filePath = join(__dirname, '../app/data/fieldnation.html');
    const classification = await engine.scrape(filePath)
    expect(classification.length).toEqual(2);
    expect(classification[0].class).toEqual(ChatType.Drift);
    expect(classification[0].strategy).toEqual(Strategy.IncludedScriptDomain);
    expect(classification[1].class).toEqual(ChatType.Drift);
    expect(classification[1].strategy).toEqual(Strategy.GlobalVar);
  });
  it('expected to scrape Drift classification (envoy.html)', async () => {
    const filePath = join(__dirname, '../app/data/envoy.html');
    const classification = await engine.scrape(filePath)
    expect(classification.length).toEqual(2);
    expect(classification[0].class).toEqual(ChatType.Drift);
    expect(classification[0].strategy).toEqual(Strategy.IncludedScriptDomain);
    expect(classification[1].class).toEqual(ChatType.Drift);
    expect(classification[1].strategy).toEqual(Strategy.GlobalVar);
  });
  it('expected to scrape Salesforce classification (omega.ca.html)', async () => {
    const filePath = join(__dirname, '../app/data/omega.ca.html');
    const classification = await engine.scrape(filePath)
    expect(classification.length).toEqual(1);
    expect(classification[0].class).toEqual(ChatType.Salesforce);
    expect(classification[0].strategy).toEqual(Strategy.IncludedScriptDomain);
  });
});