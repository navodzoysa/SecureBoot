import { DataTable } from 'mantine-datatable';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Card, createStyles, getStylesRef, Group, rem, Tabs, Text } from '@mantine/core';
import UploadFirmware from './UploadFirmware';
import { IconSquarePlus, IconListDetails  } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../../components/Notification';

const useStyles = createStyles((theme) => ({
	tabWrapper: {
		marginBottom: rem(20),
	},
	linkIcon: {
		ref: getStylesRef('icon'),
		color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
	},
}));

export default function FirmwareTable() {
	const { classes } = useStyles();
	const [firmwareList, setFirmwareList] = useState<any[]>([]);
	const [fetching, isFetching] = useState<boolean>(true);
	const [tabValue, setTabValue] = useState('view');
	const { user, isAuthenticated } = useAuthContext();
	const navigate = useNavigate();

	const getFirmwareList = useCallback(async () => {
		isFetching(true);
		await axios.get('/api/firmware', {headers: { Authorization: 'Bearer ' + user.accessToken }})
			.then((response) => {
				if (response.status === 200) {
					setFirmwareList(response.data);
				} else {
					showNotification(response.status, response.data.message);
				}
			})
			.catch((err) => {
				if (err.response.status !== 404) {
					showNotification(err.reponse.status, err.response.data.message);
				}
			})
			.finally(() => {
				isFetching(false);
			})
	}, [user, isFetching, setFirmwareList])

	useEffect(() => {
		if (isAuthenticated) {
			getFirmwareList();
		}
	}, [isAuthenticated, getFirmwareList])

	const getCurrentTab = (value: any) => {
		setTabValue(value);
	}

	let viewFirmware = (value: any) => {
		navigate('/firmware/' + value);
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
							<IconListDetails size='1.05rem' className={classes.linkIcon} />View Firmware
						</Group>
					</Tabs.Tab>
					<Tabs.Tab value="add">
						<Group spacing='xs'>
							<IconSquarePlus size='1.05rem' className={classes.linkIcon} />Add Firmware
						</Group>
					</Tabs.Tab>
				</Tabs.List>
			</Tabs>
			{tabValue === "view" && (
				<DataTable
					minHeight={'78vh'}
					fetching={fetching}
					loaderColor="teal"
					loaderSize="xl"
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
							title: 'Supported Device',
							render: ({ firmwareSupportedDevice }) => (
								<Text>
									{firmwareSupportedDevice ? firmwareSupportedDevice.toUpperCase() : 'Unknown'}
								</Text>
							),
						},
						{
							accessor: 'firmwareVersion',
							title: 'Version'
						},
					]}
					// execute this callback when a row is clicked
					onRowClick={({ _id }) => viewFirmware(_id)}
				/>
			)}
			{tabValue === "add" && (
				<Card
					style={{ minHeight: '78vh' }}
					withBorder
					shadow='md'
					radius='md'
				>
					<UploadFirmware></UploadFirmware>
				</Card>
			)}
		</div>
	);
 }