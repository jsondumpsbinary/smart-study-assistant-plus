import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-background text-text-main overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative p-8">
        <div className="max-w-6xl mx-auto w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
