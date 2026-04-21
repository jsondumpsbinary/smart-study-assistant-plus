import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Progress = () => {
  const [quizHistory, setQuizHistory] = useState([]);
  const { currentUser } = useAuth();
  const [weakTopics, setWeakTopics] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const progressKey = `quizProgress_${currentUser}`;
      const rawHistory = JSON.parse(localStorage.getItem(progressKey) || '[]');
      setQuizHistory(rawHistory);

    // Aggregate weak topics
    const weaknesses = {};
    rawHistory.forEach(session => {
      session.weaknesses?.forEach(topic => {
        weaknesses[topic] = (weaknesses[topic] || 0) + 1;
      });
    });

    const sortedWeaknesses = Object.entries(weaknesses)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5
      
    setWeakTopics(sortedWeaknesses);
    }
  }, [currentUser]);

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <TrendingUp className="text-primary" />
          Progress & Strategy
        </h1>
        <p className="text-text-muted">Track your quiz performance evolution and spot weak conceptual links.</p>
      </header>

      {quizHistory.length > 0 ? (
        <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-8">
          
          <div className="bg-surface border border-surface-hover rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-2">
              <Target size={24} /> Performance Timeline
            </h2>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={quizHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={[0, 100]} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#2d2d2d', borderRadius: '8px' }}
                    itemStyle={{ color: '#c4b5fd' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {weakTopics.length > 0 && (
            <div className="bg-error/5 border border-error/20 rounded-2xl p-8 mt-8 shadow-lg">
              <h2 className="text-2xl font-bold text-error mb-6 flex items-center gap-2">
                <AlertTriangle size={24} /> Critical Focus Areas
              </h2>
              <div className="space-y-4">
                {weakTopics.map((wt, i) => (
                  <div key={i} className="flex justify-between items-center bg-background border border-surface-hover p-4 rounded-xl">
                    <span className="font-bold text-lg">{wt.topic}</span>
                    <span className="text-error font-medium text-sm">Failed {wt.count} times</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-surface border border-surface-hover rounded-2xl p-12 text-center text-text-muted">
          Your progress dashboard is empty. Take a quiz to map your performance!
        </div>
      )}
    </div>
  );
};

export default Progress;
