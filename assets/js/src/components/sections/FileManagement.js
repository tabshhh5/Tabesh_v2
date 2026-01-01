import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * FileManagement Component.
 * 
 * File upload and management interface.
 */
const FileManagement = () => {
	const files = [
		{ id: 1, name: 'catalog-design.pdf', size: '2.5 MB', date: '۱۴۰۲/۱۰/۲۵', type: 'pdf' },
		{ id: 2, name: 'poster-artwork.ai', size: '15.8 MB', date: '۱۴۰۲/۱۰/۲۳', type: 'ai' },
		{ id: 3, name: 'brochure-final.indd', size: '8.2 MB', date: '۱۴۰۲/۱۰/۲۰', type: 'indd' },
	];

	return (
		<div className="section-file-management">
			<div className="section-header">
				<h2>{ __( 'مدیریت فایل', 'tabesh-v2' ) }</h2>
				<button className="btn-primary">
					<Icon icon={ icons.upload } />
					{ __( 'آپلود فایل جدید', 'tabesh-v2' ) }
				</button>
			</div>

			<div className="upload-area">
				<div className="upload-zone">
					<Icon icon={ icons.cloudUpload } />
					<h3>{ __( 'فایل خود را اینجا بکشید', 'tabesh-v2' ) }</h3>
					<p>{ __( 'یا کلیک کنید تا فایل را انتخاب کنید', 'tabesh-v2' ) }</p>
					<p className="upload-info">
						{ __( 'فرمت‌های پشتیبانی شده: PDF, AI, PSD, INDD, PNG, JPG', 'tabesh-v2' ) }
					</p>
				</div>
			</div>

			<div className="files-section">
				<h3>{ __( 'فایل‌های آپلود شده', 'tabesh-v2' ) }</h3>
				<div className="files-grid">
					{ files.map( ( file ) => (
						<div key={ file.id } className="file-card">
							<div className="file-icon">
								<Icon icon={ icons.media } />
							</div>
							<div className="file-info">
								<h4>{ file.name }</h4>
								<div className="file-meta">
									<span>{ file.size }</span>
									<span>{ file.date }</span>
								</div>
							</div>
							<div className="file-actions">
								<button className="action-btn-small">
									<Icon icon={ icons.download } />
								</button>
								<button className="action-btn-small">
									<Icon icon={ icons.trash } />
								</button>
							</div>
						</div>
					) ) }
				</div>
			</div>
		</div>
	);
};

export default FileManagement;
