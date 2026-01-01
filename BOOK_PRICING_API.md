# Book Pricing Matrix API Documentation

## Overview

The Book Pricing Matrix API provides endpoints for managing the pricing configuration of book printing products. The pricing system is based on:
- Book size (قطع کتاب)
- Page cost (combination of paper type, paper weight, and print type)
- Binding cost (combination of binding type and cover weight)
- Additional services with different calculation types
- Service restrictions per binding type
- Circulation and page limits

All prices are in Iranian Toman (تومان).

## Base URL

All endpoints are prefixed with `/wp-json/tabesh/v2/`

## Authentication

All endpoints require WordPress authentication with `manage_options` capability (administrator).

## Endpoints

### 1. Get All Pricing Data for a Book Size

Get complete pricing configuration for a specific book size.

**Endpoint:** `GET /book-pricing/{book_size_id}`

**Parameters:**
- `book_size_id` (required): ID of the book size

**Response:**
```json
{
  "success": true,
  "page_costs": [...],
  "bindings": [...],
  "services": [...],
  "restrictions": [...],
  "limits": {...}
}
```

**Example:**
```bash
curl -X GET "https://example.com/wp-json/tabesh/v2/book-pricing/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Page Cost Pricing

#### Get Page Cost Pricing

**Endpoint:** `GET /book-pricing/page-cost`

**Parameters:**
- `book_size_id` (optional): Filter by book size

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "book_size_id": 1,
      "paper_type_id": 1,
      "paper_weight_id": 1,
      "print_type_id": 1,
      "price": "250.00",
      "is_enabled": 1,
      "paper_type_name": "تحریر",
      "paper_weight": 60,
      "print_type_name": "تک رنگ"
    }
  ]
}
```

#### Save Page Cost Pricing

**Endpoint:** `POST /book-pricing/page-cost`

**Request Body:**
```json
{
  "book_size_id": 1,
  "paper_type_id": 1,
  "paper_weight_id": 1,
  "print_type_id": 1,
  "price": 250,
  "is_enabled": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pricing saved successfully"
}
```

**Notes:**
- If a combination already exists, it will be updated
- `is_enabled`: 1 = active, 0 = disabled
- Price should be in Toman without decimals

---

### 3. Binding Pricing

#### Get Binding Pricing

**Endpoint:** `GET /book-pricing/binding`

**Parameters:**
- `book_size_id` (optional): Filter by book size

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "book_size_id": 1,
      "binding_type_id": 1,
      "cover_weight_id": 1,
      "price": "25000.00",
      "is_enabled": 1,
      "binding_type_name": "شومیز",
      "cover_weight": 250
    }
  ]
}
```

#### Save Binding Pricing

**Endpoint:** `POST /book-pricing/binding`

**Request Body:**
```json
{
  "book_size_id": 1,
  "binding_type_id": 1,
  "cover_weight_id": 1,
  "price": 25000,
  "is_enabled": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Binding pricing saved successfully"
}
```

---

### 4. Additional Services Pricing

#### Get Additional Services Pricing

**Endpoint:** `GET /book-pricing/additional-services`

**Parameters:**
- `book_size_id` (optional): Filter by book size

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "book_size_id": 1,
      "service_id": 1,
      "price": "100.00",
      "calculation_type": "per_copy",
      "pages_per_unit": null,
      "is_enabled": 1,
      "service_name": "خط تا"
    }
  ]
}
```

#### Save Additional Services Pricing

**Endpoint:** `POST /book-pricing/additional-services`

**Request Body:**
```json
{
  "book_size_id": 1,
  "service_id": 1,
  "price": 100,
  "calculation_type": "per_copy",
  "pages_per_unit": null,
  "is_enabled": 1
}
```

**Calculation Types:**
- `fixed`: Fixed price added to total
- `per_copy`: Price multiplied by circulation (تیراژ)
- `per_pages`: Price based on total pages (requires `pages_per_unit`)

**Example for pages-based calculation:**
```json
{
  "book_size_id": 1,
  "service_id": 4,
  "price": 20000,
  "calculation_type": "per_pages",
  "pages_per_unit": 10000,
  "is_enabled": 1
}
```

This means: 20,000 Toman per 10,000 pages. If customer orders 15,000 pages, they pay 40,000 Toman (2 units).

---

### 5. Service Binding Restrictions

#### Get Service Binding Restrictions

**Endpoint:** `GET /book-pricing/service-restrictions`

**Parameters:**
- `book_size_id` (optional): Filter by book size

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "book_size_id": 1,
      "service_id": 1,
      "binding_type_id": 1,
      "is_enabled": 1,
      "service_name": "لب گرد",
      "binding_type_name": "شومیز"
    }
  ]
}
```

#### Save Service Binding Restriction

**Endpoint:** `POST /book-pricing/service-restrictions`

**Request Body:**
```json
{
  "book_size_id": 1,
  "service_id": 1,
  "binding_type_id": 1,
  "is_enabled": 1
}
```

**Notes:**
- `is_enabled`: 1 = service is available for this binding type, 0 = not available

---

### 6. Size Limits

#### Get Size Limits

**Endpoint:** `GET /book-pricing/size-limits`

**Parameters:**
- `book_size_id` (optional): Get limits for specific book size, or all if omitted

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "book_size_id": 1,
    "min_circulation": 1,
    "max_circulation": 10000,
    "circulation_step": 1,
    "min_pages": 1,
    "max_pages": 1000,
    "pages_step": 1
  }
}
```

#### Save Size Limits

**Endpoint:** `POST /book-pricing/size-limits`

**Request Body:**
```json
{
  "book_size_id": 1,
  "min_circulation": 1,
  "max_circulation": 10000,
  "circulation_step": 1,
  "min_pages": 1,
  "max_pages": 1000,
  "pages_step": 1
}
```

**Field Descriptions:**
- `min_circulation`: Minimum circulation allowed
- `max_circulation`: Maximum circulation allowed
- `circulation_step`: Step increment for circulation (e.g., 1, 10, 50)
- `min_pages`: Minimum pages allowed
- `max_pages`: Maximum pages allowed
- `pages_step`: Step increment for pages (e.g., 1, 2, 4)

---

## Error Responses

All endpoints may return error responses:

```json
{
  "success": false,
  "message": "Error message"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

---

## Usage Flow for Order Form Development

When building the order form, follow this flow:

1. **Get Book Sizes**
   - Fetch: `GET /book-params/book-sizes`
   - Let customer select book size

2. **Get Size Limits**
   - Fetch: `GET /book-pricing/size-limits?book_size_id={selected_size}`
   - Use limits to validate circulation and pages input

3. **Get Parameters**
   - Fetch all parameters: paper types, weights, print types, binding types, cover weights, services
   - Use: `GET /book-params/{parameter-type}`

4. **Get Pricing Configuration**
   - Fetch: `GET /book-pricing/{book_size_id}`
   - This returns all pricing data for the selected book size

5. **Calculate Price**
   - Page cost: `page_count × price_per_page`
   - Binding cost: `fixed_price_for_binding_and_cover`
   - Additional services:
     - Fixed: add to total
     - Per copy: multiply by circulation
     - Per pages: calculate units based on total pages

6. **Validate Service Availability**
   - Check service restrictions based on selected binding type
   - Disable unavailable services in the UI

---

## Example: Complete Order Calculation

Given:
- Book size: رقعی (ID: 1)
- Pages: 100
- Circulation: 500
- Paper: تحریر 80g, تک رنگ (250 Toman/page)
- Binding: شومیز + جلد 250g (25,000 Toman)
- Services: خط تا (100 Toman per copy)

Calculation:
```
Page cost = 100 pages × 250 Toman = 25,000 Toman
Binding cost = 25,000 Toman
Service cost = 100 Toman × 500 copies = 50,000 Toman
Total per copy = (25,000 + 25,000 + 50,000) / 500 = 200 Toman/copy
Total order = 100,000 Toman (for 500 copies)
```

Note: The actual price calculation will be implemented in the order form and price calculation endpoints (Phase 2).

---

## Version History

- **v1.2.0** (2024): Initial pricing matrix implementation
  - Book pricing tables
  - REST API endpoints
  - React UI components

---

## Support

For questions or issues, contact the development team or refer to the main plugin documentation.
