# Developer Guide - Tabesh v2

## Development Environment Setup

### Prerequisites

- WordPress 6.0+ development environment
- PHP 8.0+
- Node.js 16+ and npm
- Git

### Initial Setup

1. **Clone the repository:**
```bash
git clone https://github.com/tabshhh4-sketch/Tabesh_v2.git
cd Tabesh_v2
```

2. **Install npm dependencies:**
```bash
npm install
```

3. **Build React application:**
```bash
npm run build
```

4. **For development with hot reload:**
```bash
npm run start
```

## Project Structure

### PHP Structure

```
includes/
├── core/                 # Core functionality
│   ├── class-plugin.php  # Main plugin singleton
│   ├── class-assets.php  # Asset management
│   └── class-database.php # Database operations
├── admin/                # Admin area
│   └── class-admin.php   # Admin pages and menus
├── api/                  # REST API
│   └── class-rest-api.php # API endpoints
├── panels/               # User panels
│   ├── class-customer-panel.php
│   ├── class-manager-panel.php
│   ├── class-employee-panel.php
│   └── class-settings-panel.php
├── helpers/              # Helper utilities
│   └── class-security.php
└── class-autoloader.php  # PSR-4 autoloader
```

### React Structure

```
assets/js/src/
├── components/          # Reusable React components
│   └── App.js          # Main application component
├── panels/             # Panel-specific components
│   ├── CustomersPanel.js
│   ├── ManagersPanel.js
│   ├── EmployeesPanel.js
│   └── SettingsPanel.js
└── index.js            # Application entry point
```

## Adding New Features

### Adding a New PHP Class

1. **Create the class file** in the appropriate directory:
```php
<?php
namespace Tabesh_v2\YourNamespace;

class Your_Class {
    public function __construct() {
        // Initialize
    }
}
```

2. **The autoloader will automatically load it** based on:
   - Namespace: `Tabesh_v2\YourNamespace`
   - File location: `includes/yournamespace/class-your-class.php`

### Adding a New REST API Endpoint

Edit `includes/api/class-rest-api.php`:

```php
public function register_routes() {
    // Add your endpoint
    register_rest_route(
        $this->namespace,
        '/your-endpoint',
        array(
            array(
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => array( $this, 'your_callback' ),
                'permission_callback' => array( $this, 'check_permissions' ),
            ),
        )
    );
}

public function your_callback( $request ) {
    // Your logic here
    return new \WP_REST_Response( $data, 200 );
}
```

### Adding a New React Component

1. **Create component file** in `assets/js/src/components/`:
```javascript
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const YourComponent = () => {
    const [state, setState] = useState(null);
    
    return (
        <div>
            {__('Your Component', 'tabesh-v2')}
        </div>
    );
};

export default YourComponent;
```

2. **Import and use** in your panel:
```javascript
import YourComponent from '../components/YourComponent';
```

### Adding a New Database Table

Edit `includes/core/class-database.php`:

```php
public function create_tables() {
    // ... existing tables ...
    
    $your_table = $this->wpdb->prefix . 'tabesh_your_table';
    
    $sql[] = "CREATE TABLE IF NOT EXISTS {$your_table} (
        id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        your_field varchar(255) NOT NULL,
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) {$charset_collate};";
    
    // ... rest of function ...
}
```

## Coding Standards

### PHP Standards

Follow [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/):

- Use tabs for indentation
- Use snake_case for function and variable names
- Use Proper_Case for class names
- Always escape output
- Always sanitize input
- Add docblocks to all functions

**Example:**
```php
/**
 * Get customer orders.
 *
 * @param int $customer_id Customer ID.
 * @return array List of orders.
 */
public function get_customer_orders( $customer_id ) {
    global $wpdb;
    $table = $wpdb->prefix . 'tabesh_orders';

    $orders = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT * FROM {$table} WHERE customer_id = %d",
            $customer_id
        )
    );

    return $orders;
}
```

### JavaScript Standards

Follow WordPress JavaScript standards and React best practices:

- Use camelCase for variables and functions
- Use PascalCase for components
- Use functional components with hooks
- Use WordPress i18n for translations
- Use WordPress API fetch for API calls

**Example:**
```javascript
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

const MyComponent = () => {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        loadData();
    }, []);
    
    const loadData = async () => {
        try {
            const response = await apiFetch({
                path: '/tabesh/v2/endpoint',
            });
            setData(response);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    return (
        <div>
            {__('My Component', 'tabesh-v2')}
        </div>
    );
};

export default MyComponent;
```

## Security Best Practices

### Always Verify Permissions

```php
if ( ! current_user_can( 'manage_options' ) ) {
    wp_die( __( 'You do not have permission', 'tabesh-v2' ) );
}
```

### Use Nonces for Forms

```php
wp_nonce_field( 'tabesh_v2_action', 'tabesh_v2_nonce' );

// Verify
if ( ! wp_verify_nonce( $_POST['tabesh_v2_nonce'], 'tabesh_v2_action' ) ) {
    wp_die( __( 'Security check failed', 'tabesh-v2' ) );
}
```

### Sanitize Input

```php
$safe_text = sanitize_text_field( $_POST['field'] );
$safe_email = sanitize_email( $_POST['email'] );
$safe_int = absint( $_POST['number'] );
```

### Escape Output

```php
echo esc_html( $text );
echo esc_attr( $attribute );
echo esc_url( $url );
```

### Use Prepared Statements

```php
$wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$table} WHERE id = %d",
        $id
    )
);
```

## Testing

### Manual Testing

1. **Activate the plugin** in WordPress admin
2. **Check database tables** are created
3. **Test REST API endpoints** using browser console:
```javascript
wp.apiFetch({path: '/tabesh/v2/orders'}).then(console.log);
```
4. **Test React UI** in admin panels

### PHP Testing

Use PHPUnit for unit tests (to be implemented):

```bash
phpunit tests/
```

### JavaScript Testing

Use Jest for component tests (to be implemented):

```bash
npm run test:unit
```

## Building for Production

### Build React Application

```bash
# Production build
npm run build

# Verify build files
ls -la assets/js/build/
```

### Create Plugin ZIP

```bash
# Clean up
rm -rf node_modules/

# Create archive
cd ..
zip -r tabesh-v2.zip Tabesh_v2/ -x "*.git*" "node_modules/*" "*.DS_Store"
```

## Debugging

### Enable WordPress Debug Mode

In `wp-config.php`:
```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );
define( 'SCRIPT_DEBUG', true );
```

### PHP Debugging

Check WordPress debug log:
```bash
tail -f wp-content/debug.log
```

### JavaScript Debugging

Use browser console:
```javascript
console.log('Debug:', data);
```

### Database Debugging

Use WordPress database error reporting:
```php
global $wpdb;
$wpdb->show_errors();
$wpdb->print_error();
```

## Useful Commands

### npm Commands

```bash
npm install                 # Install dependencies
npm run build              # Build production
npm run start              # Development with hot reload
npm run lint:js            # Lint JavaScript
npm run lint:css           # Lint CSS
npm run format             # Format code
```

### WordPress CLI Commands

```bash
# Activate plugin
wp plugin activate tabesh-v2

# Deactivate plugin
wp plugin deactivate tabesh-v2

# Check plugin status
wp plugin status tabesh-v2

# Generate translation file
wp i18n make-pot . languages/tabesh-v2.pot
```

## Common Issues

### React Not Loading

1. Check if build files exist: `ls assets/js/build/`
2. Rebuild: `npm run build`
3. Clear browser cache
4. Check console for errors

### Database Tables Not Created

1. Deactivate and reactivate plugin
2. Check PHP error log
3. Verify database permissions

### API Not Working

1. Check permalinks (Settings → Permalinks → Save)
2. Verify user permissions
3. Check for REST API conflicts

## Version Control

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/your-feature

# Create pull request on GitHub
```

### Commit Message Format

Use clear, descriptive commit messages:
```
Add customer filter to orders API

- Added filter parameter to REST API
- Updated documentation
- Added validation for filter values
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Resources

- [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [React Documentation](https://react.dev/)
- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)

## Support

For development questions:
- Check documentation
- Search existing issues
- Create new issue on GitHub
- Join community discussions

---

Happy coding! 🚀
