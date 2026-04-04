import { Notification } from "./notification.model";
import { CreatorSubscription } from "../creatorSubscription/creatorSubscription.model";
import { getIO, getUserSocket } from "../../socket";
import { logger } from "../../utils/logger";
import mongoose from "mongoose";

export const notifySubscribers = async (
  creatorId: string,
  videoId: string,
  title: string
) => {
  try {
    // Convert string to ObjectId for proper MongoDB query
    const creatorObjectId = new mongoose.Types.ObjectId(creatorId);
    const subscribers = await CreatorSubscription.find({ creatorId: creatorObjectId });

    logger.info(`Found ${subscribers.length} subscribers for creator ${creatorId}`);

    if (subscribers.length === 0) {
      logger.info(`No subscribers to notify for creator ${creatorId}`);
      return;
    }

    const notifications = subscribers.map((subscriber) => {
      return {
        userId: subscriber.subscriberId,
        type: "NEW_VIDEO",
        message: `New video uploaded: ${title}`,
        videoId
      };
    });

    // Insert notifications into database
    try {
      const result = await Notification.insertMany(notifications, { ordered: false });
      logger.info(`Created ${result.length} notifications for video: ${title}`);
    } catch (insertError: any) {
      logger.error("Failed to insert notifications:", insertError);
      throw insertError;
    }

    // Send real-time notifications via Socket.IO
    try {
      const io = getIO();
      
      if (!io) {
        logger.warn("Socket.IO not initialized, skipping real-time notifications");
        return;
      }

      subscribers.forEach((subscriber) => {
        const socketId = getUserSocket(subscriber.subscriberId.toString());
        if (socketId) {
          io.to(socketId).emit("NEW_NOTIFICATION", {
            userId: subscriber.subscriberId,
            type: "NEW_VIDEO",
            message: `New video uploaded: ${title}`,
            videoId
          });
        }
      });
    } catch (socketError) {
      logger.error("Failed to send real-time notifications:", socketError);
      // Don't throw - notifications are saved in DB
    }
  } catch (error) {
    logger.error("Failed to notify subscribers:", error);
    throw error;
  }
};
export const getUnreadCountService = async (userId: string) => {
  return Notification.countDocuments({
    userId,
    isRead: false
  })
}



export const markAllAsReadService = async (userId: string) => {
  return Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  )
}