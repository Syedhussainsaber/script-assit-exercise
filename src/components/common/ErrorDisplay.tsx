import { FC } from 'react';
import {
  Alert,
  Button,
  Group,
  Stack,
  Text,
  createStyles
} from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { Localize } from '../../utils/localize';

interface ErrorDisplayProps {
  message?: string;
  error?: Error;
  onRetry?: () => void;
}

const useStyles = createStyles((theme) => ({
  container: {
    margin: `${theme.spacing.lg}px 0`,
  }
}));

const ErrorDisplay: FC<ErrorDisplayProps> = ({
  message,
  error,
  onRetry
}) => {
  const { classes } = useStyles();
  
  const errorMessage = error?.message || message || 'An error occurred while fetching data.';

  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="Error"
      color="red"
      variant="filled"
      className={classes.container}
    >
      <Stack spacing="md">
        <Text>{errorMessage}</Text>
        {onRetry && (
          <Group position="left">
            <Button
              leftIcon={<IconRefresh size={16} />}
              onClick={onRetry}
              variant="white"
              size="xs"
            >
         {Localize.Retry}
            </Button>
          </Group>
        )}
      </Stack>
    </Alert>
  );
};

export default ErrorDisplay;