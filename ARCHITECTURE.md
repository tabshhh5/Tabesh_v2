# معماری پنل پیکربندی تابش

```
┌─────────────────────────────────────────────────────────────────┐
│                    WordPress Admin Dashboard                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Tabesh v2 Menu                          │ │
│  │  ┌──────────┬──────────┬───────────┬──────────┬─────────┐ │ │
│  │  │Dashboard │Customers │ Managers  │Employees │Settings │ │ │
│  │  └──────────┴──────────┴───────────┴──────────┴────┬────┘ │ │
│  └────────────────────────────────────────────────────┼──────┘ │
└─────────────────────────────────────────────────────┼──────────┘
                                                       │
                                                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Settings Panel (React)                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Tab Navigation                         │   │
│  │ ┌────┬──────┬───────┬─────┬────────┬──────┬──────┬─────┐│   │
│  │ │ AI │Prod. │Pricing│ SMS │Firewall│ File │Access│I/E  ││   │
│  │ └────┴──────┴───────┴─────┴────────┴──────┴──────┴─────┘│   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Active Tab Content                     │   │
│  │                                                           │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Section 1: Title + Description                    │  │   │
│  │  │  ┌──────────────────────────────────────────────┐  │  │   │
│  │  │  │ FormGroup: Label + Input + Description       │  │  │   │
│  │  │  │ FormGroup: Label + Select + Description      │  │  │   │
│  │  │  │ FormGroup: Label + Checkbox                  │  │  │   │
│  │  │  └──────────────────────────────────────────────┘  │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                           │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Section 2: Title + Description                    │  │   │
│  │  │  ┌──────────────────────────────────────────────┐  │  │   │
│  │  │  │ FormGroup: ...                               │  │  │   │
│  │  │  └──────────────────────────────────────────────┘  │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Footer: Save & Reset Buttons                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬────────────────────────────────┘
                                   │
                      ┌────────────┴───────────┐
                      │    State Management    │
                      │   (React useState)     │
                      └────────────┬───────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
            ┌──────────────┐  ┌──────────┐  ┌──────────┐
            │   Loading    │  │ Settings │  │  Saving  │
            │    State     │  │   Data   │  │  State   │
            └──────────────┘  └─────┬────┘  └──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
        ┌─────────────────────┐       ┌─────────────────────┐
        │   GET Request       │       │   POST Request      │
        │ /tabesh/v2/settings │       │ /tabesh/v2/settings │
        └─────────┬───────────┘       └──────────┬──────────┘
                  │                               │
                  │                               │
┌─────────────────┴───────────────────────────────┴─────────────────┐
│                     WordPress REST API                             │
│                  (includes/api/class-rest-api.php)                 │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │  check_permissions()                                      │    │
│  │    - Verify: current_user_can('manage_options')          │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │  get_settings()                                           │    │
│  │    - Retrieve from WordPress options                      │    │
│  │    - Return JSON response                                 │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │  update_settings()                                        │    │
│  │    - Get JSON params from request                         │    │
│  │    - Call sanitize_settings()                             │    │
│  │    - Update WordPress option                              │    │
│  └──────────────────────┬────────────────────────────────────┘    │
│                         │                                          │
│  ┌──────────────────────┴────────────────────────────────────┐    │
│  │  sanitize_settings()                                      │    │
│  │                                                           │    │
│  │  ┌─────────────────────────────────────────────────────┐│    │
│  │  │ Sanitize AI Settings:                               ││    │
│  │  │  - api_key → sanitize_text_field()                  ││    │
│  │  │  - temperature → floatval()                         ││    │
│  │  │  - enabled → (bool)                                 ││    │
│  │  └─────────────────────────────────────────────────────┘│    │
│  │                                                           │    │
│  │  ┌─────────────────────────────────────────────────────┐│    │
│  │  │ Sanitize Product Settings (loop):                  ││    │
│  │  │  - min_quantity → absint()                          ││    │
│  │  │  - base_price → floatval()                          ││    │
│  │  │  - description → sanitize_textarea_field()          ││    │
│  │  └─────────────────────────────────────────────────────┘│    │
│  │                                                           │    │
│  │  ┌─────────────────────────────────────────────────────┐│    │
│  │  │ Sanitize Pricing, SMS, Firewall, File,             ││    │
│  │  │ Access Level, Import/Export Settings...            ││    │
│  │  └─────────────────────────────────────────────────────┘│    │
│  │                                                           │    │
│  │  Return: $sanitized (safe array)                         │    │
│  └───────────────────────────────────────────────────────────┘    │
└───────────────────────────────────┬───────────────────────────────┘
                                    │
                                    ▼
                ┌───────────────────────────────────┐
                │     WordPress Options Table        │
                │  wp_options.option_name =          │
                │    'tabesh_v2_settings'            │
                │  wp_options.option_value =         │
                │    serialized settings array       │
                └────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                        Data Flow Diagram
═══════════════════════════════════════════════════════════════════

User Action: Opens Settings Page
    │
    ▼
┌────────────────────────────────────────┐
│ WordPress renders admin page with:     │
│ <div id="tabesh-v2-settings"></div>    │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│ React app initializes:                 │
│ - index.js runs initApp()              │
│ - Finds #tabesh-v2-settings            │
│ - Renders <SettingsPanel />            │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│ SettingsPanel mounts:                  │
│ - useState initializes state           │
│ - useEffect triggers loadSettings()    │
└───────────────┬────────────────────────┘
                │
                ▼
         GET /tabesh/v2/settings
                │
                ▼
┌────────────────────────────────────────┐
│ REST API processes:                    │
│ 1. check_permissions() ✓               │
│ 2. get_settings()                      │
│ 3. Return settings JSON                │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│ React receives data:                   │
│ - setSettings(response)                │
│ - setLoading(false)                    │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│ UI renders:                            │
│ - TabPanel with 8 tabs                 │
│ - Active tab content with forms        │
│ - Save & Reset buttons                 │
└────────────────────────────────────────┘

────────────────────────────────────────────────────

User Action: Changes a field value
    │
    ▼
┌────────────────────────────────────────┐
│ onChange handler fires:                │
│ - Extracts field name & value          │
│ - Calls handleSettingsChange()         │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│ State updates:                         │
│ setSettings({                          │
│   ...settings,                         │
│   [section]: {                         │
│     ...settings[section],              │
│     [field]: value                     │
│   }                                    │
│ })                                     │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│ React re-renders:                      │
│ - Input shows new value                │
│ - UI remains responsive                │
└────────────────────────────────────────┘

────────────────────────────────────────────────────

User Action: Clicks "Save Settings"
    │
    ▼
┌────────────────────────────────────────┐
│ handleSave() executes:                 │
│ - setSaving(true)                      │
│ - setMessage('')                       │
└───────────────┬────────────────────────┘
                │
                ▼
    POST /tabesh/v2/settings
    Body: JSON(settings)
                │
                ▼
┌────────────────────────────────────────┐
│ REST API processes:                    │
│ 1. check_permissions() ✓               │
│ 2. get_json_params()                   │
│ 3. sanitize_settings() - Full Clean    │
│ 4. update_option()                     │
│ 5. Return success message              │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│ React handles response:                │
│ - setSaving(false)                     │
│ - setMessage(success)                  │
│ - setMessageType('success')            │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│ UI updates:                            │
│ - Shows success notice                 │
│ - Re-enables save button               │
│ - Settings persisted in DB             │
└────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                    Component Hierarchy
═══════════════════════════════════════════════════════════════════

SettingsPanel
│
├── Header
│   ├── h1: "پنل پیکربندی تابش"
│   └── p.description
│
├── Notice (conditional)
│   └── Success/Error message
│
├── TabPanel
│   ├── tab-navigation
│   │   ├── tab-button[AI] (active)
│   │   ├── tab-button[Products]
│   │   ├── tab-button[Pricing]
│   │   ├── tab-button[SMS]
│   │   ├── tab-button[Firewall]
│   │   ├── tab-button[File]
│   │   ├── tab-button[Access]
│   │   └── tab-button[Import/Export]
│   │
│   └── tab-content
│       ├── AISettingsTab (active)
│       │   ├── Section: "اتصال به ChatGPT"
│       │   │   ├── FormGroup: API Key
│       │   │   │   ├── label
│       │   │   │   ├── TextInput
│       │   │   │   └── description
│       │   │   ├── FormGroup: Model
│       │   │   ├── FormGroup: Organization ID
│       │   │   └── FormGroup: Enabled (Checkbox)
│       │   │
│       │   └── Section: "تنظیمات پیشرفته"
│       │       ├── FormGroup: Temperature
│       │       ├── FormGroup: Max Tokens
│       │       ├── FormGroup: System Prompt (TextArea)
│       │       ├── FormGroup: Cache Responses (Checkbox)
│       │       └── FormGroup: Log Requests (Checkbox)
│       │
│       ├── ProductParametersTab (hidden)
│       │   ├── Section: "انتخاب محصول"
│       │   │   └── FormGroup: Product Type (Select)
│       │   │
│       │   └── Section: "پارامترهای محصول"
│       │       ├── FormGroup: Enabled (Checkbox)
│       │       ├── FormGroup: Min Quantity
│       │       ├── FormGroup: Max Quantity
│       │       ├── FormGroup: Delivery Days
│       │       ├── FormGroup: Base Price
│       │       ├── FormGroup: Description (TextArea)
│       │       └── FormGroup: Custom Params (TextArea)
│       │
│       ├── [Other Tabs: Similar structure...]
│       │
│       └── ...
│
└── Footer
    ├── button.primary: "ذخیره تنظیمات"
    └── button.secondary: "بازنشانی"


═══════════════════════════════════════════════════════════════════
                    File Dependencies Graph
═══════════════════════════════════════════════════════════════════

index.js
  └─→ SettingsPanel.js
        ├─→ TabPanel.js
        ├─→ AISettingsTab.js
        │     └─→ FormComponents.js
        ├─→ ProductParametersTab.js
        │     └─→ FormComponents.js
        ├─→ PricingSettingsTab.js
        │     └─→ FormComponents.js
        ├─→ SMSSettingsTab.js
        │     └─→ FormComponents.js
        └─→ AdditionalSettingsTabs.js
              ├─→ FormComponents.js
              └─→ [4 sub-tabs]

WordPress Dependencies:
  ├─→ @wordpress/element (React)
  ├─→ @wordpress/i18n (Translation)
  └─→ @wordpress/api-fetch (REST API)
```

## Key Architectural Decisions

### 1. **Component-Based Architecture**
- Separation of concerns
- Reusable components (FormGroup, TextInput, etc.)
- Easy to maintain and extend

### 2. **Centralized State Management**
- Single source of truth in SettingsPanel
- Props drilling for state and onChange
- Predictable data flow

### 3. **REST API Pattern**
- Standard WordPress REST API
- JSON communication
- Stateless server-side

### 4. **Security Layers**
- WordPress capabilities check
- Comprehensive sanitization
- Nonce verification (built-in to WP REST API)

### 5. **Modular Tab System**
- Each tab is independent
- Easy to add/remove tabs
- Clean separation of features

### 6. **RTL-First Design**
- Persian/Farsi as primary language
- Proper text direction handling
- Cultural considerations in UX

---
**Version:** 1.0.0  
**Created:** 2025-12-31  
**Team:** Tabesh Development Team
