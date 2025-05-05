import { FC } from 'react';
import { 
  Paper, 
  Avatar, 
  Text, 
  Title, 
  Group, 
  Badge, 
  Grid, 
  Stack, 
  Anchor, 
  Space, 
  createStyles,
  Box
} from '@mantine/core';
import { 
  IconBuildingFactory, 
  IconRocket, 
  IconUser, 
  IconBrandWikipedia, 
  IconCalendar
} from '@tabler/icons-react';
import { CrewMember, Launch } from '../../types/spaceX.types';
import { formatShortDate } from '../../utils/dateFormatters';
import { Localize } from '../../utils/localize';

interface CrewDetailsProps {
  crewMember: CrewMember;
  launches?: Launch[];
}

const useStyles = createStyles((theme) => ({
  paper: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
  },
  avatar: {
    border: `4px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
    }`,
    boxShadow: theme.shadows.md,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1],
  },
  profileInfo: {
    marginLeft: theme.spacing.xl,
    [theme.fn.smallerThan('sm')]: {
      marginLeft: 0,
      marginTop: theme.spacing.md,
    },
  },
  section: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
  mission: {
    padding: theme.spacing.md,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  missionTitle: {
    marginBottom: theme.spacing.xs,
  }
}));

const CrewDetails: FC<CrewDetailsProps> = ({ crewMember, launches }) => {
  const { classes } = useStyles();

  return (
    <Paper className={classes.paper} shadow="md">
      <Grid>
        <Grid.Col sm={12} md="auto">
          {crewMember.image ? (
            <Avatar 
              src={crewMember.image} 
              size={200} 
              radius={100} 
              className={classes.avatar}
            />
          ) : (
            <Avatar 
              size={200} 
              radius={100} 
              className={classes.avatar}
            >
              <IconUser size={120} />
            </Avatar>
          )}
        </Grid.Col>
        
        <Grid.Col sm={12} md="auto" className={classes.profileInfo}>
          <Title order={2}>{crewMember.name}</Title>
          <Space h="md" />
          
          <Group spacing="md">
            <Badge size="lg" color="blue">
              {crewMember.agency}
            </Badge>
            
            <Badge 
              size="lg"
              color={crewMember.status === 'active' ? 'green' : 'gray'}
            >
              {crewMember.status}
            </Badge>
          </Group>
          
          <Space h="md" />
          
          <Group spacing="xl">
            <Group spacing="xs">
              <IconBuildingFactory size={18} />
              <Text>Agency: {crewMember.agency}</Text>
            </Group>
            
            <Group spacing="xs">
              <IconRocket size={18} />
              <Text>{Localize.Missions}: {launches?.length || 0}</Text>
            </Group>
          </Group>
          
          {crewMember.wikipedia && (
            <Anchor href={crewMember.wikipedia} target="_blank" mt="md">
              <Group spacing="xs">
                <IconBrandWikipedia size={18} />
                <Text>{Localize.Wikipedia}</Text>
              </Group>
            </Anchor>
          )}
        </Grid.Col>
      </Grid>

      {launches && launches.length > 0 && (
        <div className={classes.section}>
          <Title order={3} mb="md">{Localize.Missions}</Title>
          
          <Stack spacing="md">
            {launches.map((launch) => (
              <Box key={launch.id} className={classes.mission}>
                <Group position="apart" className={classes.missionTitle}>
                  <Title order={4}>{launch.name}</Title>
                  <Badge 
                    color={
                      launch.upcoming ? 'blue' : 
                      launch.success === true ? 'green' : 
                      launch.success === false ? 'red' : 'gray'
                    }
                  >
                    {launch.upcoming ? Localize.Upcoming : 
                     launch.success === true ? Localize.Success : 
                     launch.success === false ? Localize.Failed : Localize.Unknown}
                  </Badge>
                </Group>
                
                <Group spacing="xl" mt="xs">
                  <Group spacing="xs">
                    <IconCalendar size={16} />
                    <Text size="sm">{formatShortDate(launch.date_utc)}</Text>
                  </Group>
                  
                  <Group spacing="xs">
                    <IconRocket size={16} />
                    <Text size="sm">Flight #{launch.flight_number}</Text>
                  </Group>
                </Group>
                
                {launch.details && (
                  <Text size="sm" mt="md" color="dimmed">
                    {launch.details}
                  </Text>
                )}
                
                <Group mt="md">
                  <Anchor href={`/launches/${launch.id}`} size="sm">
                  {Localize.ViewMissionDetails}
                  </Anchor>
                </Group>
              </Box>
            ))}
          </Stack>
        </div>
      )}
    </Paper>
  );
};

export default CrewDetails;