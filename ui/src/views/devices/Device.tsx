import { Container, Text, Paper, Card, Badge, Button, Group, Image, Flex } from '@mantine/core';
import axios from 'axios';
import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { showNotification } from '../../components/Notification';

export default function Device() {
	const { user, isAuthenticated } = useAuthContext();
	const params = useParams();
	const [deviceDetails, setDeviceDetails] = useState<any>();

	const getDeviceDetailsById = useCallback(async () => {
		await axios.get('/api/devices/device/' + params.id, {headers: { Authorization: 'Bearer ' + user.accessToken }})
			.then((response) => {
				if (response.status === 200) {
					setDeviceDetails(response.data);
				} else {
					showNotification(response.status, response.data.message);
				}
			})
			.catch((err) => {
				showNotification(err.status, err.response.data.message);
			})
	}, [params, user, setDeviceDetails])

	useEffect(() => {
		if (isAuthenticated) {
			getDeviceDetailsById();
		}
	}, [isAuthenticated, getDeviceDetailsById])

	return (
		<Container size='xl'>
			<Flex direction='column' gap='xl'>
			<Paper shadow="xs" p="md">
				<Text>Paper is the most basic ui component</Text>
				<Text>
					Use it to create cards, dropdowns, modals and other components that require background
					with shadow
				</Text>
			</Paper>
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Card.Section>
					<Image
					src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
					height={160}
					alt="Norway"
					/>
				</Card.Section>

				<Group position="apart" mt="md" mb="xs">
					<Text weight={500}>Norway Fjord Adventures</Text>
					<Badge color="pink" variant="light">
					On Sale
					</Badge>
				</Group>

				<Text size="sm" color="dimmed">
					With Fjord Tours you can explore more of the magical fjord landscapes with tours and
					activities on and around the fjords of Norway
				</Text>

				<Button variant="light" color="blue" fullWidth mt="md" radius="md">
					Book classic tour now
				</Button>
			</Card>
			<div>{deviceDetails ? deviceDetails.deviceName : ''}</div>
			</Flex>
		</Container>
	);
}