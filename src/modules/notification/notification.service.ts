import {Notification} from "./notification.model"
import { CreatorSubscription } from "../creatorSubscription/creatorSubscription.model"
import { getIO, getUserSocket } from "../../socket"

export const notifySubscribers = async (creatorId: string,videoId: string,title:string)=>{
   const subscribers = await CreatorSubscription.find({creatorId})
   const notifications = subscribers.map((subscriber)=>{
    return {
      userId: subscriber.subscriberId,

      type: "NEW_VIDEO",
      message: `New video uploaded: ${title}`,
      videoId
    }
   }) 

   await Notification.insertMany(notifications , { ordered: false })
   const io = getIO()
   subscribers.forEach((subscriber)=> {
     const socketId = getUserSocket(
       subscriber.subscriberId.toString()
     )
     if (socketId) {
       io.to(socketId).emit("NEW_NOTIFICATION", {
         userId: subscriber.subscriberId,
         type: "NEW_VIDEO",
         message: `New video uploaded: ${title}`,
         videoId
       })
     }
   })
}