import { useState, useEffect } from 'react';
import { evaluateQuiz } from '../services/api';
import { Brain, CheckCircle2, AlertCircle } from 'lucide-react';
import Spinner from '../components/Spinner';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [topic, setTopic] = useState('');
  const [answers, setAnswers] = useState({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('studyData');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.quizzes) setQuizzes(parsed.quizzes);
      if (parsed.flashcards && parsed.flashcards[0]) {
         // rough extraction of topic from history/session if needed
         setTopic(JSON.parse(localStorage.getItem('studyHistory') || '[]')[0]?.topic || 'Current Topic');
      }
    }
  }, []);

  const handleOptionChange = (qIndex, value) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const handleEvaluate = async () => {
    if (Object.keys(answers).length < quizzes.length) {
      setError("Please answer all questions before submitting!");
      return;
    }
    
    setIsEvaluating(true);
    setError(null);
    try {
       // Format answers for the AI evaluator
       const submission = quizzes.map((q, i) => ({
           question: q.question,
           userAnswer: answers[i]
       }));
       
       const evalData = await evaluateQuiz(topic, submission);
       setEvaluation(evalData);
       
       // Save to progress history
       const history = JSON.parse(localStorage.getItem('quizProgress') || '[]');
       history.push({
           date: new Date().toLocaleDateString(),
           topic: topic,
           score: evalData.score || 0,
           weaknesses: evalData.weakTopics || []
       });
       localStorage.setItem('quizProgress', JSON.stringify(history));
       
    } catch (err) {
       setError("Evaluation servers are currently busy. Ensure your evaluate webhook is running.");
    } finally {
       setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Brain className="text-primary" />
          Interactive Quiz
        </h1>
        <p className="text-text-muted">Test your active recall. AI will grade your short answers!</p>
      </header>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      )}

      {quizzes.length > 0 ? (
        <div className="space-y-8">
          {quizzes.map((q, i) => (
             <div key={i} className="bg-surface border border-surface-hover rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold mb-4">{i + 1}. {q.question}</h3>
                
                {q.type === 'mcq' && q.options ? (
                  <div className="space-y-3">
                    {q.options.map((opt, optIdx) => (
                      <label key={optIdx} className="flex items-center gap-3 p-3 border border-surface-hover rounded-lg cursor-pointer hover:bg-surface-hover transition-colors">
                        <input 
                          type="radio" 
                          name={`q-${i}`} 
                          value={opt} 
                          checked={answers[i] === opt}
                          onChange={() => handleOptionChange(i, opt)}
                          className="w-4 h-4 text-primary"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea 
                    className="w-full bg-background border border-surface-hover rounded-xl p-4 text-text-main focus:outline-none focus:border-primary transition-colors min-h-[100px]"
                    placeholder="Type your answer here..."
                    value={answers[i] || ''}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                  />
                )}
             </div>
          ))}

          {!evaluation && (
             <button 
                onClick={handleEvaluate} 
                disabled={isEvaluating}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2"
             >
                {isEvaluating ? <Spinner /> : "Submit for Evaluation"}
             </button>
          )}

          {evaluation && (
            <div className="bg-success/10 border border-success/30 rounded-2xl p-8 mt-12 animate-in fade-in slide-in-from-bottom-8">
               <div className="flex items-center gap-4 mb-6">
                 <CheckCircle2 size={40} className="text-success" />
                 <div>
                   <h2 className="text-2xl font-bold text-success">Quiz Scored!</h2>
                   <p className="text-lg font-medium">Final Score: {evaluation.score}%</p>
                 </div>
               </div>
               
               <div className="space-y-4">
                 <h3 className="text-xl font-bold text-text-main mt-4">AI Suggestions</h3>
                 <p className="text-text-muted leading-relaxed">{evaluation.suggestions}</p>
                 
                 <h3 className="text-xl font-bold text-text-main mt-6">Focus Areas</h3>
                 <div className="flex gap-2 flex-wrap">
                   {evaluation.weakTopics?.map((wt, idx) => (
                     <span key={idx} className="bg-error/20 text-error px-3 py-1 rounded-full text-sm font-bold">
                       {wt}
                     </span>
                   ))}
                 </div>
               </div>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-surface border border-surface-hover rounded-2xl p-12 text-center text-text-muted">
          No quizzes generated yet. Head back to the Dashboard to generate a new study plan with quizzes!
        </div>
      )}
    </div>
  );
};

export default Quiz;
