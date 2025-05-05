import { FC, useEffect } from 'react';
import {
  TextInput,
  Group,
  Select,
  Button,
  Box,
  NumberInput,
  SegmentedControl,
  Accordion,
  createStyles,
  Paper,
  MediaQuery,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconFilter, IconSearch, IconX } from '@tabler/icons-react';
import { useFiltersStore, LaunchFilters } from '../../store/filterStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { filtersToSearchParams, searchParamsToFilters } from '../../utils/urlUtils';
import { Localize } from '../../utils/localize';

const useStyles = createStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing.md,
  },
  accordion: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  responsiveGroup: {
    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
    },
  },
  responsiveSegment: {
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },
  filterButton: {
    [theme.fn.smallerThan('xs')]: {
      width: '100%',
    },
  }
}));

const LaunchFilter: FC = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const { launchFilters, setLaunchFilters, resetLaunchFilters } = useFiltersStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Generate year options: (first SpaceX launch) to current year
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 2006 + 1 },
    (_, i) => ({ value: (2006 + i).toString(), label: (2006 + i).toString() })
  ).reverse();

  const form = useForm<LaunchFilters>({
    initialValues: launchFilters,
  });

  // Update form when filters change (e.g., from URL params)
  useEffect(() => {
    form.setValues(launchFilters);
  }, [launchFilters]);

  // Parse URL search params on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const parsedFilters = searchParamsToFilters(searchParams);
    if (Object.keys(parsedFilters).length > 0) {
      setLaunchFilters(parsedFilters);
    }
  }, []);

  const handleSubmit = (values: typeof form.values) => {
    setLaunchFilters(values);
    
    // Update URL with filter params
    const searchParams = filtersToSearchParams(values);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    });
  };

  const handleReset = () => {
    resetLaunchFilters();
    form.reset();
    navigate(location.pathname);
  };

  const handleQuickFilter = (filter: 'upcoming' | 'success' | 'failure') => {
    let updates: Partial<LaunchFilters> = {};
    
    if (filter === 'upcoming') {
      updates = { upcoming: true, success: null };
    } else if (filter === 'success') {
      updates = { success: true, upcoming: false };
    } else if (filter === 'failure') {
      updates = { success: false, upcoming: false };
    }
    
    const newFilters = { ...launchFilters, ...updates };
    setLaunchFilters(newFilters);
    form.setValues(newFilters);
    
    // Update URL with filter params
    const searchParams = filtersToSearchParams(newFilters);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    });
  };

  return (
    <Paper withBorder p="md" radius="md" className={classes.paper}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <MediaQuery smallerThan="xs" styles={{ flexDirection: 'column', gap: theme.spacing.sm }}>
          <Group mb="md">
            <TextInput
              placeholder="Search launches"
              icon={<IconSearch size={14} />}
              sx={{ flex: 1 }}
              {...form.getInputProps('search')}
            />
            
            <MediaQuery smallerThan="xs" styles={{ width: '100%', display: 'flex', gap: theme.spacing.xs }}>
              <Group>
                <Button type="submit" variant="filled" className={classes.filterButton}>
                 {Localize.ApplyFilers}
                </Button>
                
                <Button
                  variant="light"
                  color="gray"
                  leftIcon={<IconX size={14} />}
                  onClick={handleReset}
                  className={classes.filterButton}
                >
                  {Localize.Reset}
                </Button>
              </Group>
            </MediaQuery>
          </Group>
        </MediaQuery>
        
        <Accordion 
          variant="filled" 
          defaultValue="filters"
          classNames={{ item: classes.accordion }}
        >
          <Accordion.Item value="filters">
            <Accordion.Control icon={<IconFilter size={16} />}>
              Advanced Filters
            </Accordion.Control>
            <Accordion.Panel>
              <MediaQuery smallerThan="sm" styles={{ flexDirection: 'column' }}>
                <Group position="apart" grow className={classes.responsiveGroup}>
                  <Select
                    label="Launch Year"
                    placeholder="Select year"
                    clearable
                    data={yearOptions}
                    value={form.values.year?.toString() || ''}
                    onChange={(value) => 
                      form.setFieldValue('year', value ? parseInt(value, 10) : null)
                    }
                  />
                  
                  <Select
                    label="Sort By"
                    placeholder="Select field"
                    data={[
                      { value: 'date_utc', label: 'Launch Date' },
                      { value: 'name', label: 'Mission Name' },
                      { value: 'flight_number', label: 'Flight Number' },
                    ]}
                    {...form.getInputProps('sort')}
                  />
                  
                  <Select
                    label="Order"
                    placeholder="Select order"
                    data={[
                      { value: 'asc', label: 'Ascending' },
                      { value: 'desc', label: 'Descending' },
                    ]}
                    {...form.getInputProps('order')}
                  />
                </Group>
              </MediaQuery>
              
              <Box mt="md">
                <MediaQuery smallerThan="xs" styles={{ flexDirection: 'column' }}>
                  <SegmentedControl
                    fullWidth
                    data={[
                      { label: Localize.AllLaunches, value: 'all' },
                      { label: Localize.Upcoming, value: 'upcoming' },
                      { label: Localize.Successful, value: 'success' },
                      { label: Localize.Failed, value: 'failure' },
                    ]}
                    value={
                      form.values.upcoming
                        ? 'upcoming'
                        : form.values.success === true
                        ? 'success'
                        : form.values.success === false
                        ? 'failure'
                        : 'all'
                    }
                    onChange={(value) => {
                      if (value === 'all') {
                        form.setValues({
                          ...form.values,
                          success: null,
                          upcoming: null,
                        });
                      } else {
                        handleQuickFilter(value as 'upcoming' | 'success' | 'failure');
                      }
                    }}
                    orientation="horizontal"
                  />
                </MediaQuery>
              </Box>
              
              <Group position="right" mt="md">
                <NumberInput
                  label="Results per page"
                  min={5}
                  max={50}
                  step={5}
                  {...form.getInputProps('limit')}
                />
              </Group>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </form>
    </Paper>
  );
};

export default LaunchFilter;