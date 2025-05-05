import { useParams, useNavigate} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Group,
  Button,
  Title,
  Image,
  Text,
  Badge,
  Anchor,
  createStyles,
  Box,
  SimpleGrid
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconExternalLink,
  IconUser
} from '@tabler/icons-react';
import { spaceXAPI } from '../../api/spaceXApi';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import LaunchCard from '../../components/launches/LaunchCard';
import { CrewMember } from '../../types/spaceX.types';
import { Localize } from '../../utils/localize';

const useStyles = createStyles((theme) => ({
  container: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    display: 'flex',
    flexDirection: 'column',
  },
  backButton: {
    marginBottom: theme.spacing.md,
    alignSelf: 'flex-end',
  },
  section: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    [theme.fn.largerThan('sm')]: {
      flexDirection: 'row',
    },
  },
  imageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    [theme.fn.largerThan('sm')]: {
      marginBottom: 0,
      marginRight: theme.spacing.xl,
    },
  },
  detailsContainer: {
    flex: 2,
  },
  bioText: {
    marginTop: theme.spacing.md,
    lineHeight: 1.6,
  },
  badge: {
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
}));

const CrewDetailPage = () => {
  const { classes } = useStyles();
  const { crewId } = useParams();
  const navigate = useNavigate();

  const { data: crewMember, isLoading, error } = useQuery<CrewMember>(
    ['crew', crewId],
    () => spaceXAPI.getCrewMemberById(crewId || ''),
    {
      enabled: !!crewId,
    }
  );

  const { data: launches } = useQuery(
    ['crewLaunches', crewId],
    () => spaceXAPI.getLaunchesByCrewMemberId(crewId || ''),
    {
      enabled: !!crewId && !!crewMember,
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay message="Failed to load crew member details" />;
  }

  if (!crewMember) {
    return null;
  }

  return (
    <Layout>
      <Container className={classes.container} size="lg">
        <Button
          leftIcon={<IconArrowLeft size={16} />}
          variant="outline"
          onClick={() => navigate(-1)}
          className={classes.backButton}
        >
       {Localize.BackToCrew}
        </Button>

        <div className={classes.profileContainer}>
          <div className={classes.imageContainer}>
            {crewMember.image ? (
              <Image
                src={crewMember.image}
                alt={crewMember.name}
                radius="md"
                width={300}
                height={300}
                withPlaceholder
              />
            ) : (
              <Box
                sx={(theme) => ({
                  width: 300,
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
                  borderRadius: theme.radius.md,
                })}
              >
                <IconUser size={100} />
              </Box>
            )}
          </div>

          <div className={classes.detailsContainer}>
            <Title order={2} mb="sm">
              {crewMember.name}
            </Title>

            <Group mb="md">
              <Badge
                color={crewMember.status === 'active' ? 'green' : 'gray'}
                size="lg"
                className={classes.badge}
              >
                {crewMember.status.toUpperCase()}
              </Badge>
              <Badge color="blue" size="lg" className={classes.badge}>
                {crewMember.agency}
              </Badge>
            </Group>

            {crewMember.wikipedia && (
              <Anchor
                href={crewMember.wikipedia}
                target="_blank"
                rel="noopener noreferrer"
                mb="md"
                sx={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <IconExternalLink size={16} style={{ marginRight: 8 }} />
                {Localize.WikipediaProfile}
              </Anchor>
            )}

            <Text className={classes.bioText}>
              {crewMember.name} is a {crewMember.status} astronaut with {crewMember.agency}. 
              {crewMember.status === 'active' ? ' Currently active in missions.' : ''}
            </Text>
          </div>
        </div>

        {launches && launches.length > 0 && (
          <Box className={classes.section}>
            <Title order={3} mb="md">
             {Localize.Missions} ({launches.length})
            </Title>
            <SimpleGrid
              cols={1}
              spacing="lg"
              breakpoints={[
                { minWidth: 'sm', cols: 2 },
                { minWidth: 'md', cols: 3 },
              ]}
            >
              {launches.map((launch) => (
                <LaunchCard key={launch.id} launch={launch} />
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default CrewDetailPage;