import { useMemo } from 'react'
import { lectures } from '../data/lectures.js'
import { getAllNotes } from '../utils/storage.js'

export default function NotesReview({ onOpenLecture }) {
  const notes = getAllNotes()

  const notedLectures = useMemo(() => {
    return lectures
      .filter((l) => notes[l.id]?.text?.trim())
      .map((l) => ({ ...l, note: notes[l.id] }))
      .sort((a, b) => new Date(b.note.updatedAt) - new Date(a.note.updatedAt))
  }, [notes])

  if (notedLectures.length === 0) {
    return (
      <div className="notes-review empty-state">
        <h2>All Notes</h2>
        <p>You haven't written any notes yet. Open a lecture to start taking notes.</p>
      </div>
    )
  }

  return (
    <div className="notes-review">
      <h2>All Notes ({notedLectures.length})</h2>
      <div className="notes-review-list">
        {notedLectures.map((lecture) => (
          <div key={lecture.id} className="notes-review-card">
            <div className="notes-review-card-header">
              <h3>
                Lecture {lecture.id}: {lecture.title}
              </h3>
              <span className="notes-updated">
                Updated {new Date(lecture.note.updatedAt).toLocaleString()}
              </span>
            </div>
            <p className="notes-review-text">{lecture.note.text}</p>
            <button className="btn btn-secondary" onClick={() => onOpenLecture(lecture.id)}>
              Edit Notes
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
