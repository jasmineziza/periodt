import { createContext, useContext } from "react";

export type User = {
  id: number;
  email: string;
  name: string;
  date_of_birth?: string | null;
  created_at?: string;
};

export const UserContext = createContext<User | null>(null);
export const useUser = () => useContext(UserContext);
