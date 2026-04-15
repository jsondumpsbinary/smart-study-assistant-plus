import { useState, useEffect } from 'react';
import { generateStudyPlan } from '../services/api';
import StudyForm from '../components/StudyForm';
import NoteDisplay from '../components/NoteDisplay';
import Flashcard from '../components/Flashcard';
import { AlertCircle, CheckCircle2, Star, ThumbsUp, ThumbsDown } from 'lucide-react';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Auto-load last active session on navigate back to dashboard
  useEffect(() => {
    const saved = sessionStorage.getItem('studyData');
    if (saved) {
       setResult(JSON.parse(saved));
       setRating(null);
       setFeedbackSubmitted(false);
    }
  }, []);

  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await generateStudyPlan(formData.topic, formData.days, formData.hoursPerDay);
      
      let finalNotes = data?.notes || data?.ai_output || '';
      let rawFlashcards = data?.flashcards || [];
      let rawQuizzes = data?.quizzes || [];
      
      // Structure mapper for Flashcards (Groq outputs 'q' and 'a', our component expects 'question' and 'answer')
      let mappedFlashcards = rawFlashcards.map(fc => ({
        question: fc.q || fc.question,
        answer: fc.a || fc.answer
      }));

      // If the backend returned a cohesive string in ai_output, let's extract the Flashcards!
      if (typeof finalNotes === 'string' && mappedFlashcards.length === 0) {
        const parts = finalNotes.split(/Q:/);
        if (parts.length > 1) {
          finalNotes = parts[0].trim();
          for (let i = 1; i < parts.length; i++) {
            const qa = parts[i].split(/A:/);
            if (qa.length >= 2) {
               mappedFlashcards.push({ 
                 question: qa[0].trim(), 
                 answer: qa.slice(1).join("A:").trim() 
               });
            }
          }
        }
      }

      // Format custom Groq objects back into strings for the generic display, or keep them for custom plan handling
      if (typeof finalNotes === 'object' && Array.isArray(finalNotes)) {
         finalNotes = finalNotes.map(section => `### ${section.heading}\n- ${section.bullets?.join('\n- ')}`).join('\n\n');
      }

      const hasValidData = finalNotes.length > 0;
      const resultData = hasValidData ? {
        notes: finalNotes,
        flashcards: mappedFlashcards,
        plan: data?.plan,
        quizzes: rawQuizzes
      } : {
        notes: `Here is your generated study plan for ${formData.topic}. It spans across ${formData.days} days, requiring ${formData.hoursPerDay} hours per day.\n\nEnjoy your learning journey!`,
        flashcards: [
           { question: "What is this topic mainly about?", answer: formData.topic },
           { question: "How many days will you study?", answer: `${formData.days} days` }
        ],
        quizzes: []
      };
      
      setResult(resultData);
      
      // Save current active session
      sessionStorage.setItem('studyData', JSON.stringify(resultData));

      // Append to persistent History
      const currentHistory = JSON.parse(localStorage.getItem('studyHistory') || '[]');
      currentHistory.unshift({
        id: Date.now(),
        topic: formData.topic,
        date: new Date().toLocaleDateString(),
        data: resultData
      });
      localStorage.setItem('studyHistory', JSON.stringify(currentHistory));
      
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
          
          {/* Custom Plan rendering if exists */}
          {result.plan && Array.isArray(result.plan) && (
            <div className="bg-surface border border-surface-hover rounded-2xl p-8 shadow-lg">
               <h2 className="text-2xl font-bold mb-6 text-primary">Daily Study Plan</h2>
               <div className="space-y-4">
                 {result.plan.map((p, i) => (
                   <div key={i} className="flex gap-4 p-4 border border-surface-hover rounded-xl bg-background">
                     <div className="font-bold whitespace-nowrap text-primary">{p.day}</div>
                     <div>
                       <div className="font-semibold text-text-main">{p.topic_focus}</div>
                       <div className="text-sm text-text-muted">{p.task}</div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

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

          {/* Feedback Section */}
          <div className="bg-surface border border-surface-hover rounded-2xl p-8 mt-12 mb-8 text-center shadow-lg">
            {!feedbackSubmitted ? (
              <>
                <h3 className="text-xl font-bold mb-4">How helpful were these generated materials?</h3>
                <div className="flex justify-center gap-6 mb-4">
                  <button onClick={() => setRating(1)} className={`p-3 rounded-full transition-all ${rating === 1 ? 'bg-error/20 text-error scale-110' : 'text-text-muted hover:bg-surface-hover hover:text-error'}`}>
                    <ThumbsDown size={28} />
                  </button>
                  {[1,2,3,4,5].map((star) => (
                    <button key={star} onClick={() => setRating(star + 1)} className="p-2 transition-all group">
                      <Star size={32} className={`${rating >= star + 1 ? 'fill-yellow-400 text-yellow-400' : 'text-surface-hover group-hover:text-yellow-400/50'}`} />
                    </button>
                  ))}
                  <button onClick={() => setRating(7)} className={`p-3 rounded-full transition-all ${rating === 7 ? 'bg-success/20 text-success scale-110' : 'text-text-muted hover:bg-surface-hover hover:text-success'}`}>
                    <ThumbsUp size={28} />
                  </button>
                </div>
                <button 
                  onClick={() => setFeedbackSubmitted(true)}
                  disabled={!rating}
                  className="bg-primary hover:bg-primary-hover disabled:bg-surface-hover disabled:text-text-muted text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Submit Feedback
                </button>
              </>
            ) : (
              <div className="text-success flex justify-center items-center gap-3">
                <CheckCircle2 size={24} />
                <span className="font-medium text-lg">Thank you for your feedback! It helps train our AI.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
