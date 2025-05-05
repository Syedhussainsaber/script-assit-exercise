import { FC } from 'react';
import {
  Paper,
  Text,
  Title,
  Group,
  Badge,
  Grid,
  Image,
  Stack,
  Anchor,
  createStyles,
  SimpleGrid,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import {
  IconRocket,
  IconWorld,
  IconBuildingFactory,
  IconCalendar,
  IconCurrencyDollar,
  IconBrandWikipedia,
  IconScale,
} from '@tabler/icons-react';
import { Rocket, Launch } from '../../types/spaceX.types';
import LaunchCard from '../launches/LaunchCard';
import { formatShortDate } from '../../utils/dateFormatters';

interface RocketDetailsProps {
  rocket: Rocket;
  launches?: Launch[];
}

const useStyles = createStyles((theme) => ({
  paper: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
  },
  section: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
  statsGrid: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  carousel: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  statValue: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
  },
  statLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
  },
}));

const RocketDetails: FC<RocketDetailsProps> = ({ rocket, launches = [] }) => {
  const { classes } = useStyles();

  return (
    <Paper className={classes.paper} shadow="sm">
      {/* Header Section */}
      <Group position="apart" mb="md">
        <div>
          <Title order={2}>{rocket.name}</Title>
          <Group spacing="xs" mt="xs">
            <Badge color={rocket.active ? 'green' : 'red'} size="lg">
              {rocket.active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge color="blue" size="lg">{rocket.type}</Badge>
          </Group>
        </div>
        {rocket.wikipedia && (
          <Anchor href={rocket.wikipedia} target="_blank">
            <Group spacing="xs">
              <IconBrandWikipedia size={16} />
              <Text>Wikipedia</Text>
            </Group>
          </Anchor>
        )}
      </Group>

      {/* Image Carousel */}
      {rocket.flickr_images && rocket.flickr_images.length > 0 && (
        <Carousel
          className={classes.carousel}
          withIndicators
          height={400}
          slideSize="100%"
          slideGap="md"
        >
          {rocket.flickr_images.map((image, index) => (
            <Carousel.Slide key={index}>
              <Image src={image} alt={`${rocket.name} - ${index + 1}`} height={400} fit="contain" />
            </Carousel.Slide>
          ))}
        </Carousel>
      )}

      {/* Description */}
      <Text mt="md" size="md">{rocket.description}</Text>

      {/* Stats Grid */}
      <Paper className={classes.statsGrid} mt="xl">
        <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          <Group>
            <IconBuildingFactory size={24} />
            <div>
              <Text className={classes.statLabel}>Company</Text>
              <Text className={classes.statValue}>{rocket.company}</Text>
            </div>
          </Group>

          <Group>
            <IconWorld size={24} />
            <div>
              <Text className={classes.statLabel}>Country</Text>
              <Text className={classes.statValue}>{rocket.country}</Text>
            </div>
          </Group>

          <Group>
            <IconCalendar size={24} />
            <div>
              <Text className={classes.statLabel}>First Flight</Text>
              <Text className={classes.statValue}>{formatShortDate(rocket.first_flight)}</Text>
            </div>
          </Group>

          <Group>
            <IconCurrencyDollar size={24} />
            <div>
              <Text className={classes.statLabel}>Cost per Launch</Text>
              <Text className={classes.statValue}>${(rocket.cost_per_launch / 1000000).toFixed(1)}M</Text>
            </div>
          </Group>

          <Group>
            <IconRocket size={24} />
            <div>
              <Text className={classes.statLabel}>Success Rate</Text>
              <Text className={classes.statValue}>{rocket.success_rate_pct}%</Text>
            </div>
          </Group>

          <Group>
            <IconScale size={24} />
            <div>
              <Text className={classes.statLabel}>Mass</Text>
              <Text className={classes.statValue}>{rocket.mass.kg.toLocaleString()} kg</Text>
            </div>
          </Group>
        </SimpleGrid>
      </Paper>

      {/* Technical Specifications */}
      <div className={classes.section}>
        <Title order={3} mb="md">Technical Specifications</Title>
        <Grid>
          <Grid.Col span={12} md={6}>
            <Stack spacing="md">
              <Group position="apart">
                <Text weight={500}>Height:</Text>
                <Text>{rocket.height.meters}m / {rocket.height.feet}ft</Text>
              </Group>
              <Group position="apart">
                <Text weight={500}>Diameter:</Text>
                <Text>{rocket.diameter.meters}m / {rocket.diameter.feet}ft</Text>
              </Group>
              <Group position="apart">
                <Text weight={500}>Stages:</Text>
                <Text>{rocket.stages}</Text>
              </Group>
              <Group position="apart">
                <Text weight={500}>Boosters:</Text>
                <Text>{rocket.boosters}</Text>
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col span={12} md={6}>
            <Title order={4} mb="md">Payload Capacities</Title>
            {rocket.payload_weights.map((payload) => (
              <Group key={payload.id} position="apart" mb="xs">
                <Text>{payload.name}:</Text>
                <Text>{payload.kg.toLocaleString()} kg / {payload.lb.toLocaleString()} lb</Text>
              </Group>
            ))}
          </Grid.Col>
        </Grid>
      </div>

      {/* Related Launches */}
      {launches && launches.length > 0 && (
        <div className={classes.section}>
          <Title order={3} mb="md">Recent Launches</Title>
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} spacing="md">
            {launches.slice(0, 4).map((launch) => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </SimpleGrid>
        </div>
      )}
    </Paper>
  );
};

export default RocketDetails;