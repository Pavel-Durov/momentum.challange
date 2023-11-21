import * as cron from 'node-cron';
import * as fs from 'fs/promises';

import { join } from 'path';

import { CompanyStore } from './store';
import { init } from './logger';
import { Logger } from 'winston';
import { Scraper } from './scraper';
import { classify } from './classifier';
import { ScrapedCompanyInfo } from './domain';
import { BATCH_JOB_SIZE } from './config';

export class StoreUpdateJob {
  private log: Logger;

  constructor(private store: CompanyStore, private scraper: Scraper, private schedule: string) {
    this.log = init(StoreUpdateJob.name);
  }

  public async updateOneAndSchedule() {
    this.log.info('Updating once');
    await this.update();
    this.log.info(`Scheduling cron job with schedule ${this.schedule}`);
    // cron.schedule(this.schedule, this.update);
  }

  public static splitIntoBatches<T>(arr: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < arr.length; i += batchSize) {
      const batch = arr.slice(i, i + batchSize);
      batches.push(batch);
    }
    return batches;
  }

  private async processFile(filePath: string): Promise<ScrapedCompanyInfo> {
    const scrapedData = await this.scraper.scrape(filePath);
    const companyInfo = await classify(filePath, scrapedData);
    this.store.insert(companyInfo);
    return companyInfo;
  }

  private async update() {
    this.log.info('background job started');
    try {
      await this.scraper.init();
      const directoryPath = join(__dirname, './data/');
      const files = await fs.readdir(directoryPath);
      const batches = StoreUpdateJob.splitIntoBatches(files, BATCH_JOB_SIZE);
      let batchNumber = 1;
      for (const batch of batches) {
        this.log.info(`processing batch: ${batchNumber}/${batch.length} (batch size: ${batch.length})`);
        const promises = batch.map((file) => this.processFile(join(directoryPath, file)));
        await Promise.all(promises);
        batchNumber++;
      }
    } catch (error) {
      this.log.error(error);
      this.log.error(error);
    } finally {
      this.log.info('background job completed');
    }
  }
}
