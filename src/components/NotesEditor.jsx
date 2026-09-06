import { useEffect, useRef, useState } from 'react'
import { getNote, saveNote } from '../utils/storage.js'

export default function NotesEditor({ lectureId }) {
  const [text, setText] = useState(() => getNote(lectureId))
  const [savedAt, setSavedAt] = useState(null)
  const debounceRef = useRef(null)

  // Reset the editor when the user switches lectures.
  useEffect(() => {
    setText(getNote(lectureId))
    setSavedAt(null)
  }, [lectureId])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveNote(lectureId, text)
      setSavedAt(new Date())
    }, 600)
    return () => clearTimeout(debounceRef.current)
  }, [text, lectureId])

  return (
    <div className="notes-editor">
      <div className="notes-editor-header">
        <h3>My Notes</h3>
        <span className="notes-saved-indicator">
          {savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : 'Autosaves as you type'}
        </span>
      </div>
      <textarea
        className="notes-textarea"
        placeholder="Write your notes for this lecture here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
    </div>
  )
}
