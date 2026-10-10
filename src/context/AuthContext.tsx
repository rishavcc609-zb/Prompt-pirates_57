import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, signInWithGoogle, logOutUser } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export interface AppUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('pathfinder_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
        if (firebaseUser) {
          const appUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Learner',
            photoURL: firebaseUser.photoURL,
          };
          setUser(appUser);
          localStorage.setItem('pathfinder_auth_user', JSON.stringify(appUser));
        } else {
          setUser(null);
          localStorage.removeItem('pathfinder_auth_user');
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      const handleStorageAuth = () => {
        try {
          const saved = localStorage.getItem('pathfinder_auth_user');
          setUser(saved ? JSON.parse(saved) : null);
        } catch {
          setUser(null);
        }
      };
      window.addEventListener('auth_state_changed', handleStorageAuth);
      setIsLoading(false);
      return () => window.removeEventListener('auth_state_changed', handleStorageAuth);
    }
  }, []);

  const login = async () => {
    try {
      const firebaseUser = await signInWithGoogle();
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Google User',
          photoURL: firebaseUser.photoURL,
        };
        setUser(appUser);
        localStorage.setItem('pathfinder_auth_user', JSON.stringify(appUser));
      }
    } catch (e) {
      console.error('Google Sign-In failed:', e);
    }
  };

  const logout = async () => {
    try {
      await logOutUser();
      setUser(null);
      localStorage.removeItem('pathfinder_auth_user');
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
