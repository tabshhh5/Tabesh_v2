import { createContext, useContext, useState, useEffect } from '@wordpress/element';

/**
 * Theme Context for managing dark/light mode.
 */
const ThemeContext = createContext();

/**
 * Theme Provider Component.
 */
export const ThemeProvider = ( { children } ) => {
	// Get initial theme from localStorage or default to 'light'
	const getInitialTheme = () => {
		if ( typeof window !== 'undefined' ) {
			const savedTheme = localStorage.getItem( 'tabesh-theme' );
			if ( savedTheme ) {
				return savedTheme;
			}
			// Check system preference
			if ( window.matchMedia && window.matchMedia( '(prefers-color-scheme: dark)' ).matches ) {
				return 'dark';
			}
		}
		return 'light';
	};

	const [ theme, setTheme ] = useState( getInitialTheme );

	useEffect( () => {
		// Apply theme to document
		document.documentElement.setAttribute( 'data-theme', theme );
		
		// Save to localStorage
		localStorage.setItem( 'tabesh-theme', theme );
	}, [ theme ] );

	const toggleTheme = () => {
		setTheme( ( prevTheme ) => ( prevTheme === 'light' ? 'dark' : 'light' ) );
	};

	const value = {
		theme,
		setTheme,
		toggleTheme,
		isDark: theme === 'dark',
	};

	return (
		<ThemeContext.Provider value={ value }>
			{ children }
		</ThemeContext.Provider>
	);
};

/**
 * Custom hook to use theme context.
 */
export const useTheme = () => {
	const context = useContext( ThemeContext );
	if ( ! context ) {
		throw new Error( 'useTheme must be used within a ThemeProvider' );
	}
	return context;
};

export default ThemeContext;
