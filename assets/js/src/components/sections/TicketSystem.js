import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * TicketSystem Component.
 * 
 * Support ticket submission and tracking.
 */
const TicketSystem = () => {
	const tickets = [
		{ id: 101, subject: __( 'مشکل در کیفیت چاپ', 'tabesh-v2' ), status: 'open', date: '۱۴۰۲/۱۰/۲۵' },
		{ id: 102, subject: __( 'سوال درباره قیمت', 'tabesh-v2' ), status: 'answered', date: '۱۴۰۲/۱۰/۲۳' },
	];

	return (
		<div className="section-ticket-system">
			<div className="section-header">
				<h2>{ __( 'سیستم تیکت', 'tabesh-v2' ) }</h2>
				<button className="btn-primary">
					<Icon icon={ icons.plus } />
					{ __( 'تیکت جدید', 'tabesh-v2' ) }
				</button>
			</div>

			<div className="new-ticket-form">
				<h3>{ __( 'ارسال تیکت جدید', 'tabesh-v2' ) }</h3>
				<form className="ticket-form">
					<div className="form-group">
						<label>{ __( 'موضوع', 'tabesh-v2' ) }</label>
						<input type="text" placeholder={ __( 'موضوع تیکت را وارد کنید', 'tabesh-v2' ) } />
					</div>
					<div className="form-group">
						<label>{ __( 'دسته‌بندی', 'tabesh-v2' ) }</label>
						<select>
							<option>{ __( 'پشتیبانی فنی', 'tabesh-v2' ) }</option>
							<option>{ __( 'سوالات مالی', 'tabesh-v2' ) }</option>
							<option>{ __( 'گزارش مشکل', 'tabesh-v2' ) }</option>
							<option>{ __( 'درخواست ویژگی', 'tabesh-v2' ) }</option>
						</select>
					</div>
					<div className="form-group">
						<label>{ __( 'پیام', 'tabesh-v2' ) }</label>
						<textarea rows="6" placeholder={ __( 'توضیحات کامل مشکل یا سوال خود را بنویسید...', 'tabesh-v2' ) }></textarea>
					</div>
					<div className="form-group">
						<label>{ __( 'پیوست فایل', 'tabesh-v2' ) }</label>
						<div className="file-upload-small">
							<Icon icon={ icons.media } />
							<span>{ __( 'افزودن فایل', 'tabesh-v2' ) }</span>
						</div>
					</div>
					<button type="submit" className="btn-primary">
						{ __( 'ارسال تیکت', 'tabesh-v2' ) }
					</button>
				</form>
			</div>

			<div className="tickets-list">
				<h3>{ __( 'تیکت‌های من', 'tabesh-v2' ) }</h3>
				{ tickets.map( ( ticket ) => (
					<div key={ ticket.id } className="ticket-card">
						<div className="ticket-header">
							<span className="ticket-id">#{ ticket.id }</span>
							<span className={ `ticket-status ${ ticket.status }` }>
								{ ticket.status === 'open' ? __( 'باز', 'tabesh-v2' ) : __( 'پاسخ داده شده', 'tabesh-v2' ) }
							</span>
						</div>
						<h4>{ ticket.subject }</h4>
						<div className="ticket-meta">
							<span>{ ticket.date }</span>
							<button className="view-ticket">
								{ __( 'مشاهده', 'tabesh-v2' ) }
								<Icon icon={ icons.chevronLeft } />
							</button>
						</div>
					</div>
				) ) }
			</div>
		</div>
	);
};

export default TicketSystem;
