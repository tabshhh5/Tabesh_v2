# Super Dashboard - Customer Panel

## Overview

The Super Dashboard is a modern, studio-like customer panel that provides a comprehensive interface for managing print shop orders, viewing financial reports, and accessing various customer services.

## Shortcode

To display the Super Dashboard on any WordPress page or post, use the following shortcode:

```
[tabesh_super_dashboard]
```

### Shortcode Attributes

- `user_id` (optional): Specify a user ID. Defaults to the current logged-in user.

Example:
```
[tabesh_super_dashboard user_id="123"]
```

## Features

### Module-Based Architecture

The dashboard uses a modular architecture where customers can activate and deactivate different modules based on their needs. All modules can be displayed side-by-side in a resizable grid layout.

### Available Modules

1. **تاریخچه قیمت (Price History)**
   - Real-time price tracking for paper, gold, dollar, euro, and dirham
   - Visual trend indicators
   - Mini charts for each currency

2. **مقالات جدید (New Articles)**
   - Latest articles and news
   - Categorized by topic
   - Date stamps

3. **ثبت سفارش جدید (New Order)**
   - Quick order placement
   - Dynamic product selection
   - Parameter configuration based on product type

4. **تاریخچه سفارشات (Order History)**
   - Complete order history
   - Status tracking
   - Amount details

5. **سفارشات در حال انجام (Active Orders)**
   - Real-time order progress
   - Stage information
   - Progress bars

6. **گزارش مالی (Financial Report)**
   - Total purchases
   - Order statistics
   - Average order value
   - Trend analysis

7. **مدیریت فایلها (File Management)**
   - Uploaded files listing
   - File details (size, date)
   - Download capabilities

8. **چتبات هوش مصنوعی (AI Chatbot)**
   - Interactive AI assistant
   - Real-time responses
   - Help and support

9. **تیکت پشتیبانی (Support Ticket)**
   - Submit support tickets
   - Track ticket status

10. **پیام به مدیر حساب (Account Manager)**
    - Direct messaging to account manager
    - Contact information

11. **ناحیه کانون صنفی (Guild Area)**
    - Guild news and updates
    - Announcements

12. **محصولات منتشر شده (Published Products)**
    - Active products
    - Product status

13. **میزان فروش (Sales Metrics)**
    - Sales charts
    - Monthly comparison
    - Performance metrics

14. **بخش تبلیغات (Advertising)**
    - Special offers
    - Promotions
    - Announcements

## User Interface

### Modern Studio Design

- Clean, minimalist interface
- Smooth animations (fade, slide, scale effects)
- Professional color scheme with gradient accents
- Card-based layout for modules

### Layout Controls

Users can switch between two layout modes:

- **Grid Layout**: Modules displayed in a responsive grid
- **List Layout**: Modules displayed in a single column

### Panel Controls

Each module panel includes:

- **Minimize**: Collapse the panel to save space
- **Maximize**: Expand panel to fullscreen
- **Close**: Remove panel from workspace

### Responsive Design

The dashboard is fully responsive and adapts to:

- **Desktop**: Full grid layout with side-by-side panels
- **Tablet**: Adjusted grid with fewer columns
- **Mobile**: Single column layout with optimized touch interactions

## Technical Details

### Technology Stack

- **React**: Component-based UI
- **WordPress Elements**: WordPress-specific React utilities
- **CSS3**: Modern animations and transitions
- **RTL Support**: Full right-to-left language support

### Performance

- Lazy loading of modules
- Optimized animations
- No page refresh (SPA architecture)
- Smooth transitions

### Security

- User authentication required
- WordPress nonce verification
- Capability checks
- Secure REST API integration

## Usage Example

1. **Create a page** in WordPress admin
2. **Add the shortcode**: `[tabesh_super_dashboard]`
3. **Publish the page**
4. **View the page** (must be logged in as a customer)
5. **Select modules** to activate them
6. **Arrange panels** using layout controls
7. **Interact** with the active modules

## Customization

### Colors

Module colors are defined using CSS custom properties:

```css
--module-color: #4CAF50; /* Individual module color */
```

### Animation Speed

Animation speed can be configured in the dashboard settings:

- `fast`: 0.2s transitions
- `normal`: 0.3s transitions (default)
- `slow`: 0.5s transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- This is a UI-only implementation (Phase 1)
- Backend integration and API connections will be added in future phases
- All data displayed is currently static/placeholder
- Module functionality will be implemented in subsequent updates

## Future Enhancements

- Real-time data integration
- Advanced charting with libraries (Chart.js)
- Drag-and-drop panel arrangement
- Customizable module sizes
- User preference persistence
- Export functionality for reports
- Print-friendly layouts
