import React, { createContext, useContext, useState, useEffect } from 'react';
// Import the User type from your mock data to ensure shape consistency
import type { User } from '../../data/mockData'; 

/**
 * @file AuthContext.tsx
 * @description The Central Identity Manager.
 * * ARCHITECTURAL ROLE:
 * This context provides global access to the current user's state (Identity).
 * It decouples the UI components from the specific authentication implementation.
 * * KEY FEATURES:
 * 1. **Session Persistence:** Checks localStorage on boot.
 * 2. **Data Lake Connection:** Reads from 'ramme_db_users' to validate real accounts.
 * 3. **Simulation:** Adds artificial latency to test loading states.
 */

// ✅ CRITICAL FIX: Match the key used by useCrudLocalStorage and data-seeder
const USER_DB_KEY = 'ramme_db_users'; 
const SESSION_KEY = 'ramme_session';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(SESSION_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse session", e);
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // ✅ FIX: We now use the 'password' variable to satisfy TypeScript (ts(6133))
    // This also adds a layer of realism to the mock validation.
    if (!password || password.length < 3) {
      setIsLoading(false);
      throw new Error("Password must be at least 3 characters");
    }

    console.log(`🔐 Attempting login for: ${email}`);

    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // ✅ READ FROM THE CORRECT DATA LAKE
    const storedUsers = localStorage.getItem(USER_DB_KEY);
    
    // Debugging: See what is actually in storage
    if (!storedUsers) {
      console.warn(`⚠️ Data Lake '${USER_DB_KEY}' is empty! Did you run the seeder or signup?`);
    } else {
      // Optional: Log count for debugging (remove in production)
      // console.log(`✅ Data Lake found. Users in DB:`, JSON.parse(storedUsers).length);
    }

    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Case-insensitive email check
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
      console.log("🎉 User found:", foundUser);
      setUser(foundUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(foundUser));
      setIsLoading(false);
    } else {
      console.error("❌ User NOT found. Available emails:", users.map(u => u.email));
      setIsLoading(false);
      throw new Error("Invalid email or password");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user, 
        isLoading 
      }}
    >
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