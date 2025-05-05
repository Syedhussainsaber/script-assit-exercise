import { 
  Container, 
  Title, 
  Grid, 
  TextInput, 
  Group, 
  Switch, 
  Select, 
  Button, 
  Box, 
  Space, 
  Text, 
  Skeleton 
} from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { spaceXAPI } from '../../api/spaceXApi';
import RocketCard from '../../components/rockets/RocketCard';
import Layout from '../../components/common/Layout';
import { useFiltersStore } from '../../store/filterStore';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import { Localize } from '../../utils/localize';

const RocketsPage = () => {
  const { rocketFilters, setRocketFilters, resetRocketFilters } = useFiltersStore();
  
  // Fetch all rockets
  const { data: rockets, isLoading, error } = useQuery(
    ['rockets'],
    () => spaceXAPI.getAllRockets(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Filter rockets based on current filters
  const filteredRockets = rockets?.filter(rocket => {
    // Filter by search term
    if (rocketFilters.search && 
        !rocket.name.toLowerCase().includes(rocketFilters.search.toLowerCase()) &&
        !rocket.description.toLowerCase().includes(rocketFilters.search.toLowerCase())) {
      return false;
    }
    
    // Filter by active status
    if (rocketFilters.active !== null && rocket.active !== rocketFilters.active) {
      return false;
    }
    
    return true;
  });

  // Sort filtered rockets
  const sortedRockets = [...(filteredRockets || [])].sort((a, b) => {
    const aValue = a[rocketFilters.sort as keyof typeof a];
    const bValue = b[rocketFilters.sort as keyof typeof b];
    
    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return rocketFilters.order === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return rocketFilters.order === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const handleFilterChange = (key: string, value: any) => {
    setRocketFilters({ [key]: value });
  };

  // Handle status switch change (null = any, true = active, false = inactive)
  const handleStatusChange = () => {
    let newValue: boolean | null;
    
    if (rocketFilters.active === null) {
      newValue = true;
    } else if (rocketFilters.active === true) {
      newValue = false;
    } else {
      newValue = null;
    }
    
    setRocketFilters({ active: newValue });
  };

  const getStatusLabel = (): string => {
    if (rocketFilters.active === null) return 'Any Status';
    return rocketFilters.active ? 'Active Only' : 'Inactive Only';
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => (
        <Grid.Col key={index} xs={12} sm={6} lg={4} xl={3}>
          <Skeleton height={420} radius="md" />
        </Grid.Col>
      ));
  };

  if (error) {
    return <ErrorDisplay message ={'An error occurred while fetching data.'} />;
  }

  return (
    <Layout>
      <Container size="xl">
        <Title order={1} mb="md">{Localize.SpaceXRockets}</Title>
        
        <Box
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            padding: theme.spacing.md,
            borderRadius: theme.radius.md,
          })}
        >
          <Grid>
            <Grid.Col xs={12} md={4}>
              <TextInput
                label="Search rockets"
                placeholder="Enter rocket name"
                icon={<IconSearch size={14} />}
                value={rocketFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </Grid.Col>
            
            <Grid.Col xs={12} sm={6} md={3}>
              <Select
                label="Sort by"
                data={[
                  { value: 'name', label: Localize.Name },
                  { value: 'first_flight', label: Localize.FirstFlightDate },
                  { value: 'success_rate_pct', label: Localize.SuccessRate },
                  { value: 'cost_per_launch', label: Localize.CostPerLaunch}
                ]}
                value={rocketFilters.sort}
                onChange={(value) => handleFilterChange('sort', value || 'name')}
              />
            </Grid.Col>
            
            <Grid.Col xs={12} sm={6} md={3}>
              <Select
                label="Order"
                data={[
                  { value: 'asc', label: Localize.Ascending },
                  { value: 'desc', label: Localize.Descending }
                ]}
                value={rocketFilters.order}
                onChange={(value) => handleFilterChange('order', value as 'asc' | 'desc')}
              />
            </Grid.Col>
            
            <Grid.Col xs={12} md={2}>
              <Group position="right" mt={32}>
                <Button 
                  leftIcon={<IconX size={14} />} 
                  variant="light"
                  onClick={resetRocketFilters}
                >
                  {Localize.Reset}
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
          
          <Group position="left" mt="md">
            <Switch
              label={getStatusLabel()}
              checked={rocketFilters.active !== null}
              onChange={handleStatusChange}
            />
          </Group>
        </Box>
        
        <Space h="md" />
        
        <Grid>
          {isLoading ? (
            renderSkeletons()
          ) : sortedRockets && sortedRockets.length > 0 ? (
            sortedRockets.map((rocket) => (
              <Grid.Col key={rocket.id} xs={12} sm={6} lg={4} xl={3}>
                <RocketCard rocket={rocket} />
              </Grid.Col>
            ))
          ) : (
            <Grid.Col span={12}>
              <Box py="xl" sx={{ textAlign: 'center' }}>
                <Text size="lg">No rockets found matching your filters.</Text>
              </Box>
            </Grid.Col>
          )}
        </Grid>
      </Container>
    </Layout>
  );
};

export default RocketsPage;