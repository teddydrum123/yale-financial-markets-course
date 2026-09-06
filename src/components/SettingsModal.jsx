import { useState } from 'react'
import { getApiKey, setApiKey } from '../utils/storage.js'

export default function SettingsModal({ onClose }) {
  const [key, setKey] = useState(getApiKey())
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setApiKey(key.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function handleClear() {
    setKey('')
    setApiKey('')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <p>
          Enter your Anthropic (Claude) API key to generate fresh, AI-written quiz questions per
          lecture. Without a key, quizzes use the built-in question bank instead — the app fully
          works either way.
        </p>

        <div className="settings-warning">
          <strong>Heads up:</strong> this key is stored only in your browser's localStorage and is
          sent directly from your browser to Anthropic's API. Don't use this on a shared or public
          computer, and use a key with a spending limit you're comfortable with.
        </div>

        <label className="settings-label" htmlFor="api-key-input">
          Claude API Key
        </label>
        <input
          id="api-key-input"
          className="settings-input"
          type="password"
          placeholder="sk-ant-..."
          value={key}
          onChange={(e) => setKey(e.target.value)}
          autoComplete="off"
        />

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClear}>
            Clear Key
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? 'Saved ✓' : 'Save Key'}
          </button>
        </div>
      </div>
    </div>
  )
}
