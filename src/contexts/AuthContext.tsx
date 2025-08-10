import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem('mathapp_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('mathapp_user');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Make API call to login endpoint
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password
        }),
      });

      if (!response.ok) {
        // If API call fails, try fallback demo authentication
        console.warn('API login failed, trying demo authentication');
        
        if (email === 'demo@example.com' && password === 'password') {
          const userData: User = {
            id: 'demo-1',
            email: email,
            name: 'Demo User'
          };
          
          setUser(userData);
          localStorage.setItem('mathapp_user', JSON.stringify(userData));
          return true;
        }
        return false;
      }

      const data = await response.json();
      // Assuming the API returns user data on successful login
      const userData: User = {
        id: data.data.user?.user_id,
        email: data.data.user?.email,
        name: data.data.user?.user_name
      };
      console.log(userData);
      setUser(userData);
      localStorage.setItem('mathapp_user', JSON.stringify(userData));
      
      // Store auth token if provided
      if (data.token) {
        localStorage.setItem('mathapp_token', data.token);
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to demo authentication if API is not available
      if (email === 'demo@example.com' && password === 'password') {
        const userData: User = {
          id: 'demo-1',
          email: email,
          name: 'Demo User'
        };
        
        setUser(userData);
        localStorage.setItem('mathapp_user', JSON.stringify(userData));
        return true;
      }
      
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mathapp_user');
    localStorage.removeItem('mathapp_token');
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest',
      email: 'guest@mathapp.com',
      name: 'Guest User'
    };
    
    setUser(guestUser);
    localStorage.setItem('mathapp_user', JSON.stringify(guestUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    loginAsGuest
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
