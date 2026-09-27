import * as React from 'react';
import { IconifyIcon } from 'magi-ds';

// Iconify resuelve los sets contra su API, así que estas celdas dependen de la
// red. Si aparecen vacías, el componente igual funciona en el sitio — es la
// tarjeta la que no pudo bajar el set.
export const Tecnologias = () => (
	<div className='flex items-center gap-6 text-magi-ink'>
		<IconifyIcon icon='simple-icons:rust' className='w-8 h-8' />
		<IconifyIcon icon='simple-icons:python' className='w-8 h-8' />
		<IconifyIcon icon='simple-icons:docker' className='w-8 h-8' />
		<IconifyIcon icon='simple-icons:kubernetes' className='w-8 h-8' />
		<IconifyIcon icon='simple-icons:snowflake' className='w-8 h-8' />
	</div>
);

export const Tamanos = () => (
	<div className='flex gap-6 text-magi-accent' style={{ alignItems: 'flex-end' }}>
		<IconifyIcon icon='simple-icons:rust' className='w-4 h-4' />
		<IconifyIcon icon='simple-icons:rust' className='w-6 h-6' />
		<IconifyIcon icon='simple-icons:rust' className='w-10 h-10' />
	</div>
);

export const EnUnaTarjeta = () => (
	<div className='corner-mark border border-magi-line border-t-2 border-t-magi-accent bg-magi-surface p-5' style={{ maxWidth: 320 }}>
		<div className='flex items-center gap-2 mb-2'>
			<IconifyIcon icon='simple-icons:duckdb' />
			<h3 className='font-semibold'>DuckDB</h3>
		</div>
		<p className='text-magi-muted'>Motor analítico embebido.</p>
	</div>
);
