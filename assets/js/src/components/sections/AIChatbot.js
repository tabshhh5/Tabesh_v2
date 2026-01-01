import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * AIChatbot Component.
 * 
 * AI-powered chat interface for customer support.
 */
const AIChatbot = () => {
	const [ messages ] = useState( [
		{ id: 1, type: 'bot', text: __( 'سلام! چطور می‌تونم کمکتون کنم؟', 'tabesh-v2' ) },
		{ id: 2, type: 'user', text: __( 'می‌خوام یک کتاب ۲۰۰ صفحه‌ای چاپ کنم', 'tabesh-v2' ) },
		{ id: 3, type: 'bot', text: __( 'بله حتماً. چه نوع کاغذی رو ترجیح می‌دید؟', 'tabesh-v2' ) },
	] );

	return (
		<div className="section-ai-chatbot">
			<div className="section-header">
				<h2>{ __( 'چتبات هوش مصنوعی', 'tabesh-v2' ) }</h2>
				<p className="section-description">
					{ __( 'پاسخ سریع به سوالات شما با استفاده از هوش مصنوعی', 'tabesh-v2' ) }
				</p>
			</div>

			<div className="chat-container">
				<div className="chat-messages">
					{ messages.map( ( message ) => (
						<div key={ message.id } className={ `chat-message ${ message.type }` }>
							<div className="message-avatar">
								<Icon icon={ message.type === 'bot' ? icons.info : icons.admin } />
							</div>
							<div className="message-content">
								<p>{ message.text }</p>
							</div>
						</div>
					) ) }
				</div>

				<div className="chat-input-area">
					<div className="suggested-questions">
						<button className="suggestion-chip">
							{ __( 'قیمت چاپ کتاب چقدره؟', 'tabesh-v2' ) }
						</button>
						<button className="suggestion-chip">
							{ __( 'مدت زمان چاپ چقدر طول می‌کشه؟', 'tabesh-v2' ) }
						</button>
						<button className="suggestion-chip">
							{ __( 'چه فرمت‌هایی پشتیبانی می‌شه؟', 'tabesh-v2' ) }
						</button>
					</div>
					<div className="chat-input">
						<input
							type="text"
							placeholder={ __( 'پیام خود را بنویسید...', 'tabesh-v2' ) }
						/>
						<button className="send-btn">
							<Icon icon={ icons.arrowUp } />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AIChatbot;
