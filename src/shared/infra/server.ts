import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';

import './typeorm';
import '../container';

import uploadConfig from '@config/upload';
import rateLimiter from '@shared/infra/middlewares/rateLimiter';

import AppError from '../errors/AppError';
import routes from './http/routes';

const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadDirectory));
app.use(routes);

app.use(errors());

app.use(
    (error: Error, request: Request, response: Response, _: NextFunction) => {
        if (error instanceof AppError) {
            return response
                .status(error.statusCode)
                .json({ error: { message: error.message } });
        }
        console.error(error);

        return response.status(500).json({ error: 'Internal Error' });
    },
);

app.listen(3333, () => console.log('🚀️ App started at port 3333!!'));
