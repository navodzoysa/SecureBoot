import { DataTable } from 'mantine-datatable';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function FirmwareTable() {
	const [firmwareList, setFirmwareList] = useState<any[]>([]);
	function getFirmwareList() {
		axios.get('/api/firmware')
			.then(response => response.data)
			.then((data) => {
				setFirmwareList(data);
			})
	}
	useEffect(() => {
		getFirmwareList();
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