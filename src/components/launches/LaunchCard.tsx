import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Group,
  Text,
  Badge,
  Image,
  createStyles,
  Button,
  Stack
} from '@mantine/core';
import { IconRocket, IconCalendar, IconExternalLink } from '@tabler/icons-react';
import { Launch } from '../../types/spaceX.types';
import { formatDate } from '../../utils/dateFormatters';
import { Localize } from '../../utils/localize';

interface LaunchCardProps {
  launch: Launch;
  compact?: boolean;
}

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'transform 150ms ease, box-shadow 150ms ease',
    
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
  },
  label: {
    marginBottom: theme.spacing.xs,
    lineHeight: 1,
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    letterSpacing: -0.25,
    textTransform: 'uppercase',
  },
  section: {
    padding: theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
  statusBadge: {
    textTransform: 'uppercase',
  },
}));

const LaunchCard: FC<LaunchCardProps> = ({ launch, compact = false }) => {
  const { classes } = useStyles();
  
  const badges = (
    <Group position="apart" mt="md">
      <Badge 
        size="sm" 
        color={launch.success ? 'green' : launch.success === false ? 'red' : 'gray'}
        className={classes.statusBadge}
      >
        {launch.success ? Localize.Success : launch.success === false ? Localize.Failed: Localize.Unknown}
      </Badge>
      <Badge 
        size="sm" 
        color={launch.upcoming ? 'blue' : 'gray'}
        className={classes.statusBadge}
      >
        {launch.upcoming ? Localize.Upcoming : Localize.Completed}
      </Badge>
    </Group>
  );

  return (
    <Card shadow="sm" p="lg" radius="md" className={classes.card} withBorder>
      {/* Header with mission patch */}
      {launch.links.patch.small && !compact && (
        <Card.Section className={classes.imageSection} p="md">
          <Image
            src={launch.links.patch.small}
            alt={launch.name}
            width={compact ? 60 : 120}
            height={compact ? 60 : 120}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>)=>(e.currentTarget.src = '/src/public/images/space.png') }
            fit="contain"
          />
        </Card.Section>
      )}
      
      {/* Launch info */}
      <Stack spacing="xs" mt={compact ? "xs" : "md"}>
        <Text weight={700} size={compact ? "md" : "lg"} lineClamp={2}>
          {launch.name}
        </Text>
        
        <Group spacing="xs">
          <IconCalendar size={16} />
          <Text size="sm" color="dimmed">{formatDate(launch.date_utc)}</Text>
        </Group>
        
        {!compact && launch.details && (
          <Text size="sm" color="dimmed" lineClamp={3} mt="xs">
            {launch.details}
          </Text>
        )}
        
        {badges}
        
        {!compact && (
          <Group position="apart" mt="lg">
            <Button 
              variant="light" 
              color="blue" 
              fullWidth 
              radius="md" 
              leftIcon={<IconRocket size={16} />}
              component={Link}
              to={`/launches/${launch.id}`}
            >
            {Localize.Details}
            </Button>
            
            {launch.links.webcast && (
              <Button
                variant="outline" 
                color="gray"
                fullWidth 
                radius="md" 
                leftIcon={<IconExternalLink size={16} />}
                component="a"
                href={launch.links.webcast}
                target="_blank"
              >
          {Localize.Webcast}
              </Button>
            )}
          </Group>
        )}
      </Stack>
    </Card>
  );
};

export default LaunchCard;