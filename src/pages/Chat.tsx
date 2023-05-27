import React, { useState, useEffect } from 'react';
import {
	Form,
	Button,
	Col,
	Container,
	FormControl,
	InputGroup,
	Row,
	Navbar,
} from 'react-bootstrap';
import { User, useUser } from '../hooks/useUser';
import LogoutButton from '../LogoutButton';
import sendIcon from '../static/send-fill.svg';
import backIcon from '../static/left-arrow.svg';

const Chat: React.FC = () => {
	const { user } = useUser();
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [messages, setMessages] = useState<{ message: string; sent: boolean }[]>([]);
	const [phoneEntered, setPhoneEntered] = useState<boolean>(false);

	useEffect(() => {
		const receiveMessages = async () => {
			const response = await fetch(
				`https://api.green-api.com/waInstance${(user as User).idInstance}/ReceiveNotification/${
					(user as User).apiTokenInstance
				}`,
				{ method: 'GET' },
			);
			if (phoneEntered) {
				try {
					if (response !== null && response.ok) {
						const { receiptId, body } = await response.json();
						if (body.typeWebhook === 'incomingMessageReceived') {
							if (body.messageData.typeMessage === 'textMessage') {
								const messageResponse = body.messageData.textMessageData.textMessage;
								setMessages((prevMessages) => [
									...prevMessages,
									{ message: messageResponse, sent: false },
								]);
							}
						}
						await fetch(
							`https://api.green-api.com/waInstance${
								(user as User).idInstance
							}/DeleteNotification/${(user as User).apiTokenInstance}/${receiptId}`,
							{ method: 'DELETE' },
						);
					}
				} catch (e) {
					//   console.log((e as Error).message)
				}
			}
		};
		const interval = setInterval(() => {
			receiveMessages();
		}, 5000);
		return () => clearInterval(interval);
	}, [(user as User).idInstance, (user as User).apiTokenInstance, phoneEntered]);

	const handleOnSend = () => {
		const message = document.getElementById('message') as HTMLTextAreaElement;
		if (message !== null) {
			const trimmedMessage = message.value.trim();
			if (trimmedMessage !== '') {
				sendMessage(trimmedMessage);
				setMessages((prevMessages) => [...prevMessages, { message: trimmedMessage, sent: true }]);
				message.value = '';
			}
		}
	};

	const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			const message = e.currentTarget.value.trim();
			if (message !== '') {
				sendMessage(message);

				setMessages((prevMessages) => [...prevMessages, { message: message, sent: true }]);
				e.currentTarget.value = '';
			}
		}
	};

	const sendMessage = async (message: string) => {
		const response = await fetch(
			`https://api.green-api.com/waInstance${(user as User).idInstance}/SendMessage/${
				(user as User).apiTokenInstance
			}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chatId: phoneNumber + '@c.us',
					message,
				}),
			},
		);
		if (!response.ok) {
			console.error('Error sending message:', response);
		}
	};

	return (
		<Container>
			{!phoneEntered ? (
				<Navbar sticky="top" bg="primary" variant="dark" className="d-flex justify-content-end">
					<div className="me-3">
						<LogoutButton />
					</div>
				</Navbar>
			) : (
				<Navbar
					sticky="top"
					bg="primary"
					variant="dark"
					className="d-flex justify-content-between align-items-center"
				>
					<div className="ms-3">
						<Button className="me-2" variant="light" onClick={() => setPhoneEntered(false)}>
							<img src={backIcon} style={{ width: '20px', height: '20px' }} alt="Back" />
						</Button>
						<span style={{ color: 'white' }}>+{phoneNumber}</span>
					</div>
					<div className="me-3">
						<LogoutButton />
					</div>
				</Navbar>
			)}

			<Row>
				<Col>
					<Form>
						{!phoneEntered ? (
							<Container
								className="d-flex justify-content-center flex-column"
								style={{ height: window.innerHeight - 54 }}
							>
								<Form.Group
									className="d-flex justify-content-center align-items-center flex-column"
									controlId="phoneNumber"
								>
									<Form.Label>Phone Number</Form.Label>
									<InputGroup className="mb-3 d-flex justify-content-center align-items-center">
										<InputGroup.Text id="phone-prepend">+</InputGroup.Text>
										<Col xs={2}>
											<FormControl
												aria-describedby="phone-prepend"
												placeholder="1234567890"
												value={phoneNumber}
												onChange={(e) => setPhoneNumber(e.target.value)}
											/>
										</Col>
									</InputGroup>
									<Button onClick={() => setPhoneEntered(true)}>START MESSAGING</Button>
								</Form.Group>
							</Container>
						) : (
							<Form.Group>
								<Row>
									<Col>
										{messages.map((message, index) => (
											<div key={index}>
												{message.sent ? (
													<div className="d-flex justify-content-end">
														<div
															className="mt-1 me-3"
															style={{
																display: 'inline-block',
																padding: '0.2em 1em',
																backgroundColor: 'green',
																borderRadius: '0.5em',
																textAlign: 'center',
																color: 'white',
															}}
														>
															{message.message}
														</div>
													</div>
												) : (
													<div className="d-flex justify-content-start">
														<div
															className="mt-1 ms-3"
															style={{
																display: 'inline-block',
																padding: '0.2em 1em',
																backgroundColor: 'blue',
																borderRadius: '0.5em',
																textAlign: 'center',
																color: 'white',
															}}
														>
															{message.message}
														</div>
													</div>
												)}
											</div>
										))}
									</Col>
								</Row>
								<InputGroup style={{ position: 'fixed', left: '7vw', bottom: 0 }} className="mb-3">
									<Form.Group style={{ width: '80%' }} controlId="message">
										<FormControl
											as="textarea"
											rows={2}
											placeholder="Enter your message"
											onKeyDown={handleOnKeyDown}
										/>
									</Form.Group>
									<Button variant="outline-secondary" onClick={handleOnSend}>
										<img src={sendIcon} alt="Send" />
									</Button>
								</InputGroup>
							</Form.Group>
						)}
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default Chat;
