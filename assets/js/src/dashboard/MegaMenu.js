import { __ } from '@wordpress/i18n';

const MegaMenu = ({ user, role, onClose }) => {
	return (
		<div className="tabesh-megamenu-overlay" onClick={onClose}>
			<div className="tabesh-megamenu" onClick={(e) => e.stopPropagation()}>
				<div className="tabesh-megamenu-header">
					<h2>{__('Quick Access', 'tabesh-v2')}</h2>
					<button
						className="tabesh-icon-btn"
						onClick={onClose}
						aria-label={__('Close menu', 'tabesh-v2')}
					>
						<span className="dashicons dashicons-no"></span>
					</button>
				</div>

				<div className="tabesh-megamenu-content">
					<div className="tabesh-megamenu-section">
						<h3>{__('Actions', 'tabesh-v2')}</h3>
						<div className="tabesh-megamenu-grid">
							<a href="#" className="tabesh-megamenu-item">
								<span className="dashicons dashicons-plus"></span>
								<span>{__('New Order', 'tabesh-v2')}</span>
							</a>
							<a href="#" className="tabesh-megamenu-item">
								<span className="dashicons dashicons-upload"></span>
								<span>{__('Upload File', 'tabesh-v2')}</span>
							</a>
							<a href="#" className="tabesh-megamenu-item">
								<span className="dashicons dashicons-email"></span>
								<span>{__('New Ticket', 'tabesh-v2')}</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MegaMenu;
