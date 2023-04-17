import { createStyles, getStylesRef, Group, rem, Tabs, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { IconListDetails, IconSquarePlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
	tabWrapper: {
		marginBottom: rem(20),
	},
	linkIcon: {
		ref: getStylesRef('icon'),
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
	},
}));

export default function DeviceTable() {
	const { classes } = useStyles();
	const [deviceDetails, setDeviceDetails] = useState<any[]>([]);
	const [fetching, isFetching] = useState<boolean>(true);
	const [tabValue, setTabValue] = useState('view');
	const { user, isAuthenticated } = useAuthContext();
	const navigate = useNavigate();

	const getDevices = useCallback(async () => {
		isFetching(true);
		await axios.get('/api/devices', {headers: { Authorization: 'Bearer ' + user.accessToken }})
			.then(response => response.data)
			.then((data) => {
				setDeviceDetails(data);
				isFetching(false);
			})
			.catch((err) => {
				isFetching(false);
			})
		isFetching(false);
	}, [user, isFetching, setDeviceDetails])

	useEffect(() => {
		if (isAuthenticated) {
			getDevices();
		}
	}, [isAuthenticated, getDevices]);

	const getCurrentTab = (value: any) => {
		setTabValue(value);
	}

	let viewDevice = (value: any) => {
		navigate('/devices/' + value);
		// await axios.get('/api/firmware/download/' + value, { headers: { Authorization: 'Bearer ' + user.accessToken } })
		// 	.then((response) => {
		// 		console.log('firmware downloaded');
		// 	})
		// 	.catch((err) => {
		// 		console.log('error downloading firmware');
		// 	})
	}

	return (
		<div>
			<Tabs className={classes.tabWrapper} defaultValue="view" onTabChange={(value) => getCurrentTab(value)}>
				<Tabs.List>
					<Tabs.Tab value="view">
						<Group spacing='xs'>
							<IconListDetails size='1.05rem' className={classes.linkIcon} />View Devices
						</Group>
					</Tabs.Tab>
					<Tabs.Tab value="add">
						<Group spacing='xs'>
							<IconSquarePlus size='1.05rem' className={classes.linkIcon} />Add Device
						</Group>
					</Tabs.Tab>
				</Tabs.List>
			</Tabs>
			{tabValue === "view" && (
				<DataTable
					minHeight={'78vh'}
					fetching={fetching}
					withBorder
					borderRadius="md"
					shadow="md"
					withColumnBorders
					striped
					highlightOnHover
					// provide data
					records={deviceDetails}
					idAccessor="_id"
					// define columns
					columns={[
						{
							accessor: 'deviceName',
							title: 'Device Name'
						},
						{
							accessor: 'deviceStatus',
							title: 'Device Status',
							// this column has custom cell data rendering
							render: ({ deviceStatus }) => (
								<Text weight={700} color={deviceStatus === 'Up to date' ? 'green' : 'red'}>
									{deviceStatus.toUpperCase()}
								</Text>
							),
						},
						{
							accessor: 'lastActive',
							title: 'Last Active'
						},
					]}
					// execute this callback when a row is clicked
					onRowClick={({ _id }) => viewDevice(_id)}
				/>
			)}
			{tabValue === "add" && (
				<div style={{'flex': 'display'}}>
					<div></div>
				</div>
			)}
		</div>
	);
}