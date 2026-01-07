# OTP User Panel System - Quick Start Guide

## 🎯 Overview

This implementation adds a comprehensive OTP-based authentication system and dynamic user dashboard to the Tabesh v2 plugin. Users can log in with their phone number via SMS OTP, and access role-based dashboards.

## ✨ Key Features

- ✅ **OTP Authentication** - Secure login via SMS (Melipayamak API)
- ✅ **5 User Role Dashboards** - Admin, Employee, Customer, Author, Publisher
- ✅ **Modern React UI** - Fast, responsive, mobile-friendly
- ✅ **Security First** - Rate limiting, cryptographic OTP, CSRF protection
- ✅ **Easy Configuration** - Admin settings panel for all options
- ✅ **Production Ready** - Follows WordPress standards and best practices

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Plugin
The plugin is already part of your WordPress installation.

### Step 2: Configure Melipayamak API
1. Go to **Tabesh v2 > Settings > ورود و ثبت نام**
2. Enter your Melipayamak credentials:
   - Username (your phone number)
   - Password
   - Sender Number
   - Body ID (SMS pattern ID)

### Step 3: Configure OTP Settings (Optional)
Default settings work great, but you can customize:
- OTP Length: 6 digits
- Validity: 5 minutes
- Max Attempts: 5
- Rate Limiting: Configured

### Step 4: Set Panel URL (Optional)
- Default: `/panel`
- Custom: Change in settings
- After saving, go to **Settings > Permalinks** and click **Save Changes**

### Step 5: Test
Visit: `https://yoursite.com/panel/`

## 📱 User Experience

### Login Flow
1. Enter phone number → Click "Send OTP"
2. Receive SMS with 6-digit code
3. Enter code → Click "Verify"
4. Redirected to dashboard

### First-Time Registration
1. Enter phone number → Receive OTP
2. Enter code → Prompted for name
3. Fill in first name, last name (company optional)
4. Complete registration → Logged in

## 🎨 Dashboard Features

### Admin/Manager
- Full system statistics
- User management
- Order management
- Reports and analytics

### Employee
- Assigned orders
- Task management
- Support tickets

### Customer
- Order tracking
- Profile management
- Support tickets
- Financial reports

### Author
- Everything customers have +
- Book sales management
- Sales analytics
- Author assistant tools

### Publisher
- Everything authors have +
- Price history charts
- Industry tools
- Group order tracking

## 🔒 Security Features

✅ Cryptographically secure OTP (random_bytes)
✅ Rate limiting (3 requests/minute by default)
✅ Minimum interval between requests (2 minutes)
✅ Maximum verification attempts (5)
✅ Auto-expiring codes (5 minutes)
✅ SQL injection prevention
✅ CSRF protection
✅ Input sanitization

## 📚 Documentation

For detailed documentation, see: **OTP_USER_PANEL_DOCUMENTATION.md**

Includes:
- Complete API reference
- Database schema
- Customization guide
- Troubleshooting
- Security best practices

## 🛠️ Technical Stack

**Backend:**
- PHP 8.0+
- WordPress REST API
- Custom database tables
- Melipayamak SMS API

**Frontend:**
- React 18
- WordPress Components
- Modern CSS with dark mode
- Responsive design

## 📊 Database Tables

- `wp_tabesh_otp_codes` - OTP storage and tracking
- `wp_tabesh_rate_limit` - Rate limiting data

## 🔌 REST API Endpoints

```
POST /wp-json/tabesh/v2/auth/request-otp
POST /wp-json/tabesh/v2/auth/verify-otp
POST /wp-json/tabesh/v2/auth/complete-registration
GET  /wp-json/tabesh/v2/auth/status
POST /wp-json/tabesh/v2/auth/logout
```

## 🎯 Common Use Cases

### For Print Shop Owners
- Customers log in with phone number
- Place print orders through dashboard
- Track order status in real-time
- Receive SMS notifications

### For Publishers
- Authors manage their books
- Track sales and analytics
- View industry price trends
- Access publisher tools

### For Administrators
- Manage all users and orders
- View comprehensive reports
- Assign tasks to employees
- Configure system settings

## ⚙️ Customization

### Custom User Roles
1. Create panel component in `assets/js/src/dashboard/panels/`
2. Add to Dashboard.js
3. Define menu items in Sidebar.js

### Custom Styling
- Auth pages: `assets/css/auth.css`
- Dashboard: `assets/css/dashboard.css`

### Custom Panel URL
Change in settings or define in PHP:
```php
update_option('tabesh_v2_settings', [
    'panel' => ['url' => 'my-panel']
]);
```

## 🐛 Troubleshooting

### OTP Not Sending
- ✅ Check Melipayamak credentials
- ✅ Verify account has credit
- ✅ Check PHP error logs

### Rate Limit Too Strict
- ✅ Adjust in settings
- ✅ Clear table: `TRUNCATE wp_tabesh_rate_limit`

### Panel Not Loading
- ✅ Flush permalinks (Settings > Permalinks > Save)
- ✅ Check .htaccess writable
- ✅ Verify panel URL in settings

## 📱 Browser Support

✅ Chrome, Firefox, Safari, Edge (latest)
✅ iOS Safari, Android Chrome
✅ Responsive (mobile, tablet, desktop)
✅ Dark mode support

## 🌐 Multilingual

✅ RTL support (Persian/Arabic)
✅ Translation ready
✅ i18n functions used throughout

## 📈 Performance

- Minified JS and CSS
- Indexed database queries
- Automatic cleanup cron jobs
- Optimized React components

## 🤝 Support

For issues:
1. Check documentation
2. Review error logs
3. Check browser console
4. Verify API credentials

## 📝 License

GPL v2 or later

## 🎉 Credits

Developed for the Tabesh v2 plugin by the Tabesh Team.

---

**Ready to go!** Configure your Melipayamak API and start accepting user logins via OTP. 🚀
