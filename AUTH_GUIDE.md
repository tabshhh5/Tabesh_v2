# Login and Registration Modernization Guide

## Overview
This document describes the modernized login and registration system implemented in Tabesh v2. The new system features a React-based authentication form with OTP verification, modern design, and full customization options.

## Features

### User-Facing Features
1. **Modern React-Based Form**
   - Clean, minimal design following international UI standards
   - Smooth animations and transitions
   - Responsive layout for all devices (desktop, tablet, mobile)

2. **OTP Authentication**
   - Digit-by-digit OTP input with auto-focus
   - SMS autofill support (autocomplete="one-time-code")
   - Paste support for OTP codes
   - Auto-submission when all digits are entered
   - Clear visual feedback for verification states

3. **User Registration**
   - Support for both personal and corporate accounts
   - Optional fields based on account type
   - Name and company information collection
   - Automatic user creation upon verification

4. **Visual Feedback**
   - Loading states during API calls
   - Success/error messages with icons
   - Form validation with clear indicators
   - Smooth step transitions

### Admin Features
1. **Customization Panel**
   - Located in: Dashboard → تنظیمات → ورود و ثبت‌نام
   - Live preview of changes
   - Save, reset, and restore defaults options

2. **Appearance Settings**
   - Primary color customization
   - Background gradient colors (start and end)
   - Custom logo URL support
   - Brand title and subtitle

3. **Layout Controls**
   - Card width (320px - 800px)
   - Card padding (16px - 80px)
   - Border radius (0px - 32px)

4. **OTP Configuration**
   - Code length (4, 5, or 6 digits)
   - Expiry time (60 - 600 seconds)
   - Auto-submit toggle

5. **Registration Settings**
   - Auto-create user accounts
   - Require name fields
   - Enable corporate account registration

## Usage

### For End Users

#### Login Flow
1. Navigate to the dashboard page (default: `/panel`)
2. If not logged in, the login form appears automatically
3. Enter mobile number (format: 09xxxxxxxxx)
4. Click "دریافت کد تأیید" to receive OTP
5. Enter the 5-digit code received via SMS
6. Code is automatically verified when complete
7. Existing users are logged in immediately

#### Registration Flow
1. Follow steps 1-6 from Login Flow
2. New users will see additional registration fields:
   - First Name (required)
   - Last Name (required)
   - Corporate Account checkbox (optional)
   - Company Name (if corporate is selected)
3. Click "تکمیل ثبت‌نام" to complete registration
4. Account is created and user is logged in

### For Administrators

#### Customizing Appearance
1. Go to WordPress Admin → Tabesh v2 Settings
2. Click on "ورود و ثبت‌نام" tab
3. Adjust appearance settings:
   - Use color pickers for primary and background colors
   - Enter logo URL for custom branding
   - Modify title and subtitle text
4. Preview changes in real-time on the right panel
5. Click "ذخیره تغییرات" to save

#### Configuring OTP Settings
1. In the same settings tab, expand "تنظیمات OTP"
2. Choose OTP length (4, 5, or 6 digits)
3. Set expiry time (recommended: 120 seconds)
4. Toggle auto-submit feature
5. Save changes

#### Managing Registration Options
1. Expand "تنظیمات ثبت‌نام" section
2. Configure:
   - Auto-create user: Allow automatic user registration
   - Require name: Make name fields mandatory
   - Allow corporate: Enable corporate account option
3. Save changes

## Technical Details

### Components
- `AuthForm.js`: Main authentication component with 3-step flow
- `OTPInput.js`: Specialized OTP input with advanced features
- `AuthSettingsTab.js`: Admin customization panel
- `auth-form.scss`: Modern styling with animations
- `auth-settings.scss`: Settings panel styling

### API Endpoints Used
- `POST /tabesh/v2/auth/check-user`: Check if mobile number exists
- `POST /tabesh/v2/auth/send-otp`: Send OTP code via SMS
- `POST /tabesh/v2/auth/verify-otp`: Verify OTP and login/register
- `GET/POST /tabesh/v2/settings`: Load and save auth settings

### Shortcode
The authentication form is automatically displayed by the `[tabesh_customer_dashboard]` shortcode when the user is not logged in.

### Assets
- JavaScript: `/assets/js/build/auth.js`
- CSS: `/assets/js/build/auth.css`
- Entry point: `/assets/js/src/auth.js`

## Styling

### CSS Variables
The following CSS variables can be customized:
```css
--tabesh-primary: #4f46e5
--tabesh-primary-hover: #4338ca
--tabesh-success: #10b981
--tabesh-error: #ef4444
--tabesh-border: #e5e7eb
--tabesh-radius: 12px
```

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1200px
- Desktop: > 1200px

## Accessibility

### Features
- ARIA labels on all form inputs
- Keyboard navigation support
- Reduced motion support for animations
- High contrast mode compatibility
- Screen reader friendly

### Best Practices
- Semantic HTML structure
- Clear error messages
- Visual and textual feedback
- Focus indicators on interactive elements

## Security

### Measures Implemented
- Input sanitization on all fields
- XSS prevention in form rendering
- CSRF protection via nonces
- OTP expiry enforcement
- Rate limiting support (backend)

### CodeQL Results
- ✅ Zero vulnerabilities detected
- ✅ No security alerts

## Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Android

## Troubleshooting

### Common Issues

**Issue**: OTP code not arriving
- **Solution**: Check SMS service configuration in SMS Settings tab
- Verify mobile number format (must start with 09)
- Check SMS credit balance

**Issue**: Form not appearing
- **Solution**: Ensure auth.js and auth.css are enqueued properly
- Check browser console for JavaScript errors
- Verify user is logged out

**Issue**: Customization changes not showing
- **Solution**: Clear browser cache
- Rebuild assets: `npm run build`
- Check if settings are saved in database

**Issue**: Mobile number validation error
- **Solution**: Ensure number format is exactly 11 digits starting with 09
- Example: 09123456789

## Future Enhancements
1. Social login integration (Google, Apple ID)
2. Dark mode support
3. Multi-language support
4. Remember device option
5. Biometric authentication support
6. Two-factor authentication (2FA)

## Support
For issues or feature requests, please contact:
- GitHub: [Repository Issues](https://github.com/tabshhh5/Tabesh_v2/issues)
- Email: support@tabesh.local

## Changelog

### Version 2.0.0 (Current)
- ✅ React-based authentication form
- ✅ Modern UI with animations
- ✅ Admin customization panel
- ✅ OTP digit-by-digit input
- ✅ SMS autofill support
- ✅ Responsive design
- ✅ Corporate account support
- ✅ Live preview in settings
- ✅ Security scan passed

## Credits
Developed by the Tabesh Team
© 2024 Tabesh. All rights reserved.
