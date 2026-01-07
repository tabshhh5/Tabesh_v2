import { __ } from '@wordpress/i18n';

const EmployeePanel = ({ user, activeView, setActiveView }) => {
	const renderView = () => {
		switch (activeView) {
			case 'home':
				return (
					<div className="tabesh-panel-content">
						<h2>{__('Employee Dashboard', 'tabesh-v2')}</h2>
						<p>{__('Your assigned orders and tasks.', 'tabesh-v2')}</p>
					</div>
				);
			default:
				return (
					<div className="tabesh-panel-content">
						<h2>{activeView}</h2>
						<p>{__('Employee panel content', 'tabesh-v2')}</p>
					</div>
				);
		}
	};

	return <div className="tabesh-employee-panel">{renderView()}</div>;
};

export default EmployeePanel;
