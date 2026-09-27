import * as React from 'react';
import { cx } from '../cx';
import { DEFAULT_AVATAR } from '../avatar';
import { LinkedInIcon } from './LinkedInIcon';

export type AuthorPicSize = 'sm' | 'md' | 'lg';

export interface AuthorProps {
	/** Diámetro del avatar: 48, 70 o 90 píxeles. */
	picSize?: AuthorPicSize;
	/** Nombre que se muestra y que usa el `alt` del avatar. */
	name?: string;
	/** Cargo bajo el nombre. */
	role?: string;
	/** Imagen del avatar. Por defecto, la foto embebida. */
	avatarSrc?: string;
	/** Destino del nombre y del avatar. */
	profileUrl?: string;
	/** Destino del enlace de LinkedIn. */
	linkedinUrl?: string;
	className?: string;
}

const sizeClass: Record<AuthorPicSize, string> = {
	sm: 'w-12 h-12',
	md: 'w-[70px] h-[70px]',
	lg: 'w-[90px] h-[90px]',
};

/**
 * Firma del autor: avatar circular, nombre, cargo y enlace a LinkedIn. Se usa
 * en la cabecera de los posts y en la ficha de autor de la barra lateral.
 */
export function Author({
	picSize = 'md',
	name = 'Kevin Barroso',
	role = 'Platform Manager / AI Engineer',
	avatarSrc = DEFAULT_AVATAR,
	profileUrl = 'https://github.com/kobogithub',
	linkedinUrl = 'https://www.linkedin.com/in/kobouharriet/',
	className,
}: AuthorProps) {
	return (
		<div className={cx('flex gap-4 items-center leading-tight not-prose', className)}>
			<a
				href={profileUrl}
				target='_blank'
				rel='noopener noreferrer'
				className={cx('rounded-full overflow-hidden shrink-0 block', sizeClass[picSize])}
			>
				<img src={avatarSrc} alt={name} className='w-full h-full object-cover' />
			</a>
			<div>
				<div>
					<a
						href={profileUrl}
						className='block font-bold text-inherit hover:text-magi-accent'
						target='_blank'
						rel='noopener noreferrer'
					>
						{name}
					</a>
				</div>
				<small className='avatar__subtitle'>{role}</small>
				<a
					href={linkedinUrl}
					target='_blank'
					rel='noopener noreferrer'
					className='mt-1 flex items-center gap-1.5 text-magi-muted hover:text-magi-accent transition-colors no-underline'
					aria-label='LinkedIn'
				>
					<LinkedInIcon size={16} />
					<span className='text-xs font-mono'>LinkedIn</span>
				</a>
			</div>
		</div>
	);
}

export default Author;
