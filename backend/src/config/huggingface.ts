import { config } from "./env";
import axios from "axios";

export const huggingFaceClient = axios.create({
  baseURL: "https://api-inference.huggingface.co/models/",
  headers: {
    Authorization: `Bearer ${config.HF_API_KEY}`
  }
})

export const HF_MODEL = config.HF_MODEL;