import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  rem,
  Flex,
  Container,
  Avatar,
  Overlay,
  Box,
  Anchor,
} from '@mantine/core';
import { hasLength, isEmail, useForm } from '@mantine/form';
import axios from 'axios';
import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { showNotification } from '../../components/Notification';
import Logo from '../../assets/images/secureboot-logo.png';
import BackgroundImage from '../../assets/images/harrison-broadbent-unsplash.jpg';

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: rem(969),
  },

  hero: {
    position: 'relative',
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '80%',
  },

  container: {
    height: rem(700),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingBottom: `calc(${theme.spacing.xl} * 6)`,
    zIndex: 1,
    position: 'relative',

    [theme.fn.smallerThan('sm')]: {
      height: rem(500),
      paddingBottom: `calc(${theme.spacing.xl} * 3)`,
    },
  },

  headerTitle: {
    color: theme.white,
    fontSize: rem(60),
    fontWeight: 900,
    lineHeight: 1.1,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(40),
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    maxWidth: 600,

    [theme.fn.smallerThan('sm')]: {
      maxWidth: '100%',
      fontSize: theme.fontSizes.sm,
    },
  },

  form: {
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: rem(969),
    minWidth: rem(450),
    paddingTop: rem(80),

    [theme.fn.smallerThan('sm')]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
  link: {
    color: theme.colors.blue[7],
    textDecoration: 'inherit',
    fontWeight: 700,
  },
  imageCredits: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colorScheme === 'light' ? theme.colors.dark[6] : theme.colors.gray[0],
    color: 'white',
    textAlign: 'center',
    padding: rem(5),
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    '&:hover': {
    backgroundColor:
      theme.colorScheme === 'light' ? theme.colors.dark[5] : theme.colors.blue[0],
    },
    fontSize: rem(12),
  }
}));

export default function Login() {
  const { classes } = useStyles();
  const { setUser, setisAuthenticated } = useAuthContext();
  
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      keepMeLoggedIn: false,
    },
    validate: {
      email: isEmail('Invalid email'),
      password: hasLength({min: 8}, 'Password must be at least 8 characters'),
    },
  });

  const onFormSubmit = (values: any) => {
    if (values) {
      loginUser(values);
    }
  }

  const loginUser = useCallback(async (values: any) => {
    await axios.post('/api/users/login', { email: values.email, password: values.password })
      .then((response) => {
        if (response.status === 201) {
          const data = response.data;
          setUser(data);
          setisAuthenticated(true);
        } else {
          setUser((user: any) => {
            return { ...user, accessToken: null }
          });
          showNotification(response.status, response.data.message);
          setisAuthenticated(false);
        }
      })
      .catch((err) => {
        setUser((user: any) => {
          return { ...user, accessToken: null }
        });
        showNotification(err.status, err.response.data.message);
        setisAuthenticated(false);
      })
  }, [setUser, setisAuthenticated])

  return (
    <div className={classes.wrapper} >
      <Flex>
        <Paper className={classes.form} radius={0} p={30}>
          <Flex direction='column' justify='center' align='center'>
            <Avatar size='lg' src={Logo} />
            <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
              Welcome to SecureBoot!
            </Title>
          </Flex>

          <form onSubmit={form.onSubmit((values) => onFormSubmit(values))}>
            <TextInput label="Email" placeholder="hello@gmail.com" size="md" {...form.getInputProps('email')} />
            <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" {...form.getInputProps('password')} />
            <Checkbox label="Keep me logged in" mt="xl" size="md" {...form.getInputProps('keepMeLoggedIn', { type: 'checkbox' })} />
            <Button fullWidth mt="xl" size="md" type="submit">
              Login
            </Button>
          </form>

          <Text ta="center" mt="md">
            Don&apos;t have an account?{' '}
            <NavLink to="/register" className={classes.link}>
              Register
            </NavLink>
          </Text>
        </Paper>
        <div className={classes.hero} aria-label='hello'>
          <Overlay
            gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 700%)"
            opacity={1}
            zIndex={0}
          />
          <Container className={classes.container}>
            <Title className={classes.headerTitle}>A fully featured React components library</Title>
            <Text className={classes.description} size="xl" mt="xl">
              Build fully functional accessible web applications faster than ever – Mantine includes
              more than 120 customizable components and hooks to cover you in any situation
            </Text>
          </Container>
        </div>
      </Flex>
      <Box className={classes.imageCredits}>
        Photo by&nbsp;
        <Anchor
          color="white"
          href="https://unsplash.com/@harrisonbroadbent?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          target="_blank"
          rel="noreferrer"
        >
          Harrison Broadbent
        </Anchor>
        &nbsp;on&nbsp;
        <Anchor
          color="white"
          href="https://unsplash.com/photos/hSHNPyND_dU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          target="_blank"
          rel="noreferrer"
        >
          Unsplash
        </Anchor>
      </Box>
    </div >
	);
}