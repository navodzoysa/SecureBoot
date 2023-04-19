import { useRef, useState } from 'react';
import { Text, Group, Button, createStyles, rem } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';
import { showNotification } from '../../components/Notification';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
	marginBottom: rem(30),
	marginTop: rem(200),
  },

  dropzone: {
    borderWidth: rem(1),
    paddingBottom: rem(50),
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },

  control: {
    position: 'absolute',
    width: rem(250),
    left: `calc(50% - ${rem(125)})`,
    bottom: rem(-20),
  },
}));

export default function UploadFirmware() {
	const [firmwareBinary, setFirmwareBinary] = useState<any>();
	const [uploading, isUploading] = useState<boolean>(false);
	const { classes, theme } = useStyles();
	const openRef = useRef<() => void>(null);
	const { user } = useAuthContext();

	const getFileData = (files: any) => {
		setFirmwareBinary(files);
	}

	const uploadFirmwareBinary = async () => {
		if (firmwareBinary) {
			isUploading(true);
			const formdata = new FormData();
			formdata.append('file', firmwareBinary[0]);
			await axios.post('/api/firmware/upload',
				formdata,
				{ headers: { Authorization: 'Bearer ' + user.accessToken, 'Content-Type': 'multipart/form-data' }})
				.then((response) => {
					if (response.status === 201) {
						showNotification(response.status, response.data.message);
					} else {
						showNotification(response.status, response.data.message);
					}
				})
				.catch((err) => {
					showNotification(err.status, err.response.data.message);
				})
				.finally(() => {
					isUploading(false);
				}) 
		}
	}

	return (
		<div className={classes.wrapper}>
			<Dropzone
				openRef={openRef}
				onDrop={(files) => getFileData(files)}
				className={classes.dropzone}
				radius="md"
				accept={['application/octet-stream']}
				maxSize={10 * 1024 ** 2}
				loading={uploading}
			>
				<div style={{ pointerEvents: 'none' }}>
				<Group position="center">
					<Dropzone.Accept>
					<IconDownload
						size={rem(50)}
						color={theme.colors[theme.primaryColor][6]}
						stroke={1.5}
					/>
					</Dropzone.Accept>
					<Dropzone.Reject>
					<IconX size={rem(50)} color={theme.colors.red[6]} stroke={1.5} />
					</Dropzone.Reject>
					<Dropzone.Idle>
					<IconCloudUpload
						size={rem(50)}
						color={theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black}
						stroke={1.5}
					/>
					</Dropzone.Idle>
				</Group>

				<Text ta="center" fw={700} fz="lg" mt="xl">
					<Dropzone.Accept>Drop files here</Dropzone.Accept>
					<Dropzone.Reject>bin file less than 10mb</Dropzone.Reject>
					<Dropzone.Idle>Upload firmware</Dropzone.Idle>
				</Text>
				<Text ta="center" fz="sm" mt="xs" c="dimmed">
					Drag&apos;n&apos;drop files here to upload. We can accept only <i>.bin</i> files that
					are less than 10mb in size.
				</Text>
				</div>
			</Dropzone>

			<Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
				Select files
			</Button>
			<Button
				style={{ 'position': 'absolute', 'top': '20rem', 'left': '46rem' }}
				size="md" radius="xl"
				onClick={() => uploadFirmwareBinary()}
			>
				Submit
			</Button>
		</div>
	);
}