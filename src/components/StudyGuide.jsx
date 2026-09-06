import { studyGuides } from '../data/studyGuides.js'

export default function StudyGuide({ lectureId }) {
  const points = studyGuides[lectureId] || []
  if (points.length === 0) return null

  return (
    <div className="study-guide">
      <h3>Study Guide — Key Concepts</h3>
      <ul>
        {points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    </div>
  )
}
