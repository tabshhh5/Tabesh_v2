# User Dashboard Management System - Implementation Summary

## Overview
This implementation adds a complete user dashboard management system with SMS OTP authentication to the Tabesh v2 plugin. The system uses Meli Payamak (ملی پیامک) for sending one-time passwords via SMS, eliminating the need for traditional password-based authentication.

## Architecture

### Backend Components

#### 1. Authentication Handler (`includes/helpers/class-auth-handler.php`)
**Purpose:** Manages OTP generation, storage, verification, and user login/registration.

**Key Methods:**
- `generate_otp()` - Generates random 5-digit codes
- `store_otp()` - Stores OTP with expiration in database
- `verify_otp()` - Validates OTP and checks expiration
- `send_otp()` - Generates and sends OTP via SMS
- `login_or_register()` - Handles both login for existing users and registration for new ones
- `clean_expired_tokens()` - Maintenance function to remove expired tokens

**Security Features:**
- OTP codes expire after configurable time (default: 120 seconds)
- Used tokens are immediately deleted
- Strong random passwords generated for users
- Mobile numbers validated using regex pattern

#### 2. Meli Payamak SMS Client (`includes/helpers/class-melipayamak.php`)
**Purpose:** Handles communication with Meli Payamak REST API for SMS sending.

**Key Methods:**
- `send_otp()` - Sends OTP using pattern-based SMS
- `test_connection()` - Tests SMS configuration
- `get_credit()` - Retrieves account credit
- `get_error_message()` - Translates error codes to Persian messages

**Features:**
- Uses REST API instead of SOAP for better compatibility
- Pattern-based SMS (not free-text) for cost efficiency
- Persian error messages for all status codes
- Mobile number validation and cleaning

#### 3. User Dashboard Shortcode (`includes/shortcodes/class-user-dashboard-shortcode.php`)
**Purpose:** Provides `[tabesh_user_dashboard]` shortcode for frontend display.

**Renders:**
- Login/registration form for guests
- Dashboard interface for logged-in users
- Configurable menu items

### Database Changes

**New Table: `wp_tabesh_otp_tokens`**
```sql
CREATE TABLE wp_tabesh_otp_tokens (
    id bigint(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mobile varchar(15) NOT NULL,
    code varchar(10) NOT NULL,
    expires_at datetime NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    KEY mobile (mobile),
    KEY expires_at (expires_at)
);
```

**Database Version:** Updated from 1.3.0 to 1.4.0

### REST API Endpoints

#### Authentication Endpoints
1. **POST `/wp-json/tabesh/v2/auth/send-otp`**
   - Public endpoint (no authentication required)
   - Sends OTP to mobile number
   - Parameters: `mobile` (required)

2. **POST `/wp-json/tabesh/v2/auth/verify-otp`**
   - Public endpoint
   - Verifies OTP and logs in/registers user
   - Parameters: `mobile`, `code`, `first_name`, `last_name`, `is_corporate`, `company_name`

3. **POST `/wp-json/tabesh/v2/auth/test-sms`**
   - Admin only endpoint
   - Tests SMS configuration
   - Parameters: `mobile` (required)

#### Dashboard Management Endpoints
1. **POST `/wp-json/tabesh/v2/dashboard/create-page`**
   - Admin only endpoint
   - Creates or regenerates dashboard page
   - Parameters: `slug` (optional)

### Settings Structure

**New Settings Added to `tabesh_v2_settings` option:**

```php
'user_dashboard' => [
    'enabled' => false,
    'page_slug' => 'panel',
    'dashboard_page_id' => 0,
    'menu_items' => [
        ['id' => 'orders', 'label' => 'سفارشات', 'icon' => 'shopping-cart', 'enabled' => true, 'order' => 1],
        ['id' => 'profile', 'label' => 'پروفایل', 'icon' => 'user', 'enabled' => true, 'order' => 2],
        // ... more menu items
    ]
],
'auth' => [
    'otp_enabled' => false,
    'otp_provider' => 'melipayamak',
    'otp_length' => 5,
    'otp_expiry' => 120,
    'melipayamak' => [
        'username' => '',
        'password' => '',
        'sender_number' => '',
        'pattern_id' => '',
        'wsdl_url' => 'https://rest.payamak-panel.com/api/SendSMS/SendByBaseNumber2'
    ],
    'require_name' => true,
    'allow_corporate' => true,
    'replace_woocommerce' => false,
    'auto_create_user' => true,
    'min_mobile_length' => 11
]
```

### Frontend Components

#### React Admin Panel (`assets/js/src/panels/UserDashboardPanel.js`)
- Main admin interface for the new "داشبورد کاربران" menu
- Loads and saves settings via REST API
- Integrates with UserDashboardSettings component

#### React Settings Component (`assets/js/src/components/UserDashboardSettings.js`)
- Dashboard configuration (enable/disable, page slug)
- Menu items management (order, labels, icons, enable/disable)
- OTP settings (length, expiry)
- Meli Payamak configuration
- Test SMS functionality

#### Frontend JavaScript (`assets/js/dashboard.js`)
- Handles mobile form submission
- OTP verification flow
- Multi-step form navigation
- Real-time validation
- API error handling

#### Frontend Styles (`assets/css/dashboard.css`)
- Authentication form styling
- Dashboard layout
- Menu items grid
- Responsive design
- RTL support for Persian

## User Flow

### Registration Flow (New User)
1. User visits dashboard page
2. Enters mobile number
3. Receives OTP via SMS
4. Enters OTP code
5. If first time: enters name, last name, optional corporate info
6. User is created with random password
7. User is automatically logged in
8. Dashboard is displayed

### Login Flow (Existing User)
1. User visits dashboard page
2. Enters mobile number
3. Receives OTP via SMS
4. Enters OTP code
5. User is automatically logged in (no additional info needed)
6. Dashboard is displayed

## Security Measures

1. **OTP Security:**
   - Short expiration time (configurable, default 2 minutes)
   - One-time use (deleted after verification)
   - Random 5-digit codes (10,000 possible combinations)
   - Rate limiting possible through WordPress API

2. **Password Security:**
   - Strong random passwords (20 characters, special chars)
   - Users never know their password
   - No password resets needed

3. **Mobile Validation:**
   - Iranian mobile format: 09xxxxxxxxx
   - 11-digit length validation
   - Pattern matching on frontend and backend

4. **API Security:**
   - HTTPS communication with Meli Payamak
   - Credentials stored in WordPress options (secured)
   - Admin-only endpoints for configuration

5. **WordPress Integration:**
   - Uses WordPress user system
   - Compatible with user roles and capabilities
   - Follows WordPress security best practices

## Configuration Steps

1. **Install and Activate Plugin**
2. **Get Meli Payamak Credentials:**
   - Username and password
   - Sender number (10-digit)
   - Create pattern for OTP
   - Get pattern ID (BodyId)

3. **Configure in WordPress:**
   - Navigate to Tabesh v2 > داشبورد کاربران
   - Enable user dashboard
   - Set page slug
   - Create dashboard page
   - Enable OTP authentication
   - Enter Meli Payamak credentials
   - Test SMS connection
   - Save settings

4. **Use Dashboard:**
   - Direct users to the dashboard page URL
   - Users can login/register with mobile number

## Maintenance

### Cleanup Tasks
- Expired OTP tokens should be cleaned periodically
- Consider adding WordPress cron job:
  ```php
  wp_schedule_event(time(), 'hourly', 'tabesh_clean_expired_otps');
  ```

### Monitoring
- Monitor SMS credits in Meli Payamak panel
- Check error logs for failed SMS sends
- Monitor user registration rates

## Future Enhancements

### Potential Features
1. **WooCommerce Integration:**
   - Replace WooCommerce login with OTP
   - Auto-login during checkout
   - Preserve cart contents

2. **Multi-Provider Support:**
   - Add support for other SMS providers
   - Fallback mechanism

3. **Enhanced Security:**
   - IP-based rate limiting
   - Suspicious activity detection
   - Two-factor authentication option

4. **Analytics:**
   - Login/registration metrics
   - OTP success/failure rates
   - User engagement tracking

5. **Internationalization:**
   - Support for other countries' mobile formats
   - Multiple language support

## Testing Checklist

- [ ] Send OTP successfully
- [ ] Verify OTP code
- [ ] Register new user with mobile only
- [ ] Register with full name
- [ ] Register corporate user
- [ ] Login existing user
- [ ] Handle expired OTP
- [ ] Handle invalid OTP
- [ ] Test mobile validation
- [ ] Test dashboard page creation
- [ ] Test menu management
- [ ] Test settings save/load
- [ ] Check database tables created
- [ ] Verify security measures
- [ ] Test responsive design
- [ ] Test RTL layout

## Documentation

- **Setup Guide:** `USER_DASHBOARD_GUIDE.md` (Persian)
- **API Documentation:** Available via REST API discovery
- **Code Comments:** Inline documentation in all PHP files

## Files Changed/Added

### New Files (14)
- `includes/helpers/class-auth-handler.php`
- `includes/helpers/class-melipayamak.php`
- `includes/shortcodes/class-user-dashboard-shortcode.php`
- `assets/js/src/components/UserDashboardSettings.js`
- `assets/js/src/panels/UserDashboardPanel.js`
- `assets/js/dashboard.js`
- `assets/css/dashboard.css`
- `USER_DASHBOARD_GUIDE.md`

### Modified Files (8)
- `includes/admin/class-admin.php` - Added new menu
- `includes/api/class-rest-api.php` - Added auth endpoints
- `includes/core/class-assets.php` - Added page to asset loading
- `includes/core/class-database.php` - Added OTP table
- `includes/core/class-plugin.php` - Initialize new components
- `includes/panels/class-settings-panel.php` - Added settings
- `assets/js/src/index.js` - Mount UserDashboardPanel
- `assets/js/build/*` - Built React components

## Conclusion

This implementation provides a modern, secure, and user-friendly authentication system that eliminates the need for traditional passwords while maintaining full compatibility with WordPress's user system. The use of SMS OTP via Meli Payamak makes it ideal for Iranian users and businesses.
