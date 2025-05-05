import { FC } from 'react';
import {useQuery} from '@tanstack/react-query';
import {
  Title,
  Text,
  SimpleGrid,
  Paper,
  Group,
  ThemeIcon,
  RingProgress,
  Stack,
  Card,
  createStyles,
  Badge,
  Button,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { 
  IconRocket, 
  IconUsers, 
  IconCalendarEvent, 
  IconChevronRight,
} from '@tabler/icons-react';
import { spaceXAPI } from '../../api/spaceXApi';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import { formatShortDate } from '../../utils/dateFormatters';
import { Localize } from '../../utils/localize';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },

  item: {
    borderRadius: theme.radius.md,
    transition: 'transform 150ms ease, box-shadow 150ms ease',
    padding: theme.spacing.sm,
    
    '&:hover': {
      transform: 'scale(1.01)',
      boxShadow: theme.shadows.md,
    },
  },

  statsCard: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },

  statsRing: {
    flex: 0,
  },

  statsValue: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1,
  },

  statsLabel: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
    fontWeight: 600,
    fontSize: theme.fontSizes.sm,
    marginBottom: 5,
  },

  statsDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[7],
  },
}));


const Center = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      {children}
    </div>
  );
  
const Dashboard: FC = () => {
  const { classes } = useStyles();

  const {
    data: launches,
    isLoading: launchesLoading,
    error: launchesError,
    refetch: refetchLaunches,
  } = useQuery(['launches'], () => spaceXAPI.getAllLaunches());

  const {
    data: rockets,
    isLoading: rocketsLoading,
    error: rocketsError,
    refetch: refetchRockets,
  } = useQuery(['rockets'], () => spaceXAPI.getAllRockets());

  const {
    data: crew,
    isLoading: crewLoading,
    error: crewError,
    refetch: refetchCrew,
  } = useQuery(['crew'], () => spaceXAPI.getAllCrew());

  const isLoading = launchesLoading || rocketsLoading || crewLoading;
  const hasError = launchesError || rocketsError || crewError;

  if (isLoading) {
    return (
      <Layout>
        <Loading text="Loading dashboard data..." />
      </Layout>
    );
  }

  if (hasError) {
    return (
      <Layout>
        <ErrorDisplay 
          message="Failed to load dashboard data." 
          onRetry={() => {
            refetchLaunches();
            refetchRockets();
            refetchCrew();
          }}
        />
      </Layout>
    );
  }

  // Calculate stats
  const totalLaunches = launches?.length || 0;
  const successfulLaunches = launches?.filter(launch => launch.success).length || 0;
  const successRate = totalLaunches > 0 ? (successfulLaunches / totalLaunches) * 100 : 0;
  const activeRockets = rockets?.filter(rocket => rocket.active).length || 0;
  const totalRockets = rockets?.length || 0;
  const activeCrewMembers = crew?.filter(member => member.status === 'active').length || 0;
  const totalCrewMembers = crew?.length || 0;

  return (
    <Layout>
      <Stack spacing="xl">
        <Title order={2}>{Localize.Dashboard}</Title>
        
        {/* Stats Cards */}
        <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          <Paper className={classes.statsCard} shadow="xs">
            <Group position="apart">
              <div>
                <Text className={classes.statsLabel}>{Localize.Launches}</Text>
                <Text className={classes.statsValue}>{totalLaunches}</Text>
                <Text className={classes.statsDescription}>
                  {successfulLaunches} successful ({successRate.toFixed(0)}%)
                </Text>
              </div>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: successRate, color: 'primary' }]}
                label={
                  <Center>
                    <IconRocket size={22} />
                  </Center>
                }
                className={classes.statsRing}
              />
            </Group>
          </Paper>

          <Paper className={classes.statsCard} shadow="xs">
            <Group position="apart">
              <div>
                <Text className={classes.statsLabel}>{Localize.Rockets}</Text>
                <Text className={classes.statsValue}>{totalRockets}</Text>
                <Text className={classes.statsDescription}>
                  {activeRockets} active rockets
                </Text>
              </div>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: (activeRockets / totalRockets) * 100, color: 'primary' }]}
                label={
                  <Center>
                    <IconRocket size={22} />
                  </Center>
                }
                className={classes.statsRing}
              />
            </Group>
          </Paper>

          <Paper className={classes.statsCard} shadow="xs">
            <Group position="apart">
              <div>
                <Text className={classes.statsLabel}>{Localize.CrewMembers}</Text>
                <Text className={classes.statsValue}>{totalCrewMembers}</Text>
                <Text className={classes.statsDescription}>
                  {activeCrewMembers} active crew members
                </Text>
              </div>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: (activeCrewMembers / totalCrewMembers) * 100, color: 'primary' }]}
                label={
                  <Center>
                    <IconUsers size={22} />
                  </Center>
                }
                className={classes.statsRing}
              />
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Recent Launches */}
        <Card p="md" shadow="xs">
          <Card.Section px="md" py="sm" className={classes.section}>
            <Group position="apart">
              <Title order={4}>{Localize.RecentLaunches}</Title>
              <Button 
                component={Link}
                to="/launches"
                variant="subtle"
                rightIcon={<IconChevronRight size={16} />}
                size="xs"
              >
                {Localize.ViewAll}
              </Button>
            </Group>
          </Card.Section>

          <Stack spacing="md">
            {launches?.map((launch) => (
              <Paper key={launch.id} className={classes.item} withBorder p="md">
                <Group position="apart">
                  <div>
                    <Group>
                      <Title order={5}>{launch.name}</Title>
                      <Badge 
                        color={launch.success ? 'green' : launch.success === false ? 'red' : 'gray'}
                      >
                        {launch.success ? Localize.Success : launch.success === false ? Localize.Failed : Localize.Unknown}
                      </Badge>
                    </Group>
                    <Text size="sm" color="dimmed">
                      {formatShortDate(launch.date_utc)}
                    </Text>
                  </div>
                  <Button 
                    component={Link}
                    to={`/launches/${launch.id}`}
                    variant="light"
                    size="xs"
                  >
                    {Localize.ViewDetails}
                  </Button>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Card>

        <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          <Card p="md" shadow="xs" component={Link} to="/launches" className={classes.card}>
            <Group>
              <ThemeIcon size="lg" radius="md" variant="light">
                <IconCalendarEvent />
              </ThemeIcon>
              <div>
                <Text weight={500}>{Localize.BrowseLaunches}</Text>
                <Text size="sm" color="dimmed">{Localize.ViewAllLaunches}</Text>
              </div>
            </Group>
          </Card>

          <Card p="md" shadow="xs" component={Link} to="/rockets" className={classes.card}>
            <Group>
              <ThemeIcon size="lg" radius="md" variant="light">
                <IconRocket />
              </ThemeIcon>
              <div>
                <Text weight={500}>{Localize.ExploreRockets}</Text>
                <Text size="sm" color="dimmed">{Localize.LearnAboutRockets}</Text>
              </div>
            </Group>
          </Card>

          <Card p="md" shadow="xs" component={Link} to="/crew" className={classes.card}>
            <Group>
              <ThemeIcon size="lg" radius="md" variant="light">
                <IconUsers />
              </ThemeIcon>
              <div>
                <Text weight={500}>{Localize.MeetTheCrew}</Text>
                <Text size="sm" color="dimmed">{Localize.DiscoverSpaceXAstronauts}</Text>
              </div>
            </Group>
          </Card>
        </SimpleGrid>
      </Stack>
    </Layout>
  );
};

export default Dashboard;