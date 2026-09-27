import * as React from 'react';
import { ContactForm } from 'magi-ds';

const placeholders = {
	name: 'Kevin Barroso',
	email: 'kevin@ejemplo.com',
	subject: 'Consulta sobre arquitectura de datos',
	message: 'Contame en qué estás trabajando…',
};

export const Vacio = () => <ContactForm placeholders={placeholders} />;

export const ConErrores = () => (
	<ContactForm
		placeholders={placeholders}
		initialValues={{ name: 'Kevin', email: 'kevin@', subject: '', message: 'Hola' }}
		errors={{
			email: 'El email no tiene un formato válido.',
			subject: 'El asunto es obligatorio.',
		}}
	/>
);

export const Transmitiendo = () => (
	<ContactForm
		placeholders={placeholders}
		initialValues={{
			name: 'Kevin Barroso',
			email: 'kevin@ejemplo.com',
			subject: 'Consulta sobre arquitectura de datos',
			message: 'Quería consultarte por una migración a Snowflake.',
		}}
		isSubmitting
	/>
);

export const TransmisionRecibida = () => (
	<ContactForm status='success' statusMessage='Mensaje recibido. Te respondo a la brevedad.' />
);

export const FalloDeTransmision = () => (
	<ContactForm
		placeholders={placeholders}
		status='error'
		statusMessage='No se pudo establecer el enlace. Probá de nuevo en unos minutos.'
	/>
);
