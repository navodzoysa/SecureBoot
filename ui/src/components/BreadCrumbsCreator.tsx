import { Anchor, Breadcrumbs } from "@mantine/core";
import { useLocation } from "react-router-dom";

export default function BreadCrumbsCreator() {
	const location = useLocation();

	let currentLink = '';

	const crumbs = location.pathname.split('/')
		.filter(crumb => crumb !== '')
		.map(crumb => {
			console.log(crumb);
			currentLink += `/${crumb}`
			let crumbText = crumb.charAt(0).toUpperCase() + crumb.slice(1);
			return (
				<Anchor href={currentLink} key={crumb}>{crumbText}</Anchor>
			)
		})
	
	return (
		<>
			<Breadcrumbs style={{'marginBottom': '0.5rem'}}>{crumbs}</Breadcrumbs>
		</>
	);
}