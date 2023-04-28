import { Card } from "@mantine/core";
import { useAuthContext } from "../../context/AuthContext";

export default function User() {
	const { user } = useAuthContext();
	return (
		<Card>
			{user.firstName}
		</Card>
	)
}