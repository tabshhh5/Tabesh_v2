# OTP User Panel System - Implementation Summary

## Overview

This document describes the comprehensive OTP (One-Time Password) authentication system and dynamic user panel implementation for the Tabesh v2 plugin.

## Features Implemented

### 1. OTP Authentication System

#### Backend Components

**Database Tables**
- `wp_tabesh_otp_codes` - Stores OTP codes with expiration and verification tracking
- `wp_tabesh_rate_limit` - Tracks rate limiting for security

**PHP Classes**
- `Tabesh_v2\Auth\OTP_Handler` - Manages OTP generation and Melipayamak API integration
- `Tabesh_v2\Auth\User_Registration` - Handles user registration and login
- `Tabesh_v2\Auth\Auth_Controller` - Main authentication controller
- `Tabesh_v2\Auth\Rate_Limiter` - Implements rate limiting and security

**REST API Endpoints**
- `POST /wp-json/tabesh/v2/auth/request-otp` - Request OTP code
- `POST /wp-json/tabesh/v2/auth/verify-otp` - Verify OTP code
- `POST /wp-json/tabesh/v2/auth/complete-registration` - Complete user registration
- `GET /wp-json/tabesh/v2/auth/status` - Check authentication status
- `POST /wp-json/tabesh/v2/auth/logout` - Logout user

#### Frontend Components

**React Components**
- `LoginPage.js` - Main authentication page
- `OTPForm.js` - OTP verification form with resend functionality
- `RegisterForm.js` - User registration form for first-time users

**Features**
- Modern, minimal, and professional UI design
- Mobile-responsive design
- Dark mode support
- Real-time validation
- Countdown timer for OTP resend
- Error handling and user feedback

### 2. Dynamic User Dashboard

#### User Roles

The system supports 5 different user roles with dedicated panels:

1. **Admin/Manager** - Full system access, user management, reports
2. **Employee** - Limited access to assigned orders and tasks
3. **Customer** - Standard customer features (orders, tickets, profile)
4. **Author** - Customer features + book sales and analytics
5. **Publisher** - All features + price history and industry tools

#### Dashboard Components

**Core Components**
- `Dashboard.js` - Main dashboard orchestrator
- `Header.js` - Global header with user menu
- `Sidebar.js` - Dynamic navigation based on user role
- `Workspace.js` - Main content area
- `MegaMenu.js` - Quick access menu

**Role-Specific Panels**
- `AdminPanel.js` - Admin dashboard with statistics
- `EmployeePanel.js` - Employee task management
- `CustomerPanel.js` - Customer order tracking
- `AuthorPanel.js` - Author book management
- `PublisherPanel.js` - Publisher business tools

### 3. Security Features

#### Rate Limiting
- Configurable maximum requests per time window
- IP-based and phone-based rate limiting
- Automatic cleanup of old rate limit data

#### OTP Security
- Cryptographically secure OTP generation using `random_bytes()`
- Configurable OTP length (4-8 digits)
- Configurable expiration time (1-15 minutes)
- Maximum verification attempts tracking
- Automatic invalidation of used/expired codes

#### Authentication Security
- Nonce verification for all AJAX requests
- CSRF protection
- Prepared SQL statements
- Input sanitization and validation
- Strong auto-generated passwords for users

### 4. Configuration System

#### Admin Settings

**Melipayamak API Configuration**
- Username/Password authentication
- Sender number configuration
- Body ID (Pattern ID) for SMS templates
- Full integration with SendByBaseNumber2 method

**OTP Settings**
- OTP code length (4-8 digits)
- Validity duration (1-15 minutes)
- Maximum verification attempts
- Rate limiting configuration
- Minimum interval between requests

**Panel Settings**
- Custom panel URL (default: `/panel`)
- WooCommerce redirect integration
- Rewrite rules configuration

## Directory Structure

```
tabesh-v2/
├── includes/
│   ├── auth/
│   │   ├── class-otp-handler.php
│   │   ├── class-user-registration.php
│   │   ├── class-auth-controller.php
│   │   └── class-rate-limiter.php
│   ├── api/
│   │   └── class-auth-api.php
│   └── core/
│       └── class-database.php (updated)
├── assets/
│   ├── css/
│   │   ├── auth.css
│   │   └── dashboard.css
│   └── js/
│       └── src/
│           ├── auth/
│           │   ├── LoginPage.js
│           │   ├── OTPForm.js
│           │   └── RegisterForm.js
│           ├── dashboard/
│           │   ├── Dashboard.js
│           │   ├── Header.js
│           │   ├── Sidebar.js
│           │   ├── Workspace.js
│           │   ├── MegaMenu.js
│           │   └── panels/
│           │       ├── AdminPanel.js
│           │       ├── EmployeePanel.js
│           │       ├── CustomerPanel.js
│           │       ├── AuthorPanel.js
│           │       └── PublisherPanel.js
│           ├── auth.js
│           └── dashboard.js
```

## Setup Instructions

### 1. Configure Melipayamak API

1. Sign up at https://www.melipayamak.com/
2. Get your API credentials (username, password)
3. Create an SMS pattern and note the Body ID
4. In WordPress admin, go to Tabesh v2 > Settings > ورود و ثبت نام
5. Enter your Melipayamak credentials

### 2. Configure OTP Settings

1. Go to Tabesh v2 > Settings > ورود و ثبت نام
2. Configure OTP parameters:
   - Length: 6 digits (recommended)
   - Validity: 5 minutes (recommended)
   - Max attempts: 5 (recommended)
   - Rate limiting: 3 requests per 60 seconds
   - Minimum interval: 120 seconds

### 3. Set Panel URL

1. In settings, set your desired panel URL (e.g., "panel")
2. Go to WordPress Settings > Permalinks
3. Click "Save Changes" to flush rewrite rules

### 4. Access the Panel

- Login/Register: `https://yoursite.com/panel/` (or your custom URL)
- Users will be automatically redirected to dashboard after authentication

## User Flow

### First-Time User Registration

1. User enters phone number
2. System sends OTP via SMS
3. User enters OTP code
4. System prompts for first name, last name, (optional) company name
5. User completes registration
6. System creates WordPress user with:
   - Username: phone number
   - Strong auto-generated password
   - Default role: customer
7. User is logged in and redirected to dashboard

### Returning User Login

1. User enters phone number
2. System sends OTP via SMS
3. User enters OTP code
4. User is logged in and redirected to dashboard

## API Integration

### Request OTP

```javascript
POST /wp-json/tabesh/v2/auth/request-otp
Content-Type: application/json

{
  "phone_number": "09123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully."
}
```

### Verify OTP

```javascript
POST /wp-json/tabesh/v2/auth/verify-otp
Content-Type: application/json

{
  "phone_number": "09123456789",
  "otp_code": "123456"
}
```

**Response (Existing User):**
```json
{
  "success": true,
  "message": "Login successful."
}
```

**Response (New User):**
```json
{
  "success": true,
  "needs_registration": true,
  "message": "Please complete your registration."
}
```

### Complete Registration

```javascript
POST /wp-json/tabesh/v2/auth/complete-registration
Content-Type: application/json

{
  "phone_number": "09123456789",
  "otp_code": "123456",
  "first_name": "علی",
  "last_name": "احمدی",
  "company_name": "شرکت نمونه" // optional
}
```

## Database Schema

### OTP Codes Table

```sql
CREATE TABLE wp_tabesh_otp_codes (
  id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  phone_number varchar(20) NOT NULL,
  otp_code varchar(10) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at datetime NOT NULL,
  verified tinyint(1) NOT NULL DEFAULT 0,
  attempts int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY phone_number (phone_number),
  KEY expires_at (expires_at),
  KEY verified (verified)
);
```

### Rate Limit Table

```sql
CREATE TABLE wp_tabesh_rate_limit (
  id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  identifier varchar(100) NOT NULL,
  action_type varchar(50) NOT NULL,
  request_count int(11) NOT NULL DEFAULT 1,
  first_request_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_request_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY identifier_action (identifier, action_type),
  KEY last_request_at (last_request_at)
);
```

## Customization

### Adding Custom User Roles

To add support for additional user roles:

1. Create a new panel component in `assets/js/src/dashboard/panels/`
2. Add the role to `Dashboard.js` in the `getUserRole()` and `renderRolePanel()` functions
3. Add menu items for the role in `Sidebar.js`

### Styling Customization

- Authentication pages: `assets/css/auth.css`
- Dashboard: `assets/css/dashboard.css`

Both CSS files support:
- RTL/LTR layouts
- Dark mode
- Mobile responsive design
- Custom color schemes

## Security Considerations

1. **Never expose Melipayamak credentials** - Store in settings, never in code
2. **Rate limiting is critical** - Prevents SMS bombing and abuse
3. **OTP codes are single-use** - Automatically invalidated after verification
4. **Strong passwords** - Auto-generated 32-character passwords for security
5. **Nonce verification** - All AJAX requests require valid nonces
6. **Prepared statements** - All database queries use prepared statements

## Troubleshooting

### OTP not sending

1. Check Melipayamak credentials in settings
2. Verify Body ID is correct
3. Check PHP error logs for API errors
4. Ensure your Melipayamak account has sufficient credit

### Rate limiting too strict

1. Adjust rate limit settings in OTP configuration
2. Consider increasing time window or max requests
3. Clear rate limit table for testing: `TRUNCATE TABLE wp_tabesh_rate_limit`

### Rewrite rules not working

1. Go to Settings > Permalinks
2. Click "Save Changes" to flush rewrite rules
3. Verify .htaccess is writable (for Apache)

## Performance

- Database tables are indexed for optimal query performance
- Rate limit cleanup runs hourly via WordPress cron
- Expired OTP codes are cleaned up automatically
- CSS and JS are minified and cached

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Android Chrome)
- Progressive enhancement for older browsers

## Future Enhancements

Potential features for future versions:

1. Email OTP as alternative to SMS
2. Two-factor authentication (2FA)
3. Social login integration
4. Biometric authentication
5. Session management dashboard
6. Advanced user analytics
7. Customizable dashboard layouts
8. White-label branding options

## Support

For issues or questions:
- Check documentation
- Review code comments
- Check WordPress error logs
- Review browser console for client-side errors

## License

GPL v2 or later
