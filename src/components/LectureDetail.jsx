import { useState } from 'react'
import { getApiKey, getLectureProgress, saveLectureProgress } from '../utils/storage.js'
import { generateQuizQuestions } from '../utils/claudeApi.js'
import StudyGuide from './StudyGuide.jsx'
import NotesEditor from './NotesEditor.jsx'
import QuizModal from './QuizModal.jsx'

export default function LectureDetail({ lecture, onBack }) {
  const [progress, setProgress] = useState(getLectureProgress(lecture.id))
  const [quiz, setQuiz] = useState(null) // { questions, source }
  const [loadingQuiz, setLoadingQuiz] = useState(false)
  const [error, setError] = useState('')

  async function handleStartQuiz() {
    setError('')
    setLoadingQuiz(true)
    try {
      const result = await generateQuizQuestions({
        lectureId: lecture.id,
        title: lecture.title,
        topic: lecture.topic,
        apiKey: getApiKey(),
      })
      setQuiz(result)
    } catch (err) {
      setError(err.message || 'Failed to generate quiz.')
    } finally {
      setLoadingQuiz(false)
    }
  }

  function handleQuizSubmit(score) {
    const updated = saveLectureProgress(lecture.id, {
      completed: true,
      quizScore: { ...score, date: new Date().toISOString() },
    })
    setProgress(updated)
    setQuiz(null)
  }

  return (
    <div className="lecture-detail">
      <button className="btn btn-link" onClick={onBack}>
        ← Back to Dashboard
      </button>

      <h2 className="lecture-detail-title">
        Lecture {lecture.id}: {lecture.title}
      </h2>
      <p className="lecture-detail-topic">{lecture.topic}</p>

      <a
        className="btn btn-secondary"
        href={lecture.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Watch on Open Yale Courses ↗
      </a>

      <StudyGuide lectureId={lecture.id} />

      <section className="quiz-section">
        <h3>Quiz</h3>
        {progress?.completed && (
          <p className="lecture-score">
            Last score: {progress.quizScore.correct}/{progress.quizScore.total} (
            {Math.round((progress.quizScore.correct / progress.quizScore.total) * 100)}%)
          </p>
        )}
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary" onClick={handleStartQuiz} disabled={loadingQuiz}>
          {loadingQuiz
            ? 'Generating quiz...'
            : progress?.completed
              ? 'Retake Quiz'
              : 'Complete Lecture & Take Quiz'}
        </button>
      </section>

      <NotesEditor lectureId={lecture.id} />

      {quiz && (
        <QuizModal
          lecture={lecture}
          questions={quiz.questions}
          source={quiz.source}
          onSubmit={handleQuizSubmit}
          onClose={() => setQuiz(null)}
        />
      )}
    </div>
  )
}
