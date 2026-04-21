import { useState, useEffect } from 'react';
import { evaluateQuiz } from '../services/api';
import { Brain, CheckCircle2, AlertCircle } from 'lucide-react';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const { currentUser, currentUserEmail } = useAuth();
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
      if (parsed.flashcards && parsed.flashcards[0] && currentUser) {
         // rough extraction of topic from history/session if needed
         const historyKey = `studyHistory_${currentUser}`;
         setTopic(JSON.parse(localStorage.getItem(historyKey) || '[]')[0]?.topic || 'Current Topic');
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
       
       const evalData = await evaluateQuiz(topic, submission, currentUser, currentUserEmail);
       setEvaluation(evalData);
       
       // Save to progress history
       const progressKey = `quizProgress_${currentUser}`;
       const history = JSON.parse(localStorage.getItem(progressKey) || '[]');
       history.push({
           date: new Date().toLocaleDateString(),
           topic: topic,
           score: evalData.score || 0,
           weaknesses: evalData.weakTopics || []
       });
       localStorage.setItem(progressKey, JSON.stringify(history));
       
    } catch (err) {
       setError(err.message || "Evaluation servers are currently busy. Ensure your evaluate webhook is running.");
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
          {quizzes.map((q, i) => {
             const evalResult = evaluation?.results?.[i];
             
             // Determine if user got this right, either from AI eval or locally for MCQ
             let isUserRight = false;
             if (evalResult !== undefined) {
                 isUserRight = evalResult.isCorrect;
             } else if (q.type === 'mcq' && q.answer) {
                 const normAns = String(answers[i] || '').trim().toLowerCase();
                 const normQAns = String(q.answer).trim().toLowerCase();
                 isUserRight = (normAns === normQAns || normAns.startsWith(normQAns + ')') || normQAns.startsWith(normAns));
             }

             return (
             <div key={i} className={`bg-surface border ${evaluation ? (isUserRight ? 'border-success' : 'border-error') : 'border-surface-hover'} rounded-xl p-6 shadow-md transition-colors`}>
                <h3 className="text-lg font-bold mb-4">{i + 1}. {q.question}</h3>
                
                {q.type === 'mcq' && q.options ? (
                  <div className="space-y-3">
                    {q.options.map((opt, optIdx) => {
                      let optionStyle = 'border-surface-hover opacity-100';
                      let isUserAnswer = (answers[i] === opt);
                      
                      // More robust string matching to find the correct Option in the array
                      let isCorrectOpt = false;
                      if (q.answer) {
                         const normQAns = String(q.answer).trim().toLowerCase().replace(/^option\s+/, '');
                         const normOpt = String(opt).trim().toLowerCase();
                         if (normOpt === normQAns || normOpt.startsWith(normQAns + ')') || normOpt.startsWith(normQAns + '.') || normQAns.startsWith(normOpt)) {
                             isCorrectOpt = true;
                         } else if (normQAns.length === 1 && /[a-e]/.test(normQAns)) {
                             const expectedIdx = normQAns.charCodeAt(0) - 97; // 'a' is 0, 'b' is 1
                             if (optIdx === expectedIdx) {
                                 isCorrectOpt = true;
                             }
                         }
                      }

                      if (!evaluation) {
                        if (isUserAnswer) {
                          optionStyle = 'border-primary bg-primary/10';
                        } else {
                          optionStyle = 'border-surface-hover hover:bg-surface-hover';
                        }
                      } else {
                        // After submission!
                        if (isUserAnswer) {
                            optionStyle = isUserRight ? 'border-success bg-success/20 font-bold text-success' : 'border-error bg-error/20 font-bold text-error';
                        } else if (isCorrectOpt) {
                            optionStyle = 'border-success bg-success/20 font-medium text-success';
                        } else {
                            optionStyle = 'border-surface-hover opacity-50';
                        }
                      }

                      return (
                        <label key={optIdx} className={`flex items-center gap-3 p-3 border rounded-lg ${evaluation ? 'cursor-default' : 'cursor-pointer'} transition-all ${optionStyle}`}>
                          <input 
                            type="radio" 
                            name={`q-${i}`} 
                            value={opt} 
                            checked={isUserAnswer}
                            onChange={() => !evaluation && handleOptionChange(i, opt)}
                            disabled={!!evaluation}
                            className={`w-4 h-4 ${evaluation ? (isUserAnswer ? (isUserRight ? 'text-success' : 'text-error') : (isCorrectOpt ? 'text-success' : 'text-primary')) : 'text-primary'}`}
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea 
                      className={`w-full bg-background border ${evaluation ? (isUserRight ? 'border-success bg-success/5' : 'border-error bg-error/5') : 'border-surface-hover focus:border-primary'} rounded-xl p-4 text-text-main focus:outline-none transition-colors min-h-[100px]`}
                      placeholder="Type your answer here..."
                      value={answers[i] || ''}
                      onChange={(e) => !evaluation && handleOptionChange(i, e.target.value)}
                      disabled={!!evaluation}
                    />
                    {evaluation && !isUserRight && q.answer && (
                       <div className="bg-success/10 p-4 rounded-xl border border-success/30 text-success">
                         <p className="text-sm font-bold mb-1 flex items-center gap-2"><CheckCircle2 size={16}/> Expected Answer:</p>
                         <p className="text-sm opacity-90">{q.answer}</p>
                       </div>
                    )}
                  </div>
                )}

                {evaluation && (
                  <div className={`mt-6 p-4 rounded-xl flex items-start gap-4 flex-col sm:flex-row ${isUserRight ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    <div className="flex items-center gap-3">
                        {isUserRight ? <CheckCircle2 className="shrink-0" /> : <AlertCircle className="shrink-0" />}
                        <p className="font-bold text-lg">{isUserRight ? 'Correct!' : 'Incorrect'}</p>
                    </div>
                    {evalResult?.explanation && (
                        <p className="text-sm opacity-90 sm:mt-1">{evalResult.explanation}</p>
                    )}
                  </div>
                )}
             </div>
             );
          })}

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
