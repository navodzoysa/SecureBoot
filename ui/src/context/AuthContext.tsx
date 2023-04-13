import React, { useState, createContext, useContext } from "react";

interface AuthContext {
  user: any,
  setUser: (user: any | null) => void,
  isAuthenticated: boolean,
  setisAuthenticated: (isAuthenticated: boolean) => void,
}

interface AuthContextProviderProps{
  children: React.ReactNode
}
export const AuthContext = createContext<AuthContext>({ 
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setisAuthenticated: () => {},
});

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<any>();
  const [isAuthenticated, setisAuthenticated] = useState<boolean>(false);
  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, setisAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
}