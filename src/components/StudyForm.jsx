import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Spinner from './Spinner';

const StudyForm = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [days, setDays] = useState(7);
  const [hours, setHours] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() || days < 1 || hours < 1) return;
    onSubmit({ topic, days, hoursPerDay: hours });
  };

  return (
    <div className="bg-surface border border-surface-hover rounded-2xl p-8 shadow-xl relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="text-primary" size={24} />
          Plan Your Study
        </h2>
        <p className="text-text-muted">Generate artificial intelligence based study materials instantly.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-2 text-text-muted">
            What do you want to learn?
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Quantum Physics, React Hooks, World War II"
            className="w-full bg-background border border-surface-hover rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-surface-hover"
            disabled={isLoading}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="days" className="block text-sm font-medium mb-2 text-text-muted">
              Number of Days
            </label>
            <input
              id="days"
              type="number"
              min="1"
              max="365"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full bg-background border border-surface-hover rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="hours" className="block text-sm font-medium mb-2 text-text-muted">
              Hours per Day
            </label>
            <input
              id="hours"
              type="number"
              min="1"
              max="24"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full bg-background border border-surface-hover rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full bg-primary hover:bg-primary-hover disabled:bg-surface-hover disabled:text-text-muted text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-primary/20 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <Spinner size={20} className="text-white" />
              Generating...
            </>
          ) : (
            'Generate Study Plan'
          )}
        </button>
      </form>
    </div>
  );
};

export default StudyForm;
