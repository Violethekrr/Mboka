import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import type { Clients, Freelancers, Administrateur } from "../Type";




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

  // Initialiser avec null (pas d'utilisateur connecté par défaut)
  const [role, setRole] = useState<UserRole>(() => {
    // Initialisation paresseuse : lire depuis localStorage au premier rendu
    const savedRole = localStorage.getItem("role");
    return savedRole ? (savedRole as UserRole) : null;
  });
  
  const [user, setUser] = useState<Clients | Freelancers | Administrateur | null>(() => {
    // Initialisation paresseuse : lire depuis localStorage au premier rendu
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Erreur lors de la restauration de la session", e);
        return null;
      }
    }
    return null;
  });


  // Sauvegarder la session quand l'utilisateur change
  useEffect(() => {
    if (user && role) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    }
  }, [user, role]);

  return (
    <UserContext.Provider value={{ role, setRole, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};