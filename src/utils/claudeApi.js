import { questionBank } from '../data/questionBank.js'

// Update this if Anthropic releases a newer model you'd prefer to use.
const CLAUDE_MODEL = 'claude-sonnet-4-5-20250929'

function buildPrompt(title, topic) {
  return `You are creating a short quiz for a student studying Yale's "Financial Markets" (ECON 252) course.

Lecture title: "${title}"
Lecture topic: ${topic}

Write 6 multiple-choice questions testing understanding of the concepts in this lecture.
Respond with ONLY valid JSON (no markdown fences, no commentary) in exactly this shape:
[
  {"question": "...", "options": ["...", "...", "...", "..."], "correctIndex": 0, "explanation": "..."}
]
Each question must have exactly 4 options, and correctIndex must be an integer 0-3 pointing to the correct option.`
}

async function callClaude(title, topic, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      // Required for direct browser calls. Anthropic warns this exposes your
      // API key to anyone who can read the page's network traffic — only use
      // a personal key with a spending limit you're comfortable with.
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      messages: [{ role: 'user', content: buildPrompt(title, topic) }],
    }),
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    throw new Error(`Claude API error ${res.status}: ${errBody.slice(0, 200)}`)
  }

  const data = await res.json()
  const text = data?.content?.[0]?.text || ''
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Could not parse quiz JSON from Claude response')

  const questions = JSON.parse(jsonMatch[0])
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('Claude returned no questions')
  }
  return questions
}

/**
 * Generates quiz questions for a lecture. Tries the live Claude API first
 * (if an API key is configured); falls back to the static question bank
 * on any failure so the app always works, even offline or with no key.
 */
export async function generateQuizQuestions({ lectureId, title, topic, apiKey }) {
  if (apiKey) {
    try {
      return { questions: await callClaude(title, topic, apiKey), source: 'claude' }
    } catch (err) {
      console.warn('Falling back to static question bank:', err.message)
    }
  }

  const fallback = questionBank[lectureId]
  if (!fallback) throw new Error(`No fallback questions available for lecture ${lectureId}`)
  return { questions: fallback, source: 'fallback' }
}
