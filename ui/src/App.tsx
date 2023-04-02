import Navigator from './components/Navigator';
import { ThemeProvider } from './components/ThemeProvider';
import { useState } from 'react';
import {
  AppShell,
  Avatar,
  Navbar,
  Header,
  Footer,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Group,
  Code,
} from '@mantine/core';
import DeviceTable from './components/DeviceTable';
import Logo from './assets/images/boot-icon.png';

function App() {
const theme = useMantineTheme();
const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <Navigator></Navigator>
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Text color="dimmed" size="sm">
              SecureBoot © 2023 navodzoysa. All rights reserved.
            </Text>
          </div>
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Group position="apart">
              <Avatar src={Logo}/>
              <Text>SecureBoot</Text>
              <Code sx={{ fontWeight: 700 }}>v1.0.0</Code>
            </Group>
          </div>
        </Header>
      }
    >
      <DeviceTable></DeviceTable>
    </AppShell>
  );
}

export default App;
