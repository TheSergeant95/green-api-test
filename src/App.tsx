import React, { useState } from 'react';
import { AuthContext as Context } from './context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { User } from './hooks/useUser';
import AppRouter from './components/AppRouter';

const App = () => {
	const [authUser, setAuthUser] = useState<User | null>(null);

	const setUser = (user: User | null) => {
		setAuthUser(user); // Update the authUser state
	};

	return (
		<Context.Provider value={{ user: authUser, setUser }}>
			<Router>
				<AppRouter />
			</Router>
		</Context.Provider>
	);
};

export default App;
