# Complete Authentication System v2 - Guide

## 📋 Overview

This document describes the completely redesigned login and registration system in Tabesh v2. The system now features **4 professional templates**, advanced animations, glassmorphism effects, complete WordPress/WooCommerce integration, and comprehensive customization options.

---

## 🎨 Template System

### 1. Minimal Template (Default)
**Description:** Clean, centered form with gradient background
**Best For:** Simple, professional look
**Features:**
- Centered authentication card
- Animated gradient background
- Mobile-first responsive design
- Clean typography and spacing

### 2. Split Screen Template
**Description:** Side-by-side layout with banner/slider
**Best For:** Showcasing brand imagery or promotional content
**Features:**
- 50/50 split on desktop
- Banner can be positioned left or right
- Supports static images or Revolution Slider shortcode
- Form side with full customization
- Collapses to single column on mobile

### 3. Full Background Template (fullBg)
**Description:** Full-screen background image with glassmorphism card
**Best For:** Immersive visual experience
**Features:**
- Full-screen background image support
- Glassmorphism (glass effect) card
- Adjustable blur and opacity
- Background overlay with opacity control
- Perfect for branded experiences

### 4. Gradient Motion Template
**Description:** Animated moving gradient background
**Best For:** Modern, dynamic appearance
**Features:**
- Smooth animated gradient
- Continuous motion effect
- Eye-catching and contemporary
- Customizable gradient colors

---

## ✨ Animation System

### Card Entry Animations
Applied when the auth card first appears on screen:

1. **Slide Up** - Card slides up from bottom (Default)
2. **Fade** - Card fades in smoothly
3. **Flip** - Card flips in 3D style
4. **Zoom** - Card zooms in from center
5. **Slide** - Card slides in from side

### Step Transition Animations
Applied when transitioning between mobile → OTP → registration:

1. **Flip** - Form flips like a card (Default)
2. **Slide** - Form slides horizontally
3. **Fade** - Form fades between steps
4. **Zoom** - Form zooms in/out

---

## 🎨 Glassmorphism (Glass Effect)

Available in **Full Background** template:

### Controls:
- **Glass Effect Toggle** - Enable/disable glass appearance
- **Blur Amount** - 0-50px (default: 20px)
- **Glass Opacity** - 0.5-1.0 (default: 0.95)

### Effect:
- Semi-transparent card background
- Blurred backdrop
- Modern frosted glass appearance
- Border with subtle transparency

---

## 🖼️ Background System

### Three Background Types:

#### 1. Gradient (Default)
- Animated or static gradient
- Two customizable colors
- Smooth color transitions
- Motion effect optional (in Gradient template)

#### 2. Image
- Full-screen background image
- Overlay opacity control (0-1)
- Cover positioning
- Works with all templates

#### 3. Solid Color
- Single color background
- Clean, minimal look
- Fast loading

---

## 🎬 Banner & Slider System

### For Split Screen Template:

#### Banner Position:
- **Left** - Banner on left, form on right (RTL-friendly)
- **Right** - Banner on right, form on left

#### Banner Content Options:

**1. Static Image:**
```
URL: https://example.com/banner.jpg
Recommended Size: 800x1200px
```

**2. Revolution Slider:**
```
Shortcode: [rev_slider alias="login-banner"]
```

**3. Any Slider Shortcode:**
```
Works with any WordPress slider plugin
```

### Features:
- Desktop only (collapses on mobile)
- Responsive image sizing
- Support for shortcode execution
- Placeholder shown when empty

---

## 🔐 Security Features

### Rate Limiting

#### OTP Sending:
- **Mobile:** Max 5 requests per 10 minutes
- **IP Address:** Max 20 requests per 10 minutes
- Automatic blocking when limit exceeded
- Clear error messages

#### OTP Verification:
- **Mobile:** Max 10 attempts per 5 minutes
- Prevents brute force attacks
- Automatic counter reset on success

### Session Security:
- Isolated sessions after login
- Secure token handling
- OTP cleanup after use
- Server-side validation only

---

## 🔄 Redirect System

### WordPress Core Redirects:
- `/wp-login.php` → Custom panel (non-admins)
- `/wp-register.php` → Custom panel
- `/wp-admin/` → Custom panel (non-admins)

### WooCommerce Redirects (when enabled):
- `/my-account/` → Custom panel
- `/my-account/orders/` → Custom panel
- `/my-account/downloads/` → Custom panel
- `/my-account/edit-address/` → Custom panel
- `/my-account/edit-account/` → Custom panel
- `/my-account/payment-methods/` → Custom panel

### Exceptions:
- **Admins:** Can access all WordPress/WooCommerce pages
- **Password Reset:** Allowed via wp-login.php
- **Logout:** Redirects to custom panel
- **Profile Edit:** Allowed for all users

---

## 📱 RTL & Internationalization

### Language Support:
- **Persian (فارسی)** - Full RTL support
- **Arabic (العربية)** - Full RTL support  
- **English** - LTR support

### Digit Normalization:
- Persian digits (۰-۹) → English (0-9)
- Arabic digits (٠-٩) → English (0-9)
- Automatic conversion in all inputs
- Mobile and OTP fields always LTR

### Direction Handling:
- Text fields: RTL for Persian/Arabic
- Number fields: Always LTR
- Mixed content: Proper bidirectional support

---

## 📲 SMS & OTP Features

### Auto-fill Support:
```html
<input autocomplete="one-time-code" />
```
- iOS auto-fill from SMS
- Android auto-fill from SMS
- Web OTP API support (modern browsers)

### OTP Input:
- 4, 5, or 6 digit support (configurable)
- Digit-by-digit entry
- Auto-focus next field
- Backspace support
- Paste support (full code)
- Auto-submit on complete

### SMS Integration:
- Melipayamak API
- Pattern-based messaging
- Custom OTP length
- Configurable expiry (60-600 seconds)

---

## ⚙️ Admin Settings Guide

### Location:
WordPress Admin → Tabesh v2 → Settings → ورود و ثبت‌نام

### Template Selection

#### Choose Template:
1. **Minimal** - Simple centered form
2. **Split** - Form + Banner side-by-side
3. **Full Background** - Image background + glass card
4. **Gradient Motion** - Animated gradient

### Background Settings

#### Background Type:
- **Gradient** - Two-color gradient (default)
- **Image** - Full-screen image
- **Solid** - Single color

#### For Image Background:
- Image URL field
- Overlay opacity slider (0-1)
- Automatic overlay for readability

### Banner Settings (Split Template Only)

#### Enable Desktop Banner:
Toggle to show/hide banner panel

#### Banner Position:
- Left (form on right)
- Right (form on left)

#### Banner Content:
- **Image URL** - Direct image link
- **Slider Shortcode** - Revolution Slider or others

### Glassmorphism (fullBg Template Only)

#### Glass Effect Toggle:
Enable/disable glass appearance

#### Blur Amount:
Slider: 0-50px (default: 20px)

#### Glass Opacity:
Slider: 0.5-1.0 (default: 0.95)

### Animation Settings

#### Enable Animations:
Master toggle for all animations

#### Card Entry Animation:
- Slide Up (default)
- Fade
- Flip
- Zoom
- Slide

#### Step Transition Animation:
- Flip (default)
- Slide
- Fade
- Zoom

### Appearance Settings

#### Colors:
- **Primary Color** - Buttons, links, focus states
- **Background Color (Start)** - Gradient start
- **Background Color (End)** - Gradient end

#### Branding:
- **Logo URL** - Custom logo image
- **Brand Title** - Main heading
- **Brand Subtitle** - Subheading text

#### Layout:
- **Card Width** - 320-800px (default: 480px)
- **Card Padding** - 16-80px (default: 48px)
- **Border Radius** - 0-32px (default: 16px)

### OTP Settings

#### OTP Length:
- 4 digits
- 5 digits (default)
- 6 digits

#### OTP Expiry:
- 60-600 seconds (default: 120)

#### Auto Submit:
Toggle automatic verification when OTP complete

### Registration Settings

#### Require Name:
Toggle requirement for first/last name

#### Allow Corporate:
Enable corporate account registration option

#### Auto Create User:
Automatic user creation on successful OTP

---

## 🎯 Best Practices

### Template Selection:

**Use Minimal When:**
- You want simplicity
- Minimal branding needs
- Fast loading is priority
- Mobile-first approach

**Use Split When:**
- You have promotional content
- Brand imagery is important
- Desktop experience matters
- You want to showcase products/services

**Use Full Background When:**
- You have stunning imagery
- Brand immersion is key
- Modern aesthetic desired
- Professional photography available

**Use Gradient Motion When:**
- You want modern dynamics
- No imagery needed
- Attention-grabbing required
- Minimalist but not static

### Color Selection:

**Primary Color:**
- Should match brand
- High contrast with white
- Accessible (WCAG AA minimum)

**Gradient Colors:**
- Complementary or analogous
- Not too high contrast
- Consider readability

### Animation Selection:

**Flip/Zoom:**
- Modern, attention-grabbing
- Good for first impressions
- May be distracting for some

**Slide/Fade:**
- Subtle, professional
- Good for corporate
- Better accessibility

### Performance Tips:

1. **Optimize Images:**
   - Banner: Max 500KB
   - Background: Max 1MB
   - Logo: Max 100KB
   - Use WebP format

2. **Minimize Animations:**
   - Disable on slow connections
   - Test on mobile devices
   - Consider accessibility

3. **Test Templates:**
   - Try all on desktop
   - Try all on mobile
   - Test with slow internet
   - Check different browsers

---

## 🐛 Troubleshooting

### Settings Not Saving:
1. Check browser console for errors
2. Verify admin permissions
3. Clear browser cache
4. Try incognito/private mode

### Redirects Not Working:
1. Check "Replace WooCommerce" is enabled
2. Verify dashboard page exists
3. Check user permissions
4. Clear WordPress cache

### Template Not Displaying:
1. Clear browser cache
2. Rebuild assets: `npm run build`
3. Check theme compatibility
4. Test with default theme

### Animations Not Working:
1. Check "Enable Animations" toggle
2. Test in different browser
3. Check browser DevTools for errors
4. Verify CSS is loaded

### Banner Not Showing:
1. Verify Split template selected
2. Check "Enable Desktop Banner" toggle
3. Verify image URL is accessible
4. Check on desktop (not mobile)

### OTP Not Sending:
1. Verify Melipayamak credentials
2. Check SMS balance
3. Test with "Test SMS" button
4. Check rate limiting

---

## 📱 Mobile Considerations

### Template Behavior:

**Minimal:** Same on all devices

**Split:** 
- Desktop: Side-by-side
- Mobile: Single column (banner hidden)

**Full Background:**
- Desktop: Full image visible
- Mobile: Optimized for smaller screens

**Gradient Motion:**
- Desktop: Full animation
- Mobile: Optimized performance

### Touch Interactions:
- Large tap targets (min 44x44px)
- Easy OTP entry
- Swipe-friendly
- Optimized keyboard

### Performance:
- Lazy loading for images
- Conditional animation loading
- Optimized gradient rendering
- Minimal JavaScript footprint

---

## 🔍 Technical Details

### File Structure:
```
includes/
├── api/class-rest-api.php           # API endpoints & settings
├── helpers/
│   ├── class-auth-handler.php       # OTP logic
│   └── class-dashboard-integration.php  # Redirects
└── panels/class-settings-panel.php  # Default settings

assets/js/src/components/auth/
├── AuthForm.js                      # Main auth component
├── OTPInput.js                      # OTP input component
├── AuthSettingsTab.js               # Admin settings UI
├── auth-form.scss                   # Styles
└── auth-settings.scss               # Admin styles

templates/
└── dashboard-blank.php              # Blank template
```

### API Endpoints:
```
POST /wp-json/tabesh/v2/auth/send-otp
POST /wp-json/tabesh/v2/auth/verify-otp
POST /wp-json/tabesh/v2/auth/check-user
POST /wp-json/tabesh/v2/settings (GET/POST)
```

### Hooks Available:
```php
// Filter login URL
apply_filters('login_url', $url, $redirect, $force_reauth);

// Filter logout redirect
apply_filters('logout_redirect', $redirect_to, $requested_redirect_to, $user);

// Custom redirect checks
do_action('tabesh_before_auth_redirect');
do_action('tabesh_after_auth_redirect');
```

---

## 📚 Additional Resources

### Related Documentation:
- [REGISTRATION_LOGIN_FIXES.md](REGISTRATION_LOGIN_FIXES.md) - Bug fixes history
- [USER_DASHBOARD_GUIDE.md](USER_DASHBOARD_GUIDE.md) - Dashboard features
- [MELIPAYAMAK_AND_DASHBOARD_GUIDE.md](MELIPAYAMAK_AND_DASHBOARD_GUIDE.md) - SMS setup

### External Resources:
- [Melipayamak API Docs](https://panel.melipayamak.com)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [React Documentation](https://react.dev)

---

## 🎉 Summary

The Tabesh v2 Authentication System provides:
- ✅ 4 Professional Templates
- ✅ Advanced Animation System
- ✅ Glassmorphism Effects
- ✅ Complete WP/WC Integration
- ✅ Comprehensive Security
- ✅ Full RTL Support
- ✅ Mobile Optimized
- ✅ Highly Customizable

**Result:** A world-class authentication experience matching international standards (GitHub, ChatGPT, YouTube) while maintaining Persian/RTL excellence.

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review [Troubleshooting](#-troubleshooting) section
3. Check browser console for errors
4. Test with default settings
5. Contact support with detailed description

**Version:** 2.0.0
**Last Updated:** January 6, 2026
