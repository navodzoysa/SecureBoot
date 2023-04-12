import Navigator from './components/Navigator';
import { useEffect, useState } from 'react';
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
import { AuthContext } from './context/AuthContext';
import { useAuth } from './components/AuthenticateUser';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Login from './views/login/Login';
import Register from './views/register/Register';
import DeviceTable from './views/devices/DeviceTable';
import FirmwareTable from './views/firmware/FirmwareTable';
import Logo from './assets/images/secureboot-logo.png';

export default function App() {
  const APP_VERSION = process.env.REACT_APP_VERSION;
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [isNotAuthenticated, setIsNotAuthenticated] = useState<boolean>(true);
  const { user, setUser } = useAuth();

	useEffect(() => {
		
	}, [isNotAuthenticated, setIsNotAuthenticated])
  return (
    <Router>
      <AuthContext.Provider value={{ user, setUser }}>
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
            <Route path="/" element={isNotAuthenticated ? <Navigate replace to="/login"/> : <Navigate replace to="/devices" />} />
            <Route path="/login" element={ isNotAuthenticated ? <Login isNotAuthenticated={isNotAuthenticated} setIsNotAuthenticated={setIsNotAuthenticated} /> : <Navigate replace to="/devices" />} />
            <Route path="/register" element={ isNotAuthenticated ? <Register isNotAuthenticated={isNotAuthenticated} setIsNotAuthenticated={setIsNotAuthenticated} /> : <Navigate replace to="/devices" />} />
            <Route path="/devices" element={ isNotAuthenticated ? <Navigate replace to="/login"/> : <DeviceTable />} />
            <Route path="/firmware" element={ isNotAuthenticated ? <Navigate replace to="/login"/> : <FirmwareTable />} />
            <Route path="/settings" element={ isNotAuthenticated ? <Navigate replace to="/login"/> : <DeviceTable />} />
          </Routes>
        </AppShell>
      </AuthContext.Provider>
    </Router>   
  );
}