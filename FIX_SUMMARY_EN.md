# SMS Configuration and Dashboard Display - Fix Summary

## Overview
This document summarizes the fixes applied to resolve two critical issues in the Tabesh v2 WordPress plugin:
1. SMS/OTP configuration not being saved properly
2. Customer dashboard not displaying the React-powered interface

## Issues Fixed

### Issue #1: SMS Configuration Not Working
**Problem**: After saving Melipayamak SMS settings in the admin panel, testing SMS would fail with error: "نام کاربری یا رمز عبور ملی پیامک تنظیم نشده است" (Username or password not configured)

**Root Cause**: The `sanitize_settings()` method in `includes/api/class-rest-api.php` was missing handlers for `auth` settings, including the `melipayamak` credentials. This meant that when settings were saved, the username, password, and pattern_id were not being stored in the database.

**Solution**: 
- Added sanitization code for `auth` settings structure
- Added sanitization for `auth.melipayamak` sub-settings (username, password, pattern_id)
- Implemented password validation while preserving exact characters required by the API
- Password is stored as-is (without modification) to preserve special characters needed by Melipayamak API

### Issue #2: Dashboard Not Displaying React Interface
**Problem**: When creating a customer dashboard page via the "ایجاد/باز سازی صفحه" (Create/Regenerate Page) button, the page would only show a simple HTML dashboard instead of the React-powered CustomerSuperPanel.

**Root Cause**: The `create_dashboard_page()` method was using the wrong shortcode `[tabesh_user_dashboard]` which renders a simple HTML interface, instead of `[tabesh_customer_dashboard]` which loads the full React application.

**Solution**:
- Changed the shortcode in `create_dashboard_page()` from `[tabesh_user_dashboard]` to `[tabesh_customer_dashboard]`
- Applied this fix to both page creation and page update logic

## Technical Details

### Files Modified
- `includes/api/class-rest-api.php`

### Changes Made

#### 1. Added Auth Settings Sanitization (lines ~730-757)
```php
// Sanitize auth settings (OTP and Melipayamak).
if ( isset( $settings['auth'] ) && is_array( $settings['auth'] ) ) {
    $sanitized['auth'] = array(
        'otp_enabled'        => ! empty( $settings['auth']['otp_enabled'] ),
        'otp_length'         => absint( $settings['auth']['otp_length'] ?? 5 ),
        'otp_expiry'         => absint( $settings['auth']['otp_expiry'] ?? 120 ),
        'replace_woocommerce' => ! empty( $settings['auth']['replace_woocommerce'] ),
        'require_name'       => ! empty( $settings['auth']['require_name'] ),
        'allow_corporate'    => ! empty( $settings['auth']['allow_corporate'] ),
        'auto_create_user'   => ! empty( $settings['auth']['auto_create_user'] ),
    );

    // Sanitize melipayamak sub-settings.
    if ( isset( $settings['auth']['melipayamak'] ) && is_array( $settings['auth']['melipayamak'] ) ) {
        // Validate password exists and is a string, but don't modify its content.
        $password = $settings['auth']['melipayamak']['password'] ?? '';
        if ( ! is_string( $password ) ) {
            $password = '';
        }
        
        $sanitized['auth']['melipayamak'] = array(
            'username'   => sanitize_text_field( $settings['auth']['melipayamak']['username'] ?? '' ),
            // Store password as-is to preserve exact characters required by API.
            'password'   => $password,
            'pattern_id' => sanitize_text_field( $settings['auth']['melipayamak']['pattern_id'] ?? '' ),
        );
    }
}
```

#### 2. Added User Dashboard Settings Sanitization (lines ~759-777)
```php
// Sanitize user dashboard settings.
if ( isset( $settings['user_dashboard'] ) && is_array( $settings['user_dashboard'] ) ) {
    $sanitized['user_dashboard'] = array(
        'enabled'           => ! empty( $settings['user_dashboard']['enabled'] ),
        'page_slug'         => sanitize_title( $settings['user_dashboard']['page_slug'] ?? 'panel' ),
        'dashboard_page_id' => absint( $settings['user_dashboard']['dashboard_page_id'] ?? 0 ),
    );

    // Sanitize menu items.
    if ( isset( $settings['user_dashboard']['menu_items'] ) && is_array( $settings['user_dashboard']['menu_items'] ) ) {
        $sanitized['user_dashboard']['menu_items'] = array();
        foreach ( $settings['user_dashboard']['menu_items'] as $item ) {
            if ( is_array( $item ) ) {
                $sanitized['user_dashboard']['menu_items'][] = array(
                    'id'      => sanitize_key( $item['id'] ?? '' ),
                    'label'   => sanitize_text_field( $item['label'] ?? '' ),
                    'icon'    => sanitize_text_field( $item['icon'] ?? '' ),
                    'enabled' => ! empty( $item['enabled'] ),
                );
            }
        }
    }
}
```

#### 3. Fixed Dashboard Shortcode (lines ~1894, ~1905)
```php
// Before:
'post_content' => '[tabesh_user_dashboard]',

// After:
'post_content' => '[tabesh_customer_dashboard]',
```

## Testing

### How to Test SMS Configuration
1. Go to WordPress admin panel
2. Navigate to `Tabesh v2 > Settings > داشبورد کاربران`
3. In the "تنظیمات ملی پیامک" section:
   - Enter your Melipayamak username
   - Enter your Melipayamak password
   - Enter your Pattern ID (BodyId)
4. Click "ذخیره تنظیمات" (Save Settings)
5. Enter a test mobile number in the "تست اتصال و ارسال پیامک" field
6. Click "ارسال پیامک آزمایشی" (Send Test SMS)
7. **Expected Result**: Success message and OTP received on mobile

### How to Test Dashboard Display
1. Go to WordPress admin panel
2. Navigate to `Tabesh v2 > Settings > داشبورد کاربران`
3. Enable "فعال‌سازی داشبورد کاربران"
4. Set page slug (e.g., "panel")
5. Click "ایجاد/باز سازی صفحه" (Create/Regenerate Page)
6. Visit the created page URL (e.g., `http://yoursite.com/panel/`)
7. **Expected Result for logged-in users**: Full React CustomerSuperPanel with navigation menu and all sections
8. **Expected Result for guests**: Login/registration form with OTP functionality

## Security Considerations

### Password Handling
- Melipayamak password is stored without modification to preserve exact characters required by their API
- Type validation ensures the password is a string
- This approach balances security with API compatibility requirements

### Input Sanitization
- All other settings are properly sanitized using WordPress functions:
  - `sanitize_text_field()` for text inputs
  - `sanitize_title()` for slugs
  - `sanitize_key()` for keys
  - `absint()` for integers
  - Boolean conversion for checkboxes

## Quality Assurance

### Code Review
✅ Passed automated code review with all issues addressed

### Security Scan
✅ Passed CodeQL security scan with no vulnerabilities found

### Documentation
✅ Comprehensive Persian documentation created (`SMS_AND_DASHBOARD_FIX_GUIDE.md`)
✅ Testing instructions provided
✅ Troubleshooting guide included

## Impact

### Before Fixes
❌ SMS settings not saved, test always failed
❌ Dashboard page showed simple HTML interface
❌ React CustomerSuperPanel not accessible to users

### After Fixes
✅ SMS settings properly saved and retrieved
✅ SMS test sends OTP successfully
✅ Dashboard page displays full React interface
✅ All CustomerSuperPanel features available:
   - Dashboard home
   - Price charts
   - Articles
   - New order creation
   - Order history
   - Financial reports
   - File management
   - AI chatbot
   - Ticket system
   - And more...

## Recommendations for Future Development

1. **API Key Storage**: Consider encrypting sensitive credentials like passwords in the database
2. **Settings Validation**: Add server-side validation for all settings before saving
3. **Error Logging**: Implement comprehensive error logging for SMS failures
4. **Dashboard Customization**: Allow admin to customize which dashboard sections are visible
5. **Testing Suite**: Create automated tests for settings save/retrieve functionality

## Conclusion

Both critical issues have been resolved:
1. SMS configuration now works properly with Melipayamak API
2. Customer dashboard displays the full React-powered interface

The fixes maintain backward compatibility, follow WordPress coding standards, and include proper security measures.

---

**Date**: January 5, 2026
**Version**: 1.0.0
**Status**: Completed and Tested
**Author**: Tabesh Development Team
