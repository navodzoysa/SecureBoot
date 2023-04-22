import { useState } from 'react';
import { Stepper, Button, Group, Container, Flex, Title } from '@mantine/core';

export default function DeviceProvisioning() {
  const [active, setActive] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(active);

  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep > 3 || nextStep < 0;

    if (isOutOfBounds) {
      return;
    }

    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  const shouldAllowSelectStep = (step: number) => highestStepVisited >= step && active !== step;

  return (
    <Container size='xl' mt='xl'>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step
          label="First step"
          description="Device Identification"
          allowStepSelect={shouldAllowSelectStep(0)}
		>
			<Flex justify='center'>
				<Title>Configure Device Identification</Title>
			</Flex>
		</Stepper.Step>
        <Stepper.Step
          label="Second step"
          description="Device Credentials"
          allowStepSelect={shouldAllowSelectStep(1)}
        >
			<Flex justify='center'>
				<Title>Configure Device Credentials</Title>
			</Flex>
        </Stepper.Step>
        <Stepper.Step
          label="Final step"
          description="Confirm"
          allowStepSelect={shouldAllowSelectStep(2)}
        >
			<Flex justify='center'>
				<Title>Confirm Device Provisioning</Title>
			</Flex>
        </Stepper.Step>

        <Stepper.Completed>
          Successfully provisioned device.
        </Stepper.Completed>
      </Stepper>

      <Group position="center" mt="xl">
        <Button variant="default" onClick={() => handleStepChange(active - 1)}>
          Back
        </Button>
        <Button onClick={() => handleStepChange(active + 1)}>Next step</Button>
      </Group>
    </Container>
  );
}