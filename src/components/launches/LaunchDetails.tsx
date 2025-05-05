import { FC } from 'react';
import { 
  Paper, 
  Group, 
  Text, 
  Badge, 
  Image, 
  Grid, 
  Title,
  Anchor, 
  Space, 
  Stack, 
  Box, 
  createStyles
} from '@mantine/core';
import { 
  IconCalendar, 
  IconRocket, 
  IconMapPin, 
  IconBrandYoutube,
  IconBrandWikipedia,
  IconNews 
} from '@tabler/icons-react';
import { Launch, Launchpad, Rocket } from '../../types/spaceX.types';
import { formatDateTime } from '../../utils/dateFormatters';
import { Localize } from '../../utils/localize';

interface LaunchDetailsProps {
  launch: Launch;
  rocket?: Rocket | null;
  launchpad?: Launchpad | null;
}

const useStyles = createStyles((theme) => ({
  paper: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
  },
  section: {
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  externalLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: theme.colors.blue[7],
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    borderRadius: theme.radius.md,
  },
}));

const LaunchDetails: FC<LaunchDetailsProps> = ({ launch, rocket, launchpad }) => {
  const { classes } = useStyles();

  const getStatusBadge = () => {
    if (launch.upcoming) {
      return <Badge color="blue" size="lg">{Localize.Upcoming}</Badge>;
    }
    
    if (launch.success === true) {
      return <Badge color="green" size="lg">{Localize.Success}</Badge>;
    }
    
    if (launch.success === false) {
      return <Badge color="red" size="lg">{Localize.Failed}</Badge>;
    }
    
    return <Badge color="gray" size="lg">{Localize.Unknown}</Badge>;
  };

  const coreInfo = launch.cores?.[0];
  
  return (
    <Paper shadow="md" className={classes.paper}>
      <Grid>
        <Grid.Col sm={12} md={4}>
          <Box className={classes.imageWrapper}>
            {launch.links?.patch?.large ? (
              <Image
                src={launch.links.patch.large}
                height={200}
                width={200}
                fit="contain"
                alt={launch.name}
                withPlaceholder
              />
            ) : (
              <IconRocket size={120} opacity={0.5} />
            )}
          </Box>
        </Grid.Col>

        <Grid.Col sm={12} md={8}>
          <Group position="apart">
            <Title order={2}>{launch.name}</Title>
            {getStatusBadge()}
          </Group>

          <Space h="md" />

          <Group spacing="lg">
            <Group spacing="xs">
              <IconCalendar className={classes.icon} />
              <Text>{formatDateTime(launch.date_utc)}</Text>
            </Group>

            <Group spacing="xs">
              <IconRocket className={classes.icon} />
              <Text>{rocket?.name || 'Unknown Rocket'}</Text>
            </Group>

            {launchpad && (
              <Group spacing="xs">
                <IconMapPin className={classes.icon} />
                <Text>{launchpad.name}</Text>
              </Group>
            )}
          </Group>

          <Space h="md" />

          {launch.details && (
            <Text>{launch.details}</Text>
          )}
        </Grid.Col>
      </Grid>

      <div className={classes.section}>
        <Title order={3}>Mission Details</Title>
        <Space h="md" />
        <Grid>
          <Grid.Col span={12} md={6}>
            <Stack spacing="sm">
              <Group position="apart">
                <Text weight={500}>{Localize.FlightNumber}:</Text>
                <Text>{launch.flight_number}</Text>
              </Group>
              
              <Group position="apart">
                <Text weight={500}>Local Launch Time:</Text>
                <Text>{formatDateTime(launch.date_local)}</Text>
              </Group>
              
              {coreInfo && (
                <>
                  <Group position="apart">
                    <Text weight={500}>{Localize.ReusedCore}:</Text>
                    <Text>{coreInfo.reused ? Localize.Yes : Localize.No}</Text>
                  </Group>
                  
                  <Group position="apart">
                    <Text weight={500}>Landing Success:</Text>
                    <Text>
                      {coreInfo.landing_success === true ? Localize.Yes : 
                       coreInfo.landing_success === false ? Localize.No : 'N/A'}
                    </Text>
                  </Group>
                  
                  {coreInfo.landing_type && (
                    <Group position="apart">
                      <Text weight={500}>{Localize.LandingType}:</Text>
                      <Text>{coreInfo.landing_type}</Text>
                    </Group>
                  )}
                </>
              )}
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={12} md={6}>
            {rocket && (
              <Stack spacing="sm">
                <Group position="apart">
                  <Text weight={500}>Rocket Type:</Text>
                  <Text>{rocket.type}</Text>
                </Group>
                
                <Group position="apart">
                  <Text weight={500}>{Localize.RocketHeight}:</Text>
                  <Text>{rocket.height.meters}m / {rocket.height.feet}ft</Text>
                </Group>
                
                <Group position="apart">
                  <Text weight={500}>{Localize.RocketMass}:</Text>
                  <Text>{rocket.mass.kg.toLocaleString()}kg</Text>
                </Group>
                
                <Group position="apart">
                  <Text weight={500}>{Localize.SuccessRate}:</Text>
                  <Text>{rocket.success_rate_pct}%</Text>
                </Group>
              </Stack>
            )}
          </Grid.Col>
        </Grid>
      </div>

      {(launch?.links?.webcast || launch?.links?.article || launch?.links?.wikipedia) && (
        <div className={classes.section}>
          <Title order={3}>{Localize.ExternalLinks}</Title>
          <Space h="md" />
          <Group>
            {launch.links.webcast && (
              <Anchor href={launch.links.webcast} target="_blank" className={classes.externalLink}>
                <IconBrandYoutube className={classes.icon} />
                <Text>{Localize.WatchWebcast}</Text>
              </Anchor>
            )}
            
            {launch.links.article && (
              <Anchor href={launch.links.article} target="_blank" className={classes.externalLink}>
                <IconNews className={classes.icon} />
                <Text>{Localize.NewsArticle}</Text>
              </Anchor>
            )}
            
            {launch.links.wikipedia && (
              <Anchor href={launch.links.wikipedia} target="_blank" className={classes.externalLink}>
                <IconBrandWikipedia className={classes.icon} />
                <Text>{Localize.Wikipedia}</Text>
              </Anchor>
            )}
          </Group>
        </div>
      )}

      {launchpad && (
        <div className={classes.section}>
          <Title order={3}>{Localize.LaunchSite}</Title>
          <Space h="md" />
          <Text weight={500}>{launchpad.full_name}</Text>
          <Text size="sm" color="dimmed">{launchpad.locality}, {launchpad.region}</Text>
          <Space h="xs" />
          <Text>{launchpad.details}</Text>
        </div>
      )}
    </Paper>
  );
};

export default LaunchDetails;