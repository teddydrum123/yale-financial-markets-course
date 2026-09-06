import { useState } from 'react'

export default function QuizModal({ lecture, questions, source, onSubmit, onClose }) {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null))
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = answers.every((a) => a !== null)
  const correctCount = questions.reduce(
    (sum, q, i) => sum + (answers[i] === q.correctIndex ? 1 : 0),
    0,
  )

  function selectAnswer(qIndex, optionIndex) {
    if (submitted) return
    setAnswers((prev) => {
      const next = [...prev]
      next[qIndex] = optionIndex
      return next
    })
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  function handleFinish() {
    onSubmit({ correct: correctCount, total: questions.length })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal quiz-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Quiz: {lecture.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {source === 'fallback' && (
          <p className="quiz-source-note">
            Using the built-in question bank (no Claude API key configured, or the live request
            failed). Add a key in Settings to generate fresh AI questions.
          </p>
        )}

        <div className="quiz-questions">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="quiz-question">
              <p className="quiz-question-text">
                {qIndex + 1}. {q.question}
              </p>
              <div className="quiz-options">
                {q.options.map((option, oIndex) => {
                  const isSelected = answers[qIndex] === oIndex
                  const isCorrect = oIndex === q.correctIndex
                  let className = 'quiz-option'
                  if (isSelected) className += ' selected'
                  if (submitted && isCorrect) className += ' correct'
                  if (submitted && isSelected && !isCorrect) className += ' incorrect'

                  return (
                    <button
                      key={oIndex}
                      className={className}
                      onClick={() => selectAnswer(qIndex, oIndex)}
                      disabled={submitted}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
              {submitted && q.explanation && (
                <p className="quiz-explanation">{q.explanation}</p>
              )}
            </div>
          ))}
        </div>

        <div className="modal-footer">
          {!submitted ? (
            <button className="btn btn-primary" disabled={!allAnswered} onClick={handleSubmit}>
              {allAnswered ? 'Submit Quiz' : 'Answer all questions to submit'}
            </button>
          ) : (
            <>
              <span className="quiz-result">
                Score: {correctCount}/{questions.length} (
                {Math.round((correctCount / questions.length) * 100)}%)
              </span>
              <button className="btn btn-primary" onClick={handleFinish}>
                Save & Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
