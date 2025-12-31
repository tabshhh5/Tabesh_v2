import { __ } from '@wordpress/i18n';
import {
	FormGroup,
	TextInput,
	TextArea,
	Checkbox,
	Section,
} from '../components/FormComponents';

/**
 * Additional Settings Tabs Component.
 * Contains Firewall, File, Access Level, and Import/Export settings.
 */

/**
 * Firewall Settings Tab Component.
 */
export const FirewallSettingsTab = ( { settings, onChange } ) => {
	const firewallSettings = settings.firewall || {};

	const handleChange = ( e ) => {
		const { name, value, type, checked } = e.target;
		onChange( {
			...settings,
			firewall: {
				...firewallSettings,
				[ name ]: type === 'checkbox' ? checked : value,
			},
		} );
	};

	return (
		<div className="firewall-settings-tab">
			<Section
				title={ __( 'تنظیمات امنیتی', 'tabesh-v2' ) }
				description={ __( 'پیکربندی فایروال و امنیت', 'tabesh-v2' ) }
			>
				<FormGroup>
					<Checkbox
						name="enabled"
						checked={ firewallSettings.enabled }
						onChange={ handleChange }
						label={ __( 'فعال‌سازی فایروال', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="rate_limiting"
						checked={ firewallSettings.rate_limiting }
						onChange={ handleChange }
						label={ __( 'محدودیت تعداد درخواست', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'حداکثر درخواست در دقیقه', 'tabesh-v2' ) }
					description={ __(
						'تعداد مجاز درخواست در هر دقیقه',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="max_requests_per_minute"
						value={ firewallSettings.max_requests_per_minute }
						onChange={ handleChange }
						type="number"
						placeholder="60"
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="ip_blocking"
						checked={ firewallSettings.ip_blocking }
						onChange={ handleChange }
						label={ __( 'مسدودسازی IP', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'لیست IP های مسدود شده', 'tabesh-v2' ) }
					description={ __( 'هر IP در یک خط', 'tabesh-v2' ) }
				>
					<TextArea
						name="blocked_ips"
						value={ firewallSettings.blocked_ips }
						onChange={ handleChange }
						rows={ 6 }
						placeholder="192.168.1.1&#10;10.0.0.1"
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="brute_force_protection"
						checked={ firewallSettings.brute_force_protection }
						onChange={ handleChange }
						label={ __(
							'حفاظت در برابر حملات Brute Force',
							'tabesh-v2'
						) }
					/>
				</FormGroup>
			</Section>
		</div>
	);
};

/**
 * File Settings Tab Component.
 */
export const FileSettingsTab = ( { settings, onChange } ) => {
	const fileSettings = settings.file || {};

	const handleChange = ( e ) => {
		const { name, value, type, checked } = e.target;
		onChange( {
			...settings,
			file: {
				...fileSettings,
				[ name ]: type === 'checkbox' ? checked : value,
			},
		} );
	};

	return (
		<div className="file-settings-tab">
			<Section
				title={ __( 'تنظیمات فایل‌ها', 'tabesh-v2' ) }
				description={ __(
					'مدیریت آپلود و دانلود فایل‌ها',
					'tabesh-v2'
				) }
			>
				<FormGroup
					label={ __( 'حداکثر حجم فایل (MB)', 'tabesh-v2' ) }
					description={ __(
						'حداکثر حجم مجاز برای آپلود فایل',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="max_file_size"
						value={ fileSettings.max_file_size }
						onChange={ handleChange }
						type="number"
						placeholder="10"
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'فرمت‌های مجاز', 'tabesh-v2' ) }
					description={ __(
						'فرمت‌های مجاز جدا شده با کاما',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="allowed_formats"
						value={ fileSettings.allowed_formats }
						onChange={ handleChange }
						placeholder="pdf,jpg,png,doc,docx"
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="scan_uploads"
						checked={ fileSettings.scan_uploads }
						onChange={ handleChange }
						label={ __( 'اسکن فایل‌های آپلود شده', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'مسیر ذخیره‌سازی', 'tabesh-v2' ) }
					description={ __(
						'مسیر ذخیره فایل‌های آپلود شده',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="upload_path"
						value={ fileSettings.upload_path }
						onChange={ handleChange }
						placeholder="wp-content/uploads/tabesh"
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="auto_delete_old_files"
						checked={ fileSettings.auto_delete_old_files }
						onChange={ handleChange }
						label={ __( 'حذف خودکار فایل‌های قدیمی', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'مدت نگهداری فایل‌ها (روز)', 'tabesh-v2' ) }
					description={ __(
						'تعداد روزهای نگهداری فایل‌ها قبل از حذف خودکار',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="file_retention_days"
						value={ fileSettings.file_retention_days }
						onChange={ handleChange }
						type="number"
						placeholder="90"
					/>
				</FormGroup>
			</Section>
		</div>
	);
};

/**
 * Access Level Settings Tab Component.
 */
export const AccessLevelSettingsTab = ( { settings, onChange } ) => {
	const accessSettings = settings.access_level || {};

	const handleChange = ( e ) => {
		const { name, value, type, checked } = e.target;
		onChange( {
			...settings,
			access_level: {
				...accessSettings,
				[ name ]: type === 'checkbox' ? checked : value,
			},
		} );
	};

	return (
		<div className="access-level-settings-tab">
			<Section
				title={ __( 'سطوح دسترسی', 'tabesh-v2' ) }
				description={ __( 'تنظیم سطوح دسترسی کاربران', 'tabesh-v2' ) }
			>
				<FormGroup>
					<Checkbox
						name="customer_can_view_orders"
						checked={ accessSettings.customer_can_view_orders }
						onChange={ handleChange }
						label={ __(
							'مشتریان می‌توانند سفارشات خود را مشاهده کنند',
							'tabesh-v2'
						) }
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="customer_can_cancel_orders"
						checked={ accessSettings.customer_can_cancel_orders }
						onChange={ handleChange }
						label={ __(
							'مشتریان می‌توانند سفارشات را لغو کنند',
							'tabesh-v2'
						) }
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="manager_can_delete_orders"
						checked={ accessSettings.manager_can_delete_orders }
						onChange={ handleChange }
						label={ __(
							'مدیران می‌توانند سفارشات را حذف کنند',
							'tabesh-v2'
						) }
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="employee_can_edit_orders"
						checked={ accessSettings.employee_can_edit_orders }
						onChange={ handleChange }
						label={ __(
							'کارمندان می‌توانند سفارشات را ویرایش کنند',
							'tabesh-v2'
						) }
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="require_approval"
						checked={ accessSettings.require_approval }
						onChange={ handleChange }
						label={ __(
							'سفارشات نیاز به تایید دارند',
							'tabesh-v2'
						) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'نقش‌های مجاز برای تایید', 'tabesh-v2' ) }
					description={ __(
						'نقش‌های WordPress مجاز برای تایید سفارشات',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="approval_roles"
						value={ accessSettings.approval_roles }
						onChange={ handleChange }
						placeholder="administrator,shop_manager"
					/>
				</FormGroup>
			</Section>
		</div>
	);
};

/**
 * Import/Export Settings Tab Component.
 */
export const ImportExportSettingsTab = ( { settings, onChange } ) => {
	const importExportSettings = settings.import_export || {};

	const handleChange = ( e ) => {
		const { name, value, type, checked } = e.target;
		onChange( {
			...settings,
			import_export: {
				...importExportSettings,
				[ name ]: type === 'checkbox' ? checked : value,
			},
		} );
	};

	return (
		<div className="import-export-settings-tab">
			<Section
				title={ __( 'تنظیمات برون‌ریزی و درون‌ریزی', 'tabesh-v2' ) }
				description={ __(
					'مدیریت برون‌ریزی و درون‌ریزی داده‌ها',
					'tabesh-v2'
				) }
			>
				<FormGroup>
					<Checkbox
						name="allow_export"
						checked={ importExportSettings.allow_export }
						onChange={ handleChange }
						label={ __( 'امکان برون‌ریزی داده‌ها', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="allow_import"
						checked={ importExportSettings.allow_import }
						onChange={ handleChange }
						label={ __( 'امکان درون‌ریزی داده‌ها', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'فرمت برون‌ریزی', 'tabesh-v2' ) }
					description={ __( 'فرمت پیش‌فرض برون‌ریزی', 'tabesh-v2' ) }
				>
					<select
						name="export_format"
						value={ importExportSettings.export_format || 'csv' }
						onChange={ handleChange }
						className="regular-text"
					>
						<option value="csv">CSV</option>
						<option value="json">JSON</option>
						<option value="xml">XML</option>
						<option value="excel">Excel</option>
					</select>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="include_customer_data"
						checked={ importExportSettings.include_customer_data }
						onChange={ handleChange }
						label={ __( 'شامل اطلاعات مشتریان', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="include_order_data"
						checked={ importExportSettings.include_order_data }
						onChange={ handleChange }
						label={ __( 'شامل اطلاعات سفارشات', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="auto_backup"
						checked={ importExportSettings.auto_backup }
						onChange={ handleChange }
						label={ __( 'پشتیبان‌گیری خودکار', 'tabesh-v2' ) }
					/>
				</FormGroup>

				<FormGroup
					label={ __( 'دوره پشتیبان‌گیری (روز)', 'tabesh-v2' ) }
					description={ __(
						'فاصله زمانی پشتیبان‌گیری خودکار',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="backup_interval"
						value={ importExportSettings.backup_interval }
						onChange={ handleChange }
						type="number"
						placeholder="7"
					/>
				</FormGroup>

				<FormGroup
					label={ __(
						'تعداد نسخه‌های پشتیبان نگهداری شده',
						'tabesh-v2'
					) }
					description={ __(
						'حداکثر تعداد فایل‌های پشتیبان برای نگهداری',
						'tabesh-v2'
					) }
				>
					<TextInput
						name="max_backups"
						value={ importExportSettings.max_backups }
						onChange={ handleChange }
						type="number"
						placeholder="10"
					/>
				</FormGroup>
			</Section>
		</div>
	);
};
