import { useEffect, useState } from 'react';
import { 
  Container, 
  Title, 
  Grid, 
  Space, 
  Pagination as MantinePagination, 
  Group, 
  Text, 
  Box,
  Skeleton,
  MediaQuery,
  useMantineTheme 
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { spaceXAPI } from '../../api/spaceXApi';
import LaunchCard from '../../components/launches/LaunchCard';
import LaunchFilter from '../../components/launches/LaunchFilters';
import { useFiltersStore } from '../../store/filterStore';
import { searchParamsToFilters, filtersToSearchParams } from '../../utils/urlUtils';
import Layout from '../../components/common/Layout';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import { Localize } from '../../utils/localize';

const Pagination = ({ 
  total, 
  page, 
  onChange, 
  ...props 
}: { 
  total: number; 
  page: number; 
  onChange: (page: number) => void;
  [key: string]: any;
}) => {
  return (
    <MantinePagination
      total={total}
      value={page}
      onChange={onChange}
      {...props}
    />
  );
};

const LaunchesPage = () => {
  const theme = useMantineTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const { launchFilters, setLaunchFilters } = useFiltersStore();
  const [urlInitialized, setUrlInitialized] = useState(false);
  const [filteredLaunches, setFilteredLaunches] = useState<any[]>([]);

  // Initialize filters from URL on first load
  useEffect(() => {
    if (!urlInitialized) {
      const urlFilters = searchParamsToFilters(searchParams);
      if (Object.keys(urlFilters).length > 0) {
        setLaunchFilters(urlFilters);
      }
      setUrlInitialized(true);
    }
  }, [searchParams, setLaunchFilters, urlInitialized]);

  // Update URL when filters change
  useEffect(() => {
    if (urlInitialized) {
      const params = filtersToSearchParams(launchFilters);
      setSearchParams(params);
    }
  }, [launchFilters, setSearchParams, urlInitialized]);

  // Fetch all launches (no filtering on API side)
  const { data: allLaunches, isLoading, error } = useQuery(
    ['launches'],
    () => spaceXAPI.getAllLaunches(),
    {
      enabled: urlInitialized,
      keepPreviousData: true
    }
  );

  // Apply filters to the data
  useEffect(() => {
    if (allLaunches && urlInitialized) {
      let filtered = [...allLaunches];
      
      // Apply search filter
      if (launchFilters.search) {
        const searchTerm = launchFilters.search.toLowerCase();
        filtered = filtered.filter(launch => 
          launch.name.toLowerCase().includes(searchTerm) ||
          (launch.details && launch.details.toLowerCase().includes(searchTerm)) ||
          (launch.rocket && launch.rocket?.toLowerCase().includes(searchTerm)))
      }
      
      // Apply year filter
      if (launchFilters.year) {
        filtered = filtered.filter(launch => {
          const launchYear = new Date(launch.date_utc).getFullYear();
          return launchYear === launchFilters.year;
        });
      }
      
      // Apply success filter
      if (launchFilters.success !== null) {
        filtered = filtered.filter(launch => launch.success === launchFilters.success);
      }
      
      // Apply upcoming filter
      if (launchFilters.upcoming !== null) {
        filtered = filtered.filter(launch => launch.upcoming === launchFilters.upcoming);
      }
      
      // Apply sorting
      if (launchFilters.sort) {
        filtered.sort((a, b) => {
        switch (launchFilters.sort) {
            case 'name':
              return launchFilters.order === 'asc' 
                ? a.name.localeCompare(b.name) 
                : b.name.localeCompare(a.name);
            
            case 'flight_number':
              return launchFilters.order === 'asc' 
                ? a.flight_number - b.flight_number 
                : b.flight_number - a.flight_number;
            
            case 'date_utc':
              const aDate = new Date(a.date_utc).getTime();
              const bDate = new Date(b.date_utc).getTime();
              return launchFilters.order === 'asc' 
                ? aDate - bDate 
                : bDate - aDate;
            
            default:
              return 0;
          }          
          return 0;
        });
      }
      
      setFilteredLaunches(filtered);
    }
  }, [allLaunches, launchFilters, urlInitialized]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setLaunchFilters({ ...launchFilters, page });
  };

  // Calculate paginated data
  const paginatedLaunches = filteredLaunches.slice(
    (launchFilters.page - 1) * launchFilters.limit,
    launchFilters.page * launchFilters.limit
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredLaunches.length / launchFilters.limit);

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(launchFilters.limit || 10)
      .fill(0)
      .map((_, index) => (
        <Grid.Col key={index} xs={12} sm={6} md={6} lg={4}>
          <Skeleton height={350} radius="md" />
        </Grid.Col>
      ));
  };

  if (error) {
    return <ErrorDisplay message={'An error occurred while fetching data.'} />;
  }

  return (
    <Layout>
      <Container size="xl">
        <Title order={1} mb="md">{Localize.SpaceXLaunches}</Title>
        <LaunchFilter />
        <Space h="md" />
        
        <Grid>
          {isLoading ? (
            renderSkeletons()
          ) : paginatedLaunches && paginatedLaunches.length > 0 ? (
            paginatedLaunches.map((launch) => (
              <Grid.Col key={launch.id} xs={12} sm={6} md={6} lg={4}>
                <LaunchCard launch={launch} />
              </Grid.Col>
            ))
          ) : (
            <Grid.Col span={12}>
              <Box py="xl" sx={{ textAlign: 'center' }}>
                <Text size="lg">No launches found matching your filters.</Text>
              </Box>
            </Grid.Col>
          )}
        </Grid>
        
        <Space h="md" />
        
        <MediaQuery smallerThan="xs" styles={{ flexDirection: 'column', alignItems: 'center', gap: theme.spacing.md }}>
          <Group position="center" mt="xl">
            <Pagination
              total={totalPages}
              page={launchFilters.page}
              onChange={handlePageChange}
              size="md"
              radius="md"
            />
            <Text color="dimmed" size="sm">
              Showing {filteredLaunches.length ? (launchFilters.page - 1) * launchFilters.limit + 1 : 0}-
              {Math.min(launchFilters.page * launchFilters.limit, filteredLaunches.length)} of {filteredLaunches.length} launches
            </Text>
          </Group>
        </MediaQuery>
      </Container>
    </Layout>
  );
};

export default LaunchesPage;