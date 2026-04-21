import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const trimmedUser = user.trim().toLowerCase();
      const savedProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
      setCurrentUser(trimmedUser);
      setCurrentUserEmail(savedProfiles[trimmedUser]?.email || '');
    }
    setLoading(false);
  }, []);

  const login = (username, email) => {
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedEmail = email.trim().toLowerCase();
    const savedProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    savedProfiles[trimmedUsername] = {
      username: trimmedUsername,
      email: trimmedEmail
    };

    localStorage.setItem('userProfiles', JSON.stringify(savedProfiles));
    localStorage.setItem('currentUser', trimmedUsername);
    setCurrentUser(trimmedUsername);
    setCurrentUserEmail(trimmedEmail);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    // We optionally clear the active session studyData on logout
    sessionStorage.removeItem('studyData');
    setCurrentUser(null);
    setCurrentUserEmail('');
  };

  return (
    <AuthContext.Provider value={{ currentUser, currentUserEmail, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
