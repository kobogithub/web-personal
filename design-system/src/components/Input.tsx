import * as React from 'react';
import { cx } from '../cx';

export interface InputProps {
	/** Campo de una línea o área de texto. */
	as?: 'input' | 'textarea';
	/** Tipo del `<input>`, ignorado cuando `as='textarea'`. */
	type?: string;
	id: string;
	name: string;
	/** Etiqueta, en versalitas mono sobre el campo. */
	label: string;
	value: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	/** Mensaje de error. Su presencia tiñe el borde de rojo. */
	error?: string;
	/** Tope de caracteres, también usado por el contador. */
	maxLength: number;
	placeholder?: string;
	/** Alto del área de texto, en filas. */
	rows?: number;
	/** Marca el campo con un asterisco. */
	required?: boolean;
	/** Muestra el contador `usados/máximo` junto a la etiqueta. */
	showCounter?: boolean;
}

/**
 * Campo de formulario del panel: etiqueta en versalitas mono, marco con marcas
 * de retícula y contador opcional. En error, el borde y el mensaje pasan a
 * `magi-danger`.
 */
export function Input({
	as = 'input',
	type = 'text',
	id,
	name,
	label,
	value,
	onChange,
	error,
	maxLength,
	placeholder,
	rows,
	required = true,
	showCounter = false,
}: InputProps) {
	const fieldClass = cx(
		'w-full px-4 py-3 border transition duration-300 focus:outline-none focus:ring-2 focus:ring-magi-accent bg-magi-surface2 text-magi-ink',
		error ? 'border-magi-danger focus:ring-magi-danger' : 'border-magi-line focus:border-magi-accent',
		as === 'textarea' && 'resize-vertical'
	);

	return (
		<div>
			<div className='flex justify-between items-center mb-2'>
				<label
					htmlFor={id}
					className='block text-xs font-mono uppercase tracking-wider text-magi-muted'
				>
					{label} {required && '*'}
				</label>
				{showCounter && (
					<span className='text-xs text-magi-muted font-mono'>
						{value.length}/{maxLength}
					</span>
				)}
			</div>
			<div className='corner-mark'>
				{as === 'textarea' ? (
					<textarea
						id={id}
						name={name}
						rows={rows ?? 6}
						value={value}
						onChange={onChange}
						maxLength={maxLength}
						className={fieldClass}
						placeholder={placeholder}
					/>
				) : (
					<input
						type={type}
						id={id}
						name={name}
						value={value}
						onChange={onChange}
						maxLength={maxLength}
						className={fieldClass}
						placeholder={placeholder}
					/>
				)}
			</div>
			{error && <p className='mt-1 text-sm text-magi-danger'>{error}</p>}
		</div>
	);
}

export default Input;
