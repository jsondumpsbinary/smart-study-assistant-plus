import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = (username) => {
    const trimmedUsername = username.trim().toLowerCase();
    localStorage.setItem('currentUser', trimmedUsername);
    setCurrentUser(trimmedUsername);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    // We optionally clear the active session studyData on logout
    sessionStorage.removeItem('studyData');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
