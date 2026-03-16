import express from 'express';
import cors from 'cors';
import "./queues/ai.worker";
import helmet from 'helmet';
import morgan from 'morgan';
import healthRouter from './routes/health.route';
import { errorMiddleware } from './middlewares/error.middleware';
import userRoutes from './modules/user/user.route';
import commentRoutes from './modules/comment/comment.route';
import likeRoutes  from './modules/like/like.route';
import watchHistoryRoutes from './modules/watchHistory.route';
import aiRoutes from './modules/ai/ai.route';
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/watch-history", watchHistoryRoutes);
app.use("/api/v1/ai", aiRoutes);

app.use(errorMiddleware);

export default app;
