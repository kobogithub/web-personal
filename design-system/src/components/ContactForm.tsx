import * as React from 'react';
import { cx } from '../cx';
import { Input } from './Input';

export type SubmitStatus = 'success' | 'error' | 'cooldown';

export interface ContactFormValues {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export interface ContactFormLabels {
	name: string;
	email: string;
	subject: string;
	message: string;
	submit: string;
	submitting: string;
}

export interface ContactFormProps {
	/** Textos de los campos y del botón. */
	labels?: Partial<ContactFormLabels>;
	/** Marcadores de posición de cada campo. */
	placeholders?: Partial<Record<keyof ContactFormValues, string>>;
	/** Valores iniciales. El formulario mantiene su propio estado. */
	initialValues?: Partial<ContactFormValues>;
	/** Errores por campo. Tiñen el borde y muestran el mensaje debajo. */
	errors?: ContactFormErrors;
	/** Estado del panel de transmisión. Sin esto, el panel no se muestra. */
	status?: SubmitStatus;
	/** Texto dentro del panel de transmisión. */
	statusMessage?: string;
	/** Rótulo del panel. Por defecto, el que corresponde al estado en español. */
	statusLabel?: string;
	/** Bloquea el botón y muestra el spinner. */
	isSubmitting?: boolean;
	/** En éxito, los campos se ocultan y queda sólo el panel. */
	onSubmit?: (values: ContactFormValues) => void;
	className?: string;
}

const MAX_LENGTHS = { name: 100, email: 254, subject: 200, message: 5000 };

const STATUS_STYLES: Record<SubmitStatus, { rail: string; text: string; bg: string; dot: string }> = {
	success: { rail: 'border-t-magi-support', text: 'text-magi-support', bg: 'bg-magi-support/10', dot: 'bg-magi-support' },
	error: { rail: 'border-t-magi-danger', text: 'text-magi-danger', bg: 'bg-magi-danger/10', dot: 'bg-magi-danger' },
	cooldown: { rail: 'border-t-magi-violet', text: 'text-magi-violet', bg: 'bg-magi-violet/10', dot: 'bg-magi-violet' },
};

const STATUS_LABEL: Record<SubmitStatus, string> = {
	success: 'TRANSMISIÓN RECIBIDA',
	error: 'FALLO DE TRANSMISIÓN',
	cooldown: 'EN ESPERA',
};

const DEFAULT_LABELS: ContactFormLabels = {
	name: 'Nombre',
	email: 'Email',
	subject: 'Asunto',
	message: 'Mensaje',
	submit: 'Transmitir',
	submitting: 'Transmitiendo',
};

/**
 * Formulario de contacto del panel. Los cuatro campos usan `Input`, y la
 * respuesta aparece en un panel de transmisión que entra con `transmit-in` y
 * escribe el mensaje con `typewriter-cursor`. El color del panel lo fija
 * `status`: verde en éxito, rojo en fallo, violeta en espera.
 */
export function ContactForm({
	labels,
	placeholders = {},
	initialValues = {},
	errors = {},
	status,
	statusMessage,
	statusLabel,
	isSubmitting = false,
	onSubmit,
	className,
}: ContactFormProps) {
	const l = { ...DEFAULT_LABELS, ...labels };
	const [values, setValues] = React.useState<ContactFormValues>({
		name: initialValues.name ?? '',
		email: initialValues.email ?? '',
		subject: initialValues.subject ?? '',
		message: initialValues.message ?? '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit?.(values);
	};

	return (
		<div className={cx('max-w-2xl mx-auto', className)}>
			<form onSubmit={handleSubmit} className='space-y-6'>
				{status !== 'success' && (
					<>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<Input
								id='name'
								name='name'
								label={l.name}
								value={values.name}
								onChange={handleChange}
								error={errors.name}
								maxLength={MAX_LENGTHS.name}
								placeholder={placeholders.name}
							/>
							<Input
								id='email'
								name='email'
								type='email'
								label={l.email}
								value={values.email}
								onChange={handleChange}
								error={errors.email}
								maxLength={MAX_LENGTHS.email}
								placeholder={placeholders.email}
							/>
						</div>

						<Input
							id='subject'
							name='subject'
							label={l.subject}
							value={values.subject}
							onChange={handleChange}
							error={errors.subject}
							maxLength={MAX_LENGTHS.subject}
							placeholder={placeholders.subject}
						/>

						<Input
							as='textarea'
							id='message'
							name='message'
							label={l.message}
							value={values.message}
							onChange={handleChange}
							error={errors.message}
							maxLength={MAX_LENGTHS.message}
							placeholder={placeholders.message}
							showCounter
						/>

						<div>
							<button
								type='submit'
								disabled={isSubmitting}
								className='corner-cut w-full bg-magi-accent hover:brightness-110 hover:shadow-[0_0_20px_-4px_var(--magi-accent)] disabled:opacity-50 disabled:hover:shadow-none text-magi-accent-ink font-mono font-semibold uppercase tracking-wider py-3 px-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-magi-accent focus:ring-offset-2 disabled:cursor-not-allowed'
							>
								{isSubmitting ? (
									<span className='flex items-center justify-center'>
										<svg
											className='animate-spin -ml-1 mr-3 h-5 w-5'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
										>
											<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
											/>
										</svg>
										{l.submitting}
									</span>
								) : (
									l.submit
								)}
							</button>
						</div>
					</>
				)}

				{status && statusMessage && (
					<div
						className={cx(
							'transmit-in corner-mark border border-magi-line border-t-2 p-4',
							STATUS_STYLES[status].rail,
							STATUS_STYLES[status].bg
						)}
					>
						<div className='flex items-center gap-2 mb-1.5'>
							<span
								className={cx('inline-block w-2 h-2 shrink-0 animate-pulse', STATUS_STYLES[status].dot)}
							/>
							<span
								className={cx(
									'font-mono text-xs uppercase tracking-wider',
									STATUS_STYLES[status].text
								)}
							>
								{statusLabel ?? STATUS_LABEL[status]}
							</span>
						</div>
						<p className={cx('typewriter-cursor font-mono text-sm', STATUS_STYLES[status].text)}>
							{statusMessage}
						</p>
					</div>
				)}
			</form>
		</div>
	);
}

export default ContactForm;
