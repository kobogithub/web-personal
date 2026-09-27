import * as React from 'react';
import { EntryGate } from 'magi-ds';

// `position='absolute'` lo encierra en el contenedor de abajo. Con el `fixed`
// del sitio la portada se saldría de la tarjeta y taparía la grilla.
const Marco = ({ children }: { children: React.ReactNode }) => (
	<div
		className='relative w-full overflow-hidden border border-magi-line'
		style={{ height: 520 }}
	>
		{children}
	</div>
);

export const Portada = () => (
	<Marco>
		<EntryGate
			position='absolute'
			logLines={['> MAGI-01 MELCHIOR ... ONLINE', '> MAGI-02 BALTHASAR ... ONLINE', '> MAGI-03 CASPER ... ONLINE']}
		/>
	</Marco>
);

export const Arrancando = () => (
	<Marco>
		<EntryGate position='absolute' logLines={['> MAGI-01 MELCHIOR ... ONLINE']} />
	</Marco>
);

export const EnIngles = () => (
	<Marco>
		<EntryGate
			position='absolute'
			eyebrow='Access system'
			enterLabel='Enter'
			hint='Press Enter to continue'
			logLines={['> MAGI-01 MELCHIOR ... ONLINE', '> MAGI-02 BALTHASAR ... ONLINE']}
		/>
	</Marco>
);
