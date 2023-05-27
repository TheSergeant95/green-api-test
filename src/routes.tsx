import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from './components/Login';
import Chat from './pages/Chat';
import { useAuth } from './hooks/useAuth';

export const publicRoutes = [
	{
		path: '/',
		Component: <Chat />,
	},
	{
		path: '/login',
		Component: <Login />,
	},
];

export const ProtectedRoute = ({ children }: any) => {
	const { isLoggedIn } = useAuth();

	if (!isLoggedIn) {
		// user is not authenticated
		return <Navigate to="/login" />;
	}
	return children;
};
