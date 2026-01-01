import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * OrderHistory Component.
 * 
 * Display order history with filtering and search.
 */
const OrderHistory = () => {
	const orders = [
		{ id: 1003, title: __( 'چاپ کتاب ۲۰۰ صفحه', 'tabesh-v2' ), date: '۱۴۰۲/۱۰/۲۵', status: 'completed', amount: '۳,۵۰۰,۰۰۰' },
		{ id: 1002, title: __( 'چاپ کاتالوگ رنگی', 'tabesh-v2' ), date: '۱۴۰۲/۱۰/۲۰', status: 'completed', amount: '۲,۸۰۰,۰۰۰' },
		{ id: 1001, title: __( 'چاپ بروشور تبلیغاتی', 'tabesh-v2' ), date: '۱۴۰۲/۱۰/۱۵', status: 'completed', amount: '۱,۵۰۰,۰۰۰' },
	];

	return (
		<div className="section-order-history">
			<div className="section-header">
				<h2>{ __( 'تاریخچه سفارشات', 'tabesh-v2' ) }</h2>
				<div className="header-filters">
					<input type="text" placeholder={ __( 'جستجو...', 'tabesh-v2' ) } />
					<select>
						<option>{ __( 'همه وضعیت‌ها', 'tabesh-v2' ) }</option>
						<option>{ __( 'تکمیل شده', 'tabesh-v2' ) }</option>
						<option>{ __( 'لغو شده', 'tabesh-v2' ) }</option>
					</select>
				</div>
			</div>

			<div className="orders-table">
				<table>
					<thead>
						<tr>
							<th>{ __( 'شماره سفارش', 'tabesh-v2' ) }</th>
							<th>{ __( 'عنوان', 'tabesh-v2' ) }</th>
							<th>{ __( 'تاریخ', 'tabesh-v2' ) }</th>
							<th>{ __( 'وضعیت', 'tabesh-v2' ) }</th>
							<th>{ __( 'مبلغ', 'tabesh-v2' ) }</th>
							<th>{ __( 'عملیات', 'tabesh-v2' ) }</th>
						</tr>
					</thead>
					<tbody>
						{ orders.map( ( order ) => (
							<tr key={ order.id }>
								<td>#{ order.id }</td>
								<td>{ order.title }</td>
								<td>{ order.date }</td>
								<td>
									<span className={ `status-badge ${ order.status }` }>
										{ __( 'تکمیل شده', 'tabesh-v2' ) }
									</span>
								</td>
								<td>{ order.amount } { __( 'تومان', 'tabesh-v2' ) }</td>
								<td>
									<button className="action-btn-small">
										<Icon icon={ icons.seen } />
									</button>
									<button className="action-btn-small">
										<Icon icon={ icons.download } />
									</button>
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default OrderHistory;
