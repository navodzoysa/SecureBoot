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

export default function GroupTable() {
	const { classes } = useStyles();
	const [groupDetails, setGroupDetails] = useState<any[]>([]);
	const [fetching, isFetching] = useState<boolean>(true);
	const [tabValue, setTabValue] = useState('view');
	const { user, isAuthenticated } = useAuthContext();
	const navigate = useNavigate();

	const getGroups = useCallback(async () => {
		isFetching(true);
		await axios.get('/api/groups', {headers: { Authorization: 'Bearer ' + user.accessToken }})
			.then((response) => {
				if (response.status === 200) {
					if (Array.isArray(response.data)) {
						setGroupDetails(response.data);
					}
				} else {
					showNotification(response.status, response.data.message);
				}
			})
			.catch((err) => {
				console.log('err ', err)
				if (err.response.status !== 404) {
					showNotification(err.reponse.status, err.response.data.message);
				}
			})
			.finally(() => {
				isFetching(false);
			})
	}, [user, isFetching, setGroupDetails])

	useEffect(() => {
		if (isAuthenticated) {
			getGroups();
		}
	}, [isAuthenticated, getGroups]);

	const getCurrentTab = (value: any) => {
		setTabValue(value);
	}

	let viewGroup = (value: any) => {
		navigate('/groups/' + value);
	}

	return (
		<div>
			<Tabs className={classes.tabWrapper} defaultValue="view" onTabChange={(value) => getCurrentTab(value)}>
				<Tabs.List>
					<Tabs.Tab value="view">
						<Group spacing='xs'>
							<IconListDetails size='1.05rem' className={classes.linkIcon} />View Groups
						</Group>
					</Tabs.Tab>
					<Tabs.Tab value="add">
						<Group spacing='xs'>
							<IconSquarePlus size='1.05rem' className={classes.linkIcon} />Add Group
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
					records={groupDetails}
					idAccessor="_id"
					// define columns
					columns={[
						{
							accessor: 'groupName',
							title: 'Group Name'
						},
						{
							accessor: 'deviceCount',
							title: 'Device Count',
						},
					]}
					// execute this callback when a row is clicked
					onRowClick={({ _id }) => viewGroup(_id)}
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