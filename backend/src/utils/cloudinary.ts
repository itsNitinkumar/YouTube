import cloudinary from "../config/cloudinary"
import fs from "fs"
import { logger } from "./logger"

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })

    // Delete local file after upload
    fs.unlinkSync(localFilePath)
    
    return response
  } catch (error) {
    logger.error("Cloudinary upload error:", error)
    
    // Delete local file if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath)
    }
    
    return null
  }
}

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) return null
    
    const response = await cloudinary.uploader.destroy(publicId)
    return response
  } catch (error) {
    logger.error("Cloudinary delete error:", error)
    return null
  }
}
