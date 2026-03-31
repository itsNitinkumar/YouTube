import { groqClient, GROQ_MODEL } from "../../config/groq"
import { logger } from "../../utils/logger"

/**
 * Query Groq AI with retry logic
 */
const queryGroq = async (
  prompt: string,
  retries = 2
): Promise<string | null> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.info(`Groq request attempt ${attempt}/${retries}`)

      const completion = await groqClient.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        model: GROQ_MODEL,
        temperature: 0.5,
        max_tokens: 200
      })

      const text = completion.choices[0]?.message?.content

      if (!text) {
        logger.warn("Groq returned empty response")
        return null
      }

      logger.info("Groq request successful")
      return text.trim()
    } catch (error: any) {
      const errorMessage = error?.message || error?.error?.error?.message || "Unknown error"
      logger.error(`Groq error (attempt ${attempt}/${retries}): ${errorMessage}`)

      if (attempt === retries) {
        logger.error("Groq request failed after all attempts")
        return null
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  return null
}

/**
 * Generate video summary using Groq
 */
export const generateVideoSummary = async (
  description: string
): Promise<string> => {
  if (!description || description.length < 10) {
    return "No description provided."
  }

  const prompt = `Summarize this video description in exactly 2 sentences. Be concise and informative.

Description: ${description.substring(0, 500)}

Summary:`

  const result = await queryGroq(prompt)

  if (!result) {
    // Fallback
    const sentences = description.match(/[^.!?]+[.!?]+/g) || []
    return (
      sentences.slice(0, 2).join(" ").trim() ||
      description.substring(0, 200) + "..."
    )
  }

  return result
}

/**
 * Generate video tags using Groq
 */
export const generateVideoTags = async (
  title: string,
  description: string
): Promise<string[]> => {
  const prompt = `Generate exactly 5 relevant tags for this video. Return ONLY the tags separated by commas, nothing else.

Title: ${title}
Description: ${description.substring(0, 300)}

Tags:`

  const result = await queryGroq(prompt)

  if (result) {
    const tags = result
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 5)

    if (tags.length > 0) {
      return tags
    }
  }

  // Fallback: Extract keywords
  const text = `${title} ${description}`.toLowerCase()
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for"
  ])

  const words = text
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !commonWords.has(word))

  return [...new Set(words)].slice(0, 5)
}

/**
 * Generate title suggestions using Groq
 */
export const generateTitleSuggestions = async (
  description: string
): Promise<string[]> => {
  const prompt = `Generate 5 catchy video titles based on this description. Return ONLY the titles, one per line, no numbering.

Description: ${description.substring(0, 300)}

Titles:`

  const result = await queryGroq(prompt)

  if (result) {
    const titles = result
      .split("\n")
      .map((title) =>
        title.replace(/^\d+[\.)]\s*/, "").replace(/^[-•]\s*/, "").trim()
      )
      .filter(Boolean)
      .slice(0, 5)

    if (titles.length > 0) {
      return titles
    }
  }

  // Fallback
  const firstSentence = description.split(/[.!?]/)[0] || description
  return [
    firstSentence.substring(0, 60),
    `Watch: ${firstSentence.substring(0, 50)}`,
    `${firstSentence.substring(0, 50)} | Video`,
    `Amazing: ${firstSentence.substring(0, 45)}`,
    firstSentence.substring(0, 55) + "..."
  ].filter(Boolean)
}

/**
 * Detect toxic comments using Groq
 */
export const detectToxicComment = async (
  comment: string
): Promise<boolean> => {
  const prompt = `Is this comment toxic, offensive, or contains hate speech? Reply with ONLY "true" or "false".

Comment: "${comment}"

Answer:`

  const result = await queryGroq(prompt)

  if (result) {
    return result.toLowerCase().includes("true")
  }

  // Fallback: Simple keyword detection
  const toxicKeywords = ["hate", "kill", "die", "stupid", "idiot"]
  const lowerComment = comment.toLowerCase()
  return toxicKeywords.some((keyword) => lowerComment.includes(keyword))
}

/**
 * Generate video category using Groq
 */
export const generateVideoCategory = async (
  title: string,
  description: string
): Promise<string> => {
  const prompt = `Based on this video title and description, suggest ONE category from: Education, Entertainment, Gaming, Music, Sports, Technology, Travel, Cooking, News, Comedy, Science, Art, Fashion, Health, Business.

Title: ${title}
Description: ${description.substring(0, 300)}

Category:`

  const result = await queryGroq(prompt)

  if (result) {
    const category = result.trim()
    // Return the first word if multiple words returned
    return category.split(/[\s,]/)[0]
  }

  // Fallback
  return "Entertainment"
}

/**
 * Generate comprehensive video summary from all metadata
 */
export const generateComprehensiveSummary = async (
  title: string,
  description: string,
  tags: string[],
  category: string
): Promise<string> => {
  const prompt = `Create a comprehensive 2-3 sentence summary of this video based on all available information:

Title: ${title}
Description: ${description.substring(0, 400)}
Tags: ${tags.join(", ")}
Category: ${category}

Summary:`

  const result = await queryGroq(prompt, 2)

  if (!result) {
    // Fallback to description-based summary
    return generateVideoSummary(description)
  }

  return result
}

/**
 * Summarize video transcript (actual spoken content)
 */
export const summarizeTranscript = async (
  transcript: string
): Promise<string> => {
  if (!transcript || transcript.length < 50) {
    return "Transcript too short to summarize."
  }

  // For long transcripts, take first 2000 characters
  const truncatedTranscript = transcript.substring(0, 2000)

  const prompt = `Summarize what is discussed in this video transcript in 2-3 clear sentences:

Transcript: ${truncatedTranscript}

Summary:`

  const result = await queryGroq(prompt, 2)

  if (!result) {
    // Fallback: Return first few sentences of transcript
    const sentences = transcript.match(/[^.!?]+[.!?]+/g) || []
    return sentences.slice(0, 3).join(" ").trim() || transcript.substring(0, 300) + "..."
  }

  return result
}
