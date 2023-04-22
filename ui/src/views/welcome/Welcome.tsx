import {
  createStyles,
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
} from '@mantine/core';
import { IconGauge, IconUser, IconCookie } from '@tabler/icons-react';

const mockdata = [
  {
    title: 'Security First',
    description:
      'This dust is actually a powerful poison that will even make a pro wrestler sick, Regice cloaks itself with frigid air of -328 degrees Fahrenheit',
    icon: IconGauge,
  },
  {
    title: 'Privacy Focused',
    description:
      'People say it can run at the same speed as lightning striking, Its icy body is so cold, it will not melt even if it is immersed in magma',
    icon: IconUser,
  },
  {
    title: 'No Third Parties',
    description:
      'They’re popular, but they’re rare. Trainers who show them off recklessly may be targeted by thieves',
    icon: IconCookie,
  },
];

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(34),
    fontWeight: 900,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(24),
    },
  },

  description: {
    maxWidth: 600,
    margin: 'auto',

    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.colors.teal[5],
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },

  card: {
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  cardTitle: {
    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.colors.teal[5],
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
    },
  },
}));

export default function Welcome() {
  const { classes, theme } = useStyles();
  const features = mockdata.map((feature) => (
    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
      <feature.icon size={rem(50)} stroke={2} color={theme.colors.teal[5]} />
      <Text fz="xl" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="md" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="xl" py="xl">
      <Group position="center">
        <Badge variant="filled" size="xl" color='teal'>
          Secure Firmware Updates
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="xl">
        Update your devices Over-the-Air with Security
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="xl">
        Every once in a while, you’ll see a Golbat that’s missing some fangs. This happens when
        hunger drives it to try biting a Steel-type Pokémon.
      </Text>

      <SimpleGrid cols={3} spacing="xl" mt={50} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
        {features}
      </SimpleGrid>
    </Container>
  );
}