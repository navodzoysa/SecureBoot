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
			{deviceDetails && deviceDetails.map((device, index) =>
			<div key={index}>
			<DataTable
				withBorder
				borderRadius="sm"
				withColumnBorders
				striped
				highlightOnHover
				// provide data
				records={[
					{ id: index, deviceName: device.deviceName, deviceStatus: device.deviceStatus, lastSynced: device.lastSynced, },
					// more records...
				]}
				// define columns
				columns={[
					{
					accessor: 'id',
					// this column has a custom title
					title: '#',
					// right-align column
					textAlignment: 'right',
					},
					{ accessor: 'deviceName' },
					{
					accessor: 'deviceStatus',
					// this column has custom cell data rendering
					render: ({ deviceStatus }) => (
						<Text weight={700} color={deviceStatus === 'Active' ? 'green' : 'red'}>
						{deviceStatus.toUpperCase()}
						</Text>
					),
					},
					{ accessor: 'lastSynced' },
				]}
				// execute this callback when a row is clicked
				onRowClick={({ deviceName, deviceStatus, lastSynced }) =>
					alert(`You clicked on ${deviceName}, an ${deviceStatus.toLowerCase()} device last seen ${lastSynced}`)
				}
			/>		
			</div>
			)}
		</div>
	);
}