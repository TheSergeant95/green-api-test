import { createContext } from 'react';
import { User } from '../hooks/useUser';

interface AuthContextValue {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextValue>({
	user: null,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setUser: () => {},
});
