import { notifications } from '@mantine/notifications';
import { IconShieldCheckFilled, IconShieldX } from '@tabler/icons-react';

export const showNotification = (status: number, message: String) => {
	let title, icon, color;
	if (status === 200 || status === 201) {
		title = 'Success';
		icon = <IconShieldCheckFilled  />;
		color = 'teal';
		message = message ? message : 'Oops no message to show!';
	} else {
		title = 'Error';
		icon = <IconShieldX />;
		color = 'red';
		message = message ? message : 'Oops something went wrong!';
	}
	notifications.show({
		title: title,
		message: message,
		icon: icon,
		color: color,
		radius: 'md',
	})
}