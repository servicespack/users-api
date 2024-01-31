import http from 'node:http';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pino from 'pino-http';

import { options } from './logger';
import routers from './routers';

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(pino(options));

app.use('/api', routers.root);
app.use('/api/users', routers.users);
app.use('/api/tokens', routers.tokens);
app.use('/api/verifications', routers.verifications);

export const server = http.createServer(app);
