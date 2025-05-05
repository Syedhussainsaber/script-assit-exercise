import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Header as MantineHeader,
  Group,
  Button,
  Title,
  Text,
  Avatar,
  Menu,
  ActionIcon,
  Container,
  createStyles,
  useMantineColorScheme,
  useMantineTheme
} from '@mantine/core';
import { useAuthStore } from '../../store/authStore';
import { IconUser, IconLogout, IconMoonStars, IconSun, IconRocket, IconUsers } from '@tabler/icons-react';
import { Localize } from '../../utils/localize';

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
  },
  nav: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
  mobileNav: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.md,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.colorScheme === 'dark' 
        ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
        : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },
}));

const Header: FC = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <MantineHeader height={70} className={classes.header}>
      <Container>
        <Group position="apart">
          <Group>
            <Title order={3} color={colorScheme === 'dark' ? theme.colors.primary[0] : 'primary'} style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>{Localize.SpaceXExplorer}</Title>
          </Group>
          
          {isAuthenticated ? (
            <>
              <Group spacing={20} className={classes.nav}>
                <Link to="/dashboard" className={classes.link}>{Localize.Dashboard}</Link>
                <Link to="/launches" className={classes.link}>{Localize.Launches}</Link>
                <Link to="/rockets" className={classes.link}>{Localize.Rockets}</Link>
                <Link to="/crew" className={classes.link}>{Localize.Crew}</Link>
                
                <Menu position="bottom-end" shadow="md" width={200}>
                  <Menu.Target>
                    <Group spacing="xs" style={{ cursor: 'pointer' }}>
                      <Avatar color="primary" radius="xl" size="sm">
                        {user?.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Text size="sm" weight={500}>{user?.username}</Text>
                    </Group>
                  </Menu.Target>
                  
                  <Menu.Dropdown>
                    <Menu.Label>Account</Menu.Label>
                    <Menu.Item icon={<IconUser size={14} />}>{Localize.Profile}</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item 
                      color="red" 
                      icon={<IconLogout size={14} />}
                      onClick={handleLogout}
                    >
                {Localize.Logout}
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                
                <ActionIcon
                  variant="outline"
                  color={colorScheme === 'dark' ? 'yellow' : 'blue'}
                  onClick={() =>toggleColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
                  title="Toggle color scheme"
                >
                  {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
                </ActionIcon>
              </Group>
              
              <Group className={classes.mobileNav}>
                <Menu position="bottom-end" shadow="md" width={200}>
                  <Menu.Target>
                    <Avatar color="primary" radius="xl" size="sm">
                      {user?.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </Menu.Target>
                  
                  <Menu.Dropdown>
                    <Menu.Label>{Localize.Navigation}</Menu.Label>
                    <Menu.Item component={Link} to="/dashboard" icon={<IconRocket size={14} />}>
                {Localize.Dashboard}
                    </Menu.Item>
                    <Menu.Item component={Link} to="/launches" icon={<IconRocket size={14} />}>
                {Localize.Launches}
                    </Menu.Item>
                    <Menu.Item component={Link} to="/rockets" icon={<IconRocket size={14} />}>
                     {Localize.Rockets}
                    </Menu.Item>
                    <Menu.Item component={Link} to="/crew" icon={<IconUsers size={14} />}>
                    {Localize.Crew}
                    </Menu.Item>
                    <Menu.Divider />
                    
                    <Menu.Label>Account</Menu.Label>
                    <Menu.Item icon={<IconUser size={14} />}>{Localize.Profile}</Menu.Item>
                    <Menu.Item 
                      color="red" 
                      icon={<IconLogout size={14} />}
                      onClick={handleLogout}
                    >
                      {Localize.Logout}
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </>
          ) : (
            <Group>
              <Button 
                variant="light" 
                component={Link} 
                to="/login"
              >
             {Localize.Login}
              </Button>
            </Group>
          )}
        </Group>
      </Container>
    </MantineHeader>
  );
};

export default Header;