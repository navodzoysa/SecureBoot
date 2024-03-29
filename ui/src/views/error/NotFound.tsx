import { createStyles, Container, Title, Text, Button, Group, rem, LoadingOverlay } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  inner: {
    position: 'relative',
  },

  image: {
    ...theme.fn.cover(),
    opacity: 0.75,
  },

  content: {
    paddingTop: rem(220),
    position: 'relative',
    zIndex: 1,

    [theme.fn.smallerThan('sm')]: {
      paddingTop: rem(120),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32),
    },
  },

  description: {
    maxWidth: rem(540),
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
}));

export function NotFound() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthContext();
      
  useEffect(() => {
    const loadData = async () => {
      await new Promise((r) => setTimeout(r, 250));
      setLoading(false);
    };
    loadData();
  }, [])

  return (
    <Container className={classes.root}>
      { !loading ?
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>Nothing to see here</Title>
            <Text color="dimmed" size="lg" align="center" className={classes.description}>
              Page you are trying to open does not exist. You may have mistyped the address, or the
              page has been moved to another URL. If you think this is an error contact support.
            </Text>
            <Group position="center">
              <Button color="teal" onClick={() => { navigate( isAuthenticated ? '/welcome' : '/login') }} size="md">Take me back to home page</Button>
            </Group>
          </div>
        </div>
        :
        <LoadingOverlay
          loaderProps={{ size: 'xl', color: 'teal', variant: 'oval' }}
          overlayOpacity={0.3}
          overlayColor="#c5c5c5"
          visible
        />
      }
    </Container>
  );
}