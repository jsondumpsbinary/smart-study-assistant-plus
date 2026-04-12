import { useState } from 'react';
import { generateStudyPlan } from '../services/api';
import StudyForm from '../components/StudyForm';
import NoteDisplay from '../components/NoteDisplay';
import Flashcard from '../components/Flashcard';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await generateStudyPlan(formData.topic, formData.days, formData.hoursPerDay);
      
      let finalNotes = data?.ai_output || data?.notes || '';
      let finalFlashcards = data?.flashcards || [];

      // If the backend returned a cohesive string in ai_output, let's extract the Flashcards!
      if (typeof finalNotes === 'string' && finalFlashcards.length === 0) {
        // Look for "Q:" and "A:" patterns in the text
        // By splitting on "Q:", the first part becomes the main notes, and subsequent parts are Q&A blocks.
        const parts = finalNotes.split(/Q:/);
        
        if (parts.length > 1) {
          finalNotes = parts[0].trim(); // Everything before the first "Q:" becomes the notes

          for (let i = 1; i < parts.length; i++) {
            const qa = parts[i].split(/A:/);
            if (qa.length >= 2) {
               finalFlashcards.push({ 
                 question: qa[0].trim(), 
                 // Re-join just in case the answer itself contains "A:"
                 answer: qa.slice(1).join("A:").trim() 
               });
            }
          }
        }
      }

      // If nothing generated correctly, fall back to default
      const hasValidData = finalNotes.length > 0;
      const resultData = hasValidData ? {
        notes: finalNotes,
        flashcards: finalFlashcards
      } : {
        notes: `Here is your generated study plan for ${formData.topic}. It spans across ${formData.days} days, requiring ${formData.hoursPerDay} hours per day.\n\nEnjoy your learning journey!`,
        flashcards: [
           { question: "What is this topic mainly about?", answer: formData.topic },
           { question: "How many days will you study?", answer: `${formData.days} days` }
        ]
      };
      
      setResult(resultData);
      // Save to sessionStorage for other tabs
      sessionStorage.setItem('studyData', JSON.stringify(resultData));
      
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while generating your plan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Welcome Back! ✨</h1>
        <p className="text-text-muted">What are we learning today?</p>
      </header>

      <section>
        <StudyForm onSubmit={handleGenerate} isLoading={isLoading} />
      </section>

      {/* States */}
      {error && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl flex items-center gap-3 animate-pulse">
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      )}

      {result && !isLoading && (
        <div className="bg-success/10 border border-success/20 text-success p-4 rounded-xl flex items-center gap-3">
          <CheckCircle2 size={24} />
          <p>Study plan generated successfully!</p>
        </div>
      )}

      {/* Outputs */}
      {result && (
        <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <NoteDisplay notes={result.notes} />
          
          {result.flashcards && result.flashcards.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                Brain Teasers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.flashcards.map((fc, i) => (
                  <Flashcard key={i} question={fc.question} answer={fc.answer} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
