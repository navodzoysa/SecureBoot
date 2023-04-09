import { Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function DeviceTable() {
	const [deviceDetails, setDeviceDetails] = useState<any[]>([]);
	const [fetching, isFetching] = useState(true);
	async function getDeviceDetails() {
		isFetching(true);
		// await new Promise(resolve => setTimeout(resolve, 1000));
		await axios.get('/api/devices')
			.then(response => response.data)
			.then((data) => {
				setDeviceDetails(data);
				isFetching(false);
			})
	}
	useEffect(() => {
		getDeviceDetails();
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