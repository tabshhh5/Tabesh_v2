import { createContext, useState, useEffect, useContext } from '@wordpress/element';

/**
 * Theme Context for managing dark/light mode.
 */
const ThemeContext = createContext();

/**
 * Hook to use theme context.
 *
 * @return {Object} Theme context value.
 */
export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within ThemeProvider');
	}
	return context;
};

/**
 * ThemeProvider Component.
 *
 * Manages dark/light mode state and persistence.
 */
export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(() => {
		// Get theme from localStorage or default to 'light'.
		const savedTheme = localStorage.getItem('tabesh_theme');
		return savedTheme || 'light';
	});

	useEffect(() => {
		// Apply theme class to body.
		document.body.classList.remove('tabesh-theme-light', 'tabesh-theme-dark');
		document.body.classList.add(`tabesh-theme-${theme}`);

		// Save theme to localStorage.
		localStorage.setItem('tabesh_theme', theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
	};

	const value = {
		theme,
		setTheme,
		toggleTheme,
		isDark: theme === 'dark',
	};

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	);
};

export default ThemeProvider;
