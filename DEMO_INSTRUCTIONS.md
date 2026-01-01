# Customer Dashboard Demo

## How to Test the Customer Dashboard

### Step 1: Create a Page

1. Go to WordPress Admin → Pages → Add New
2. Give it a title like "Customer Dashboard" or "پنل مشتریان"
3. Add the shortcode to the page content:

```
[tabesh_customer_dashboard]
```

### Step 2: View the Page

1. Publish the page
2. View it on the frontend
3. You should see the modern customer super panel

### Optional: Customize with Attributes

You can customize the dashboard with shortcode attributes:

```
[tabesh_customer_dashboard theme="light" lang="fa"]
```

## Expected Result

When you view the page, you should see:

1. **Loading State**: Initially shows a loading spinner
2. **Global Header**: Top navigation bar with menu button, section title, and action buttons
3. **Mega Menu**: When clicking the menu button, a side menu slides in with all sections organized by category
4. **Dashboard Content**: The main dashboard home section with:
   - Statistics cards showing active orders, completed orders, total purchases, and open tickets
   - Recent orders list
   - Quick action buttons

### Testing Different Sections

Click on different menu items in the mega menu to explore all 15 sections:

- پیشخوان (Dashboard)
- نمودار تاریخچه قیمت (Price Charts)
- مقالات جدید (Articles)
- ثبت سفارش جدید (New Order)
- تاریخچه سفارشات (Order History)
- سفارشات در حال انجام (Active Orders)
- گزارش مالی (Financial Reports)
- مدیریت فایل (File Management)
- چتبات هوش مصنوعی (AI Chatbot)
- ارسال تیکت (Ticket System)
- پیام به مدیر حساب (Account Manager)
- ناحیه کانون صنفی (Trade Union)
- محصولات منتشر شده (Published Products)
- میزان فروش (Sales Metrics)
- تبلیغات (Advertisements)

## Responsive Testing

Test the dashboard on different screen sizes:

- **Desktop** (1920x1080): Full layout with side-by-side sections
- **Tablet** (768x1024): Adapted layout
- **Mobile** (375x667): Mobile-optimized layout with full-width sections

## Browser Console

Check the browser console for any JavaScript errors. The dashboard should load without errors.

## Styling Verification

Verify that:
- Colors match the design system (blue primary color)
- Fonts are clean and readable
- Hover effects work smoothly
- Transitions are smooth (0.2s ease)
- RTL layout works correctly for Persian text
- Icons display properly (using WordPress icons)

## Notes

- This is a UI-only implementation (no backend functionality yet)
- All data shown is sample/placeholder data
- Forms and buttons are styled but not functional
- API endpoints will be added in future development

## Troubleshooting

### Dashboard doesn't load
- Check that JavaScript is enabled
- Verify that the shortcode class is initialized in `class-plugin.php`
- Check browser console for errors

### Styles look broken
- Clear browser cache
- Rebuild assets: `npm run build`
- Check that CSS files are enqueued properly

### Menu doesn't open
- Check that React is loading properly
- Verify that event handlers are attached
- Check browser console for JavaScript errors

## Screenshots

Take screenshots of:
1. Dashboard home view
2. Mega menu open
3. Different section views
4. Mobile responsive view
5. RTL layout with Persian text

## Next Steps

After verifying the UI works correctly:
1. Add backend API endpoints for each section
2. Connect real data sources
3. Implement form submissions
4. Add user authentication checks
5. Implement file upload functionality
6. Add real-time updates
7. Integrate payment processing
8. Add notification system
