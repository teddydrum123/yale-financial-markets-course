export default function LectureCard({ lecture, progress, onOpen }) {
  const completed = Boolean(progress?.completed)
  const score = progress?.quizScore

  return (
    <div className={completed ? 'lecture-card completed' : 'lecture-card'}>
      <div className="lecture-card-top">
        <span className="lecture-number">Lecture {lecture.id}</span>
        {completed && <span className="badge badge-complete">✓ Completed</span>}
      </div>
      <h3 className="lecture-title">{lecture.title}</h3>
      <p className="lecture-topic">{lecture.topic}</p>

      {score && (
        <p className="lecture-score">
          Quiz score: {score.correct}/{score.total} (
          {Math.round((score.correct / score.total) * 100)}%)
        </p>
      )}

      <div className="lecture-card-actions">
        <a
          className="btn btn-secondary"
          href={lecture.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Watch Video ↗
        </a>
        <button className="btn btn-primary" onClick={onOpen}>
          {completed ? 'Review Lecture' : 'Open Lecture'}
        </button>
      </div>
    </div>
  )
}
