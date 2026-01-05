import { useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Modern OTP Input Component with auto-focus and SMS autofill support.
 * 
 * @param {Object} props Component props
 * @param {number} props.length Number of OTP digits (default: 5)
 * @param {string} props.value Current OTP value
 * @param {Function} props.onChange Callback when OTP changes
 * @param {Function} props.onComplete Callback when OTP is complete
 * @param {boolean} props.disabled Whether inputs are disabled
 */
const OTPInput = ({ length = 5, value = '', onChange, onComplete, disabled = false }) => {
	const [otp, setOtp] = useState(Array(length).fill(''));
	const inputRefs = useRef([]);

	// Initialize refs
	useEffect(() => {
		inputRefs.current = inputRefs.current.slice(0, length);
	}, [length]);

	// Auto-focus first input on mount
	useEffect(() => {
		if (inputRefs.current[0] && !disabled) {
			inputRefs.current[0].focus();
		}
	}, [disabled]);

	// Update OTP from value prop
	useEffect(() => {
		if (value) {
			const digits = value.split('').slice(0, length);
			const newOtp = [...Array(length)].map((_, i) => digits[i] || '');
			setOtp(newOtp);
		} else {
			setOtp(Array(length).fill(''));
		}
	}, [value, length]);

	/**
	 * Handle input change.
	 */
	const handleChange = (index, e) => {
		const val = e.target.value;
		
		// Only allow digits
		if (val && !/^\d$/.test(val)) {
			return;
		}

		const newOtp = [...otp];
		newOtp[index] = val;
		setOtp(newOtp);

		// Notify parent of change
		const otpString = newOtp.join('');
		if (onChange) {
			onChange(otpString);
		}

		// Move to next input if digit entered
		if (val && index < length - 1) {
			inputRefs.current[index + 1]?.focus();
		}

		// Call onComplete if all digits filled
		if (val && index === length - 1) {
			const isComplete = newOtp.every(digit => digit !== '');
			if (isComplete && onComplete) {
				onComplete(otpString);
			}
		}
	};

	/**
	 * Handle key down (backspace, arrow keys).
	 */
	const handleKeyDown = (index, e) => {
		if (e.key === 'Backspace') {
			e.preventDefault();
			
			if (otp[index]) {
				// Clear current input
				const newOtp = [...otp];
				newOtp[index] = '';
				setOtp(newOtp);
				
				if (onChange) {
					onChange(newOtp.join(''));
				}
			} else if (index > 0) {
				// Move to previous input and clear it
				const newOtp = [...otp];
				newOtp[index - 1] = '';
				setOtp(newOtp);
				inputRefs.current[index - 1]?.focus();
				
				if (onChange) {
					onChange(newOtp.join(''));
				}
			}
		} else if (e.key === 'ArrowLeft' && index > 0) {
			e.preventDefault();
			inputRefs.current[index - 1]?.focus();
		} else if (e.key === 'ArrowRight' && index < length - 1) {
			e.preventDefault();
			inputRefs.current[index + 1]?.focus();
		}
	};

	/**
	 * Handle paste event.
	 */
	const handlePaste = (e) => {
		e.preventDefault();
		
		const pastedData = e.clipboardData.getData('text/plain');
		const digits = pastedData.replace(/\D/g, '').split('').slice(0, length);
		
		if (digits.length > 0) {
			const newOtp = [...Array(length)].map((_, i) => digits[i] || '');
			setOtp(newOtp);
			
			const otpString = newOtp.join('');
			if (onChange) {
				onChange(otpString);
			}

			// Focus last filled input or first empty
			const lastFilledIndex = Math.min(digits.length - 1, length - 1);
			inputRefs.current[lastFilledIndex]?.focus();

			// Check if complete
			if (digits.length === length && onComplete) {
				onComplete(otpString);
			}
		}
	};

	/**
	 * Handle focus event.
	 */
	const handleFocus = (index, e) => {
		e.target.select();
	};

	return (
		<div className="tabesh-otp-container">
			{otp.map((digit, index) => (
				<input
					key={index}
					ref={el => inputRefs.current[index] = el}
					type="text"
					inputMode="numeric"
					autoComplete={index === 0 ? 'one-time-code' : 'off'}
					pattern="\d{1}"
					maxLength={1}
					className="tabesh-otp-input"
					value={digit}
					onChange={(e) => handleChange(index, e)}
					onKeyDown={(e) => handleKeyDown(index, e)}
					onPaste={handlePaste}
					onFocus={(e) => handleFocus(index, e)}
					disabled={disabled}
					aria-label={__('رقم', 'tabesh-v2') + ' ' + (index + 1)}
					dir="ltr"
				/>
			))}
		</div>
	);
};

export default OTPInput;
