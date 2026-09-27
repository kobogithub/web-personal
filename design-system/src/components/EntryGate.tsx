import * as React from 'react';
import { cx } from '../cx';
import { Button } from './Button';

export interface EntryGateProps {
	/** Título grande del panel. */
	title?: string;
	/** Línea mono bajo el título. */
	subtitle?: string;
	/** Rótulo en versalitas sobre el registro de arranque. */
	eyebrow?: string;
	/** Líneas del registro de arranque, ya reveladas. */
	logLines?: string[];
	/** Texto del botón de entrada. */
	enterLabel?: string;
	/** Nota al pie, bajo el botón. */
	hint?: string;
	/**
	 * `fixed` cubre la ventana — es como entra en el sitio. `absolute` lo encierra
	 * en el contenedor posicionado más cercano, que es lo que hace falta para
	 * verlo dentro de una tarjeta.
	 */
	position?: 'fixed' | 'absolute';
	/** Se dispara al presionar el botón. */
	onEnter?: () => void;
	className?: string;
}

/**
 * Portal de entrada al sitio: dos puertas que se abren al costado, un registro
 * de arranque en mono y el panel central con el título. Las puertas llevan el
 * fondo animado `magi-bg-fx` y el marco usa las marcas de retícula.
 */
export function EntryGate({
	title = 'MAGI',
	subtitle = 'Kevin Barroso — Platform Manager / AI Engineer',
	eyebrow = 'Sistema de acceso',
	logLines = [],
	enterLabel = 'Entrar',
	hint = 'Presioná Enter para continuar',
	position = 'fixed',
	onEnter,
	className,
}: EntryGateProps) {
	return (
		<div
			className={cx(
				position === 'fixed' ? 'fixed inset-0 z-[9999]' : 'absolute inset-0',
				'flex items-center justify-center bg-magi-bg px-4',
				className
			)}
			role='dialog'
			aria-modal='true'
			aria-label={title}
		>
			<div className='absolute inset-y-0 left-0 w-1/2 bg-magi-bg border-r border-magi-line shadow-[inset_-8px_0_16px_-8px_var(--magi-accent)] overflow-hidden'>
				<div className='magi-bg-fx' aria-hidden='true' />
			</div>
			<div className='absolute inset-y-0 right-0 w-1/2 bg-magi-bg border-l border-magi-line shadow-[inset_8px_0_16px_-8px_var(--magi-accent)] overflow-hidden'>
				<div className='magi-bg-fx' aria-hidden='true' />
			</div>
			<div className='corner-mark relative border border-magi-line border-t-2 border-t-magi-accent bg-magi-surface w-[min(92vw,32rem)] p-8 text-center'>
				<p className='eyebrow mb-4'>{eyebrow}</p>
				<div className='font-mono text-xs text-magi-muted text-left mb-6 min-h-[4.5em] space-y-1'>
					{logLines.map((line) => (
						<div key={line}>{line}</div>
					))}
				</div>
				<h1 className='font-display font-bold uppercase tracking-tight text-4xl sm:text-5xl text-magi-ink mb-2'>
					{title}
				</h1>
				<p className='font-mono text-xs text-magi-muted mb-8'>{subtitle}</p>
				<Button as='button' className='mx-auto' onClick={onEnter}>
					{enterLabel}
				</Button>
				<p className='font-mono text-[0.65rem] text-magi-muted mt-4 opacity-70'>{hint}</p>
			</div>
		</div>
	);
}

export default EntryGate;
