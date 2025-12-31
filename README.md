# Tabesh v2 - Print Shop Order Management Plugin

[![WordPress](https://img.shields.io/badge/WordPress-6.0%2B-blue.svg)](https://wordpress.org/)
[![PHP](https://img.shields.io/badge/PHP-8.0%2B-purple.svg)](https://php.net/)
[![License](https://img.shields.io/badge/License-GPL%20v2-green.svg)](https://www.gnu.org/licenses/gpl-2.0.html)

**پلتفرم جامع ثبت سفارشات چاپخانه**

A comprehensive WordPress plugin for managing print shop orders with a modern React-based interface, modular architecture, and multi-role support.

## 🌟 Features

### Core Features
- **Modular Architecture**: Independent, interconnected classes for easy development and maintenance
- **React-Based UI**: Modern, responsive interface using React and WordPress components
- **Multi-Role Support**: Separate panels for customers, managers, employees, and administrators
- **REST API Integration**: Complete RESTful API for seamless data management
- **Security First**: Built-in security features including nonce verification and capability checks
- **Internationalization Ready**: Full i18n support for multiple languages

### User Panels
- **Customer Panel**: View and manage personal orders
- **Manager Panel**: Comprehensive order management and reporting
- **Employee Panel**: View and update assigned orders
- **Settings Panel**: Configurable plugin settings

## 📋 Requirements

- WordPress 6.0 or higher
- PHP 8.0 or higher
- MySQL 5.7 or higher
- Node.js 16+ and npm (for development)

## 🚀 Installation

### Automatic Installation

1. Download the plugin zip file
2. Go to WordPress Admin → Plugins → Add New
3. Click "Upload Plugin"
4. Choose the downloaded zip file
5. Click "Install Now"
6. Activate the plugin

### Manual Installation

1. Upload the `tabesh-v2` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Navigate to "Tabesh v2" in the admin menu

### Development Installation

```bash
# Clone the repository
git clone https://github.com/tabshhh4-sketch/Tabesh_v2.git

# Navigate to the plugin directory
cd Tabesh_v2

# Install npm dependencies
npm install

# Build the React application
npm run build

# For development with hot reload
npm run start
```

## 🏗️ Architecture

### Directory Structure

```
tabesh-v2/
├── assets/
│   ├── css/                  # Stylesheets
│   │   └── admin.css
│   └── js/
│       ├── src/              # React source files
│       │   ├── components/   # React components
│       │   ├── panels/       # Panel components
│       │   └── index.js      # Main entry point
│       └── build/            # Compiled JavaScript
├── includes/
│   ├── admin/                # Admin-specific classes
│   │   └── class-admin.php
│   ├── api/                  # REST API classes
│   │   └── class-rest-api.php
│   ├── core/                 # Core plugin classes
│   │   ├── class-assets.php
│   │   ├── class-database.php
│   │   └── class-plugin.php
│   ├── helpers/              # Helper classes
│   │   └── class-security.php
│   ├── panels/               # Panel-specific classes
│   │   ├── class-customer-panel.php
│   │   ├── class-employee-panel.php
│   │   ├── class-manager-panel.php
│   │   └── class-settings-panel.php
│   └── class-autoloader.php  # PSR-4 autoloader
├── languages/                # Translation files
├── package.json              # npm dependencies
├── tabesh-v2.php            # Main plugin file
└── README.md                # This file
```

### Class Structure

#### Core Classes

**Plugin** (`Tabesh_v2\Core\Plugin`)
- Main plugin singleton
- Initializes all components
- Handles activation/deactivation

**Assets** (`Tabesh_v2\Core\Assets`)
- Manages JavaScript and CSS enqueuing
- Localizes scripts with settings and translations

**Database** (`Tabesh_v2\Core\Database`)
- Creates and manages custom database tables
- Provides table name getters

**Autoloader** (`Tabesh_v2\Autoloader`)
- PSR-4 compliant autoloader
- Automatically loads classes

#### Admin Classes

**Admin** (`Tabesh_v2\Admin\Admin`)
- Registers admin menu pages
- Handles admin area functionality
- Renders React root elements

#### API Classes

**Rest_Api** (`Tabesh_v2\Api\Rest_Api`)
- Registers REST API endpoints
- Handles CRUD operations
- Implements permission checks

#### Panel Classes

**Customer_Panel** (`Tabesh_v2\Panels\Customer_Panel`)
- Customer role management
- Customer-specific functionality

**Manager_Panel** (`Tabesh_v2\Panels\Manager_Panel`)
- Manager role management
- Order statistics and reporting

**Employee_Panel** (`Tabesh_v2\Panels\Employee_Panel`)
- Employee role management
- Assigned orders functionality

**Settings_Panel** (`Tabesh_v2\Panels\Settings_Panel`)
- Plugin settings management
- Configuration options

#### Helper Classes

**Security** (`Tabesh_v2\Helpers\Security`)
- Nonce verification
- Input sanitization
- Data validation
- Security utilities

## 📊 Database Schema

### Tables

#### `wp_tabesh_orders`
- `id`: Primary key
- `order_number`: Unique order identifier
- `customer_id`: Customer reference
- `status`: Order status (pending, completed, cancelled)
- `total_amount`: Order total
- `currency`: Currency code
- `priority`: Order priority
- `deadline`: Order deadline
- `assigned_to`: Assigned employee
- `notes`: Additional notes
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp
- `completed_at`: Completion timestamp

#### `wp_tabesh_order_meta`
- `meta_id`: Primary key
- `order_id`: Order reference
- `meta_key`: Meta key
- `meta_value`: Meta value

#### `wp_tabesh_order_items`
- `id`: Primary key
- `order_id`: Order reference
- `item_name`: Item name
- `item_type`: Item type
- `quantity`: Quantity
- `unit_price`: Unit price
- `total_price`: Total price
- `specifications`: Item specifications

#### `wp_tabesh_customers`
- `id`: Primary key
- `user_id`: WordPress user reference
- `company_name`: Company name
- `contact_name`: Contact person name
- `email`: Email address
- `phone`: Phone number
- `address`: Address
- `city`: City
- `postal_code`: Postal code
- `notes`: Additional notes

## 🔌 REST API

### Endpoints

#### Orders

**GET** `/wp-json/tabesh/v2/orders`
- Get all orders (paginated)
- Parameters: `page`, `per_page`

**POST** `/wp-json/tabesh/v2/orders`
- Create new order
- Required: `order_number`, `customer_id`

**GET** `/wp-json/tabesh/v2/orders/{id}`
- Get single order

**PUT** `/wp-json/tabesh/v2/orders/{id}`
- Update order

**DELETE** `/wp-json/tabesh/v2/orders/{id}`
- Delete order

#### Customers

**GET** `/wp-json/tabesh/v2/customers`
- Get all customers

**POST** `/wp-json/tabesh/v2/customers`
- Create new customer
- Required: `contact_name`, `email`

#### Settings

**GET** `/wp-json/tabesh/v2/settings`
- Get plugin settings

**POST** `/wp-json/tabesh/v2/settings`
- Update plugin settings

### Authentication

All API endpoints require authentication and appropriate capabilities. Include the `X-WP-Nonce` header with your requests.

## 🛠️ Development

### Building the React App

```bash
# Install dependencies
npm install

# Development mode (with hot reload)
npm run start

# Production build
npm run build

# Linting
npm run lint:js
npm run lint:css

# Format code
npm run format
```

### PHP Coding Standards

The plugin follows WordPress Coding Standards. To check your code:

```bash
# Install PHP_CodeSniffer with WordPress standards
composer require --dev wp-coding-standards/wpcs

# Check coding standards
phpcs --standard=WordPress includes/
```

### Adding New Features

1. **New Class**: Create in appropriate directory under `includes/`
2. **React Component**: Add to `assets/js/src/components/` or `assets/js/src/panels/`
3. **API Endpoint**: Add to `includes/api/class-rest-api.php`
4. **Database Table**: Update `includes/core/class-database.php`

## 🔒 Security

### Built-in Security Features

- **Nonce Verification**: All form submissions verified
- **Capability Checks**: Permission checks on all actions
- **Input Sanitization**: All user input sanitized
- **Output Escaping**: All output properly escaped
- **Prepared Statements**: SQL injection prevention
- **CSRF Protection**: Cross-site request forgery prevention

### Security Best Practices

- Always use the Security helper class for validation
- Never trust user input
- Escape all output
- Use WordPress functions for security operations
- Keep the plugin updated

## 🌐 Internationalization

The plugin is fully internationalized and ready for translation.

### Text Domain
`tabesh-v2`

### Creating Translations

1. Generate POT file:
```bash
wp i18n make-pot . languages/tabesh-v2.pot
```

2. Create PO file for your language
3. Compile to MO file
4. Place in `languages/` directory

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Follow WordPress coding standards
4. Write clear commit messages
5. Submit a pull request

## 📝 Changelog

### Version 1.0.0
- Initial release
- Core plugin structure
- React-based UI
- Multi-panel support
- REST API implementation
- Database schema
- Security features
- Internationalization support

## 📄 License

This plugin is licensed under the GPL v2 or later.

```
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
```

## 👥 Authors

- Tabesh Team

## 🔗 Links

- [GitHub Repository](https://github.com/tabshhh4-sketch/Tabesh_v2)
- [WordPress Plugin Directory](https://wordpress.org/plugins/)
- [Documentation](#)
- [Support](#)

## 📞 Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue on GitHub

---

**Made with ❤️ for the print shop industry**
