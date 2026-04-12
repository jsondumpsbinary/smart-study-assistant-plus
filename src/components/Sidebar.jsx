import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Layers } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Notes', path: '/notes', icon: <BookOpen size={20} /> },
    { name: 'Flashcards', path: '/flashcards', icon: <Layers size={20} /> },
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

      <div className="p-4 border-t border-surface-hover">
        <div className="bg-surface-hover p-4 rounded-xl flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          <span className="text-sm font-medium text-text-muted">Ready to learn</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
