"use client";
import { createContext, useState, useContext, ReactNode } from "react";

interface User {
	name: string;
	id: string;
}

// Define the context type
interface UserContextType {
	user: User;
	setUser: (user: User) => void;
}

// Create the UserContext with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};

// Create the provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User>({ name: "", id: "" });

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};
