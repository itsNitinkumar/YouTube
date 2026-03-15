import { string } from "zod"
import { huggingFaceClient, HF_MODEL } from "../../config/huggingface"

/**
 * Centralized HuggingFace query function
 */
const queryHF = async (
  prompt: string,
  parameters: Record<string, any> = {}
) => {
  try {

    const response = await huggingFaceClient.post(
      `/${HF_MODEL}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          return_full_text: false,
          ...parameters
        }
      },
      {
        timeout: 10000
      }
    )

    const text = response.data?.[0]?.generated_text

    if (!text) return null

    return text.trim()

  } catch (error) {

    console.error("HuggingFace Error:", error)

    return null
  }
}


/**
 * AI Video Summary
 */
export const generateVideoSummary = async (
  description: string
) => {

  const prompt = `
Summarize the following video description in exactly 2 sentences.

Description:
${description}

Summary:
`

  return queryHF(prompt, {
    temperature: 0.3
  })
}


/**
 * AI Tag Generator
 */
export const generateVideoTags = async (
  title: string,
  description: string
) => {

  const prompt = `
Generate exactly 5 tags for the following video.

Title: ${title}
Description: ${description}

Return ONLY the tags separated by commas.

Example:
react, javascript, frontend, hooks, tutorial
`

  const result = await queryHF(prompt, {
    temperature: 0.2
  })

  return result
    ?.split(",")
    .map((tag: string) => tag.trim())
    .filter(Boolean)
    .slice(0, 5)
}


/**
 * AI Toxic Comment Detection
 */
export const detectToxicComment = async (
  comment: string
) => {

  const prompt = `
Determine if the following comment contains hate speech,
harassment, or toxic language.

Reply ONLY with:
true
or
false

Comment:
${comment}
`

  const result = await queryHF(prompt, {
    temperature: 0
  })

  return result
    ?.trim()
    .toLowerCase()
    .startsWith("true")
}


/**
 * AI Title Suggestions
 */
export const generateTitleSuggestions = async (
  description: string
) => {

  const prompt = `
Generate 5 catchy YouTube titles for the following video.

Description:
${description}

Return each title on a new line.
Do not include numbering.
`

  const result = await queryHF(prompt, {
    temperature: 0.7
  })

  return result
    ?.split("\n")
    .map((title: string) =>
      title
        .replace(/^\d+\.\s*/, "")
        .trim()
    )
    .filter(Boolean)
    .slice(0, 5)
}
