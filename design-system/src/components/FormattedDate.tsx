import * as React from 'react';

export interface FormattedDateProps {
	/** La fecha a mostrar. Se formatea siempre en UTC. */
	date: Date;
	className?: string;
}

/**
 * Fecha en formato corto (`Sep 27, 2026`), dentro de un `<time>` con su
 * `datetime` ISO. Fija la zona horaria en UTC para que el servidor y el
 * navegador no rendericen días distintos.
 */
export function FormattedDate({ date, className }: FormattedDateProps) {
	return (
		<time dateTime={date.toISOString()} className={className}>
			{date.toLocaleDateString('en-us', {
				year: 'numeric',
				month: 'short',
				day: '2-digit',
				timeZone: 'UTC',
			})}
		</time>
	);
}

export default FormattedDate;
