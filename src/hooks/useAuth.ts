import { useEffect, useState } from 'react';
import { useUser, User } from './useUser';
import { useLocalStorage } from './useLocalStorage';

export const useAuth = () => {
	const { user, addUser, removeUser } = useUser();
	const { getItem } = useLocalStorage();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const user = getItem('user');

		if (user) {
			addUser(JSON.parse(user));
		}
		setIsLoading(false);
	}, []);

	const login = (user: User) => {
		addUser(user);
	};

	const logout = () => {
		removeUser();
	};

	const isLoggedIn = user !== null;

	return { user, login, logout, isLoggedIn, isLoading };
};
