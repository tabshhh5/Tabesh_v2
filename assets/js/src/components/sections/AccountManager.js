import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * AccountManager Component.
 * 
 * Direct messaging with account manager.
 */
const AccountManager = () => {
	return (
		<div className="section-account-manager">
			<div className="section-header">
				<h2>{ __( 'پیام به مدیر حساب', 'tabesh-v2' ) }</h2>
			</div>

			<div className="manager-info-card">
				<div className="manager-avatar">
					<Icon icon={ icons.admin } />
				</div>
				<div className="manager-details">
					<h3>{ __( 'مدیر حساب شما', 'tabesh-v2' ) }</h3>
					<p className="manager-name">{ __( 'احمد محمدی', 'tabesh-v2' ) }</p>
					<div className="manager-contact">
						<span><Icon icon={ icons.mobile } /> ۰۹۱۲۳۴۵۶۷۸۹</span>
						<span><Icon icon={ icons.atSymbol } /> ahmad@tabesh.com</span>
					</div>
				</div>
			</div>

			<div className="messaging-area">
				<div className="messages-list">
					<div className="message sent">
						<div className="message-content">
							<p>{ __( 'سلام، می‌خواستم درباره سفارش اخیرم سوال کنم', 'tabesh-v2' ) }</p>
							<span className="message-time">۱۴:۳۰</span>
						</div>
					</div>
					<div className="message received">
						<div className="message-content">
							<p>{ __( 'بله حتماً، در خدمتم', 'tabesh-v2' ) }</p>
							<span className="message-time">۱۴:۳۲</span>
						</div>
					</div>
				</div>

				<div className="message-input-area">
					<textarea
						rows="3"
						placeholder={ __( 'پیام خود را بنویسید...', 'tabesh-v2' ) }
					></textarea>
					<div className="message-actions">
						<button className="attach-btn">
							<Icon icon={ icons.paperclip } />
						</button>
						<button className="send-btn">
							<Icon icon={ icons.arrowUp } />
							{ __( 'ارسال', 'tabesh-v2' ) }
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AccountManager;
