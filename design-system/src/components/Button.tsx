import * as React from 'react';
import { cx } from '../cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps
	extends React.HTMLAttributes<HTMLElement> {
	/** Peso visual del botón dentro del panel. */
	variant?: ButtonVariant;
	/** Renderiza un `<a>` (por defecto) o un `<button>`. */
	as?: 'a' | 'button';
	/** Destino, sólo cuando `as='a'`. */
	href?: string;
	target?: string;
	rel?: string;
	/** Deshabilitado, sólo cuando `as='button'`. */
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
	children?: React.ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
	primary:
		'bg-magi-accent text-magi-accent-ink border-transparent hover:brightness-110 hover:shadow-[0_0_20px_-4px_var(--magi-accent)]',
	secondary:
		'bg-transparent text-magi-ink border-magi-ink hover:bg-magi-ink/5 hover:shadow-[0_0_16px_-6px_var(--magi-ink)]',
	ghost: 'bg-transparent text-magi-violet border-transparent px-1 hover:brightness-110',
};

/**
 * Botón del panel MAGI: esquina cortada (`corner-cut`), tipografía mono en
 * versalitas y un empuje de medio píxel en hover. Es `<a>` salvo que se pida
 * `as='button'`.
 */
export function Button({
	variant = 'primary',
	as = 'a',
	className,
	children,
	...props
}: ButtonProps) {
	const classes = cx(
		'corner-cut inline-flex items-center justify-center gap-1.5 border font-mono font-semibold text-xs uppercase tracking-wider px-5 py-2.5 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0',
		variantClass[variant],
		className
	);

	if (as === 'button') {
		return (
			<button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
				{children}
			</button>
		);
	}
	return (
		<a className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
			{children}
		</a>
	);
}

export default Button;
