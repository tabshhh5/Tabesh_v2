# Tabesh v2 API Documentation

## Overview

The Tabesh v2 plugin provides a comprehensive REST API for managing print shop orders, customers, and settings. All endpoints follow WordPress REST API standards and require proper authentication and permissions.

## Base URL

```
https://your-site.com/wp-json/tabesh/v2/
```

## Authentication

All API requests require authentication. Include the `X-WP-Nonce` header with your requests:

```javascript
fetch('/wp-json/tabesh/v2/orders', {
  headers: {
    'X-WP-Nonce': wpApiSettings.nonce,
    'Content-Type': 'application/json'
  }
});
```

## Permissions

All endpoints require the `manage_options` capability by default. Users must have appropriate permissions to access the API.

## Orders API

### List Orders

Get a paginated list of all orders.

**Endpoint:** `GET /orders`

**Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Results per page (default: 20)

**Response:**
```json
{
  "orders": [
    {
      "id": 1,
      "order_number": "ORD-001",
      "customer_id": 5,
      "status": "pending",
      "total_amount": "1500.00",
      "currency": "IRR",
      "priority": "normal",
      "deadline": "2024-01-15 10:00:00",
      "assigned_to": null,
      "notes": "Urgent order",
      "created_at": "2024-01-01 12:00:00",
      "updated_at": "2024-01-01 12:00:00",
      "completed_at": null
    }
  ],
  "total": 100,
  "page": 1,
  "per_page": 20,
  "total_pages": 5
}
```

### Get Order

Get details of a specific order.

**Endpoint:** `GET /orders/{id}`

**Parameters:**
- `id` (required): Order ID

**Response:**
```json
{
  "id": 1,
  "order_number": "ORD-001",
  "customer_id": 5,
  "status": "pending",
  "total_amount": "1500.00",
  "currency": "IRR",
  "priority": "normal",
  "deadline": "2024-01-15 10:00:00",
  "assigned_to": null,
  "notes": "Urgent order",
  "created_at": "2024-01-01 12:00:00",
  "updated_at": "2024-01-01 12:00:00",
  "completed_at": null
}
```

### Create Order

Create a new order.

**Endpoint:** `POST /orders`

**Request Body:**
```json
{
  "order_number": "ORD-002",
  "customer_id": 5,
  "status": "pending",
  "total_amount": 2000.00,
  "notes": "High priority order"
}
```

**Required Fields:**
- `order_number`: Unique order identifier
- `customer_id`: Customer ID

**Optional Fields:**
- `status`: Order status (default: "pending")
- `total_amount`: Order total (default: 0)
- `notes`: Additional notes

**Response:**
```json
{
  "message": "Order created successfully",
  "id": 2
}
```

### Update Order

Update an existing order.

**Endpoint:** `PUT /orders/{id}`

**Parameters:**
- `id` (required): Order ID

**Request Body:**
```json
{
  "status": "completed",
  "total_amount": 2500.00,
  "notes": "Order completed successfully"
}
```

**Response:**
```json
{
  "message": "Order updated successfully"
}
```

### Delete Order

Delete an order.

**Endpoint:** `DELETE /orders/{id}`

**Parameters:**
- `id` (required): Order ID

**Response:**
```json
{
  "message": "Order deleted successfully"
}
```

## Customers API

### List Customers

Get all customers.

**Endpoint:** `GET /customers`

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 10,
    "company_name": "چاپخانه مهر",
    "contact_name": "علی احمدی",
    "email": "ali@example.com",
    "phone": "09123456789",
    "address": "تهران، خیابان آزادی",
    "city": "تهران",
    "postal_code": "1234567890",
    "notes": "",
    "created_at": "2024-01-01 10:00:00",
    "updated_at": "2024-01-01 10:00:00"
  }
]
```

### Create Customer

Create a new customer.

**Endpoint:** `POST /customers`

**Request Body:**
```json
{
  "contact_name": "رضا کریمی",
  "email": "reza@example.com",
  "phone": "09121234567",
  "company_name": "شرکت گرافیک"
}
```

**Required Fields:**
- `contact_name`: Contact person name
- `email`: Email address

**Optional Fields:**
- `phone`: Phone number
- `company_name`: Company name
- `address`: Address
- `city`: City
- `postal_code`: Postal code

**Response:**
```json
{
  "message": "Customer created successfully",
  "id": 2
}
```

## Settings API

### Get Settings

Get plugin settings.

**Endpoint:** `GET /settings`

**Response:**
```json
{
  "version": "1.0.0",
  "currency": "IRR",
  "date_format": "Y-m-d",
  "time_format": "H:i:s",
  "orders_per_page": 20,
  "enable_customers": true,
  "enable_managers": true,
  "enable_employees": true
}
```

### Update Settings

Update plugin settings.

**Endpoint:** `POST /settings`

**Request Body:**
```json
{
  "currency": "IRR",
  "date_format": "Y-m-d",
  "time_format": "H:i:s",
  "orders_per_page": 30,
  "enable_customers": true,
  "enable_managers": true,
  "enable_employees": true
}
```

**Response:**
```json
{
  "message": "Settings updated successfully"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

**404 Not Found:**
```json
{
  "message": "Order not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Failed to create order"
}
```

**401 Unauthorized:**
```json
{
  "code": "rest_forbidden",
  "message": "Sorry, you are not allowed to do that.",
  "data": {
    "status": 401
  }
}
```

## Using the API with JavaScript

### Example: Fetch Orders

```javascript
import apiFetch from '@wordpress/api-fetch';

async function getOrders() {
  try {
    const response = await apiFetch({
      path: '/tabesh/v2/orders',
      method: 'GET',
    });
    console.log(response);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Example: Create Order

```javascript
import apiFetch from '@wordpress/api-fetch';

async function createOrder(orderData) {
  try {
    const response = await apiFetch({
      path: '/tabesh/v2/orders',
      method: 'POST',
      data: orderData,
    });
    console.log('Order created:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

createOrder({
  order_number: 'ORD-003',
  customer_id: 5,
  total_amount: 3000,
  notes: 'Test order'
});
```

## Using the API with PHP

### Example: Get Orders

```php
$request = new WP_REST_Request('GET', '/tabesh/v2/orders');
$response = rest_do_request($request);
$data = $response->get_data();
```

### Example: Create Customer

```php
$request = new WP_REST_Request('POST', '/tabesh/v2/customers');
$request->set_body_params([
    'contact_name' => 'احمد محمدی',
    'email' => 'ahmad@example.com',
    'phone' => '09121234567',
]);
$response = rest_do_request($request);
```

## Rate Limiting

Currently, there are no rate limits implemented. However, it's recommended to implement rate limiting in production environments.

## Versioning

The API uses versioning in the URL path (`/tabesh/v2/`). Future versions will maintain backward compatibility with existing endpoints.

## Support

For API support and questions:
- Check the [documentation](../README.md)
- Open an issue on [GitHub](https://github.com/tabshhh4-sketch/Tabesh_v2/issues)
