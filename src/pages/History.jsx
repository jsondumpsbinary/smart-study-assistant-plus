import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Trash2, FolderOpen, Download } from 'lucide-react';

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
                  onClick={() => handleDownloadPdf(item)}
                  className="p-2 border border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 rounded-lg transition-colors"
                  title="Download as PDF"
                  aria-label="Download as PDF"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 border border-error/20 text-error hover:bg-error/10 hover:border-error/40 rounded-lg transition-colors"
                  title="Delete notes"
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
