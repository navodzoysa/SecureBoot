import { createStyles, getStylesRef, Group, rem, Tabs } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { IconListDetails, IconSquarePlus } from '@tabler/icons-react';
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

export default function UpdatesTable() {
	const { classes } = useStyles();
	const [updateDetails, setUpdateDetails] = useState<any[]>([]);
	const [fetching, isFetching] = useState<boolean>(true);
	const [tabValue, setTabValue] = useState('view');
	const { user, isAuthenticated } = useAuthContext();
	const navigate = useNavigate();

	const getUpdates = useCallback(async () => {
		isFetching(true);
		await axios.get('/api/updates', {headers: { Authorization: 'Bearer ' + user.accessToken }})
			.then((response) => {
				if (response.status === 200) {
					if (Array.isArray(response.data)) {
						setUpdateDetails(response.data);
					}
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
	}, [user, isFetching, setUpdateDetails])

	useEffect(() => {
		if (isAuthenticated) {
			getUpdates();
		}
	}, [isAuthenticated, getUpdates]);

	const getCurrentTab = (value: any) => {
		setTabValue(value);
	}

	let viewUpdate = (value: any) => {
		navigate('/updates/' + value);
	}

	return (
		<div>
			<Tabs className={classes.tabWrapper} defaultValue="view" onTabChange={(value) => getCurrentTab(value)}>
				<Tabs.List>
					<Tabs.Tab value="view">
						<Group spacing='xs'>
							<IconListDetails size='1.05rem' className={classes.linkIcon} />View Updates
						</Group>
					</Tabs.Tab>
					<Tabs.Tab value="add">
						<Group spacing='xs'>
							<IconSquarePlus size='1.05rem' className={classes.linkIcon} />Add Update
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
					records={updateDetails}
					idAccessor="_id"
					// define columns
					columns={[
						{
							accessor: 'updateName',
							title: 'Update Name'
						},
						{
							accessor: 'updateStatus',
							title: 'Update Status'
						},
					]}
					// execute this callback when a row is clicked
					onRowClick={({ _id }) => viewUpdate(_id)}
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