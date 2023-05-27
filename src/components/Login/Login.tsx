import React, { useState } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

const Login: React.FC = () => {
	const [idInstance, setIdInstance] = useState('');
	const [apiTokenInstance, setApiTokenInstance] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const { login } = useAuth();
	const handleIdInstanceChange = (event: any) => {
		setIdInstance(event.target.value);
	};

	const handleApiTokenInstanceChange = (event: any) => {
		setApiTokenInstance(event.target.value);
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		const response = await fetch(
			`https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
		if (!response.ok) {
			setError('Error: ' + response);
		}
		try {
			if (response.ok) {
				const { stateInstance } = await response.json();
				if (stateInstance === 'notAuthorized') {
					setError('User not Authorized');
				}
				if (stateInstance === 'authorized') {
					login({
						idInstance,
						apiTokenInstance,
					});
					navigate('/');
				}
			}
		} catch (e) {
			//console.log(e.message)
		}
	};

	return (
		<Container
			className="d-flex justify-content-center flex-column"
			style={{ height: window.innerHeight - 54 }}
		>
			<Row>
				<Form onSubmit={handleSubmit}>
					<Form.Group
						controlId="formIdInstance"
						className="d-flex justify-content-center align-items-center flex-column"
					>
						<Form.Label column>Instance ID</Form.Label>
						<Col xs={7}>
							<Form.Control
								className="mb-3"
								type="text"
								placeholder="Enter instance ID"
								value={idInstance}
								onChange={handleIdInstanceChange}
							/>
						</Col>
					</Form.Group>
					<Form.Group
						controlId="formApiTokenInstance"
						className="d-flex justify-content-center align-items-center flex-column"
					>
						<Form.Label column>API Token</Form.Label>
						<Col xs={7}>
							<Form.Control
								className="mb-3"
								type="text"
								placeholder="Enter API token"
								value={apiTokenInstance}
								onChange={handleApiTokenInstanceChange}
							/>
						</Col>
					</Form.Group>
					<Col className="d-flex justify-content-center">
						<Button variant="primary" type="submit">
							Login
						</Button>
					</Col>
				</Form>
			</Row>
		</Container>
	);
};

export default Login;
