import multer from "multer"
import path from "path"
import fs from "fs"
import { ApiError } from "../utils/ApiError"

// Ensure uploads directory exists
const uploadsDir = "uploads/"
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (_req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueName + path.extname(file.originalname))
  }
})

// Image upload filter
const imageFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new ApiError(400, "Only image files allowed") as any)
  }
}

// Video upload filter
const videoFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true)
  } else {
    cb(new ApiError(400, "Only video files allowed") as any)
  }
}

// Image and video upload filter
const mediaFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true)
  } else {
    cb(new ApiError(400, "Only image and video files allowed") as any)
  }
}

// Image upload (5MB limit)
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

// Video upload (100MB limit)
export const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
})

// Media upload (image or video, 100MB limit)
export const uploadMedia = multer({
  storage,
  fileFilter: mediaFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
})

// Legacy export for backward compatibility
export const upload = uploadImage