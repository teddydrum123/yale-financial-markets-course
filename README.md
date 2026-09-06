# Financial Markets — Yale ECON 252 Study Platform

A self-contained React app for working through Yale's Open Course "Financial
Markets" (ECON 252, Robert Shiller): all 23 lectures, dynamic AI-generated
quizzes (with a full offline fallback question bank), a note-taker, a study
guide per lecture, and progress tracking — all stored locally in your browser
via `localStorage`. No backend required.

## Features

- **Dashboard** — all 23 lectures with direct links to the videos on [Open
  Yale Courses](https://oyc.yale.edu/economics/econ-252-11), plus completion
  status and quiz scores.
- **Quizzes** — click "Complete Lecture & Take Quiz" to generate a 5-7
  question multiple-choice quiz for that lecture, with instant grading and
  explanations. If you add a Claude API key in Settings, questions are
  generated live by Claude; otherwise the app uses a built-in question bank
  so it always works.
- **Notes** — a note box under every lecture that autosaves to
  `localStorage` as you type, and persists across browser sessions.
- **Study guides** — key concepts per lecture.
- **All Notes view** — review every note you've written, across every
  lecture, in one place.
- **Progress tracker** — completed lecture count and average quiz score.

## Local development

Requires [Node.js](https://nodejs.org/) 18+ (which includes `npm`).

```bash
npm install
npm run dev
```

This starts a local dev server (Vite will print the URL, typically
`http://localhost:5173`).

## Using live AI-generated quizzes (optional)

By default, quizzes come from a built-in question bank — no setup required.

To generate fresh quiz questions with Claude instead:

1. Get an API key from the [Anthropic Console](https://console.anthropic.com/).
2. In the app, click **Settings** and paste your key in.

The app calls the Claude API directly from your browser (using Anthropic's
`anthropic-dangerous-direct-browser-access` header, intended for prototypes
like this). Your key is stored only in your browser's `localStorage` and is
never sent anywhere except Anthropic's API — but note that anyone with access
to your browser or its dev tools could read it. Don't use this on a shared or
public computer, and use a key with a spending limit you're comfortable with.

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow
(`.github/workflows/deploy.yml`) that builds the app and publishes it to
GitHub Pages automatically on every push to `main`.

**One-time setup, after pushing this repo to GitHub:**

1. On GitHub, go to your repo's **Settings → Pages**.
2. Under "Build and deployment", set **Source** to **GitHub Actions**.
3. Push to `main` (or re-run the workflow from the **Actions** tab).
4. Your site will be live at:
   `https://<your-github-username>.github.io/yale-financial-markets-course/`

If you rename the repo, update the `base` path in `vite.config.js` to match
(`/your-new-repo-name/`), or the built assets won't load correctly.

## Tech stack

- React 18 (function components + hooks, no state library)
- Vite (build tool / dev server)
- Plain CSS (no UI framework)
- `localStorage` for all persistence (progress, quiz scores, notes, API key)
- Fetch API for calling the Claude API directly from the browser

## Project structure

```
src/
  data/
    lectures.js        23 lectures: titles, topics, video URLs
    studyGuides.js      key concepts per lecture
    questionBank.js      fallback quiz questions per lecture
  utils/
    storage.js          localStorage helpers (progress, notes, API key)
    claudeApi.js         Claude API call + fallback logic
  components/
    Header.jsx, Dashboard.jsx, LectureCard.jsx, LectureDetail.jsx,
    StudyGuide.jsx, NotesEditor.jsx, NotesReview.jsx,
    QuizModal.jsx, SettingsModal.jsx
  App.jsx, main.jsx, App.css, index.css
```
