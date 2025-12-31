# Tabesh v2 - Quick Reference

## 📦 What Has Been Created

### Core Plugin Files
- `tabesh-v2.php` - Main plugin file with WordPress headers and initialization
- `includes/class-autoloader.php` - PSR-4 autoloader for automatic class loading

### Core Classes (includes/core/)
- `class-plugin.php` - Main plugin singleton, handles activation/deactivation
- `class-assets.php` - Manages JavaScript and CSS asset enqueuing
- `class-database.php` - Creates and manages custom database tables

### Admin Classes (includes/admin/)
- `class-admin.php` - Admin area menus and page rendering

### API Classes (includes/api/)
- `class-rest-api.php` - REST API endpoints for CRUD operations

### Panel Classes (includes/panels/)
- `class-customer-panel.php` - Customer role and functionality
- `class-manager-panel.php` - Manager role and order statistics
- `class-employee-panel.php` - Employee role and assigned orders
- `class-settings-panel.php` - Plugin settings management

### Helper Classes (includes/helpers/)
- `class-security.php` - Security utilities (nonce, sanitization, validation)

### React Components (assets/js/src/)
- `index.js` - Main application entry point
- `components/App.js` - Main dashboard component
- `panels/CustomersPanel.js` - Customer management interface
- `panels/ManagersPanel.js` - Manager dashboard
- `panels/EmployeesPanel.js` - Employee dashboard
- `panels/SettingsPanel.js` - Settings interface

### Styling
- `assets/css/admin.css` - Admin area styles

### Documentation
- `README.md` - Complete project documentation
- `INSTALLATION.md` - Installation guide (Persian/English)
- `API_DOCUMENTATION.md` - REST API reference
- `DEVELOPER_GUIDE.md` - Developer guidelines and best practices

### Configuration
- `package.json` - npm dependencies and build scripts
- `webpack.config.js` - Webpack configuration for React
- `.gitignore` - Git ignore rules

## 🗄️ Database Schema

### Tables Created on Activation:
1. `wp_tabesh_orders` - Main orders table
2. `wp_tabesh_order_meta` - Order metadata
3. `wp_tabesh_order_items` - Order line items
4. `wp_tabesh_customers` - Customer information

## 🔐 User Roles Created
1. **tabesh_customer** - Can view and create personal orders
2. **tabesh_manager** - Full order management access
3. **tabesh_employee** - Can update assigned orders

## 🔌 REST API Endpoints

### Orders
- `GET /wp-json/tabesh/v2/orders` - List orders
- `POST /wp-json/tabesh/v2/orders` - Create order
- `GET /wp-json/tabesh/v2/orders/{id}` - Get order
- `PUT /wp-json/tabesh/v2/orders/{id}` - Update order
- `DELETE /wp-json/tabesh/v2/orders/{id}` - Delete order

### Customers
- `GET /wp-json/tabesh/v2/customers` - List customers
- `POST /wp-json/tabesh/v2/customers` - Create customer

### Settings
- `GET /wp-json/tabesh/v2/settings` - Get settings
- `POST /wp-json/tabesh/v2/settings` - Update settings

## 🚀 Quick Start Commands

### Development Setup
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode (hot reload)
npm run start
```

### Code Quality
```bash
# Lint JavaScript
npm run lint:js

# Lint CSS
npm run lint:css

# Format code
npm run format
```

## 📋 Next Steps

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Build React App:**
   ```bash
   npm run build
   ```

3. **Test Plugin:**
   - Install in WordPress (development environment)
   - Activate the plugin
   - Check database tables are created
   - Access Tabesh v2 menu in admin
   - Test REST API endpoints

4. **Development:**
   - Run `npm run start` for hot reload
   - Make code changes
   - Test in WordPress admin

## 🎯 Key Features

✅ **Modular Architecture** - Independent, interconnected classes
✅ **React-Based UI** - Modern, responsive interface
✅ **REST API** - Complete CRUD operations
✅ **Multi-Role Support** - Customer, Manager, Employee panels
✅ **Security** - Built-in nonce verification, sanitization, validation
✅ **Internationalization** - i18n ready
✅ **Database Tables** - Custom tables for orders and customers
✅ **Documentation** - Comprehensive guides and references

## 📚 Documentation Files

1. **README.md** - Project overview, features, installation
2. **INSTALLATION.md** - Step-by-step installation (Persian)
3. **API_DOCUMENTATION.md** - REST API reference with examples
4. **DEVELOPER_GUIDE.md** - Development guidelines and best practices
5. **QUICK_REFERENCE.md** - This file

## 🔧 Architecture Highlights

### PSR-4 Autoloading
- Namespace: `Tabesh_v2\`
- Base directory: `includes/`
- Convention: `class-{name}.php`

### Singleton Pattern
Main plugin class uses singleton for single instance management.

### WordPress Hooks
- `plugins_loaded` - Initialize plugin
- `admin_menu` - Add admin pages
- `rest_api_init` - Register REST routes
- `admin_enqueue_scripts` - Enqueue admin assets

### Security Features
- Nonce verification for forms
- Capability checks on all actions
- Input sanitization
- Output escaping
- Prepared SQL statements

## 📞 Support Resources

- Check documentation files
- Review code comments
- Search GitHub issues
- Create new GitHub issue

---

**Plugin Version:** 1.0.0  
**WordPress Required:** 6.0+  
**PHP Required:** 8.0+  
**License:** GPL v2 or later
