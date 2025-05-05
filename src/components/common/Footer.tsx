import { createStyles, Container, Group, Text, Anchor, Image, Stack, MediaQuery, useMantineTheme } from '@mantine/core';
import { Localize } from '../../utils/localize';

const useStyles = createStyles((theme) => ({
  footer: {
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.neutral[0],
  },
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
    },
  },
  links: {
    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.md,
    },
  },
  linkItem: {
    color: theme.colorScheme === 'dark' ? theme.colors.primary[2] : theme.colors.primary[6],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  copyright: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.neutral[5],
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.sm,
  },
  logo: {
    maxWidth: 150,
    [theme.fn.smallerThan('sm')]: {
      maxWidth: 120,
    },
  }
}));

const footerLinks = [
  { label: Localize.Home, link: '/' },
  { label: Localize.Launches, link: '/launches' },
  { label: Localize.Rockets, link: '/rockets' },
  { label: Localize.Crew, link: '/crew' },
];

const Footer = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const currentYear = new Date().getFullYear();

  const links = footerLinks.map((link) => (
    <Anchor
      key={link.label}
      href={link.link}
      className={classes.linkItem}
    >
      {link.label}
    </Anchor>
  ));

  return (
    <footer className={classes.footer}>
      <Container size="xl">
        <div className={classes.inner}>
          <MediaQuery smallerThan="sm" styles={{ alignItems: 'center' }}>
            <Stack spacing="xs">
              <Image 
                src="/src/public/images/space.png"
                alt="SpaceX Explorer"
                width={80}
                className={classes.logo}
                withPlaceholder
              />
              <Text className={classes.copyright}>
                © {currentYear} SpaceX Explorer. All rights reserved.
              </Text>
            </Stack>
          </MediaQuery>

          <MediaQuery smallerThan="sm" styles={{ marginTop: theme.spacing.md }}>
            <Group spacing={theme.spacing.lg} className={classes.links}>
              {links}
            </Group>
          </MediaQuery>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;