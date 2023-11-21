import * as cron from 'node-cron';
import * as fs from 'fs/promises';

import { join } from 'path';

import { CompanyStore } from './store';
import { init } from './logger';
import { Logger } from 'winston';

export class CompanyUpdateJob {
  private log: Logger;
  readonly BATCH_SIZE = 20;

  constructor(private store: CompanyStore, private schedule: string) {
    this.log = init(CompanyUpdateJob.name);
  }

  public async updateOneAndSchedule() {
    this.log.info('Updating once');
    await this.update();
    this.log.info(`Scheduling cron job with schedule ${this.schedule}`);
    cron.schedule(this.schedule, this.update);
  }

  public static splitIntoBatches<T>(arr: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < arr.length; i += batchSize) {
      const batch = arr.slice(i, i + batchSize);
      batches.push(batch);
    }
    return batches;
  }

  private async update() {
    this.log.info('background job started');
    try {
      const directoryPath = join(__dirname, './data/');
      const files = await fs.readdir(directoryPath);
      const batches = CompanyUpdateJob.splitIntoBatches(files, this.BATCH_SIZE);
      for (const files of batches) {
        this.log.info(`Processing batch of ${files.length} files`);
      }
    } catch (error) {
      this.log.error(error);
    } finally {
      this.log.info('background job completed');
    }
  }
}
