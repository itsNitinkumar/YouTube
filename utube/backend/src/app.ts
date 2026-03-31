import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import "./queues/ai.worker";
import helmet from 'helmet';
import morgan from 'morgan';
import healthRouter from './routes/health.route';
import { errorMiddleware } from './middlewares/error.middleware';
import userRoutes from './modules/user/user.route';
import videoRoutes from './modules/video/video.route';
import commentRoutes from './modules/comment/comment.route';
import likeRoutes from './modules/like/like.route';
import watchHistoryRoutes from './modules/watchHistory/watchHistory.route';
import aiRoutes from './modules/ai/ai.route';
import notificationRoutes from "./modules/notification/notification.route";
import planRoutes from './modules/plan/plan.route';
import subscriptionRoutes from './modules/subscription/subscription.route';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import creatorSubscriptionRoutes from './modules/creatorSubscription/creatorSubscription.routes';


const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/watch-history", watchHistoryRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/plans", planRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/creators", creatorSubscriptionRoutes);

// Error middleware must be last
app.use(errorMiddleware);

export default app;
