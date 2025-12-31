import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Tab Panel Component for Settings.
 *
 * @param {Object} props Component props
 * @param {Array} props.tabs Array of tab objects with id, title, and content
 */
const TabPanel = ( { tabs } ) => {
	const [ activeTab, setActiveTab ] = useState( tabs[ 0 ]?.id || '' );

	return (
		<div className="tabesh-tab-panel">
			<div className="tab-navigation">
				{ tabs.map( ( tab ) => (
					<button
						key={ tab.id }
						className={ `tab-button ${
							activeTab === tab.id ? 'active' : ''
						}` }
						onClick={ () => setActiveTab( tab.id ) }
					>
						{ tab.title }
					</button>
				) ) }
			</div>
			<div className="tab-content">
				{ tabs.map( ( tab ) => (
					<div
						key={ tab.id }
						className={ `tab-panel ${
							activeTab === tab.id ? 'active' : ''
						}` }
						style={ {
							display: activeTab === tab.id ? 'block' : 'none',
						} }
					>
						{ tab.content }
					</div>
				) ) }
			</div>
		</div>
	);
};

export default TabPanel;
