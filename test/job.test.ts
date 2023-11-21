import { describe, expect, it } from '@jest/globals';

import {join } from 'path';
import * as fs from 'fs/promises'
import { CompanyUpdateJob } from '../app/storeJob';


describe('CompanyUpdateJob', () => {

  it('expected to split into correct batches', async () => {
    const files = await fs.readdir(join(__dirname, '../app/data/'));
    const batched = CompanyUpdateJob.splitIntoBatches(files, 20);

    expect(batched.length).toBe(6);
    expect(batched[0]).toEqual(files.slice(0, 20));
    expect(batched[1]).toEqual(files.slice(20, 40));
    expect(batched[2]).toEqual(files.slice(40, 60));
    expect(batched[3]).toEqual(files.slice(60, 80));
    expect(batched[4]).toEqual(files.slice(80, 100));
    expect(batched[5]).toEqual(files.slice(100, 114));
  });

});