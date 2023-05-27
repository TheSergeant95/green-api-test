import axios from 'axios';

const $host = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

export const login = async (instanceId: any, token: any) => {
	const response = await $host.get(`waInstance${instanceId}/getStateInstance/${token}`);
	if (!response.data) {
		throw new Error(`User not found: ${response.statusText}`);
	}
	return response.data;
};

export const sendMessage = async (instanceId: any, token: any, chatId: any, text: any) => {
	const { data } = await $host.post(`waInstance${instanceId}/SendMessage/${token}`, {
		chatId,
		message: text,
	});
	return data;
};
