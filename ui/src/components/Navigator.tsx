import { createStyles, Navbar, getStylesRef, rem } from '@mantine/core';
import {
  IconSettings,
  IconLogout,
  IconDeviceDesktopAnalytics,
  IconCpu,
  IconBroadcast,
  IconQrcode,
  IconBox,
} from '@tabler/icons-react';
import axios from 'axios';
import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { showNotification } from './Notification';

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      [`& .${getStylesRef('icon')}`]: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      },
    },
  },
}));

const data = [
  { link: '/welcome', label: 'Welcome', icon: IconBroadcast },
  { link: '/dashboard', label: 'Dashboard', icon: IconDeviceDesktopAnalytics },
  { link: '/devices', label: 'Devices', icon: IconCpu },
  { link: '/firmware', label: 'Firmware', icon: IconBox },
  { link: '/provision', label: 'Provisioning', icon: IconQrcode },
  { link: '/settings', label: 'Settings', icon: IconSettings },
];

export default function Navigator() {
  const { classes } = useStyles();
  const { user, setUser, setisAuthenticated } = useAuthContext();

  const logOutUser = useCallback(async () => {
    await axios.post('/api/users/logout', null, { headers: { Authorization: 'Bearer ' + user.accessToken }})
      .catch((err) => {
        showNotification(err.status, err.response.data.message);
      })
      .finally(() => {
        setUser(null);
        setisAuthenticated(false);
      })
  }, [user, setUser, setisAuthenticated])

  const links = data.map((item) => (
    <NavLink to={item.link}
      className={(navData) => (navData.isActive ? `${classes.linkActive} ${classes.link}` : classes.link)}
        key={item.label}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </NavLink>
  ));

  return (
    <Navbar height={500} width={{ sm: 200, lg: 300 }} p="md">
      <Navbar.Section grow>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <a href="/#" className={classes.link} onClick={() => logOutUser()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
}