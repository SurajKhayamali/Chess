import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import pino from 'pino-http';
import cors from 'cors';
import { createServer } from 'node:http';
import { join } from 'node:path';

import config from './config';
import routes from './routes';
import {
  errorHandlerMiddleware,
  // notFoundHandlerMiddleware,
} from './middlewares/errorHandler.middleware';
import { initializeDatabase } from './database/data-source';
import { initializeSocket } from './socket.init';

const publicPath = join(__dirname, '..', 'public');

const app = express();
const http = createServer(app);
initializeSocket(http);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.cookieSecret));

app.use(pino());

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

app.use('/api', routes);

app.use(errorHandlerMiddleware);

app.use(express.static(publicPath));

app.get('*', function (_req, res) {
  res.sendFile('index.html', {
    root: publicPath,
  });
});

// app.use(notFoundHandlerMiddleware);

initializeDatabase()
  .then(() => {
    http.listen(config.port, () => {
      console.log(`Server listening on port: ${config.port}`);
    });
  })
  .catch((error) => {
    console.log('Database initialization failed:', error);
  });
