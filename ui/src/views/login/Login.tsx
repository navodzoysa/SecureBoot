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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: rem(900),
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
  },

  form: {
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: rem(900),
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

export default function Login(props: any) {
  const { classes } = useStyles();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      keepMeLoggedIn: false,
    },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });
  const onSubmit = () => {
    auth.signin(form.values.email, () => { 
      props.setIsNotAuthenticated(false);
      navigate(from, { replace: true });
    })
  }

	return (
		<div className={classes.wrapper}>
		<Paper className={classes.form} radius={0} p={30}>
			<Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
			Welcome to SecureBoot!
			</Title>

      <form onSubmit={form.onSubmit(() => onSubmit())}>
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
		</div>
	);
}