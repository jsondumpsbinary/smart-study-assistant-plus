import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BookOpen,
  CalendarDays,
  Clock,
  Sparkles,
  X,
  Loader2,
  GraduationCap,
} from 'lucide-react';

const GENERATE_URL = 'http://localhost:5000/api/generate';

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [studyHours, setStudyHours] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!modalOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [modalOpen]);

  const closeModal = () => {
    setModalOpen(false);
    setFeedback(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        subject: subject.trim(),
        examDate,
        studyHours: studyHours === '' ? null : Number(studyHours),
      };

      const { data } = await axios.post(GENERATE_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      setFeedback({ type: 'success', text: 'Session request sent successfully.' });
      setSubject('');
      setExamDate('');
      setStudyHours('');
      if (data != null) {
        console.log('Generate response:', data);
      }
    } catch (err) {
      const text =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Something went wrong. Is the server running on port 5000?';
      setFeedback({ type: 'error', text: String(text) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-svh w-full text-left bg-gradient-to-b from-slate-50 via-white to-violet-50/40 px-4 py-10 sm:px-8 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/30">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/25 ring-4 ring-violet-100 dark:bg-violet-500 dark:ring-violet-900/50">
              <GraduationCap className="h-7 w-7" aria-hidden />
            </span>
            <div>
              <p className="mb-1 flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400">
                <Sparkles className="h-4 w-4" aria-hidden />
                Smart Study Assistant
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
                Hello, Student!
              </h1>
              <p className="mt-2 max-w-lg text-slate-600 dark:text-slate-400">
                Start a focused study session tailored to your subject and timeline.
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/60">
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                Ready when you are
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Configure subject, exam date, and weekly hours in one place.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setModalOpen(true);
                setFeedback(null);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-500/30 transition hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              Start New Session
            </button>
          </div>
        </section>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition dark:bg-black/60"
            onClick={closeModal}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="session-modal-title"
            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="session-modal-title"
                  className="text-xl font-semibold text-slate-900 dark:text-slate-50"
                >
                  New study session
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  We will send this to your study planner API.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="subject"
                  className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  <BookOpen className="h-4 w-4 text-violet-600 dark:text-violet-400" aria-hidden />
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Organic Chemistry"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label
                  htmlFor="examDate"
                  className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  <CalendarDays
                    className="h-4 w-4 text-violet-600 dark:text-violet-400"
                    aria-hidden
                  />
                  Exam Date
                </label>
                <input
                  id="examDate"
                  name="examDate"
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="studyHours"
                  className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  <Clock className="h-4 w-4 text-violet-600 dark:text-violet-400" aria-hidden />
                  Study Hours
                </label>
                <input
                  id="studyHours"
                  name="studyHours"
                  type="number"
                  min={0}
                  max={168}
                  step={0.5}
                  required
                  value={studyHours}
                  onChange={(e) => setStudyHours(e.target.value)}
                  placeholder="Hours per week"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>

              {feedback && (
                <p
                  role="status"
                  className={
                    feedback.type === 'success'
                      ? 'rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'
                      : 'rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200'
                  }
                >
                  {feedback.text}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" aria-hidden />
                      Generate plan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
