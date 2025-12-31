import { __ } from '@wordpress/i18n';
import { FormGroup, TextInput, TextArea, Checkbox, Section } from '../components/FormComponents';

/**
 * AI Settings Tab Component.
 * 
 * @param {Object} props Component props
 * @param {Object} props.settings Current settings
 * @param {Function} props.onChange Settings change handler
 */
const AISettingsTab = ({ settings, onChange }) => {
	const aiSettings = settings.ai || {};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		onChange({
			...settings,
			ai: {
				...aiSettings,
				[name]: type === 'checkbox' ? checked : value,
			},
		});
	};

	return (
		<div className="ai-settings-tab">
			<Section
				title={__('اتصال به ChatGPT', 'tabesh-v2')}
				description={__('پیکربندی و اتصال به سرویس هوش مصنوعی ChatGPT', 'tabesh-v2')}
			>
				<FormGroup
					label={__('API Key', 'tabesh-v2')}
					description={__('کلید API دریافتی از OpenAI', 'tabesh-v2')}
				>
					<TextInput
						name="api_key"
						value={aiSettings.api_key}
						onChange={handleChange}
						type="password"
						placeholder="sk-..."
					/>
				</FormGroup>

				<FormGroup
					label={__('مدل ChatGPT', 'tabesh-v2')}
					description={__('نسخه مدل هوش مصنوعی مورد استفاده', 'tabesh-v2')}
				>
					<TextInput
						name="model"
						value={aiSettings.model}
						onChange={handleChange}
						placeholder="gpt-4"
					/>
				</FormGroup>

				<FormGroup
					label={__('Organization ID (اختیاری)', 'tabesh-v2')}
					description={__('شناسه سازمان در OpenAI', 'tabesh-v2')}
				>
					<TextInput
						name="organization_id"
						value={aiSettings.organization_id}
						onChange={handleChange}
						placeholder="org-..."
					/>
				</FormGroup>

				<FormGroup label={__('فعال‌سازی', 'tabesh-v2')}>
					<Checkbox
						name="enabled"
						checked={aiSettings.enabled}
						onChange={handleChange}
						label={__('استفاده از هوش مصنوعی فعال است', 'tabesh-v2')}
					/>
				</FormGroup>
			</Section>

			<Section
				title={__('تنظیمات پیشرفته', 'tabesh-v2')}
				description={__('تنظیمات پیشرفته هوش مصنوعی', 'tabesh-v2')}
			>
				<FormGroup
					label={__('دمای مدل (Temperature)', 'tabesh-v2')}
					description={__('میزان خلاقیت پاسخ‌ها (0 تا 2)', 'tabesh-v2')}
				>
					<TextInput
						name="temperature"
						value={aiSettings.temperature}
						onChange={handleChange}
						type="number"
						placeholder="0.7"
					/>
				</FormGroup>

				<FormGroup
					label={__('حداکثر توکن‌ها', 'tabesh-v2')}
					description={__('حداکثر تعداد توکن‌های پاسخ', 'tabesh-v2')}
				>
					<TextInput
						name="max_tokens"
						value={aiSettings.max_tokens}
						onChange={handleChange}
						type="number"
						placeholder="2000"
					/>
				</FormGroup>

				<FormGroup
					label={__('دستورالعمل سیستم (System Prompt)', 'tabesh-v2')}
					description={__('دستورالعمل اولیه برای هوش مصنوعی', 'tabesh-v2')}
				>
					<TextArea
						name="system_prompt"
						value={aiSettings.system_prompt}
						onChange={handleChange}
						rows={6}
						placeholder={__('شما یک دستیار هوشمند برای مدیریت سفارشات چاپ هستید...', 'tabesh-v2')}
					/>
				</FormGroup>

				<FormGroup label={__('سایر تنظیمات', 'tabesh-v2')}>
					<Checkbox
						name="cache_responses"
						checked={aiSettings.cache_responses}
						onChange={handleChange}
						label={__('ذخیره پاسخ‌های تکراری', 'tabesh-v2')}
					/>
				</FormGroup>

				<FormGroup>
					<Checkbox
						name="log_requests"
						checked={aiSettings.log_requests}
						onChange={handleChange}
						label={__('ثبت لاگ درخواست‌ها', 'tabesh-v2')}
					/>
				</FormGroup>
			</Section>
		</div>
	);
};

export default AISettingsTab;
