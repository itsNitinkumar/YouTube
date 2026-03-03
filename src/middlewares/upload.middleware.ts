import multer from "multer"
import path from "path"
import { ApiError } from "../utils/ApiError"

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, "uploads/") // Make sure this folder exists
  },
  filename: function (_, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueName + path.extname(file.originalname))
  }
})

const fileFilter = (
  _: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new ApiError(400, "Only image files allowed"))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})