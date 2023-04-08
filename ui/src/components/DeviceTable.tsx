import { Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import axios from 'axios';
import { useEffect, useState } from 'react';



export default function DeviceTable() {
	const [deviceDetails, setDeviceDetails] = useState<any[]>([]);
	function getDeviceDetails() {
		axios.get('/api/devices')
			.then(response => response.data)
			.then((data) => {
				setDeviceDetails(data);
			})
	}
	useEffect(() => {
		getDeviceDetails();
	}, [])
	return (
		<div>
			<DataTable
				withBorder
				borderRadius="sm"
				withColumnBorders
				striped
				highlightOnHover
				// provide data
				records={deviceDetails}
				idAccessor="_id"
				// define columns
				columns={[
					{ accessor: 'deviceName' },
					{
					accessor: 'deviceStatus',
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
				onRowClick={({ deviceName, deviceStatus, lastSynced }) =>
					alert(`You clicked on ${deviceName}, an ${deviceStatus.toLowerCase()} device last seen ${lastSynced}`)
				}
			/>		
		</div>
	);
}