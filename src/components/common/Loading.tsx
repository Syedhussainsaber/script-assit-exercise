import { FC } from 'react';
import { Center, Loader, Text, Stack, createStyles } from '@mantine/core';

interface LoadingProps {
  text?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const useStyles = createStyles((theme) => ({
  container: {
    minHeight: '200px',
    width: '100%',
  },
}));

const Loading: FC<LoadingProps> = ({ 
  text = 'Loading data...', 
  size = 'md' 
}) => {
  const { classes } = useStyles();

  return (
    <Center className={classes.container}>
      <Stack align="center" spacing="xs">
        <Loader size={size} variant="dots" color="primary" />
        {text && <Text color="dimmed" size="sm">{text}</Text>}
      </Stack>
    </Center>
  );
};

export default Loading;

