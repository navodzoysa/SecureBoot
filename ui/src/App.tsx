import Navigator from './components/Navigator';
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
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import Login from './views/login/Login';
import Register from './views/register/Register';
import DeviceTable from './views/devices/DeviceTable';
import FirmwareTable from './views/firmware/FirmwareTable';
import Logo from './assets/images/secureboot-logo.png';

export default function App() {
  const APP_VERSION = process.env.REACT_APP_VERSION;
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [isNotAuthenticated, setIsNotAuthenticated] = useState(true);
  return (
    <Router>
      <AuthProvider>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  <Avatar src={Logo} />
                  <Text>SecureBoot</Text>
                  <Code sx={{ fontWeight: 700 }}>v{APP_VERSION}</Code>
                </Group>
              </div>
            </Header>
          }
          hidden={isNotAuthenticated}
        >
          <Routes>
            <Route path="/" element={<Navigate replace to="/devices" />} />
            <Route path="/login" element={<Login setIsNotAuthenticated={setIsNotAuthenticated} />} />
            <Route path="/register" element={<Register setIsNotAuthenticated={setIsNotAuthenticated} />} />
            <Route path="/devices" element={<AuthenticatedRoute><DeviceTable /></AuthenticatedRoute>} />
            <Route path="/firmware" element={<AuthenticatedRoute><FirmwareTable /></AuthenticatedRoute>} />
            <Route path="/settings" element={<AuthenticatedRoute><DeviceTable /></AuthenticatedRoute>} />
          </Routes>
        </AppShell>
      </AuthProvider>
    </Router>   
  );
}