import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Grid,
  Space,
  Group,
  Text,
  Box,
  Skeleton,
  Select,
  TextInput,
  Button
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { IconSearch, IconFilterOff } from '@tabler/icons-react';
import { spaceXAPI } from '../../api/spaceXApi';
import { useFiltersStore } from '../../store/filterStore';
import Layout from '../../components/common/Layout';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import CrewCard from '../../components/crew/CrewCard';
import { Localize } from '../../utils/localize';

const CrewPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { crewFilters, setCrewFilters, resetCrewFilters } = useFiltersStore();
  const [urlInitialized, setUrlInitialized] = useState(false);
  const [agencies, setAgencies] = useState<string[]>([]);

  // Initialize filters from URL on first load
  useEffect(() => {
    if (!urlInitialized) {
      setUrlInitialized(true);
    }
  }, [searchParams, setCrewFilters, urlInitialized]);

  // Fetch crew members
  const { data: crewMembers, isLoading, error } = useQuery(
    ['crew', crewFilters],
    () => spaceXAPI.getAllCrew(),
    {
      enabled: urlInitialized,
      onSuccess: (data) => {
        const uniqueAgencies = [...new Set(data.map(member => member.agency))];
        setAgencies(uniqueAgencies);
      }
    }
  );

  // Filter crew members based on current filters
  const filteredCrew = crewMembers?.filter(member => {
    if (crewFilters.search && !member.name.toLowerCase().includes(crewFilters.search.toLowerCase())) {
      return false;
    }
    
    if (crewFilters.agency && member.agency !== crewFilters.agency) {
      return false;
    }

    if (crewFilters.status && member.status !== crewFilters.status) {
      return false;
    }
    
    return true;
  });


  // Sort crew members
  const sortedCrew = filteredCrew?.sort((a, b) => {
    const sortField = crewFilters.sort === 'name' ? 'name' : 'agency';
    const aValue = a[sortField].toLowerCase();
    const bValue = b[sortField].toLowerCase();
    
    return crewFilters.order === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });
  
  // Handle search input
  const handleSearch = (value: string) => {
    setCrewFilters({ search: value });
  };

  // Handle filter changes
  const handleAgencyChange = (value: string | null) => {
    setCrewFilters({ agency: value || '' });
  };

  const handleStatusChange = (value: string | null) => {
    setCrewFilters({ status: value || '' });
  };

  const handleSortChange = (value: string | null) => {
    if (value) {
      setCrewFilters({ sort: value });
    }
  };

  const handleOrderChange = (value: string | null) => {
    if (value === 'asc' || value === 'desc') {
      setCrewFilters({ order: value });
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    resetCrewFilters();
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <Grid.Col key={index} xs={12} sm={6} md={4} lg={3}>
          <Skeleton height={320} radius="md" />
        </Grid.Col>
      ));
  };

  if (error) {
    return <ErrorDisplay message={'An error occurred while fetching crew data.'} />;
  }

  return (
    <Layout>
      <Container size="xl">
        <Title order={1} mb="md">{Localize.SpaceXRockets}</Title>

        {/* Filters */}
        <Grid mb="md">
          <Grid.Col span={12} md={4}>
            <TextInput
              placeholder="Search by name"
              icon={<IconSearch size={16} />}
              value={crewFilters.search}
              onChange={(e) => handleSearch(e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={12} md={3}>
            <Select
              placeholder="Filter by agency"
              clearable
              data={agencies.map(agency => ({ value: agency, label: agency }))}
              value={crewFilters.agency}
              onChange={handleAgencyChange}
            />
          </Grid.Col>
          <Grid.Col span={12} md={3}>
            <Select
              placeholder="Filter by status"
              clearable
              data={[
                { value: 'active', label: Localize.Active },
                { value: 'inactive', label: Localize.Inactive },
                { value: 'retired', label: Localize.Retired }
              ]}
              value={crewFilters.status}
              onChange={handleStatusChange}
            />
          </Grid.Col>
          <Grid.Col span={12} md={2}>
            <Button 
              leftIcon={<IconFilterOff size={16} />}
              variant="light"
              onClick={handleResetFilters}
              fullWidth
            >
              {Localize.ResetFilters}
            </Button>
          </Grid.Col>
        </Grid>

        {/* Sort options */}
        <Group mb="xl">
          <Text size="sm" weight={500}>{Localize.SortBy}:</Text>
          <Select
            size="xs"
            style={{ width: 120 }}
            data={[
              { value: 'name', label: Localize.Name },
              { value: 'agency', label: Localize.Agency}
            ]}
            value={crewFilters.sort}
            onChange={handleSortChange}
          />
          <Select
            size="xs"
            style={{ width: 120 }}
            data={[
              { value: 'asc', label:  Localize.Ascending},
              { value: 'desc', label: Localize.Descending }
            ]}
            value={crewFilters.order}
            onChange={handleOrderChange}
          />
        </Group>       
        <Space h="md" />
        <Grid>
          {isLoading ? (
            renderSkeletons()
          ) : sortedCrew && sortedCrew.length > 0 ? (
            sortedCrew.map((crewMember) => (
              <Grid.Col key={crewMember.id} xs={12} sm={6} md={4} lg={3}>
                <CrewCard crewMember={crewMember} />
              </Grid.Col>
            ))
          ) : (
            <Grid.Col span={12}>
              <Box py="xl" sx={{ textAlign: 'center' }}>
                <Text size="lg">No crew members found matching your filters.</Text>
              </Box>
            </Grid.Col>
          )}
        </Grid>
      </Container>
    </Layout>
  );
};

export default CrewPage;