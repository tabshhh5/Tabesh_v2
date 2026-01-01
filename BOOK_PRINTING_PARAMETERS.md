# Book Printing Parameters Management

## Overview

This document describes the Book Printing Parameters Management system implemented in Tabesh v2. This system provides a comprehensive interface for managing all parameters related to book printing orders through the super admin panel (Settings → پارامترهای چاپ کتاب).

## Database Schema

### Tables

The system creates 8 new database tables to manage book printing parameters:

#### 1. `tabesh_book_sizes` (قطع کتاب)
Manages book size options (رقعی, وزیری, رحلی, etc.)

```sql
CREATE TABLE tabesh_book_sizes (
    id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    prompt_master text DEFAULT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY name (name)
);
```

#### 2. `tabesh_paper_types` (نوع کاغذ متن)
Manages paper types (بالک, تحریر, گلاسه, etc.)

```sql
CREATE TABLE tabesh_paper_types (
    id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    prompt_master text DEFAULT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY name (name)
);
```

#### 3. `tabesh_paper_weights` (گرماژ کاغذ متن)
Manages paper weights with relationship to paper types

```sql
CREATE TABLE tabesh_paper_weights (
    id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    paper_type_id bigint(20) UNSIGNED NOT NULL,
    weight int(11) NOT NULL,
    prompt_master text DEFAULT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY paper_type_id (paper_type_id)
);
```

#### 4. `tabesh_print_types` (انواع چاپ)
Manages print types (چاپ سیاه‌وسفید, چاپ رنگی, چاپ ترکیبی)

```sql
CREATE TABLE tabesh_print_types (
    id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    prompt_master text DEFAULT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY name (name)
);
```

#### 5. `tabesh_license_types` (انواع مجوز)
Manages license/permission types for printing

```sql
CREATE TABLE tabesh_license_types (
    id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    prompt_master text DEFAULT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY name (name)
);
```

#### 6. `tabesh_cover_weights` (گرماژ کاغذ جلد)
Manages cover paper weights

```sql
CREATE TABLE tabesh_cover_weights (
    id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    weight int(11) NOT NULL,
    prompt_master text DEFAULT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY weight (weight)
);
```

#### 7. `tabesh_lamination_types` (انواع سلفون جلد)
Manages lamination types for covers

```sql
CREATE TABLE tabesh_lamination_types (
    id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    prompt_master text DEFAULT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY name (name)
);
```

#### 8. `tabesh_additional_services` (خدمات اضافی)
Manages additional services (شیرینک, نقره‌کوب, طلاکوب, etc.)

```sql
CREATE TABLE tabesh_additional_services (
    id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    prompt_master text DEFAULT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY name (name)
);
```

### Database Upgrade System

The system includes an automatic database upgrade mechanism:
- Database version is tracked in `tabesh_v2_db_version` option
- Current version: `1.1.0`
- Upgrade check runs on `plugins_loaded` hook
- Tables are created/updated automatically when version changes

## REST API Endpoints

All endpoints are namespaced under `/wp-json/tabesh/v2/book-params/`

### Book Sizes (قطع کتاب)

#### Get All Book Sizes
```
GET /wp-json/tabesh/v2/book-params/book-sizes
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "رقعی",
      "prompt_master": "قطع کتاب رقعی با ابعاد استاندارد",
      "created_at": "2024-01-01 12:00:00",
      "updated_at": "2024-01-01 12:00:00"
    }
  ]
}
```

#### Create Book Size
```
POST /wp-json/tabesh/v2/book-params/book-sizes
Content-Type: application/json

{
  "name": "رقعی",
  "prompt_master": "قطع کتاب رقعی با ابعاد استاندارد"
}
```

#### Delete Book Size
```
DELETE /wp-json/tabesh/v2/book-params/book-sizes/{id}
```

### Paper Types (نوع کاغذ متن)

Same structure as Book Sizes:
- `GET /book-params/paper-types`
- `POST /book-params/paper-types`
- `DELETE /book-params/paper-types/{id}`

### Paper Weights (گرماژ کاغذ متن)

#### Get All Paper Weights
```
GET /wp-json/tabesh/v2/book-params/paper-weights
```

Response includes paper type relationship:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "paper_type_id": 1,
      "weight": 80,
      "paper_type_name": "بالک",
      "prompt_master": "گرماژ 80 گرم",
      "created_at": "2024-01-01 12:00:00",
      "updated_at": "2024-01-01 12:00:00"
    }
  ]
}
```

#### Create Paper Weight
```
POST /wp-json/tabesh/v2/book-params/paper-weights
Content-Type: application/json

{
  "paper_type_id": 1,
  "weight": 80,
  "prompt_master": "گرماژ 80 گرم"
}
```

### Other Parameter Types

All follow the same pattern:
- **Print Types**: `/book-params/print-types`
- **License Types**: `/book-params/license-types`
- **Cover Weights**: `/book-params/cover-weights`
- **Lamination Types**: `/book-params/lamination-types`
- **Additional Services**: `/book-params/additional-services`

## Frontend Interface

### Component: BookPrintingParametersTab

Location: `assets/js/src/components/BookPrintingParametersTab.js`

This React component provides a comprehensive interface for managing all book printing parameters.

### Features

1. **Section-based Layout**: Each parameter type has its own section with:
   - Title and description
   - List of existing items
   - Form to add new items
   - Delete functionality

2. **Prompt Master Field**: Each parameter can have AI-related metadata stored in the `prompt_master` field (displayed with 📝 icon)

3. **Real-time Updates**: Changes are immediately reflected without page reload

4. **Persian/RTL Support**: Full support for Persian language and right-to-left layout

### CSS Styling

Custom styles in `assets/css/admin.css`:
- `.book-printing-parameters-tab` - Main container
- `.parameter-list` - List of parameters
- `.parameter-item` - Individual parameter row
- `.parameter-add-form` - Add new parameter form

### Integration

The component is integrated into the Settings Panel as a new tab:

```javascript
{
    id: 'book_printing',
    title: __( 'پارامترهای چاپ کتاب', 'tabesh-v2' ),
    content: <BookPrintingParametersTab />,
}
```

## Default Data

On first activation, the system populates default data:

### Book Sizes
- رقعی (Raqa'i)
- وزیری (Waziri)
- رحلی (Rahli)
- پالتویی (Paltoui)

### Paper Types
- بالک (Bulk)
- تحریر (Tahrir)
- گلاسه (Glossy)

### Paper Weights
- بالک: 60, 70, 80 گرم
- تحریر: 60, 70, 80, 90 گرم

### Print Types
- چاپ سیاه‌وسفید (Black & White)
- چاپ رنگی (Color)
- چاپ ترکیبی (Combined)

### License Types
- دارای مجوز شخصی (Personal License)
- مجوز انتشارات چاپکو (Chapko Publication License)
- مجوز انتشارات سفیر سلامت (Safir Salamat Publication License)
- بدون مجوز (No License)

### Cover Weights
- 135, 200, 250, 300 گرم

### Lamination Types
- سلفون مات (Matte)
- سلفون براق (Glossy)
- بدون سلفون (No Lamination)

### Additional Services
- شیرینک (Shrink Wrap)
- نقره‌کوب (Silver Foil)
- طلاکوب (Gold Foil)
- UV برجسته (Embossed UV)
- وکیوم (Vacuum Packaging)

## Security

- **Permission Check**: All API endpoints require `manage_options` capability (admin only)
- **Data Sanitization**: All inputs are sanitized before saving:
  - `sanitize_text_field()` for names
  - `sanitize_textarea_field()` for prompt_master
  - `absint()` for IDs and numeric values

## Future Development

This infrastructure is designed to support future pricing and calculation logic:

1. **Pricing Matrix**: Parameters will be used in complex pricing calculations
2. **AI Integration**: `prompt_master` fields will provide context for AI-powered features
3. **Order Processing**: Parameters will be selectable during order creation
4. **Validation Rules**: Custom validation based on parameter combinations

## Usage Examples

### Adding a New Book Size (Frontend)

1. Navigate to WordPress Admin → Tabesh v2 → Settings
2. Click on "پارامترهای چاپ کتاب" tab
3. Scroll to "قطع کتاب" section
4. Enter name: "جیبی"
5. Enter prompt master: "قطع کتاب جیبی با ابعاد کوچک"
6. Click "افزودن قطع کتاب"

### Adding a New Paper Weight (API)

```bash
curl -X POST \
  'https://yoursite.com/wp-json/tabesh/v2/book-params/paper-weights' \
  -H 'Content-Type: application/json' \
  -H 'X-WP-Nonce: YOUR_NONCE' \
  --data '{
    "paper_type_id": 1,
    "weight": 100,
    "prompt_master": "گرماژ 100 گرم با کیفیت بالا"
  }'
```

### Retrieving All Parameters (API)

```bash
curl -X GET \
  'https://yoursite.com/wp-json/tabesh/v2/book-params/book-sizes' \
  -H 'X-WP-Nonce: YOUR_NONCE'
```

## Troubleshooting

### Tables Not Created

If tables are not created on activation:
1. Check database permissions
2. Ensure plugin activation ran successfully
3. Manually trigger table creation: Deactivate and reactivate plugin

### API Returns 403 Error

- Ensure user has `manage_options` capability
- Check if user is logged in
- Verify nonce is included in request headers

### Frontend Not Loading

- Clear browser cache
- Run `npm run build` to rebuild JavaScript
- Check browser console for errors
- Verify React component is properly imported

## Related Files

### Backend
- `includes/core/class-database.php` - Database table definitions
- `includes/api/class-rest-api.php` - REST API endpoints
- `includes/core/class-plugin.php` - Plugin initialization and defaults

### Frontend
- `assets/js/src/components/BookPrintingParametersTab.js` - Main component
- `assets/js/src/panels/SettingsPanel.js` - Settings panel integration
- `assets/css/admin.css` - Custom styling

## Maintenance Notes

- Database version must be incremented when schema changes
- Default data should be reviewed and updated periodically
- Translations should be added to `.po` files for localization
- API endpoints follow REST conventions and WordPress coding standards

---

**Last Updated**: January 2026
**Version**: 1.1.0
**Status**: Production Ready
