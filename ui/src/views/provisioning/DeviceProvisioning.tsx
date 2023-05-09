import { useCallback, useState } from 'react';
import { Stepper, Button, Group, Container, Flex, Divider, PasswordInput, TextInput, Text, Card } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import { showNotification } from '../../components/Notification';
import axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';

export default function DeviceProvisioning() {
  const [active, setActive] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(active);
  const [successTitle, setSuccessTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [successDetails, setScuccessDetails] = useState('');
  const { user } = useAuthContext();

  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep > 3 || nextStep < 0;

    if (isOutOfBounds) {
      return;
    }
    
    if (nextStep === 3) {
      if (form.values) {
        if (form.values.deviceName.length >= 4 && form.values.deviceType.length >= 4) {
          onFormSubmit(form.values);
        } else {
          setSuccessTitle('Error');
          setSuccessMessage('Device name and device type must be at least 4 characters');
          showNotification(400, 'Device name and device type must be at least 4 characters');
        }
      }
    }

    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  const shouldAllowSelectStep = (step: number) => highestStepVisited >= step && active !== step;

  const form = useForm({
    initialValues: {
      deviceName: '',
      deviceType: '',
      wifiSsid: '',
      wifiPassword: '',
    },
    validate: {
      deviceName: hasLength({ min: 4 }, 'Device name must be at least 4 characters'),
      deviceType: hasLength({ min: 4 }, 'Device type must be at least 4 characters'),
    },
  })

  const onFormSubmit = (values: any) => {
    if (values) {
      provisionDevice(values);
    }
  }

  const provisionDevice = useCallback(async (values: any) => {
    await axios.post('/api/devices/provision',
      { deviceName: values.deviceName, deviceType: values.deviceType },
      { headers: { Authorization: 'Bearer ' + user.accessToken } }
    )
      .then((response) => {
        if (response.status === 201) {
          setSuccessTitle('Success');
          setScuccessDetails(response.data.preSharedKey);
          setSuccessMessage(response.data.message);
        } else {
          setSuccessTitle('Error');
          setScuccessDetails('');
          setSuccessMessage('Something went wrong please try again!');
        }
      })
      .catch((err) => {
        setSuccessTitle('Error');
        setScuccessDetails('');
        setSuccessMessage('Something went wrong please try again!');
        showNotification(err.status, err.response.data.message);
      })
  }, [user])

  return (
    <Container size='100%' mt='xl' p={0}>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step
          label="First step"
          description="Device Identification"
          allowStepSelect={shouldAllowSelectStep(0)}
        >
          <Card
            style={{ 'width': '100%', minHeight: '70vh' }}
            withBorder
            shadow='md'
            radius='md'
          >
            <Divider
              label='Configure Device Identification'
              labelPosition='center'
              labelProps={{ 'size': 'xl', 'weight': '700', 'fz': 'xl' }}
              mb="lg"
            />
            <Flex align='center' direction='column'>
              <form style={{'width': '50%', minHeight: '60vh'}} onSubmit={form.onSubmit((values) => onFormSubmit(values))}>
                <TextInput label="Device Name" placeholder="My Device" required size="md" mt="lg" {...form.getInputProps('deviceName')} />
                <TextInput label="Device Type" placeholder="ESP32" required size="md" {...form.getInputProps('deviceType')} />
              </form>
            </Flex>
          </Card>
		    </Stepper.Step>
        <Stepper.Step
          label="Second step"
          description="Device Credentials"
          allowStepSelect={shouldAllowSelectStep(1)}
        >
          <Card style={{ 'width': '100%', minHeight: '70vh' }}
            withBorder
            shadow='md'
            radius='md'
          >
            <Divider
              label='Configure Device Credentials'
              labelPosition='center'
              labelProps={{ 'size': 'xl', 'weight': '700', 'fz': 'xl' }}
              mb="lg"
            />
            <Flex align='center' direction='column'>
              <form style={{'width': '50%', minHeight: '60vh'}} onSubmit={form.onSubmit((values) => onFormSubmit(values))}>
                <TextInput label="Wi-Fi SSID" placeholder="My Wifi" required size="md" mt="lg" {...form.getInputProps('wifiSsid')} />
                <PasswordInput label="Wi-Fi Password" placeholder="Your Wifi password" required mt="md" size="md" {...form.getInputProps('wifiPassword')} />
              </form>
            </Flex>
          </Card>
        </Stepper.Step>
        <Stepper.Step
          label="Final step"
          description="Confirm"
          allowStepSelect={shouldAllowSelectStep(2)}
        >
          <Card style={{ 'width': '100%', minHeight: '70vh' }}
            withBorder
            shadow='md'
            radius='md'
          >
            <Divider
              label='Confirm Device Provisioning'
              labelPosition='center'
              labelProps={{ 'size': 'xl', 'weight': '700', 'fz': 'xl' }}
              mb="lg"
            />
            <Flex direction='column' align='center' justify='center'>
              <div style={{ 'width': '50%', minHeight: '60vh' }}>
                <Flex direction='column' align='center' justify='center'>
                  <Text>Device Name: {form.values.deviceName}</Text>
                  <Text>Device Type: {form.values.deviceType}</Text>
                  </Flex>
                </div>
            </Flex>
          </Card>
        </Stepper.Step>

        <Stepper.Completed>
          <Card style={{ 'width': '100%', minHeight: '70vh' }}
            withBorder
            shadow='md'
            radius='md'
          >
            <Divider
              label={successTitle}
              labelPosition='center'
              labelProps={{ 'size': 'xl', 'weight': '700', 'fz': 'xl' }}
              mb="lg"
            />
            <Flex direction='column' align='center' justify='center'>
              <div style={{ 'width': '50%', minHeight: '60vh' }}>
                <Flex direction='column' align='center' justify='center'>
                  <Text>{successMessage}</Text>
                  <Text>{successDetails}</Text>
                </Flex>
              </div>
            </Flex>
          </Card>
        </Stepper.Completed>
      </Stepper>

      <Group position="center" mt="xl" >
        { active !== 0 ?
          <Button variant="default" radius="md" onClick={() => handleStepChange(active - 1)}>
            Back
          </Button>
          :
          <></>
        }
        { active !== 3 ?
          <Button
            radius="md"
            onClick={() => handleStepChange(active + 1)}
          >
            {active === 2 ? 'Confirm' : 'Next step'}
          </Button>
          :
          <></>
        }
      </Group>
    </Container>
  );
}