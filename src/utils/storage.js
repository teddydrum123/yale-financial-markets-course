const PROGRESS_KEY = 'yfm_progress'
const NOTES_KEY = 'yfm_notes'
const API_KEY_KEY = 'yfm_api_key'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage unavailable (private browsing, quota exceeded) — fail silently
  }
}

export function getProgress() {
  return read(PROGRESS_KEY, {})
}

export function getLectureProgress(lectureId) {
  return getProgress()[lectureId] || null
}

export function saveLectureProgress(lectureId, data) {
  const progress = getProgress()
  progress[lectureId] = { ...progress[lectureId], ...data }
  write(PROGRESS_KEY, progress)
  return progress[lectureId]
}

export function getAllNotes() {
  return read(NOTES_KEY, {})
}

export function getNote(lectureId) {
  return getAllNotes()[lectureId]?.text || ''
}

export function saveNote(lectureId, text) {
  const notes = getAllNotes()
  if (text.trim() === '') {
    delete notes[lectureId]
  } else {
    notes[lectureId] = { text, updatedAt: new Date().toISOString() }
  }
  write(NOTES_KEY, notes)
}

export function getApiKey() {
  try {
    return localStorage.getItem(API_KEY_KEY) || ''
  } catch {
    return ''
  }
}

export function setApiKey(key) {
  try {
    if (key) localStorage.setItem(API_KEY_KEY, key)
    else localStorage.removeItem(API_KEY_KEY)
  } catch {
    // ignore
  }
}
