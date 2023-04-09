import { DataTable } from 'mantine-datatable';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function FirmwareTable() {
	const [firmwareList, setFirmwareList] = useState<any[]>([]);
	const [fetching, isFetching] = useState(true);
	async function getFirmwareList() {
		isFetching(true);
		// await new Promise(resolve => setTimeout(resolve, 1000));
		await axios.get('/api/firmware')
			.then(response => response.data)
			.then((data) => {
				setFirmwareList(data);
				isFetching(false);
			})
	}
	useEffect(() => {
		getFirmwareList();
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
				records={firmwareList}
				idAccessor="_id"
				// define columns
				columns={[
					{
						accessor: 'firmwareName',
						title: 'Firmware'
					},
					{
						accessor: 'firmwareSupportedDevice',
						title: 'Firmware Supported Device'
					},

					{
						accessor: 'firmwareVersion',
						title: 'Firmware Version'
					},
				]}
				// execute this callback when a row is clicked
				onRowClick={({ firmwareName, firmwareSupportedDevice, firmwareVersion }) =>
					alert(`You clicked on ${firmwareName}, which supports ${firmwareSupportedDevice} and the version is ${firmwareVersion}`)
				}
			/>		
		</div>
	);
 }