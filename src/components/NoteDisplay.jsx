import { BookOpen } from 'lucide-react';

const NoteDisplay = ({ notes }) => {
  if (!notes) return null;

  return (
    <div className="bg-surface border border-surface-hover rounded-2xl p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6 border-b border-surface-hover pb-4">
        <BookOpen className="text-primary" />
        <h2 className="text-2xl font-bold">Study Notes</h2>
      </div>
      
      <div className="prose prose-invert max-w-none">
        {/* If notes is a markdown string, we could use react-markdown. 
            For now, we'll format text with linebreaks nicely. */}
        {typeof notes === 'string' ? (
          notes.split('\n').map((paragraph, index) => (
            <p key={index} className="text-text-main leading-relaxed mb-4 text-lg">
              {paragraph}
            </p>
          ))
        ) : (
          <pre className="whitespace-pre-wrap text-text-main font-sans">{JSON.stringify(notes, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default NoteDisplay;
