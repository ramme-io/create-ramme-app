import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers, type User } from '../data/mockUsers';

interface AuthContextType {
  user: User | null;
  login: (username: string, password?: string) => Promise<User | null>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for a logged-in user in localStorage on initial load
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password?: string): Promise<User | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          u => u.username === username && u.password === password
        );
        if (foundUser) {
          const userToStore = { ...foundUser };
          delete userToStore.password; // Don't store password
          localStorage.setItem('authUser', JSON.stringify(userToStore));
          setUser(userToStore);
          resolve(userToStore);
        } else {
          resolve(null);
        }
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};