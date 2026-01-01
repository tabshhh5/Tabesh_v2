# Book Pricing Matrix Implementation Summary

## تاریخ: ۱۴۰۴/۱۰/۱۲ (2026-01-01)

## خلاصه پیاده‌سازی

سیستم قیمت‌گذاری ماتریسی برای محصول کتاب با موفقیت پیاده‌سازی شد. این سیستم امکان تنظیم دقیق قیمت‌ها و قوانین سفارش‌گیری را برای هر قطع کتاب فراهم می‌کند.

## تغییرات انجام شده

### ۱. ساختار دیتابیس (Database Schema)

**نسخه دیتابیس:** 1.1.0 → 1.2.0

**جداول جدید:**
1. `tabesh_binding_types` - انواع صحافی (شومیز، جلد سخت، منگنه و...)
2. `tabesh_book_pricing_page_cost` - قیمت هر صفحه (براساس نوع کاغذ، گرماژ و نوع چاپ)
3. `tabesh_book_pricing_binding` - قیمت صحافی و جلد (براساس نوع صحافی و گرماژ جلد)
4. `tabesh_book_pricing_additional_services` - قیمت خدمات اضافی با انواع محاسبه
5. `tabesh_book_pricing_service_binding_restrictions` - محدودیت دسترسی خدمات براساس نوع صحافی
6. `tabesh_book_pricing_size_limits` - محدودیت‌های تیراژ و تعداد صفحه

**فایل تغییر یافته:**
- `includes/core/class-database.php`

### ۲. REST API Endpoints

**نقاط پایانی جدید:**

```
GET  /wp-json/tabesh/v2/book-params/binding-types
POST /wp-json/tabesh/v2/book-params/binding-types
DEL  /wp-json/tabesh/v2/book-params/binding-types/{id}

GET  /wp-json/tabesh/v2/book-pricing/{book_size_id}
GET  /wp-json/tabesh/v2/book-pricing/page-cost
POST /wp-json/tabesh/v2/book-pricing/page-cost
GET  /wp-json/tabesh/v2/book-pricing/binding
POST /wp-json/tabesh/v2/book-pricing/binding
GET  /wp-json/tabesh/v2/book-pricing/additional-services
POST /wp-json/tabesh/v2/book-pricing/additional-services
GET  /wp-json/tabesh/v2/book-pricing/service-restrictions
POST /wp-json/tabesh/v2/book-pricing/service-restrictions
GET  /wp-json/tabesh/v2/book-pricing/size-limits
POST /wp-json/tabesh/v2/book-pricing/size-limits
```

**فایل تغییر یافته:**
- `includes/api/class-rest-api.php`

### ۳. کامپوننت‌های React

**کامپوننت‌های جدید:**

1. **BookPricingMatrixTab.js** (کامپوننت اصلی)
   - انتخابگر قطع کتاب
   - تب‌های مختلف برای انواع قیمت‌گذاری
   
2. **PageCostMatrix** (زیر کامپوننت)
   - جداول ماتریسی برای قیمت هر صفحه
   - گروه‌بندی براساس نوع کاغذ
   - امکان فعال/غیرفعال کردن هر ترکیب
   
3. **BindingCostMatrix** (زیر کامپوننت)
   - جداول قیمت صحافی براساس نوع و گرماژ جلد
   - امکان تعیین مجاز/غیرمجاز بودن هر ترکیب
   
4. **AdditionalServicesConfig** (زیر کامپوننت)
   - تنظیم قیمت خدمات اضافی
   - انتخاب نوع محاسبه (ثابت، به ازای هر جلد، براساس صفحه)
   - تعیین تعداد صفحه برای محاسبات مبتنی بر صفحه
   
5. **ServiceBindingRestrictions** (زیر کامپوننت)
   - تعیین دسترسی خدمات براساس نوع صحافی
   - جداول جداگانه برای هر خدمت
   
6. **SizeLimitsForm** (زیر کامپوننت)
   - تنظیم حداقل، حداکثر و گام تیراژ
   - تنظیم حداقل، حداکثر و گام تعداد صفحات

**فایل‌های جدید:**
- `assets/js/src/components/BookPricingMatrixTab.js`

**فایل‌های تغییر یافته:**
- `assets/js/src/components/PricingSettingsTab.js` - افزودن انتخابگر نوع محصول و یکپارچه‌سازی
- `assets/js/src/components/BookPrintingParametersTab.js` - افزودن مدیریت انواع صحافی

### ۴. مستندات

**مستندات جدید:**
- `BOOK_PRICING_API.md` - مستندات کامل API شامل:
  - توضیح تمام endpoints
  - نمونه‌های request/response
  - راهنمای استفاده برای توسعه فرم ثبت سفارش
  - نمونه محاسبه قیمت

## معماری سیستم

### جریان کار (Workflow)

```
┌─────────────────────────────────────────────────────────────┐
│  مدیر > منوی قیمت‌گذاری > انتخاب نوع محصول: کتاب          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│           BookPricingMatrixTab Component                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  انتخاب قطع کتاب (رقعی، وزیری، رحلی و...)           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│ قیمت صفحه   │    │  قیمت صحافی      │    │ خدمات اضافی │
│              │    │                  │    │              │
│ نوع کاغذ    │    │ نوع صحافی        │    │ نوع محاسبه  │
│ ├─ گرماژ    │    │ ├─ گرماژ جلد    │    │ قیمت         │
│ ├─ نوع چاپ  │    │ └─ قیمت         │    │ محدودیت‌ها   │
│ └─ قیمت     │    │                  │    │              │
└──────────────┘    └──────────────────┘    └──────────────┘
```

### ساختار داده (Data Structure)

```
Book Size (قطع)
  │
  ├─ Page Costs (قیمت صفحه)
  │   └─ [Paper Type × Paper Weight × Print Type] → Price
  │
  ├─ Binding Costs (قیمت صحافی)
  │   └─ [Binding Type × Cover Weight] → Price
  │
  ├─ Additional Services (خدمات اضافی)
  │   └─ Service → Price + Calculation Type
  │
  ├─ Service Restrictions (محدودیت‌ها)
  │   └─ [Service × Binding Type] → Enabled/Disabled
  │
  └─ Size Limits (محدودیت‌ها)
      ├─ Circulation (min/max/step)
      └─ Pages (min/max/step)
```

## ویژگی‌های پیاده‌سازی شده

### ✅ قیمت‌گذاری صفحه
- ماتریس سه‌بعدی: نوع کاغذ × گرماژ × نوع چاپ
- امکان فعال/غیرفعال کردن هر ترکیب
- ویرایش آنی در جداول
- گروه‌بندی براساس نوع کاغذ

### ✅ قیمت‌گذاری صحافی
- ماتریس دوبعدی: نوع صحافی × گرماژ جلد
- امکان تعیین مجاز/غیرمجاز بودن
- پشتیبانی از انواع مختلف صحافی

### ✅ خدمات اضافی
- سه نوع محاسبه:
  1. **ثابت:** مبلغ ثابت به فاکتور اضافه می‌شود
  2. **به ازای هر جلد:** قیمت × تیراژ
  3. **براساس صفحه:** براساس واحدهای صفحه (مثلاً هر ۱۰۰۰۰ صفحه)

### ✅ محدودیت‌های خدمات
- تعیین دسترسی خدمات براساس نوع صحافی
- کنترل دقیق روی ترکیب‌های مجاز

### ✅ محدودیت‌های تیراژ و صفحه
- حداقل و حداکثر
- گام حرکتی (step) برای اعتبارسنجی ورودی

## UX Design

### طراحی رابط کاربری

```
┌────────────────────────────────────────────────┐
│  قیمت‌گذاری ماتریسی کتاب                     │
├────────────────────────────────────────────────┤
│  انتخاب قطع کتاب: [رقعی ▼]                   │
├────────────────────────────────────────────────┤
│  [هزینه صفحه] [صحافی] [خدمات] [محدودیت‌ها]   │
├────────────────────────────────────────────────┤
│                                                │
│  محتوای تب انتخاب شده                         │
│                                                │
└────────────────────────────────────────────────┘
```

### ویژگی‌های UX:
- **تب‌های واضح:** دسته‌بندی منطقی اطلاعات
- **ویرایش درجا:** کلیک روی سلول برای ویرایش
- **وضعیت بصری:** checkbox برای فعال/غیرفعال
- **بارگذاری:** نمایش وضعیت در حین ذخیره
- **گروه‌بندی:** جداول منظم و خوانا

## فایل‌های تغییر یافته

```
includes/
  ├─ core/
  │   └─ class-database.php          [MODIFIED]
  └─ api/
      └─ class-rest-api.php           [MODIFIED]

assets/js/src/components/
  ├─ BookPricingMatrixTab.js          [NEW]
  ├─ PricingSettingsTab.js            [MODIFIED]
  └─ BookPrintingParametersTab.js     [MODIFIED]

BOOK_PRICING_API.md                   [NEW]
```

## آماده برای فاز بعدی

### چه چیزهایی پیاده‌سازی شد:
1. ✅ ساختار دیتابیس کامل
2. ✅ REST API endpoints کامل
3. ✅ رابط کاربری React کامل
4. ✅ مستندات API
5. ✅ یکپارچه‌سازی با منوی تنظیمات

### مراحل بعدی (فاز ۲ - فرم ثبت سفارش):
1. ساخت فرم ثبت سفارش مشتری
2. پیاده‌سازی محاسبه قیمت خودکار
3. اعتبارسنجی ورودی‌ها
4. نمایش پیش‌نمایش سفارش
5. ثبت سفارش در دیتابیس

## نکات مهم برای توسعه‌دهندگان

### استفاده از API:
```javascript
// دریافت قیمت‌های قطع خاص
const pricing = await apiFetch({
  path: `/tabesh/v2/book-pricing/${bookSizeId}`
});

// ذخیره قیمت صفحه
await apiFetch({
  path: '/tabesh/v2/book-pricing/page-cost',
  method: 'POST',
  data: {
    book_size_id: 1,
    paper_type_id: 1,
    paper_weight_id: 1,
    print_type_id: 1,
    price: 250,
    is_enabled: 1
  }
});
```

### محاسبه قیمت:
```javascript
// قیمت صفحه
const pageCost = pageCount × pricePerPage;

// قیمت صحافی
const bindingCost = bindingPrice; // ثابت

// خدمات اضافی
let serviceCost = 0;
services.forEach(service => {
  if (service.calculation_type === 'fixed') {
    serviceCost += service.price;
  } else if (service.calculation_type === 'per_copy') {
    serviceCost += service.price × circulation;
  } else if (service.calculation_type === 'per_pages') {
    const units = Math.ceil(totalPages / service.pages_per_unit);
    serviceCost += service.price × units;
  }
});

// جمع کل
const totalPrice = (pageCost + bindingCost) × circulation + serviceCost;
```

## وضعیت تست

⚠️ **نیاز به تست در محیط WordPress:**
- تست دیتابیس و migration
- تست API endpoints
- تست UI و workflow
- تست محاسبات قیمت

## نتیجه‌گیری

پیاده‌سازی سیستم قیمت‌گذاری ماتریسی با موفقیت انجام شد. تمام بخش‌های مورد نیاز برای مدیریت قیمت‌ها توسط مدیر سیستم آماده است. 

**آماده برای:**
- تست در محیط واقعی
- توسعه فرم ثبت سفارش مشتری
- پیاده‌سازی محاسبه‌گر قیمت

**تعداد خطوط کد افزوده شده:** ~2000+ خط
**تعداد فایل‌های جدید:** 2
**تعداد فایل‌های تغییر یافته:** 3
**تعداد جداول دیتابیس جدید:** 6
**تعداد API endpoints جدید:** 12

---
**توسعه دهنده:** GitHub Copilot
**تاریخ:** 2026-01-01
**نسخه:** 1.2.0
