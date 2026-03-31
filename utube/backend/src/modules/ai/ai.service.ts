import * as groqService from "./groq.service";
import * as assemblyaiService from "./assemblyai.service";

// Export Groq-based AI functions
export const generateVideoSummary = groqService.generateVideoSummary;
export const generateVideoTags = groqService.generateVideoTags;
export const generateTitleSuggestions = groqService.generateTitleSuggestions;
export const detectToxicComment = groqService.detectToxicComment;
export const generateVideoCategory = groqService.generateVideoCategory;
export const generateComprehensiveSummary = groqService.generateComprehensiveSummary;
export const summarizeTranscript = groqService.summarizeTranscript;

// Export AssemblyAI functions
export const transcribeVideo = assemblyaiService.transcribeVideo;
export const generateVideoContentSummary = assemblyaiService.generateVideoContentSummary;
