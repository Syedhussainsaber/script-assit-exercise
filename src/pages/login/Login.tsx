import { FC, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  TextInput, 
  PasswordInput, 
  Paper, 
  Title, 
  Container, 
  Button, 
  createStyles, 
  Text, 
  Divider,
  Group,
  Stack,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconRocket } from '@tabler/icons-react';
import { useAuthStore } from '../../store/authStore';
import { Localize } from '../../utils/localize';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage: 'linear-gradient(250deg, rgba(130, 201, 30, 0) 0%, #062343 70%), url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80)',
    display: 'flex',
    alignItems: 'center',  
    justifyContent: 'center',
},
  
  form: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: '60%',
    maxWidth: 450,
    paddingTop: 80,
    
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },
  
  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
  },
  
  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const Login: FC = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },

    validate: {
      username: (value) => (value.trim().length < 1 ? 'Username is required' : null),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await login(values.username, values.password);
      
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Container>
        <Paper className={classes.form} radius={0} p={30}>
          <Group mb={50} position="center">
            <IconRocket size={40} />
            <Title order={2} className={classes.title} ta="center">
             {Localize.SpaceXExplorer}
            </Title>
          </Group>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title="Authentication Error" color="red" mb="lg">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                required
                label="Username"
                placeholder="Your username"
                value={form.values.username}
                onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                error={form.errors.username}
                size="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                error={form.errors.password}
                size="md"
              />
            </Stack>

            <Button fullWidth mt="xl" size="md" type="submit" loading={loading}>
              {Localize.SignIn}
            </Button>
          </form>

          <Divider my="lg" label="Demo Credentials" labelPosition="center" />
          
          <Stack spacing="xs">
            <Text size="sm" align="center">
              Username: <b>admin</b>, Password: <b>password123</b>
            </Text>
            <Text size="sm" align="center">
              Username: <b>user</b>, Password: <b>user123</b>
            </Text>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;