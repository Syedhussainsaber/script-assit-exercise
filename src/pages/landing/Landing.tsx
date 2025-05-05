import { FC } from 'react';
import { 
  Title, 
  Text, 
  Container, 
  Button, 
  Group, 
  createStyles,
  useMantineTheme
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconRocket } from '@tabler/icons-react';
import { Localize } from '../../utils/localize';

const useStyles = createStyles((theme) => ({
  hero: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 900,
    marginBottom: theme.spacing.md,
    [theme.fn.smallerThan('sm')]: {
      fontSize: theme.fontSizes.xl,
    },
  },
  description: {
    maxWidth: 600,
    margin: 'auto',
    marginBottom: theme.spacing.xl,
  },
  cta: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
}));

const Landing: FC = () => {
  const { classes } = useStyles();

  return (
    <Container size="md" className={classes.hero}>
      <Title className={classes.title}>
        {Localize.ExploreSpaceX}
      </Title>
      
      <Text className={classes.description} color="dimmed">
        Discover all SpaceX launches, rockets, and crew members in one place. 
        Get detailed information about past and upcoming missions.
      </Text>
      
      <Group className={classes.cta}>
        <Button
          component={Link}
          to="/login"
          size="lg"
          leftIcon={<IconRocket size={18} />}
        >
         {Localize.GetStarted}
        </Button>
        
        <Button
          component={Link}
          to="/launches"
          size="lg"
          variant="outline"
        >
          {Localize.BrowseLaunches}
        </Button>
      </Group>
    </Container>
  );
};

export default Landing;