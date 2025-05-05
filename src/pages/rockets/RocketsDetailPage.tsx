import { useParams, Link } from 'react-router-dom';
import { 
  Container, 
  Title, 
  Button, 
  Group, 
  Text, 
  Space, 
  Skeleton,
  Box
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { spaceXAPI } from '../../api/spaceXApi';
import RocketDetails from '../../components/rockets/RocketDetails'
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import { Localize } from '../../utils/localize';

const RocketDetailPage = () => {
  const { rocketId } = useParams<{ rocketId: string }>();

  // Fetch rocket details
  const { 
    data: rocket, 
    isLoading: isLoadingRocket, 
    error: rocketError 
  } = useQuery(
    ['rocket', rocketId],
    () => spaceXAPI.getRocketById(rocketId!),
    {
      enabled: !!rocketId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch launches using this rocket for data enrichment
  const { 
    data: launches, 
    isLoading: isLoadingLaunches
  } = useQuery(
    ['rocketLaunches', rocketId],
    () => spaceXAPI.getLaunchesByRocketId(rocketId!),
    {
      enabled: !!rocketId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const isLoading = isLoadingRocket || isLoadingLaunches;

  if (rocketError) {
    return <ErrorDisplay error={rocketError as Error} />;
  }

  if (isLoadingRocket) {
    return <Loading />;
  }

  if (!rocket) {
    return (
      <Layout>
        <Container size="md">
          <Title order={1}>{Localize.RocketNotFound}</Title>
          <Space h="md" />
          <Text>The rocket you are looking for could not be found.</Text>
          <Space h="xl" />
          <Button component={Link} to="/rockets" leftIcon={<IconArrowLeft size={16} />}>
{Localize.BackToRockets}
          </Button>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container size="lg">
        <Group position="apart" mb="lg">
          <Title order={1}>{Localize.Rocket}: {rocket.name}</Title>
          <Button 
            component={Link} 
            to="/rockets" 
            leftIcon={<IconArrowLeft size={16} />}
            variant="outline"
          >
      {Localize.BackToRockets}
          </Button>
        </Group>

        {isLoading ? (
          <Box>
            <Skeleton height={400} radius="md" />
            <Space h="md" />
            <Skeleton height={200} radius="md" />
          </Box>
        ) : (
          <RocketDetails rocket={rocket} launches={launches} />
        )}
      </Container>
    </Layout>
  );
};

export default RocketDetailPage;