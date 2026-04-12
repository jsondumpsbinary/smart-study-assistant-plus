import { useEffect, useState } from 'react';
import Flashcard from '../components/Flashcard';
import { Layers } from 'lucide-react';

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    const data = sessionStorage.getItem('studyData');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.flashcards) setFlashcards(parsed.flashcards);
    }
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Layers className="text-primary" />
          Flashcards
        </h1>
        <p className="text-text-muted">Test your knowledge with flip cards.</p>
      </header>

      {flashcards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((fc, i) => (
            <Flashcard key={i} question={fc.question} answer={fc.answer} />
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-surface-hover rounded-2xl p-12 text-center text-text-muted">
          No flashcards generated yet. Go to the Dashboard to create a study plan!
        </div>
      )}
    </div>
  );
};

export default Flashcards;
