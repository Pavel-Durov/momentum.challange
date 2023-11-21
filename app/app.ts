import cors from 'cors';
import express from 'express';
import router from './routes/chat';
import { init } from './logger';

const log = init('server');

const app: express.Application = express();

const options: cors.CorsOptions = {
  origin: '*'
};

app.use(express.json());
app.use(cors(options));
app.use('/chat', router);

app.listen('8080', function () {
  log.info('listening on http://localhost:8080');
});
