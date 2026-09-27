import * as React from 'react';
import { Input } from 'magi-ds';

const noop = () => {};

export const Campos = () => (
	<div className='flex flex-col gap-6' style={{ maxWidth: 448 }}>
		<Input
			id='p-nombre'
			name='nombre'
			label='Nombre'
			value='Kevin Barroso'
			onChange={noop}
			maxLength={100}
		/>
		<Input
			id='p-email'
			name='email'
			type='email'
			label='Email'
			value=''
			placeholder='kevin@ejemplo.com'
			onChange={noop}
			maxLength={254}
		/>
	</div>
);

export const ConError = () => (
	<div style={{ maxWidth: 448 }}>
		<Input
			id='p-email-error'
			name='email'
			type='email'
			label='Email'
			value='kevin@'
			onChange={noop}
			maxLength={254}
			error='El email no tiene un formato válido.'
		/>
	</div>
);

export const AreaConContador = () => (
	<div style={{ maxWidth: 448 }}>
		<Input
			as='textarea'
			id='p-mensaje'
			name='mensaje'
			label='Mensaje'
			value='Quería consultarte por una migración a Snowflake.'
			onChange={noop}
			maxLength={5000}
			rows={5}
			showCounter
		/>
	</div>
);

export const Opcional = () => (
	<div style={{ maxWidth: 448 }}>
		<Input
			id='p-empresa'
			name='empresa'
			label='Empresa'
			value=''
			placeholder='Opcional'
			onChange={noop}
			maxLength={120}
			required={false}
		/>
	</div>
);
