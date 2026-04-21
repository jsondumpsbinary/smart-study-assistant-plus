import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Layers, Clock, Brain, TrendingUp, LogOut, User } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Notes', path: '/notes', icon: <BookOpen size={20} /> },
    { name: 'Flashcards', path: '/flashcards', icon: <Layers size={20} /> },
    { name: 'Quiz Engine', path: '/quiz', icon: <Brain size={20} /> },
    { name: 'Progress Tracking', path: '/progress', icon: <TrendingUp size={20} /> },
    { name: 'History', path: '/history', icon: <Clock size={20} /> },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-surface-hover h-full flex flex-col transition-all duration-300">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          StudyAssistant+
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-text-muted hover:bg-surface-hover hover:text-text-main"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={clsx("transition-transform group-hover:scale-110", isActive ? "text-primary" : "")}>
                  {item.icon}
                </span>
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {currentUser && (
        <div className="p-4 border-t border-surface-hover space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
              <User size={16} />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-text-main truncate">@{currentUser}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors border border-transparent hover:border-error/20"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
