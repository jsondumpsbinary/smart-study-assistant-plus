# ✨ Smart Study Assistant+

An intelligent, modern study companion that automatically generates a 5-day study plan, in-depth text notes, and interactive flippable flashcards for any given topic using the Gemini AI through an n8n webhook backend.

## 🚀 Features

- **Dark Theme UI**: Premium aesthetic with deep gray/black backgrounds and vibrant purple accents using Tailwind CSS v4.
- **Dynamic AI Generation**: Integrates with a backend n8n webhook pointing to `gemini-2.5-flash` to pull detailed academic context dynamically based on your inputs.
- **Smart Formatting**: Client-side parsing automatically separates cohesive generated text into Study Notes and an array of individual Flashcards.
- **Interactive Flashcards**: Fluid 3D flip card animations using `framer-motion` to test your knowledge seamlessly.
- **State Management**: Beautiful multi-page routing handled with `react-router-dom` saving session data persistently.

## 🛠 Tech Stack

- **Frontend Core**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + `clsx` & `tailwind-merge`
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Fetching**: Native Fetch API (formerly Axios)

## 📋 Prerequisites

To run this application, ensure you have the following installed on your machine:
- Node.js (v18 or newer recommended)
- npm or yarn

You will also need an **n8n Workflow** listening at `http://localhost:5678/webhook-test/generate-notes` connected to the Gemini AI API, returning a JSON response specifically formatted with `{"ai_output": "the generated text"}`.

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jsondumpsbinary/smart-study-assistant-plus.git
   cd FOAI-project
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Spin up the development server:**
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173/` in your browser to view the application!

## 📁 Project Structure

```text
├── src/
│   ├── components/       # Reusable UI Elements (StudyForm, Flashcard, NotesDisplay)
│   ├── pages/            # Application Routes (Dashboard, Notes, Flashcards)
│   ├── services/         # API handling scripts
│   ├── App.jsx           # Main Application layout and routing wrapper
│   └── index.css         # Tailwind initialization & Theme variables
├── ...config files
```
