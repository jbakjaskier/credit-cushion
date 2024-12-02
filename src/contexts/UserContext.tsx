import { createContext, useContext, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  imageUrl: string;
}

interface UserContextType {
  user: User | null;
  setUser?: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({ user: null });

interface UserProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function UserProvider({ children, initialUser = null }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user: initialUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 