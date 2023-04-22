import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  createStyles,
  rem,
  Flex,
  Avatar,
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
import BackgroundImage from '../../assets/images/micah-williams-unsplash.jpg'

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: rem(969),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage:
      `url(${BackgroundImage})`,
  },

  form: {
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: rem(969),
    maxWidth: rem(450),
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
    color: 'white',
    textAlign: 'center',
    padding: rem(5),
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    '&:hover': {
    backgroundColor:
      theme.colorScheme === 'light' ? theme.colors.dark[5] : theme.colors.blue[0],
    },
    fontSize: rem(9),
  }
}));

export default function Register() {
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
      registerUser(values);
    }
  }

  const registerUser = useCallback(async (values: any) => {
    await axios.post('/api/users/register', { email: values.email, password: values.password })
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
    <div className={classes.wrapper}>
      <Container size='xl' p={50}>
        <Flex justify='center' align='center' direction='column'>
          <Paper withBorder shadow="md" p={30} radius="md">
            <Flex direction='column' justify='center' align='center'>
              <Avatar size='lg' src={Logo} />
              <Title
                mt="md" mb="lg"
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
              >
                Register at SecureBoot!
              </Title>
            </Flex>
            <Text color="dimmed" size="sm" align="center" mt={5}>
              Already have an account?{' '}
              <NavLink to="/login" className={classes.link}>
                Log In
              </NavLink>
            </Text>
            <form onSubmit={form.onSubmit((values) => onFormSubmit(values))}>
              <TextInput label="Email" placeholder="hello@gmail.com" required {...form.getInputProps('email')} />
              <PasswordInput label="Password" placeholder="Your password" required mt="md" {...form.getInputProps('password')} />
              <Button fullWidth mt="xl" type="submit">
                Sign Up
              </Button>
            </form>
          </Paper>
        </Flex>
        <Box className={classes.imageCredits}>
          Photo by&nbsp;
          <Anchor
            color="white"
            href="https://unsplash.com/@mr_williams_photography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            target="_blank"
            rel="noreferrer"
          >
            Micah Williams
          </Anchor>
          &nbsp;on&nbsp;
          <Anchor
            color="white"
            href="https://unsplash.com/photos/lmFJOx7hPc4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            target="_blank"
            rel="noreferrer"
          >
            Unsplash
          </Anchor>
        </Box>
      </Container>
    </div>
  );
}