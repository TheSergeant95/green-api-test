import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import { Context } from '../index.js';
import { ProtectedRoute } from '../routes';
import Chat from '../pages/Chat';
import Login from './Login';
import { useAuth } from '../hooks/useAuth';

const AppRouter = () => {
	const { isLoading } = useAuth();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Routes>
			<Route
				key={'chat'}
				path={'/'}
				element={
					<ProtectedRoute>
						<Chat />
					</ProtectedRoute>
				}
			/>
			<Route key={'login'} path={'/login'} element={<Login />} />
			<Route path="/*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};

export default AppRouter;
