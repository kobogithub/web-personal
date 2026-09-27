import * as React from 'react';
import { FormattedDate } from 'magi-ds';

export const Fechas = () => (
	<div className='flex flex-col gap-2 font-mono text-sm text-magi-muted'>
		<FormattedDate date={new Date('2026-09-27T00:00:00Z')} />
		<FormattedDate date={new Date('2026-09-05T00:00:00Z')} />
		<FormattedDate date={new Date('2025-11-14T00:00:00Z')} />
		<FormattedDate date={new Date('2024-01-08T00:00:00Z')} />
	</div>
);

export const EnUnaFila = () => (
	<div className='flex items-center gap-3 border-b border-magi-line pb-2'>
		<span className='text-magi-muted text-sm w-24 shrink-0 font-mono'>
			<FormattedDate date={new Date('2026-09-05T00:00:00Z')} />
		</span>
		<span className='font-medium'>Ni el owner puede leer esa columna</span>
	</div>
);
