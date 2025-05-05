import { useParams, Link } from 'react-router-dom';
import { 
  Container, 
  Title, 
  Button, 
  Group, 
  Space, 
  Text, 
  Skeleton,
  Box
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { spaceXAPI } from '../../api/spaceXApi';
import LaunchDetails from '../../components/launches/LaunchDetails';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import { Localize } from '../../utils/localize';

const LaunchDetailPage = () => {
  const { launchId } = useParams<{ launchId: string }>();

  // Fetch launch details
  const { 
    data: launch, 
    isLoading: isLoadingLaunch, 
    error: launchError,
  } = useQuery(
    ['launch', launchId],
    () => spaceXAPI.getLaunchById(launchId!),
    {
      enabled: !!launchId
    }
  );

  // Fetch associated rocket if available
  const { 
    data: rocket, 
    isLoading: isLoadingRocket 
  } = useQuery(
    ['rocket', launch?.rocket],
    () => spaceXAPI.getRocketById(launch!.rocket),
    {
      enabled: !!launch?.rocket
    }
  );

  // Fetch associated launchpad if available
  const { 
    data: launchpad, 
    isLoading: isLoadingLaunchpad 
  } = useQuery(
    ['launchpad', launch?.launchpad],
    () => spaceXAPI.getLaunchpadById(launch!.launchpad),
    {
      enabled: !!launch?.launchpad
    }
  );

  const isLoading = isLoadingLaunch || isLoadingRocket || isLoadingLaunchpad;

  if (launchError) {
    return <ErrorDisplay message={'Error fetching launch details'} />;
  }

  if (isLoadingLaunch) {
    return <Loading />;
  }

  if (!launch) {
    return (
      <Layout>
        <Container size="md">
          <Title order={1}>{Localize.LaunchNotFound}</Title>
          <Space h="md" />
          <Text>The launch you are looking for could not be found.</Text>
          <Space h="xl" />
          <Button component={Link} to="/launches" leftIcon={<IconArrowLeft size={16} />}>
            {Localize.BackToLaunches}
          </Button>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container size="lg">
        <Group position="apart" mb="lg">
          <Title order={1}>{Localize.Launch}: {launch.name}</Title>
          <Button 
            component={Link} 
            to="/launches" 
            leftIcon={<IconArrowLeft size={16} />}
            variant="outline"
          >
            {Localize.BackToLaunches}
          </Button>
        </Group>

        {isLoading ? (
          <Box>
            <Skeleton height={400} radius="md" />
            <Space h="md" />
            <Skeleton height={200} radius="md" />
          </Box>
        ) : (
          <LaunchDetails 
            launch={launch} 
            rocket={rocket || null} 
            launchpad={launchpad || null} 
          />
        )}
      </Container>
    </Layout>
  );
};

export default LaunchDetailPage;