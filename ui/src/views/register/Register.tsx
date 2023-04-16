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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: rem(920),
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
  },

  form: {
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: rem(920),
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
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value: string) => (value ? null : 'Invalid password'),
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
          setisAuthenticated(false);
        }
      })
      .catch((err) => {
        setUser((user: any) => {
          return { ...user, accessToken: null }
        });
        setisAuthenticated(false);
      })
  }, [setUser, setisAuthenticated])

  return (
    <div className={classes.wrapper}>
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
        >
          Register at SecureBoot!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Already have an account?{' '}
          <NavLink to="/login" className={classes.link}>
            Log In
          </NavLink>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit((values) => onFormSubmit(values))}>
            <TextInput label="Email" placeholder="hello@gmail.com" required {...form.getInputProps('email')} />
            <PasswordInput label="Password" placeholder="Your password" required mt="md" {...form.getInputProps('password')} />
            {/* <Group position="apart" mt="lg">
              <Checkbox label="Remember me" />
              <Anchor component="button" size="sm">
                Forgot password?
              </Anchor>
            </Group> */}
            <Button fullWidth mt="xl" type="submit">
              Sign Up
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}