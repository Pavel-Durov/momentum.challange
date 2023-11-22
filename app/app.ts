import cors from 'cors';
import express from 'express';
import router from './routes/chat';
import { init } from './logger';
import { CRON_SCHEDULE, PORT } from './config';

import { CompanyStore } from './store';
import { StoreUpdateJob } from './storeJob';
import { StatusCodes } from 'http-status-codes';
import { Scraper } from './scraper';

const app: express.Application = express();

const log = init('server');

const options: cors.CorsOptions = {
  origin: '*'
};

app.use(express.json());
app.use(cors(options));

const store = new CompanyStore();
const updateJob = new StoreUpdateJob(store, new Scraper(), CRON_SCHEDULE);

app.use('/chat', router(store));

app.get('/health', (req, res) => {
  res.send('I am alive!').status(StatusCodes.OK);
});

const server = app.listen(PORT, function () {
  log.info(`listening on http://localhost:${PORT}. pid ${process.pid}`);
  updateJob.updateOneAndSchedule();
});

server.on('close', () => {
  log.info('Server stopped! Process will exit now.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log.info('Received SIGTERM! Refusing new connections.');
  server.close();
});
