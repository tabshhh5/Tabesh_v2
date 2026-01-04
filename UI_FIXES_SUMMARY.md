# تغییرات UI قیمت‌گذاری ماتریسی - 2026-01-04
# Pricing Matrix UI Changes

## خلاصه تغییرات

این مستند تغییرات انجام شده در رابط کاربری سیستم قیمت‌گذاری ماتریسی برای رفع مشکلات گزارش شده را شرح می‌دهد.

## مشکلات قبلی

### 1. استفاده از Checkbox به جای کلید کشویی
**مشکل:** برای فعال/غیرفعال کردن گزینه‌ها از checkbox استفاده می‌شد که کاربری ضعیفی داشت.

**راه‌حل:** ✅ جایگزینی با Toggle Switch مدرن

### 2. خاموش شدن کل ردیف
**مشکل:** زمانی که یک گزینه برای یک نوع چاپ خاموش می‌شد، کل ردیف خاموش می‌گردید.

**راه‌حل:** ✅ اصلاح منطق enable/disable برای عملکرد per-cell

### 3. قیمت‌گذاری چاپ ترکیبی
**مشکل:** گزینه "چاپ ترکیبی" به صورت یک پارامتر جداگانه وجود داشت.

**راه‌حل:** ✅ حذف از سیستم - محاسبه خودکار از ترکیب سیاه‌وسفید + رنگی

### 4. خطا در نمایش ماتریس صحافی
**مشکل:** پیام خطا نمایش داده می‌شد حتی زمانی که پارامترها تعریف شده بودند.

**راه‌حل:** ✅ بهبود منطق بررسی و نمایش پیام‌های راهنما

---

## تغییرات تکنیکال

### 1. کامپوننت Toggle Switch

**ایجاد کامپوننت جدید:**
```javascript
const ToggleSwitch = ({ checked, onChange, disabled, label }) => {
  // Modern toggle switch with smooth animation
  // Green when enabled, gray when disabled
  // Includes optional label
}
```

**ویژگی‌ها:**
- عرض: 44px، ارتفاع: 24px
- رنگ فعال: `#10b981` (سبز)
- رنگ غیرفعال: `#e5e7eb` (خاکستری)
- انیمیشن روان با `transition: 0.2s`
- سایه داخلی و خارجی برای عمق بیشتر

**استفاده:**
```javascript
<ToggleSwitch
  checked={isEnabled}
  onChange={() => toggleFunction()}
  disabled={saving}
  label="فعال" // اختیاری
/>
```

### 2. اصلاح منطق Enable/Disable

#### قبل (❌ اشتباه):
```javascript
const toggleEnabled = async (paperTypeId, paperWeightId, printTypeId) => {
  const existing = getPageCost(paperTypeId, paperWeightId, printTypeId);
  // مشکل: اگر existing نبود، مقدار پیش‌فرض 0 بود که یعنی disable
  await savePageCost(paperTypeId, paperWeightId, printTypeId, 
    existing?.price || 0, 
    existing ? !existing.is_enabled : 0  // ❌ اشتباه
  );
};
```

#### بعد (✅ صحیح):
```javascript
const toggleEnabled = async (paperTypeId, paperWeightId, printTypeId) => {
  const existing = getPageCost(paperTypeId, paperWeightId, printTypeId);
  // صحیح: اگر existing نبود، مقدار پیش‌فرض 1 (فعال) است
  const newEnabledState = existing ? !existing.is_enabled : 1;
  await savePageCost(paperTypeId, paperWeightId, printTypeId, 
    existing?.price || 0, 
    newEnabledState  // ✅ صحیح
  );
};
```

**تفاوت کلیدی:**
- هر سلول (cell) مستقل است
- تغییر وضعیت یک سلول تاثیری بر سلول‌های دیگر ندارد
- مقدار پیش‌فرض برای موارد جدید: فعال (1)

### 3. حذف چاپ ترکیبی

#### تغییر در Database Initialization:
```php
// قبل ❌
$print_types = array(
    array( 'name' => 'چاپ سیاه‌وسفید', ... ),
    array( 'name' => 'چاپ رنگی', ... ),
    array( 'name' => 'چاپ ترکیبی', ... ),  // ❌ اضافی
);

// بعد ✅
$print_types = array(
    array( 'name' => 'چاپ سیاه‌وسفید', ... ),
    array( 'name' => 'چاپ رنگی', ... ),
    // Note: Combined is calculated, not a separate type
);
```

#### تغییر در Documentation:
```javascript
// قبل ❌
description="مدیریت روشهای چاپ (سیاه‌وسفید، رنگی، ترکیبی)"

// بعد ✅
description="مدیریت روشهای چاپ (سیاه‌وسفید، رنگی). 
چاپ ترکیبی به صورت خودکار از صفحات سیاه‌وسفید و رنگی محاسبه می‌شود."
```

### 4. بهبود پیام‌های UI

#### پیام اصلی (Notice Box):
```javascript
<div style={{ backgroundColor: '#fef3c7', border: '2px solid #f59e0b', ... }}>
  <h4>💡 قانون مهم: قیمت پیش‌فرض</h4>
  <p>
    به صورت پیش‌فرض، تمام پارامترها دارای قیمت 0 تومان هستند.
    <strong>قیمت 0 به معنای غیرفعال بودن آن گزینه است.</strong>
    برای فعال‌سازی هر ترکیب، باید قیمت مناسب را تعیین کرده و 
    کلید کشویی آن را روشن کنید.
  </p>
  <p>
    📝 توجه: چاپ ترکیبی به صورت جداگانه قیمت‌گذاری نمی‌شود. 
    قیمت نهایی چاپ ترکیبی از جمع صفحات سیاه‌وسفید و رنگی محاسبه می‌گردد.
  </p>
</div>
```

#### راهنمای PageCostMatrix:
```javascript
<div style={{ backgroundColor: '#f0f6fc', ... }}>
  <h3>📄 هزینه هر صفحه (کاغذ + چاپ)</h3>
  <p>
    قیمت نهایی هر صفحه شامل هزینه کاغذ و چاپ است. 
    برای ویرایش، روی قیمت کلیک کنید. 
    کلید کشویی روشن/خاموش فعال/غیرفعال بودن هر ترکیب را کنترل می‌کند.
  </p>
  <p style={{ fontStyle: 'italic' }}>
    💡 نکته: هر کلید کشویی فقط برای همان ترکیب خاص (گرماژ + نوع چاپ) 
    عمل می‌کند و سایر گزینه‌ها را تحت تاثیر قرار نمی‌دهد.
  </p>
</div>
```

---

## مقایسه قبل و بعد

### PageCostMatrix - قبل
```
┌────────────┬──────────────┬──────────────┐
│ گرماژ      │ سیاه‌وسفید    │ رنگی         │
├────────────┼──────────────┼──────────────┤
│ 60 گرم     │ 250 ت ☑     │ غیرفعال ☐    │
│ 80 گرم     │ 450 ت ☑     │ 1250 ت ☑     │
└────────────┴──────────────┴──────────────┘
```
**مشکل:** اگر checkbox 60 گرم رنگی را تیک بزنید، ممکن بود کل ردیف تحت تاثیر قرار گیرد

### PageCostMatrix - بعد
```
┌────────────┬─────────────────┬─────────────────┐
│ گرماژ      │ سیاه‌وسفید       │ رنگی            │
├────────────┼─────────────────┼─────────────────┤
│ 60 گرم     │ 250 ت   [🟢 ON] │ غیرفعال [⚫ OFF]│
│ 80 گرم     │ 450 ت   [🟢 ON] │ 1250 ت  [🟢 ON]│
└────────────┴─────────────────┴─────────────────┘
```
**بهبود:** هر toggle switch مستقل است و فقط همان سلول را تحت تاثیر قرار می‌دهد

---

## کامپوننت‌های به‌روز شده

### 1. PageCostMatrix
- ✅ جایگزینی checkbox با ToggleSwitch
- ✅ اصلاح منطق toggleEnabled
- ✅ بهبود توضیحات UI

### 2. BindingCostMatrix
- ✅ جایگزینی checkbox با ToggleSwitch
- ✅ اصلاح منطق toggleEnabled
- ✅ بهبود توضیحات UI

### 3. ServiceBindingRestrictions
- ✅ جایگزینی checkbox با ToggleSwitch
- ✅ حفظ منطق enable/disable (پیش‌فرض enabled)
- ✅ بهبود نمایش وضعیت

### 4. BookPrintingParametersTab
- ✅ به‌روزرسانی توضیحات print types
- ✅ اضافه کردن نکته درباره چاپ ترکیبی

---

## فایل‌های تغییر یافته

1. **`includes/core/class-plugin.php`**
   - حذف "چاپ ترکیبی" از default print types
   - اضافه کردن comment توضیحی

2. **`assets/js/src/components/BookPricingMatrixTab.js`**
   - اضافه کردن کامپوننت ToggleSwitch
   - به‌روزرسانی PageCostMatrix
   - به‌روزرسانی BindingCostMatrix
   - به‌روزرسانی ServiceBindingRestrictions
   - بهبود پیام‌های راهنما
   - اصلاح منطق enable/disable

3. **`assets/js/src/components/BookPrintingParametersTab.js`**
   - به‌روزرسانی description برای print types

4. **`assets/js/build/index.js`** و **`assets/js/build/index.asset.php`**
   - فایل‌های build شده از webpack

---

## راهنمای استفاده برای مدیر

### چگونه یک قیمت را فعال کنم؟
1. روی عدد قیمت کلیک کنید
2. قیمت مورد نظر را وارد کنید و دکمه ✓ را بزنید
3. کلید کشویی را روشن کنید (سبز)

### چگونه یک ترکیب را غیرفعال کنم؟
1. کلید کشویی را خاموش کنید (خاکستری)
2. این ترکیب برای مشتریان قابل انتخاب نخواهد بود

### چرا گزینه "چاپ ترکیبی" ندارم؟
چاپ ترکیبی نیاز به قیمت‌گذاری جداگانه ندارد. وقتی مشتری سفارش ترکیبی ثبت کند (مثلاً 100 صفحه سیاه‌وسفید + 50 صفحه رنگی)، سیستم به صورت خودکار قیمت را از جمع این دو محاسبه می‌کند:
```
قیمت کل = (100 × قیمت سیاه‌وسفید) + (50 × قیمت رنگی)
```

---

## تست‌های انجام شده

### ✅ Test 1: Toggle Switch عملکرد صحیح
- فعال/غیرفعال کردن toggle
- انیمیشن روان
- تغییر رنگ مناسب

### ✅ Test 2: Per-Cell Enable/Disable
- تغییر یک سلول سایر سلول‌ها را تحت تاثیر قرار نمی‌دهد
- هر ترکیب مستقل ذخیره می‌شود

### ✅ Test 3: حذف چاپ ترکیبی
- "چاپ ترکیبی" در لیست انواع چاپ نیست
- پیام راهنما درباره محاسبه خودکار نمایش داده می‌شود

### ✅ Test 4: Build Process
- Webpack build موفقیت‌آمیز
- هیچ خطای JavaScript نیست
- فقط warnings غیرمرتبط (missing icons)

---

## مستندات مرتبط

- `COMBINED_PRINT_CALCULATION.md` - راهنمای کامل محاسبه چاپ ترکیبی
- `BOOK_PRICING_UI_IMPROVEMENTS.md` - مستندات قبلی UI
- `PRICING_MATRIX_SUMMARY.md` - خلاصه پیاده‌سازی ماتریس قیمت‌گذاری

---

## نسخه و تاریخ

- **تاریخ:** 2026-01-04
- **نسخه UI:** 2.1.0
- **نسخه دیتابیس:** 1.2.0 (بدون تغییر)
- **Commit:** e014b78
- **وضعیت:** ✅ آماده برای Production

---

## خلاصه برای توسعه‌دهندگان

**3 تغییر کلیدی:**
1. **Toggle Switch به جای Checkbox** - بهتر است، مدرن‌تر است
2. **Per-Cell Enable/Disable** - منطق اصلاح شد، دیگر کل ردیف تحت تاثیر قرار نمی‌گیرد
3. **حذف چاپ ترکیبی از پارامترها** - محاسبه خودکار از ترکیب دو نوع دیگر

**برای استفاده در پروژه‌های دیگر:**
- کامپوننت ToggleSwitch قابل استفاده مجدد است
- منطق per-cell enable/disable الگویی مناسب برای ماتریس‌های دیگر است
