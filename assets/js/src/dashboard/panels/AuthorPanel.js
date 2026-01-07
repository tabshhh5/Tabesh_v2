import { __ } from '@wordpress/i18n';

const AuthorPanel = ({ user, activeView, setActiveView }) => {
	const renderView = () => {
		switch (activeView) {
			case 'home':
				return (
					<div className="tabesh-panel-content">
						<h2>{__('Author Dashboard', 'tabesh-v2')}</h2>
						<p>{__('Manage your books and sales.', 'tabesh-v2')}</p>
					</div>
				);
			default:
				return (
					<div className="tabesh-panel-content">
						<h2>{activeView}</h2>
						<p>{__('Author panel content', 'tabesh-v2')}</p>
					</div>
				);
		}
	};

	return <div className="tabesh-author-panel">{renderView()}</div>;
};

export default AuthorPanel;
