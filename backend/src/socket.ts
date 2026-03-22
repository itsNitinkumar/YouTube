import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import {config} from "./config/env"
const onlineUsers = new Map<string, string>()
let io: Server

export const initSocket = (server: any) => {

  io = new Server(server, {
    cors: {
      origin: "*"
    }
  })

 io.on("connection", (socket) => {

  try {

    const token = socket.handshake.auth.token

    if (!token) {
      console.log("No token provided")
      socket.disconnect()
      return
    }

    const decoded: any = jwt.verify(
      token,
      config.ACCESS_TOKEN_SECRET
    )

    const userId = decoded.userId

    
    onlineUsers.set(userId, socket.id)

    console.log(`User connected: ${userId}`)

    socket.on("disconnect", () => {
      onlineUsers.delete(userId)
      console.log(`User disconnected: ${userId}`)
    })

  } catch (error) {
    console.log("Socket auth error:", error)
  }

})
}
export const getIO = () => io 
export const getUserSocket = (userId: string) => {
  return onlineUsers.get(userId)
}
