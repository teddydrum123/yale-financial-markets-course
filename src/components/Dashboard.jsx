import { useMemo, useState, useEffect } from 'react'
import { lectures } from '../data/lectures.js'
import { getProgress } from '../utils/storage.js'
import LectureCard from './LectureCard.jsx'

export default function Dashboard({ onOpenLecture }) {
  const [progress, setProgress] = useState(getProgress())

  // Progress can change while this view is mounted (returning from a lecture),
  // so re-read localStorage each time the dashboard becomes visible.
  useEffect(() => {
    setProgress(getProgress())
  }, [])

  const stats = useMemo(() => {
    const completedIds = Object.keys(progress).filter((id) => progress[id]?.completed)
    const scores = completedIds
      .map((id) => progress[id]?.quizScore)
      .filter((s) => s && s.total > 0)
    const avgPct = scores.length
      ? Math.round(
          (scores.reduce((sum, s) => sum + s.correct / s.total, 0) / scores.length) * 100,
        )
      : null
    return { completedCount: completedIds.length, avgPct }
  }, [progress])

  return (
    <div className="dashboard">
      <section className="progress-summary">
        <div className="progress-stat">
          <span className="progress-stat-value">
            {stats.completedCount}/{lectures.length}
          </span>
          <span className="progress-stat-label">Lectures completed</span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${(stats.completedCount / lectures.length) * 100}%` }}
          />
        </div>
        {stats.avgPct !== null && (
          <div className="progress-stat">
            <span className="progress-stat-value">{stats.avgPct}%</span>
            <span className="progress-stat-label">Average quiz score</span>
          </div>
        )}
      </section>

      <div className="lecture-grid">
        {lectures.map((lecture) => (
          <LectureCard
            key={lecture.id}
            lecture={lecture}
            progress={progress[lecture.id]}
            onOpen={() => onOpenLecture(lecture.id)}
          />
        ))}
      </div>
    </div>
  )
}
