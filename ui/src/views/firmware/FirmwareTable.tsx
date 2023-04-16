import { DataTable } from 'mantine-datatable';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Tabs } from '@mantine/core';
import UploadFirmware from './UploadFirmware';

export default function FirmwareTable() {
	const [firmwareList, setFirmwareList] = useState<any[]>([]);
	const [fetching, isFetching] = useState<boolean>(true);
	const [tabValue, setTabValue] = useState('view');
	const { user, isAuthenticated } = useAuthContext();

	const getFirmwareList = useCallback(async () => {
		isFetching(true);
		await axios.get('/api/firmware', {headers: { Authorization: 'Bearer ' + user.accessToken }})
			.then(response => response.data)
			.then((data) => {
				setFirmwareList(data);
				isFetching(false);
			})
			.catch((err) => {
				isFetching(false);
			})
		isFetching(false);
	}, [user, isFetching, setFirmwareList])

	useEffect(() => {
		if (isAuthenticated) {
			getFirmwareList();
		}
	}, [isAuthenticated, getFirmwareList])

	const getCurrentTab = (value: any) => {
		setTabValue(value);
	}

	const downloadFirmware = async (value: any) => {
		await axios.get('/api/firmware/download/' + value, { headers: { Authorization: 'Bearer ' + user.accessToken } })
			.then((response) => {
				console.log('firmware downloaded');
			})
			.catch((err) => {
				console.log('error downloading firmware');
			})
	}

	return (
		<div>
			<Tabs defaultValue="view" onTabChange={(value) => getCurrentTab(value)}>
				<Tabs.List>
					<Tabs.Tab value="add">Add firmware</Tabs.Tab>
					<Tabs.Tab value="view">View firmware</Tabs.Tab>
				</Tabs.List>
			</Tabs>
			{tabValue === "view" && (
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
					onRowClick={({ _id }) => downloadFirmware(_id)}
				/>
			)}
			{tabValue === "add" && (
				<div style={{'flex': 'display'}}>
					<UploadFirmware></UploadFirmware>
				</div>
			)}
		</div>
	);
 }