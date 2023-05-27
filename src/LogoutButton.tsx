import { Button } from 'react-bootstrap';
import { useAuth } from './hooks/useAuth';

const LogoutButton = () => {
	const { logout } = useAuth();

	return (
		<Button variant="light" onClick={logout}>
			Logout
		</Button>
	);
};

export default LogoutButton;
