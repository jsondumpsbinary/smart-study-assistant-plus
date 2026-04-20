import { useEffect, useState } from 'react';
import NoteDisplay from '../components/NoteDisplay';
import { BookOpen } from 'lucide-react';

const Notes = () => {
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('studyData');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.notes) setNotes(parsed.notes);
    }
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="text-primary" />
          Your Notes
        </h1>
        <p className="text-text-muted">Review your generated study materials.</p>
      </header>

      {notes ? (
        <NoteDisplay notes={notes} />
      ) : (
        <div className="bg-surface border border-surface-hover rounded-2xl p-12 text-center text-text-muted">
          No notes generated yet. Go to the Dashboard to create a study plan!
        </div>
      )}
    </div>
  );
};

export default Notes;
