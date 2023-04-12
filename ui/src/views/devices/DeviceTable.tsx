import { Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../../components/LocalStorage';

export default function DeviceTable() {
	const [deviceDetails, setDeviceDetails] = useState<any[]>([]);
	const [fetching, isFetching] = useState<boolean>(true);
	const { getItem } = useLocalStorage();
	let userDetails: any;
	useEffect(() => {
		const user = getItem('user');
		if (user) {
			userDetails = JSON.parse(user);
			console.log('user details - ', userDetails);
		}
	}, []);

	const getDevices = useCallback(async () => {
		isFetching(true);
		await axios.get('/api/devices', {headers: { Authorization: 'Bearer ' + userDetails.authToken }})
			.then(response => response.data)
			.then((data) => {
				setDeviceDetails(data);
				isFetching(false);
			}).catch((err) => { 
				console.log('Error fetching devices - ', err);
				isFetching(false);
			})
	}, [isFetching, setDeviceDetails])

	useEffect(() => {
		getDevices();
	}, [])
	return (
		<div>
			<DataTable
				minHeight={'83vh'}
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
				onRowClick={({ deviceName, deviceStatus, lastActive }) =>
					alert(`You clicked on ${deviceName}, an ${deviceStatus.toLowerCase()} device last seen ${lastActive}`)
				}
			/>		
		</div>
	);
}