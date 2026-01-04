# Customer Super Panel - Tabesh v2

## Overview

The Customer Super Panel is a modern, professional dashboard interface for print shop customers. It provides a comprehensive workspace with multiple sections for managing orders, files, communications, and more.

## Recent Updates (v2.0)

### 🎨 Complete Redesign
- **Dark/Light Theme Toggle**: Users can switch between dark and light modes with a button in the header
- **Persistent Side-by-Side Menu**: Mega menu stays open, allowing simultaneous work in menu and content
- **Modern Animations**: Smooth transitions, staggered card animations, and interactive hover effects
- **Enhanced UX**: Inspired by YouTube, Steam, and ChatGPT for a professional feel
- **Improved Responsiveness**: Better mobile and tablet experience

### 🚀 Key Features
- Theme persistence with localStorage
- CSS variables for consistent theming
- Smooth cubic-bezier transitions
- Ripple effects on buttons
- Staggered animations for better visual hierarchy
- Side-by-side layout with adjustable workspace

## Features

### UI/UX
- **Modern Design**: Inspired by world-class platforms like YouTube, Steam, and ChatGPT
- **Responsive**: Fully responsive design that works on desktop, tablet, and mobile
- **RTL Support**: Complete right-to-left language support for Persian/Arabic
- **SPA Experience**: Single Page Application with smooth transitions
- **Smooth Animations**: Purposeful animations for better user experience

### Architecture
- **Modular Components**: Each section is an independent React component
- **Mega Menu**: Expandable side menu with categorized sections
- **Global Header**: Context-specific header for each workspace
- **Side-by-Side Layout**: Users can manage workspace layout
- **PWA-like**: Progressive Web App experience on mobile devices

## Usage

### Shortcode

Display the customer dashboard using the following shortcode:

```
[tabesh_customer_dashboard]
```

### Shortcode Attributes

- `theme` (optional): Set the theme. Default: `light`
- `lang` (optional): Set the language. Default: auto-detected (RTL/LTR)

**Example:**
```
[tabesh_customer_dashboard theme="light" lang="fa"]
```

## Dashboard Sections

The dashboard includes 15 comprehensive sections:

1. **Dashboard (پیشخوان)** - Main overview with statistics and quick actions
2. **Price History Charts (نمودار تاریخچه قیمت)** - Track prices of paper, gold, currency
3. **Articles (مقالات جدید)** - Latest news and educational content
4. **New Order (ثبت سفارش جدید)** - Create new print orders
5. **Order History (تاریخچه سفارشات)** - View past orders
6. **Active Orders (سفارشات در حال انجام)** - Track current orders with progress
7. **Financial Reports (گزارش مالی)** - Financial statements and transactions
8. **File Management (مدیریت فایل)** - Upload and manage print files
9. **AI Chatbot (چتبات هوش مصنوعی)** - AI-powered customer support
10. **Ticket System (ارسال تیکت)** - Submit and track support tickets
11. **Account Manager (پیام به مدیر حساب)** - Direct messaging with account manager
12. **Trade Union (ناحیه کانون صنفی)** - Industry news and resources
13. **Published Products (محصولات منتشر شده)** - Manage published products
14. **Sales Metrics (میزان فروش)** - Sales analytics and reports
15. **Advertisements (تبلیغات)** - Manage advertising campaigns

## Technical Details

### File Structure

```
includes/
└── shortcodes/
    └── class-customer-dashboard-shortcode.php

assets/js/src/
├── customer-dashboard.js                 # Entry point
├── contexts/
│   └── ThemeContext.js                   # Theme management (dark/light)
├── components/
│   ├── CustomerSuperPanel.js            # Main panel component with theme support
│   ├── MegaMenu.js                      # Navigation menu (persistent)
│   ├── GlobalHeader.js                  # Section header with theme toggle
│   └── sections/                        # All section components
│       ├── DashboardHome.js
│       ├── PriceCharts.js
│       ├── Articles.js
│       ├── NewOrder.js
│       ├── OrderHistory.js
│       ├── ActiveOrders.js
│       ├── FinancialReports.js
│       ├── FileManagement.js
│       ├── AIChatbot.js
│       ├── TicketSystem.js
│       ├── AccountManager.js
│       ├── TradeUnion.js
│       ├── PublishedProducts.js
│       ├── SalesMetrics.js
│       └── Advertisements.js
└── styles/
    ├── customer-dashboard.scss          # Main styles with CSS variables
    └── sections/
        ├── _common.scss                 # Common section styles
        ├── _dashboard-home.scss         # Dashboard specific styles
        └── _all-sections.scss           # All other sections

assets/js/build/
├── customer-dashboard.js                # Compiled JS
├── customer-dashboard.css               # Compiled CSS
└── customer-dashboard-rtl.css           # RTL CSS
```

### Dependencies

- WordPress 6.0+
- PHP 8.0+
- React 18.2+
- @wordpress/components
- @wordpress/icons
- @wordpress/element
- @wordpress/i18n

## Development

### Building Assets

```bash
# Install dependencies
npm install

# Development mode (watch)
npm run start

# Production build
npm run build
```

### Customization

The super panel is designed to be highly customizable:

1. **Add New Sections**: Create a new component in `assets/js/src/components/sections/`
2. **Modify Styles**: Edit SCSS files in `assets/js/src/styles/`
3. **Update Menu**: Modify `CustomerSuperPanel.js` to add/remove sections
4. **Change Layout**: Adjust the workspace structure in main components

### Hooks and Filters

The shortcode class provides WordPress hooks for customization:

```php
// Modify user data
add_filter('tabesh_customer_dashboard_user_data', function($user_data) {
    // Modify user data before sending to JavaScript
    return $user_data;
});

// Modify localized script data
add_filter('tabesh_customer_dashboard_script_data', function($data) {
    // Add custom data to JavaScript
    return $data;
});
```

## Future Enhancements

The current implementation provides the UI/UX structure. Future development will add:

- [ ] Backend API endpoints for each section
- [ ] Real data integration
- [ ] User permissions and role management
- [ ] Advanced filtering and search
- [ ] Export functionality
- [ ] Real-time notifications
- [ ] Advanced chart integrations
- [ ] File upload processing
- [ ] AI chatbot integration
- [ ] Payment gateway integration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

The dashboard is optimized for performance:
- Code splitting for section components
- Lazy loading where appropriate
- Optimized asset delivery
- Minimal bundle size
- Efficient React rendering

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- Proper ARIA labels
- Focus management

## Support

For issues or feature requests, please contact the development team or create an issue in the GitHub repository.

## License

GPL v2 or later
