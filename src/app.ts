import dotenv from 'dotenv';
dotenv.config();

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import route from './controllers';
import { errorHandler } from './middleware/error-handler';
import mysql2 from './db';

const app: express.Application = express();
const port: number = parseInt(process.env.PORT as string, 10);
const apiHost =
  process.env.NODE_ENV === 'local'
    ? `${process.env.HOST}:${process.env.PORT}`
    : process.env.HOST;

app.use(helmet());
app.use(cors());
app.use(errorHandler);
app.use(express.json());

app.use('/v1', route);
console.log(route);

const server = app.listen(port, () => {
  console.log(`server is running! port: ${port}`);
});

const gracefulShutdown = () => {
  server.close(() => {
    console.log('Http server closed.');
    mysql2.close();
    console.log('DB conn closed.');
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
