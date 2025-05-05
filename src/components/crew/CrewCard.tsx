import { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Avatar,
  Text,
  Badge,
  Group,
  Button,
  createStyles,
} from '@mantine/core';
import { IconRocket, IconUser } from '@tabler/icons-react';
import { CrewMember } from '../../types/spaceX.types';
import { Localize } from '../../utils/localize';

interface CrewCardProps {
  crewMember: CrewMember;
  launchCount?: number;
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
  avatarSection: {
    padding: theme.spacing.xl,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
  avatar: {
    border: `2px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
    }`,
    boxShadow: theme.shadows.sm,
  },
  content: {
    padding: theme.spacing.md,
    flex: 1,
  },
  footer: {
    padding: theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    marginTop: 'auto',
  },
}));

const CrewCard: FC<CrewCardProps> = ({ crewMember, launchCount }) => {
  const { classes } = useStyles();
  
  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.avatarSection}>
        {crewMember.image ? (
          <Avatar 
            src={crewMember.image} 
            size={120} 
            radius={120} 
            className={classes.avatar}
          />
        ) : (
          <Avatar 
            size={120} 
            radius={120} 
            className={classes.avatar}
          >
            <IconUser size={80} />
          </Avatar>
        )}
      </Card.Section>
      
      <div className={classes.content}>
        <Text weight={700} size="lg" align="center" mb="xs">
          {crewMember.name}
        </Text>
        
        <Group position="center" mb="md">
          <Badge color="blue">{crewMember.agency}</Badge>
          <Badge 
            color={crewMember.status === 'active' ? 'green' : 'gray'}
          >
            {crewMember.status}
          </Badge>
        </Group>
        
        {launchCount !== undefined && (
          <Group position="center" spacing="xs">
            <IconRocket size={16} />
            <Text size="sm">
              {launchCount} {launchCount === 1 ? Localize.Mission : Localize.Missions}
            </Text>
          </Group>
        )}
      </div>
      
      <Card.Section className={classes.footer}>
        <Group position="apart">
          <Text size="sm" color="dimmed">
       {Localize.SpaceXAstronaut}
          </Text>
          <Button
            component={Link}
            to={`/crew/${crewMember.id}`}
            compact
            variant="light"
          >
          {Localize.ViewProfile}
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
};

export default CrewCard;