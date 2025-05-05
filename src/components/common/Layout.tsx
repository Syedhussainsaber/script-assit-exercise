import { FC, ReactNode } from 'react';
import { AppShell, Container, createStyles } from '@mantine/core';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  fluid?: boolean;
}

const useStyles = createStyles((theme) => ({
  main: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    minHeight: 'calc(100vh - 70px)',
  },
  container: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  }
}));

const Layout: FC<LayoutProps> = ({ children, fluid = false }) => {
  const { classes } = useStyles();

  return (
    <AppShell
      padding="md"
      header={<Header />}
      className={classes.main}
      footer={<Footer/>}
    >
      <Container size={fluid ? 'xl' : 'lg'} className={classes.container}>
        {children}
      </Container>
    </AppShell>
  );
};

export default Layout;