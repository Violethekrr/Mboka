import { createContext, useContext, useState, type ReactNode } from "react";
import type { Clients, Freelancers, Administrateur } from "../Type";
import { administrateursMock, } from "../constants";

export type UserRole = "client" | "freelancer" | "admin" | null;

type UserContextType = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: Clients | Freelancers | Administrateur | null;
  setUser: (user: Clients | Freelancers | Administrateur | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser doit être utilisé dans UserProvider");
  }

  return context;
};

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [role, setRole] = useState<UserRole>('admin');
  const [user, setUser] = useState<Clients | Freelancers | Administrateur | null>(administrateursMock[0]);

  return (
    <UserContext.Provider value={{ role, setRole, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};