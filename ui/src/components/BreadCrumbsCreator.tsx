import { Anchor, Box, Breadcrumbs, rem, Text } from "@mantine/core";
import { useLocation } from "react-router-dom";

export default function BreadCrumbsCreator() {
	const location = useLocation();

	let currentLink = '';

	const crumbs = location.pathname.split('/')
		.filter(crumb => crumb !== '')
		.map(crumb => {
			currentLink += `/${crumb}`
			let crumbText = crumb.charAt(0).toUpperCase() + crumb.slice(1);
			return (
				<Anchor style={{ color: 'black' }} size='md' href={currentLink} key={crumb}>
					<Text>{crumbText}</Text>
				</Anchor>
			)
		})
	
	return (
		<>
			<Box sx={(theme) => ({
					backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
					textAlign: 'center',
					padding: rem(5),
					borderRadius: theme.radius.md,
					cursor: 'pointer',
					'&:hover': {
					backgroundColor:
						theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[0],
					},
				})}
			>
				<Breadcrumbs separator=">" style={{ 'fontSize': '0.9rem', fontWeight: '500' }}>{crumbs}</Breadcrumbs>
			</Box>
		</>
	);
}