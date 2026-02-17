import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import healthRouter from './routes/health.route';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use("/api/v1/health", healthRouter);

app.use(errorMiddleware);

export default app;
