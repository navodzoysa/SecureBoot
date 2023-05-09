import { useRef, useState } from 'react';
import { Text, Group, Button, createStyles, rem, Flex, TextInput, SimpleGrid, Divider } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconCloudUpload, IconX, IconDownload } from '@tabler/icons-react';
import axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';
import { showNotification } from '../../components/Notification';
import { hasLength, useForm } from '@mantine/form';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
	marginBottom: rem(30),
  },

  dropzone: {
    borderWidth: rem(1),
    paddingBottom: rem(50),
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },

  control: {
	  width: rem(250),
	  marginTop: rem(50)
  },
}));

export default function UploadFirmware() {
	const [firmwareBinary, setFirmwareBinary] = useState<any>();
	const [uploading, isUploading] = useState<boolean>(false);
	const { classes, theme } = useStyles();
	const openRef = useRef<() => void>(null);
	const { user } = useAuthContext();

	const form = useForm({
		initialValues: {
			firmwareName: '',
			deviceType: '',
			firmwareVersion: '',
		},
		validate: {
		  	firmwareName: hasLength({ min: 4 }, 'Firmware name must be at least 4 characters'),
		  	deviceType: hasLength({ min: 4 }, 'Device type must be at least 4 characters'),
			firmwareVersion: hasLength({ min: 5 }, 'Firmware version must be at least 5 characters'),
		},
	})

	const getFileData = (files: any) => {
		setFirmwareBinary(files);
	}

	const uploadFirmwareBinary = async () => {
		let formItems = form.values;
		if (formItems) {
			if (
				formItems.firmwareName.length >= 4 &&
				formItems.deviceType.length >= 4 &&
				formItems.firmwareVersion.length === 5 &&
				firmwareBinary?.length > 0)
			{
				if (firmwareBinary) {
					isUploading(true);
					const formdata = new FormData();
					formdata.append('file', firmwareBinary[0]);
					formdata.append('firmwareName', formItems.firmwareName);
					formdata.append('deviceType', formItems.deviceType);
					formdata.append('firmwareVersion', formItems.firmwareVersion);
					await axios.post('/api/firmware/upload',
						formdata,
						{ headers: { Authorization: 'Bearer ' + user.accessToken, 'Content-Type': 'multipart/form-data' }})
						.then((response) => {
							if (response.status === 201) {
								showNotification(response.status, response.data.message);
								form.reset();
								setFirmwareBinary(null);
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
				} else {
					showNotification(400, 'No firmware added. Please add a firmware binary to upload!');
				}
			} else {
				showNotification(400, 'All inputs are mandatory. Please try again!');
			}
		}
	}

	return (
		<div className={classes.wrapper}>
			<Divider
              label='Upload New Firmware'
              labelPosition='center'
              labelProps={{ 'size': 'xl', 'weight': '700', 'fz': 'xl' }}
              mb="lg"
            />
			<Flex direction='column' align='center' justify='center'>
				<form style={{ width: '40%' }}>
					<TextInput
						label="Firmware Name"
						placeholder="My Firmware"
						description="Firmware name (at least 4 characters)"
						required
						size="md" mt="lg"
						{...form.getInputProps('firmwareName')}
					/>
					<TextInput
						label="Device Type"
						placeholder="ESP32"
						description="Type of device. eg: ESP32 (at least 4 characters)"
						required
						size="md" mt="lg"
						{...form.getInputProps('deviceType')}
					/>
					<TextInput
						label="Firmware Version"
						placeholder="1.0.1"
						description="Firmware version. eg: 1.0.1 (should be 5 characters)"
						required
						size="md" mt="lg"
						{...form.getInputProps('firmwareVersion')}
					/>
				</form>
				<Dropzone
					openRef={openRef}
					onDrop={(files) => getFileData(files)}
					className={classes.dropzone}
					radius="md"
					accept={['application/octet-stream']}
					maxSize={10 * 1024 ** 2}
					loading={uploading}
					mt="xl"
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
						<Dropzone.Reject>bin file less than 2mb</Dropzone.Reject>
						<Dropzone.Idle>Upload firmware</Dropzone.Idle>
					</Text>
					<Text ta="center" fz="sm" mt="xs" c="dimmed">
						Drag&apos;n&apos;drop files here to upload. We can accept only <i>.bin</i> files that
						are less than 2mb in size.
					</Text>
					</div>
				</Dropzone>
				<SimpleGrid
					cols={1}
					breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
					mt={firmwareBinary?.length > 0 ? 'sm' : 0}
				>
					{firmwareBinary? 'Selected File : ' + firmwareBinary[0].name : ''}
				</SimpleGrid>

				<Button
					className={classes.control}
					mt={firmwareBinary?.length > 0 ? 'sm' : rem(50)}
					size="md" radius="md"
					onClick={() => uploadFirmwareBinary()}
				>
					Submit
				</Button>
			</Flex>
		</div>
	);
}