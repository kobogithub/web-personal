import * as React from 'react';
import { Author } from 'magi-ds';

// Avatar neutro para la celda que muestra otra persona: con el avatar por
// defecto la tarjeta quedaba mostrando un nombre ajeno sobre la foto de Kevin.
const AVATAR_NEUTRO =
	'data:image/svg+xml;utf8,' +
	encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#d8490f"/><circle cx="48" cy="38" r="16" fill="#fbede4"/><path d="M16 96c0-17.7 14.3-32 32-32s32 14.3 32 32z" fill="#fbede4"/></svg>`
	);

export const Tamanos = () => (
	<div className='flex flex-col gap-8'>
		<Author picSize='lg' />
		<Author picSize='md' />
		<Author picSize='sm' />
	</div>
);

export const OtraPersona = () => (
	<Author
		picSize='md'
		name='Ada Lovelace'
		role='Analista / Matemática'
		avatarSrc={AVATAR_NEUTRO}
		profileUrl='https://example.com'
		linkedinUrl='https://example.com'
	/>
);
