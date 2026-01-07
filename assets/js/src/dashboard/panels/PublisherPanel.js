import { __ } from '@wordpress/i18n';

const PublisherPanel = ({ user, activeView, setActiveView }) => {
	const renderView = () => {
		switch (activeView) {
			case 'home':
				return (
					<div className="tabesh-panel-content">
						<h2>{__('Publisher Dashboard', 'tabesh-v2')}</h2>
						<p>{__('Manage your publishing business.', 'tabesh-v2')}</p>
					</div>
				);
			default:
				return (
					<div className="tabesh-panel-content">
						<h2>{activeView}</h2>
						<p>{__('Publisher panel content', 'tabesh-v2')}</p>
					</div>
				);
		}
	};

	return <div className="tabesh-publisher-panel">{renderView()}</div>;
};

export default PublisherPanel;
