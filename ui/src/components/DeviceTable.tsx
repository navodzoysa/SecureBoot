import { Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

export default function DeviceTable() {
	return (
		<DataTable
			withBorder
			borderRadius="sm"
			withColumnBorders
			striped
			highlightOnHover
			// provide data
			records={[
				{ deviceName: 'NodeMCU-32S', deviceStatus: 'Active', lastSynced: '2 mins ago', },
				// more records...
			]}
			// define columns
			columns={[
				// {
				// accessor: 'id',
				// // this column has a custom title
				// title: '#',
				// // right-align column
				// textAlignment: 'right',
				// },
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
	);
}