import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { theme } from './theme';
import './App.scss';

export default function App() {
	const { pathname } = useLocation();

	const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
	const toggleColorScheme = (value?: ColorScheme) =>
	  setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
		<MantineProvider theme={{...theme, colorScheme}} withGlobalStyles withNormalizeCSS>
			<Outlet />
		</MantineProvider>
		</ColorSchemeProvider>
	);
}
