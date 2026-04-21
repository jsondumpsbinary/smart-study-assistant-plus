import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FolderOpen, Download, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserNotes } from '../services/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const getHiddenNotesKey = (username) => `hiddenStudyHistory_${username}`;

  useEffect(() => {
    if (!currentUser) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    const normalizeNotes = (notes) => {
      if (Array.isArray(notes)) {
        return notes.map(section => `### ${section.heading}\n- ${section.bullets?.join('\n- ')}`).join('\n\n');
      }

      return typeof notes === 'string' ? notes : '';
    };

    const normalizeFlashcards = (flashcards) => {
      if (!Array.isArray(flashcards)) return [];

      return flashcards.map((fc) => ({
        question: fc.q || fc.question || 'Untitled question',
        answer: fc.a || fc.answer || ''
      }));
    };

    const normalizeRemoteItems = (items = []) => (
      items.map((item) => ({
        id: item.id,
        topic: item.topic,
        date: item.createdTime
          ? new Date(item.createdTime).toLocaleDateString()
          : 'Unknown date',
        source: 'remote',
        data: {
          notes: normalizeNotes(item.notes),
          flashcards: normalizeFlashcards(item.flashcards),
          plan: item.plan || [],
          quizzes: item.quizzes || []
        }
      }))
    );

    const normalizeLocalItems = (items = []) => (
      items.map((item) => ({
        ...item,
        source: item.source || 'local'
      }))
    );

    const filterHiddenItems = (items = []) => {
      const hiddenIds = new Set(JSON.parse(localStorage.getItem(getHiddenNotesKey(currentUser)) || '[]'));
      return items.filter((item) => !hiddenIds.has(item.id));
    };

    const loadHistory = async () => {
      setIsLoading(true);
      setLoadError('');

      const historyKey = `studyHistory_${currentUser}`;
      const savedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');

      try {
        const remoteData = await getUserNotes(currentUser);
        const remoteHistory = normalizeRemoteItems(remoteData.items || []);
        const localHistory = normalizeLocalItems(savedHistory);
        const seenIds = new Set(remoteHistory.map((item) => item.id));
        const mergedHistory = [
          ...remoteHistory,
          ...localHistory.filter((item) => !seenIds.has(item.id))
        ];

        setHistory(filterHiddenItems(mergedHistory));
      } catch (error) {
        setHistory(filterHiddenItems(normalizeLocalItems(savedHistory)));
        setLoadError('Showing local history only because the Notion sync endpoint could not be reached.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [currentUser]);

  const handleLoadSession = (historyItem) => {
    sessionStorage.setItem('studyData', JSON.stringify(historyItem.data));
    navigate('/');
  };

  const removeLocalMatches = (historyItem) => {
    if (!currentUser) return;

    const historyKey = `studyHistory_${currentUser}`;
    const savedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const nextHistory = savedHistory.filter((item) => (
      !(item.topic === historyItem.topic && item.date === historyItem.date)
    ));

    localStorage.setItem(historyKey, JSON.stringify(nextHistory));
  };

  const persistHiddenItem = (historyItem) => {
    if (!currentUser) return;

    const hiddenKey = getHiddenNotesKey(currentUser);
    const hiddenIds = new Set(JSON.parse(localStorage.getItem(hiddenKey) || '[]'));
    hiddenIds.add(historyItem.id);
    localStorage.setItem(hiddenKey, JSON.stringify(Array.from(hiddenIds)));
  };

  const handleDelete = (historyItem) => {
    if (!currentUser) return;

    const confirmed = window.confirm(`Delete "${historyItem.topic}" from your history?`);
    if (!confirmed) return;

    persistHiddenItem(historyItem);
    removeLocalMatches(historyItem);

    setHistory((prevHistory) => prevHistory.filter((item) => {
      if (item.id === historyItem.id) return false;
      return !(item.topic === historyItem.topic && item.date === historyItem.date);
    }));
  };

  const handleDownloadPdf = (item) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to download the PDF");
      return;
    }
    
    let htmlContent = `<!DOCTYPE html><html><head><title>${item.topic} - Study Materials</title>`;
    htmlContent += `<style>body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 2rem; } h1 { border-bottom: 2px solid #eaeaea; padding-bottom: 0.5rem; } .plan-item { margin-bottom: 1rem; padding: 1rem; background: #f9f9f9; border-radius: 8px; border: 1px solid #eaeaea; } .plan-item strong { color: #0066cc; font-size: 1.1rem; display: block; margin-bottom: 0.25rem; } .flashcard { margin-bottom: 1rem; page-break-inside: avoid; border: 1px solid #ddd; padding: 1rem; border-radius: 8px; } .q { font-weight: bold; margin-bottom: 0.5rem; } .notes { white-space: pre-wrap; background: #fdfdfd; padding: 1.5rem; border-radius: 8px; border: 1px solid #eaeaea; } h2 { color: #2a2a2a; margin-top: 2rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; } @media print { body { padding: 0; max-width: 100%; } @page { margin: 1cm; } }</style>`;
    htmlContent += `</head><body>`;
    htmlContent += `<h1>${item.topic} - Study Materials</h1>`;
    htmlContent += `<p><strong>Generated on:</strong> ${item.date}</p>`;

    if (item.data.plan && item.data.plan.length > 0) {
      htmlContent += `<h2>Daily Study Plan</h2>`;
      item.data.plan.forEach(p => {
        htmlContent += `<div class="plan-item"><strong>${p.day}</strong><div><b>${p.topic_focus}</b></div><div>${p.task}</div></div>`;
      });
    }

    if (item.data.notes && item.data.notes.trim() !== '') {
      htmlContent += `<h2>Study Notes</h2>`;
      htmlContent += `<div class="notes">${item.data.notes.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
    }

    if (item.data.flashcards && item.data.flashcards.length > 0) {
      htmlContent += `<h2>Flashcards</h2>`;
      item.data.flashcards.forEach((fc, i) => {
        htmlContent += `<div class="flashcard"><div class="q">Q${i+1}: ${fc.question.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div><div class="a">A: ${fc.answer.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div></div>`;
      });
    }

    htmlContent += `<script>window.onload = function() { setTimeout(function() { window.print(); }, 500); };</script>`;
    htmlContent += `</body></html>`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
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

      {loadError && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={24} />
          <p>{loadError}</p>
        </div>
      )}

      {isLoading ? (
        <div className="bg-surface border border-surface-hover rounded-2xl p-12 text-center text-text-muted">
          Loading your study history...
        </div>
      ) : history.length > 0 ? (
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
                  onClick={() => handleDownloadPdf(item)}
                  className="p-2 border border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 rounded-lg transition-colors"
                  title="Download as PDF"
                  aria-label="Download as PDF"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 border border-error/20 text-error hover:bg-error/10 hover:border-error/40 rounded-lg transition-colors"
                  title="Delete note"
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
