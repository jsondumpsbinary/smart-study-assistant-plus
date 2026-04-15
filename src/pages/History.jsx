import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Trash2, FolderOpen } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('studyHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const handleLoadSession = (historyItem) => {
    sessionStorage.setItem('studyData', JSON.stringify(historyItem.data));
    navigate('/');
  };

  const handleDelete = (id) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('studyHistory', JSON.stringify(newHistory));
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Clock className="text-primary" />
          Study History
        </h1>
        <p className="text-text-muted">Review your past generated study plans and notes.</p>
      </header>

      {history.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div key={item.id} className="bg-surface border border-surface-hover rounded-2xl p-6 shadow-lg flex flex-col group animate-in fade-in slide-in-from-bottom-4 duration-500 hover:border-primary/50 transition-colors">
              <div className="flex-1">
                <div className="text-sm font-medium text-primary mb-2">{item.date}</div>
                <h3 className="text-xl font-bold text-text-main leading-tight mb-4 line-clamp-2">
                  {item.topic}
                </h3>
              </div>
              
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-surface-hover">
                <button
                  onClick={() => handleLoadSession(item)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-2 rounded-lg font-medium transition-colors"
                >
                  <FolderOpen size={18} />
                  Load
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 border border-error/20 text-error hover:bg-error/10 hover:border-error/40 rounded-lg transition-colors"
                  aria-label="Delete history item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-surface-hover rounded-2xl p-12 text-center text-text-muted">
          Your history is empty. Go to the Dashboard to create your first study plan!
        </div>
      )}
    </div>
  );
};

export default History;
