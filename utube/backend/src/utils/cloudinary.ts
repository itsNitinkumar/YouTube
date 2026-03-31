import cloudinary from "../config/cloudinary"
import fs from "fs"
import { logger } from "./logger"

interface UploadOptions {
  folder?: string
  resource_type?: "image" | "video" | "raw" | "auto"
  transformation?: any[]
  eager?: any[]
  eager_async?: boolean
}

/**
 * Upload file to Cloudinary
 * @param localFilePath - Path to local file
 * @param options - Cloudinary upload options
 */
export const uploadOnCloudinary = async (
  localFilePath: string,
  options: UploadOptions = {}
) => {
  try {
    if (!localFilePath) {
      logger.error("No file path provided")
      return null
    }

    // Check if file exists
    if (!fs.existsSync(localFilePath)) {
      logger.error(`File does not exist: ${localFilePath}`)
      return null
    }

    const uploadOptions = {
      resource_type: options.resource_type || "auto",
      folder: options.folder || "videohub",
      ...options
    }

    logger.info(`Uploading file to Cloudinary: ${localFilePath}`)
    logger.info(`Upload options: ${JSON.stringify(uploadOptions)}`)
    
    const response = await cloudinary.uploader.upload(
      localFilePath,
      uploadOptions
    )

    // Delete local file after successful upload
    fs.unlinkSync(localFilePath)

    logger.info(`File uploaded to Cloudinary: ${response.public_id}`)
    return response
  } catch (error: any) {
    logger.error("Cloudinary upload error:", error.message)
    if (error.error) {
      logger.error("Cloudinary error details:", error.error)
    }
    if (error.http_code) {
      logger.error("HTTP code:", error.http_code)
    }

    // Delete local file if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath)
    }

    throw error // Re-throw to see full error
  }
}

/**
 * Upload image to Cloudinary with optimizations
 */
export const uploadImageToCloudinary = async (localFilePath: string) => {
  return uploadOnCloudinary(localFilePath, {
    resource_type: "image",
    folder: "videohub/images",
    transformation: [
      { width: 1920, height: 1080, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" }
    ]
  })
}

/**
 * Upload video to Cloudinary with optimizations
 */
export const uploadVideoToCloudinary = async (localFilePath: string) => {
  // Simplified upload without folder or transformations
  return uploadOnCloudinary(localFilePath, {
    resource_type: "video"
  })
}

/**
 * Upload thumbnail to Cloudinary
 */
export const uploadThumbnailToCloudinary = async (localFilePath: string) => {
  return uploadOnCloudinary(localFilePath, {
    resource_type: "image",
    folder: "videohub/thumbnails",
    transformation: [
      { width: 1280, height: 720, crop: "fill", gravity: "auto" },
      { quality: "auto" },
      { fetch_format: "auto" }
    ]
  })
}

/**
 * Delete file from Cloudinary
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
) => {
  try {
    if (!publicId) return null

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    })

    logger.info(`File deleted from Cloudinary: ${publicId}`)
    return response
  } catch (error) {
    logger.error("Cloudinary delete error:", error)
    return null
  }
}

/**
 * Generate video thumbnail from Cloudinary video
 */
export const generateVideoThumbnail = (videoPublicId: string) => {
  return cloudinary.url(videoPublicId, {
    resource_type: "video",
    transformation: [
      { width: 1280, height: 720, crop: "fill" },
      { quality: "auto" },
      { fetch_format: "jpg" }
    ],
    start_offset: "auto" // Auto-select best frame
  })
}

/**
 * Get optimized video URL with multiple quality options
 */
export const getVideoUrls = (videoPublicId: string) => {
  return {
    original: cloudinary.url(videoPublicId, { resource_type: "video" }),
    hd: cloudinary.url(videoPublicId, {
      resource_type: "video",
      transformation: [
        { width: 1920, height: 1080, crop: "limit" },
        { quality: "auto" }
      ]
    }),
    sd: cloudinary.url(videoPublicId, {
      resource_type: "video",
      transformation: [
        { width: 1280, height: 720, crop: "limit" },
        { quality: "auto" }
      ]
    }),
    mobile: cloudinary.url(videoPublicId, {
      resource_type: "video",
      transformation: [
        { width: 854, height: 480, crop: "limit" },
        { quality: "auto" }
      ]
    })
  }
}
