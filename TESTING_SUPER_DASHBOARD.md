# Testing Super Dashboard in WordPress

## Quick Test Guide

### 1. Plugin Activation
After installing the plugin, activate it from WordPress admin:
- Go to **Plugins** → **Installed Plugins**
- Find "Tabesh v2 - Print Shop Order Management"
- Click **Activate**

### 2. Create Test Page
Create a new page to display the dashboard:

1. Go to **Pages** → **Add New**
2. Give it a title: "Customer Dashboard" or "پنل مشتریان"
3. Add the shortcode to the content:
   ```
   [tabesh_super_dashboard]
   ```
4. Click **Publish**

### 3. User Setup
The dashboard requires a logged-in user with customer role:

**Option A: Create a new customer user**
1. Go to **Users** → **Add New**
2. Fill in the required fields
3. Set **Role** to "Tabesh Customer"
4. Click **Add New User**

**Option B: Test as admin**
- Administrators can also access the dashboard
- Simply log in with your admin account

### 4. View Dashboard
1. Log in with a customer account or admin account
2. Navigate to the page you created
3. You should see the Super Dashboard with all modules

### 5. Test Features

**Module Selection:**
- Click on any module card to activate/deactivate it
- Active modules appear in the workspace below
- The counter updates showing active modules

**Layout Controls:**
- Click the grid icon (⊞) for grid layout
- Click the list icon (☰) for list layout
- Test both layouts to see the difference

**Panel Controls:**
Each active module has three control buttons:
- **Minimize (−)**: Collapse the panel
- **Maximize (⛶)**: Expand to fullscreen
- **Close (×)**: Remove from workspace

**Responsive Testing:**
- Resize browser window to test responsive behavior
- Test on mobile device or use browser dev tools
- Check all breakpoints: Desktop (1200px+), Tablet (768px), Mobile (480px)

### 6. Expected Behavior

**Desktop (> 1200px):**
- Header with title and layout controls
- Module selector grid with 7 columns
- Active modules in 2-3 column grid
- All modules side-by-side

**Tablet (768px - 1200px):**
- Header stacked or side-by-side
- Module selector grid with 4-5 columns
- Active modules in 2 column grid

**Mobile (< 768px):**
- Header elements stacked
- Module selector grid with 2-3 columns
- Active modules in single column
- Optimized spacing and touch targets

### 7. Module Content

All modules display placeholder/demo content:
- **Price History**: Shows sample currency prices with trends
- **New Order**: Order form with product selection
- **Order History**: Sample order list
- **Active Orders**: Orders with progress bars
- **Financial Report**: Financial metrics cards
- And more...

### 8. Troubleshooting

**Dashboard not displaying?**
- Ensure you're logged in
- Check user has 'tabesh_customer' role or is admin
- Verify shortcode is correctly placed
- Check browser console for JavaScript errors

**Styles not loading?**
- Clear browser cache
- Check that build files exist in `/assets/js/build/`
- Run `npm run build` to rebuild assets

**Permission denied message?**
- User needs 'tabesh_customer' role or 'manage_options' capability
- Update user role in WordPress admin

### 9. Browser Console Testing

Open browser console (F12) and check for:
- No JavaScript errors
- React components mounted successfully
- Look for log: "Rendering SuperDashboard component"

### 10. Performance Testing

**Load Time:**
- Initial page load should be quick
- Assets are minified and optimized
- No unnecessary API calls (Phase 1)

**Animations:**
- Should be smooth at 60fps
- No janky transitions
- All animations complete within 0.5s

### 11. Screenshot Checklist

Take screenshots of:
- [ ] Desktop view with modules selector
- [ ] Desktop view with 2-3 active modules
- [ ] Tablet landscape view
- [ ] Mobile portrait view
- [ ] Module in minimized state
- [ ] Module in fullscreen state
- [ ] Empty workspace (no modules active)
- [ ] Grid layout mode
- [ ] List layout mode

### 12. Feature Testing Checklist

- [ ] Shortcode renders on page
- [ ] Login requirement works
- [ ] Permission check works
- [ ] Module activation/deactivation
- [ ] Grid/List layout switching
- [ ] Panel minimize/maximize/close
- [ ] Smooth animations
- [ ] Responsive breakpoints
- [ ] RTL text direction
- [ ] Module content displays
- [ ] Icons and emojis render
- [ ] Color gradients apply
- [ ] Hover effects work
- [ ] Click interactions work

## Development Testing

### Run Development Server
```bash
npm run start
```
This enables hot-reload for development.

### Build for Production
```bash
npm run build
```

### Check Build Files
Ensure these files exist after build:
- `assets/js/build/index.js`
- `assets/js/build/index.css`
- `assets/js/build/index-rtl.css`
- `assets/js/build/index.asset.php`

## Notes for Phase 2

Current limitations (intentional for Phase 1):
- No real data from database
- No API connections
- Static placeholder content
- No data persistence
- No backend processing

These will be addressed in Phase 2 with:
- REST API integration
- Real-time data fetching
- Database connections
- User preference saving
- Actual functionality for all modules
