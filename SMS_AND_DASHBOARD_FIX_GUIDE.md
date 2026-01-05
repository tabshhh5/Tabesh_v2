# راهنمای اصلاح تنظیمات SMS و داشبورد کاربران

## خلاصه مشکلات و راه‌حل‌ها

### ۱. مشکل تنظیمات SMS ملی پیامک

#### مشکل قبلی:
پس از ذخیره تنظیمات ملی پیامک، تست ارسال پیامک با خطای زیر مواجه می‌شد:
```
خطا در ارتباط با سرور: نام کاربری یا رمز عبور ملی پیامک تنظیم نشده است.
```

#### علت اصلی:
متد `sanitize_settings()` در فایل `includes/api/class-rest-api.php` فاقد کد لازم برای sanitize کردن تنظیمات `auth` و `auth.melipayamak` بود. در نتیجه، هنگام ذخیره تنظیمات، اطلاعات کاربری ملی پیامک (نام کاربری، رمز عبور، و کد پترن) ذخیره نمی‌شد.

#### راه‌حل اعمال شده:
- افزودن sanitization برای تنظیمات `auth` شامل:
  - `otp_enabled`: فعال/غیرفعال بودن OTP
  - `otp_length`: طول کد OTP
  - `otp_expiry`: زمان انقضای کد
  - `replace_woocommerce`: جایگزینی ورود ووکامرس
  - `require_name`: درخواست نام هنگام ثبت‌نام
  - `allow_corporate`: امکان ثبت‌نام شخص حقوقی

- افزودن sanitization برای `auth.melipayamak`:
  - `username`: نام کاربری (با sanitize_text_field)
  - `password`: رمز عبور (بدون تغییر برای حفظ کاراکترهای دقیق)
  - `pattern_id`: کد پترن (با sanitize_text_field)

#### نکات امنیتی:
- رمز عبور بدون تغییر ذخیره می‌شود تا کاراکترهای دقیق مورد نیاز API حفظ شود
- اعتبارسنجی انجام می‌شود تا مطمئن شویم رمز عبور از نوع رشته است

---

### ۲. مشکل نمایش داشبورد React

#### مشکل قبلی:
صفحه پنل کاربری که از طریق دکمه "ایجاد/باز سازی صفحه" ساخته می‌شد، فقط یک داشبورد ساده HTML نمایش می‌داد و داشبورد React (CustomerSuperPanel) بارگذاری نمی‌شد.

#### علت اصلی:
متد `create_dashboard_page()` از شورت‌کد اشتباه `[tabesh_user_dashboard]` استفاده می‌کرد که یک داشبورد ساده HTML ارائه می‌دهد، به جای شورت‌کد صحیح `[tabesh_customer_dashboard]` که داشبورد React پیشرفته را بارگذاری می‌کند.

#### راه‌حل اعمال شده:
تغییر شورت‌کد در متد `create_dashboard_page()` از:
```php
'post_content' => '[tabesh_user_dashboard]',
```
به:
```php
'post_content' => '[tabesh_customer_dashboard]',
```

این تغییر در دو محل اعمال شد:
1. هنگام بروزرسانی صفحه موجود
2. هنگام ساخت صفحه جدید

---

## نحوه تست اصلاحات

### تست ۱: تنظیمات SMS ملی پیامک

#### مراحل:
1. به پنل مدیریت WordPress بروید
2. به منوی `Tabesh v2 > Settings > داشبورد کاربران` بروید
3. در بخش "تنظیمات ملی پیامک":
   - نام کاربری پنل خود را وارد کنید
   - رمز عبور پنل خود را وارد کنید
   - کد پترن (BodyId) را وارد کنید
4. روی دکمه "ذخیره تنظیمات" کلیک کنید
5. در فیلد "تست اتصال و ارسال پیامک"، شماره موبایل خود را وارد کنید
6. روی "ارسال پیامک آزمایشی" کلیک کنید

#### نتیجه مورد انتظار:
- پیام موفقیت نمایش داده شود: "پیامک با موفقیت ارسال شد."
- کد OTP به شماره موبایل وارد شده ارسال شود
- خطای "نام کاربری یا رمز عبور ملی پیامک تنظیم نشده است" دیگر نمایش داده نشود

---

### تست ۲: داشبورد React کاربران

#### مراحل:
1. به پنل مدیریت WordPress بروید
2. به منوی `Tabesh v2 > Settings > داشبورد کاربران` بروید
3. "فعال‌سازی داشبورد کاربران" را فعال کنید
4. آدرس صفحه (مثلاً `panel`) را تعیین کنید
5. روی دکمه "ایجاد/باز سازی صفحه" کلیک کنید
6. آدرس صفحه ایجاد شده را کپی کنید (مثلاً: `http://yoursite.com/panel/`)
7. در یک تب جدید مرورگر، به آن آدرس بروید

#### نتیجه مورد انتظار برای کاربران مهمان:
- فرم ورود/ثبت‌نام با OTP نمایش داده شود
- فیلدهای شماره موبایل و کد تأیید قابل مشاهده باشد

#### نتیجه مورد انتظار برای کاربران وارد شده:
- داشبورد React با عنوان "CustomerSuperPanel" بارگذاری شود
- منوی کناری (MegaMenu) با تمام بخش‌ها نمایش داده شود:
  - پیشخوان
  - نمودار تاریخچه قیمت
  - مقالات جدید
  - ثبت سفارش جدید
  - تاریخچه سفارشات
  - و سایر بخش‌ها
- رابط کاربری مدرن و حرفه‌ای با طراحی RTL

---

## بررسی در کنسول مرورگر

برای اطمینان از بارگذاری صحیح داشبورد React:

1. صفحه داشبورد را در مرورگر باز کنید
2. کنسول توسعه‌دهنده را باز کنید (F12 یا Ctrl+Shift+I)
3. به تب Console بروید
4. بررسی کنید که:
   - خطای JavaScript وجود ندارد
   - فایل `customer-dashboard.js` با موفقیت بارگذاری شده
   - فایل `customer-dashboard.css` با موفقیت بارگذاری شده
5. به تب Network بروید و فیلتر را روی JS قرار دهید
6. بررسی کنید که درخواست به `/assets/js/build/customer-dashboard.js` با کد 200 پاسخ داده شده

---

## عیب‌یابی مشکلات احتمالی

### خطا: "نام کاربری یا رمز عبور ملی پیامک تنظیم نشده است" همچنان ظاهر می‌شود

**راه‌حل:**
1. تنظیمات را دوباره ذخیره کنید
2. از صحت نام کاربری و رمز عبور اطمینان حاصل کنید
3. در پایگاه داده، جدول `wp_options` را بررسی کنید و رکورد `tabesh_v2_settings` را پیدا کنید
4. مطمئن شوید که در محتوای JSON، کلیدهای زیر وجود دارند:
   ```json
   {
     "auth": {
       "melipayamak": {
         "username": "your_username",
         "password": "your_password",
         "pattern_id": "12345"
       }
     }
   }
   ```

### داشبورد React بارگذاری نمی‌شود

**راه‌حل:**
1. کش مرورگر را پاک کنید (Ctrl+Shift+Delete)
2. از وجود فایل‌های زیر اطمینان حاصل کنید:
   - `/wp-content/plugins/tabesh-v2/assets/js/build/customer-dashboard.js`
   - `/wp-content/plugins/tabesh-v2/assets/js/build/customer-dashboard.css`
3. کنسول مرورگر را بررسی کنید تا خطاهای JavaScript را ببینید
4. مطمئن شوید که jQuery و wp-api-fetch بارگذاری شده‌اند
5. محتوای صفحه را در پنل مدیریت بررسی کنید و مطمئن شوید شورت‌کد `[tabesh_customer_dashboard]` است

### صفحه 404 برای آدرس پنل

**راه‌حل:**
1. به `Settings > Permalinks` بروید
2. روی "Save Changes" کلیک کنید (برای flush کردن rewrite rules)
3. دوباره به آدرس پنل مراجعه کنید

---

## فایل‌های تغییر یافته

```
includes/api/class-rest-api.php
```

## تغییرات کلیدی در کد

### ۱. افزودن sanitization برای auth settings:
```php
// Sanitize auth settings (OTP and Melipayamak).
if ( isset( $settings['auth'] ) && is_array( $settings['auth'] ) ) {
    $sanitized['auth'] = array(
        'otp_enabled'        => ! empty( $settings['auth']['otp_enabled'] ),
        'otp_length'         => absint( $settings['auth']['otp_length'] ?? 5 ),
        'otp_expiry'         => absint( $settings['auth']['otp_expiry'] ?? 120 ),
        // ... سایر تنظیمات
    );

    // Sanitize melipayamak sub-settings.
    if ( isset( $settings['auth']['melipayamak'] ) && is_array( $settings['auth']['melipayamak'] ) ) {
        // Validate password exists and is a string, but don't modify its content.
        $password = $settings['auth']['melipayamak']['password'] ?? '';
        if ( ! is_string( $password ) ) {
            $password = '';
        }
        
        $sanitized['auth']['melipayamak'] = array(
            'username'   => sanitize_text_field( $settings['auth']['melipayamak']['username'] ?? '' ),
            // Store password as-is to preserve exact characters required by API.
            'password'   => $password,
            'pattern_id' => sanitize_text_field( $settings['auth']['melipayamak']['pattern_id'] ?? '' ),
        );
    }
}
```

### ۲. تغییر شورت‌کد داشبورد:
```php
// قبل:
'post_content' => '[tabesh_user_dashboard]',

// بعد:
'post_content' => '[tabesh_customer_dashboard]',
```

---

## نتیجه‌گیری

با اعمال این اصلاحات:

✅ تنظیمات ملی پیامک به درستی ذخیره و بازیابی می‌شود
✅ ارسال پیامک تست با موفقیت انجام می‌شود
✅ داشبورد React به طور کامل برای کاربران نمایش داده می‌شود
✅ تمام ویژگی‌های CustomerSuperPanel قابل دسترس است
✅ امنیت رمز عبور حفظ شده و در عین حال اعتبارسنجی انجام می‌شود

---

**تاریخ ایجاد:** 2026-01-05  
**نسخه:** 1.0.0  
**وضعیت:** تکمیل شده
