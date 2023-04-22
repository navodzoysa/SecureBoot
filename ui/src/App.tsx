import Navigator from './components/Navigator';
import { useCallback, useEffect, useState } from 'react';
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
  Group as MantineGroup,
  Code,
} from '@mantine/core';
import { useAuthContext } from './context/AuthContext';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Login from './views/login/Login';
import Register from './views/register/Register';
import DeviceTable from './views/devices/DeviceTable';
import FirmwareTable from './views/firmware/FirmwareTable';
import Logo from './assets/images/secureboot-logo.png';
import axios from 'axios';
import Welcome from './views/welcome/Welcome';
import Dashboard from './views/dashboard/Dashboard';
import Firmware from './views/firmware/Firmware';
import Device from './views/devices/Device';
import BreadCrumbsCreator from './components/BreadCrumbsCreator';
import { NotFound } from './views/error/NotFound';
import { showNotification } from './components/Notification';
import DeviceProvisioning from './views/provisioning/DeviceProvisioning';
import Settings from './views/settings/Settings';
import GroupTable from './views/groups/GroupTable';
import Group from './views/groups/Group';
import User from './views/user/User';

export default function App() {
  const APP_VERSION = process.env.REACT_APP_VERSION;
  const [year, setYear] = useState('');
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { setUser, isAuthenticated, setisAuthenticated } = useAuthContext();

  const verifyUser = useCallback(async () => {
    await axios.post('/api/users/refresh-token', {})
      .then((response) => {
        if (response.status === 201) {
          setUser((user: any) => {
            return { ...user, accessToken: response.data.accessToken }
          })
          setisAuthenticated(true);
        } else {
          setUser((user: any) => {
            return { ...user, accessToken: null }
          });
          showNotification(response.status, response.data.message);
          setisAuthenticated(false);
        }
      })
      .catch(() => {
        setUser((user: any) => {
            return { ...user, accessToken: null }
        });
        setisAuthenticated(false);
      })
    setTimeout(verifyUser, 5 * 60 * 1000);
  }, [setUser, setisAuthenticated])

  useEffect(() => {
    setYear(new Date().getUTCFullYear().toString());
    if (!isAuthenticated) {
      console.log('logout - ', localStorage.getItem('logout'))
      verifyUser();
    }
  }, [isAuthenticated, verifyUser])

  return (
    <Router>
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
          <Footer height={50} p="md">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text color="dimmed" size="sm">
                SecureBoot © {year} Navod Zoysa
              </Text>
            </div>
          </Footer>
        }
        header={
          <Header height={{ base: 50, md: 60 }} p="md">
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
              <MantineGroup position="apart">
                <Avatar src={Logo} />
                <Text style={{'fontWeight': '600', fontSize: '1.4rem'}}>SecureBoot</Text>
                <Code sx={{ fontWeight: 700, paddingTop: '0.5rem' }}>v{APP_VERSION}</Code>
                {isAuthenticated && (
                  <div style={{'marginLeft': '2.8rem'}}>
                    <BreadCrumbsCreator></BreadCrumbsCreator>
                  </div>
                )}
              </MantineGroup>
            </div>
          </Header>
        }
        hidden={!isAuthenticated}
      >
        <Routes>
          { isAuthenticated ?
            <>
              <Route path="/login" element={<Navigate replace to='/welcome' />} />
              <Route path="/register" element={<Navigate replace to='/welcome' />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/devices" element={<DeviceTable />} />
              <Route path="/devices/:id" element={<Device />} />
              <Route path="/firmware" element={<FirmwareTable />} />
              <Route path="/firmware/:id" element={<Firmware />} />
              <Route path="/groups" element={<GroupTable />} />
              <Route path="/groups/:id" element={<Group />} />
              <Route path="/provisioning" element={<DeviceProvisioning />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/user" element={<User />} />
              <Route path="*" element={<NotFound />} />
            </>
            :
            <>
              <Route path="/" element={<Navigate replace to='/login' />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          }
        </Routes>
      </AppShell>
    </Router>   
  );
}