# ✨ Smart Study Assistant+

An intelligent, modern study companion that automatically generates custom study plans, in-depth text notes, interactive flashcards, and quizzes for any given topic under minutes. It utilizes an n8n webhook backend with LangChain integration (powered by Groq AI models) to dynamically curate your learning materials and adapt to your feedback over time.

## 🚀 Features

- **Dark Theme UI**: Premium aesthetic with deep gray/black backgrounds and vibrant purple accents using Tailwind CSS v4.
- **Dynamic AI Generation**: Integrates with a backend n8n webhook (Groq models via LangChain) to pull detailed academic context dynamically based on your inputs.
- **Adaptive AI Feedback Loop**: Rate the generated study materials! Your feedback is securely logged to a Notion database and read during your next generation request to continually improve and personalize the AI's output.
- **Interactive Flashcards & Quizzes**: Fluid 3D flip card animations to test your knowledge seamlessly, plus a dedicated quiz section complete with AI-graded short-answer and multiple-choice questions.
- **State Management & History**: Beautiful multi-page routing handled with `react-router-dom`, saving session data persistently in local storage so you can easily review past study sessions.
- **PDF Export**: Instantly download your generated study plan as a nicely formatted PDF.

## 🛠 Tech Stack

- **Frontend Core**: React 19 + Vite
- **Styling**: Tailwind CSS v4 
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend Flow**: n8n workflows (Webhooks, Notion API, Gmail API, LangChain nodes)
- **AI Models**: Groq (e.g., LLaMA 3 70B / 120B)

## 📋 Prerequisites

To run this application, ensure you have the following installed on your machine:
- Node.js (v18 or newer recommended)
- npm or yarn

## ⚙️ Backend Architecture (n8n)

The application relies on a powerful, unified n8n workflow that handles all AI logic, database management, and email notifications. The single backend canvas manages 5 core sub-workflows:

1. **Study Material Generation (`/generate-notes`)**
   - Receives the topic and study preferences.
   - Fetches past user feedback from Notion to personalize the AI context.
   - Triggers 4 parallel Groq LangChain models (LLaMA) to generate Notes, Flashcards, a Study Plan, and a Quiz.
   - Merges the data and saves it to a Notion database.

2. **Quiz Evaluation (`/evaluate-quiz`)**
   - Receives the user's quiz answers.
   - Evaluates them against the Groq model, returning a score, weak topics, and explanations.
   - Logs the score and attempt history securely in Notion.

3. **User History (`/get-user-notes`)**
   - Queries the Notion databases to return a user's past generated topics and saved flashcards to populate their dashboard.

4. **Feedback Loop (`/submit-feedback`)**
   - Collects 1-7 star ratings from the UI.
   - Stores the rating along with the topic in Notion, which the Generation workflow uses to improve future outputs.

5. **Daily Reminder Emails (Cron Job)**
   - Runs daily at 19:00 via a Schedule Trigger.
   - Scans Notion for recent quiz scores and weak topics.
   - Automatically builds and dispatches personalized revision emails to the user via Gmail to encourage spaced repetition.

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jsondumpsbinary/smart-study-assistant-plus.git
   cd smart-study-assistant-plus
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Spin up the development server:**
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173/` in your browser to view the application! Note that the Vite config proxies `/api` requests to `http://localhost:5678` (your local n8n instance).

## 📁 Project Structure

```text
├── src/
│   ├── components/       # Reusable UI Elements (StudyForm, Flashcard, NotesDisplay, QuizCard)
│   ├── context/          # React Context (AuthContext)
│   ├── pages/            # Application Routes (Dashboard, History, Login, Signup)
│   ├── services/         # API handling scripts (api.js)
│   ├── App.jsx           # Main Application layout and routing wrapper
│   └── index.css         # Tailwind initialization & Theme variables
├── vite.config.js        # Vite configuration (includes API proxy to n8n)
├── ...config files
```
