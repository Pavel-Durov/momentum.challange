import * as fs from 'fs/promises';
import puppeteer, { Browser, Page } from 'puppeteer';
import { ChatType, ScrapeClassification, Strategy } from './domain';
import { Logger } from 'winston';
import { init } from './logger';

export class Scraper {
  private browser: Browser;
  private log: Logger;

  public async init() {
    this.browser = await puppeteer.launch({ headless: 'new' });
    this.log = init(Scraper.name);
  }

  public async getDriftClass(page: Page): Promise<ScrapeClassification[]> {
    const result: ScrapeClassification[] = [];
    const driftScriptsExist = await page.evaluate(() => {
      const scriptElements = document.querySelectorAll('script[src*="js.driftt.com"]');
      return scriptElements.length > 0;
    });
    if (driftScriptsExist) {
      result.push({ strategy: Strategy.IncludedScriptDomain, class: ChatType.Drift });
    }

    const driftVarExist = await page.evaluate(() => {
      return (window as any).drift !== undefined;
    });
    if (driftVarExist) {
      result.push({ strategy: Strategy.GlobalVar, class: ChatType.Drift });
    }

    const driftIframesExist = await page.evaluate(() => {
      return (
        [...document.getElementsByTagName('iframe')]
          .map((frame) => frame.src)
          .filter((src) => src.includes('js.driftt')).length > 0
      );
    });

    if (driftIframesExist) {
      result.push({ strategy: Strategy.IframeMatch, class: ChatType.Drift });
    }
    return result;
  }

  public async getSalesforceClass(page: Page): Promise<ScrapeClassification[]> {
    const result: ScrapeClassification[] = [];
    const salesScriptExists = await page.evaluate(() => {
      const script1 = document.querySelectorAll('script[src*="service.force.com"]');
      const script2 = document.querySelectorAll('script[src*="salesforceliveagent"]');
      const script3 = document.querySelectorAll('script[src*="liveagent"]');
      return script3.length > 0 || script2.length > 0 || script1.length > 0;
    });

    if (salesScriptExists) {
      result.push({ strategy: Strategy.IncludedScriptDomain, class: ChatType.Salesforce });
    }
    return result;
  }
  private async getClass(page: Page): Promise<ScrapeClassification[]> {
    let result: ScrapeClassification[] = [{ class: ChatType.None, strategy: Strategy.None }];
    const drift = await this.getDriftClass(page);
    if (drift.length > 0) {
      result = drift;
    }
    const saleforce = await this.getSalesforceClass(page);
    if (drift.length > 0 && saleforce.length > 0) {
      result = [...result, ...saleforce];
    } else if (saleforce.length > 0) {
      result = saleforce;
    }
    return result;
  }

  public async scrape(filePath: string): Promise<ScrapeClassification[]> {
    let result: ScrapeClassification[] = [{ class: ChatType.None, strategy: Strategy.None }];
    let content: string | undefined = undefined;
    try {
      content = (await fs.readFile(filePath)).toString();
    } catch (e) {
      this.log.error(e);
    }
    if (content === undefined || content.length === 0) {
      return result;
    }
    let page: Page | undefined = undefined;
    try {
      this.log.info(`Scraping ${filePath}`);
      page = await this.browser?.newPage();
      await page.setContent(content, { timeout: 30000 });
      result = await this.getClass(page);
    } catch (e) {
      this.log.error(e);
    } finally {
      await page?.close();
    }
    return result;
  }

  public async close() {
    await this.browser?.close();
  }
}
