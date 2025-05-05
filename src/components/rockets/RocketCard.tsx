import { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  createStyles,
  Button,
  Stack,
} from '@mantine/core';
import { IconCalendar, IconRuler, IconWeight } from '@tabler/icons-react';
import { Rocket } from '../../types/spaceX.types';
import { Localize } from '../../utils/localize';

interface RocketCardProps {
  rocket: Rocket;
}

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'transform 150ms ease, box-shadow 150ms ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    
    '&:hover': {
      transform: 'scale(1.01)',
      boxShadow: theme.shadows.md,
    },
  },
  imageSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    height: 220
  },
  section: {
    padding: theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
  footer: {
    marginTop: 'auto',
    padding: theme.spacing.md,
  },
  specGroup: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  specIcon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
  }
}));

const RocketCard: FC<RocketCardProps> = ({ rocket }) => {
  const { classes } = useStyles();
  
  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        {rocket?.flickr_images && rocket.flickr_images[0] ? (
          <Image
            src={rocket.flickr_images[0]}
            height={220}
            fit="cover"
            alt={rocket.name}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>)=>(e.currentTarget.src = '/src/public/images/space.png') }
            withPlaceholder
          />
        ) : (
          <Text size="xl" color="dimmed">No image available</Text>
        )}
      </Card.Section>
      
      <Card.Section p="md">
        <Group position="apart" mb="xs">
          <Text weight={700} size="lg">{rocket.name}</Text>
          <Badge color={rocket.active ? 'green' : 'gray'}>
            {rocket.active ? 'Active' : 'Inactive'}
          </Badge>
        </Group>
        
        <Text lineClamp={2} color="dimmed" size="sm" mb="md">
          {rocket.description}
        </Text>
        
        <Stack spacing="xs">
          <Group className={classes.specGroup}>
            <IconCalendar size={16} className={classes.specIcon} />
            <Text size="sm">First Flight: {new Date(rocket.first_flight).toLocaleDateString()}</Text>
          </Group>

          <Group className={classes.specGroup}>
            <IconRuler size={16} className={classes.specIcon} />
            <Text size="sm">Height: {rocket.height.meters}m</Text>
          </Group>

          <Group className={classes.specGroup}>
            <IconWeight size={16} className={classes.specIcon} />
            <Text size="sm">Mass: {rocket.mass.kg.toLocaleString()}kg</Text>
          </Group>
        </Stack>
      </Card.Section>
      
      <Card.Section className={classes.footer}>
        <Group position="apart">
          <Text size="sm" color="dimmed">
            Success Rate: {rocket.success_rate_pct}%
          </Text>
          <Button 
            component={Link}
            to={`/rockets/${rocket.id}`}
            compact
            variant="light"
          >
           {Localize.ViewDetails}
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
};

export default RocketCard;