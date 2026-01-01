import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import * as icons from '@wordpress/icons';

/**
 * NewOrder Component.
 * 
 * Form for creating a new print order with product selection.
 */
const NewOrder = () => {
	const products = [
		{ id: 1, name: __( 'چاپ کتاب', 'tabesh-v2' ), icon: 'book' },
		{ id: 2, name: __( 'چاپ کاتالوگ', 'tabesh-v2' ), icon: 'pages' },
		{ id: 3, name: __( 'چاپ بروشور', 'tabesh-v2' ), icon: 'media-document' },
		{ id: 4, name: __( 'چاپ پوستر', 'tabesh-v2' ), icon: 'format-image' },
		{ id: 5, name: __( 'چاپ کارت ویزیت', 'tabesh-v2' ), icon: 'id' },
		{ id: 6, name: __( 'چاپ بنر', 'tabesh-v2' ), icon: 'flag' },
	];

	return (
		<div className="section-new-order">
			<div className="section-header">
				<h2>{ __( 'ثبت سفارش جدید', 'tabesh-v2' ) }</h2>
				<p className="section-description">
					{ __( 'محصول مورد نظر خود را انتخاب کرده و سفارش خود را ثبت کنید', 'tabesh-v2' ) }
				</p>
			</div>

			<div className="product-selection">
				<h3>{ __( 'انتخاب محصول', 'tabesh-v2' ) }</h3>
				<div className="product-grid">
					{ products.map( ( product ) => (
						<button key={ product.id } className="product-card">
							<div className="product-icon">
								<Icon icon={ icons.tag } />
							</div>
							<span className="product-name">{ product.name }</span>
						</button>
					) ) }
				</div>
			</div>

			<div className="order-form">
				<h3>{ __( 'مشخصات سفارش', 'tabesh-v2' ) }</h3>
				<form className="form-grid">
					<div className="form-group">
						<label>{ __( 'عنوان سفارش', 'tabesh-v2' ) }</label>
						<input type="text" placeholder={ __( 'عنوان سفارش را وارد کنید', 'tabesh-v2' ) } />
					</div>

					<div className="form-group">
						<label>{ __( 'تعداد', 'tabesh-v2' ) }</label>
						<input type="number" placeholder="1000" min="1" />
					</div>

					<div className="form-group full-width">
						<label>{ __( 'توضیحات', 'tabesh-v2' ) }</label>
						<textarea rows="4" placeholder={ __( 'توضیحات تکمیلی خود را وارد کنید...', 'tabesh-v2' ) }></textarea>
					</div>

					<div className="form-group full-width">
						<label>{ __( 'آپلود فایل', 'tabesh-v2' ) }</label>
						<div className="file-upload-area">
							<Icon icon={ icons.upload } />
							<p>{ __( 'فایل خود را اینجا بکشید یا کلیک کنید', 'tabesh-v2' ) }</p>
						</div>
					</div>

					<div className="form-actions full-width">
						<button type="button" className="btn-secondary">
							{ __( 'پیش‌نمایش', 'tabesh-v2' ) }
						</button>
						<button type="submit" className="btn-primary">
							<Icon icon={ icons.check } />
							{ __( 'ثبت سفارش', 'tabesh-v2' ) }
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default NewOrder;
