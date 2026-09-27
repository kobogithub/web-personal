import * as React from 'react';
import { cx } from '../cx';
import { Author, type AuthorProps } from './Author';

export interface AboutTheAuthorProps extends Pick<AuthorProps, 'name' | 'role' | 'avatarSrc' | 'profileUrl' | 'linkedinUrl'> {
	/** Rótulo de la sección, en versalitas. */
	title?: string;
	/** Bio corta bajo la firma. Acepta texto o JSX con enlaces. */
	description?: React.ReactNode;
	className?: string;
}

/**
 * Ficha de autor para el pie de un post: rótulo, la firma de `Author` y una
 * bio breve, separada del contenido por una línea inferior.
 */
export function AboutTheAuthor({
	title = 'Sobre el autor',
	description,
	className,
	...author
}: AboutTheAuthorProps) {
	return (
		<div className={cx('about-the-author py-4 border-b border-magi-line', className)}>
			<h3 className='eyebrow mb-4'>{title}</h3>
			<Author picSize='md' {...author} />
			<div className='author-desc text-[.825rem] my-4 text-magi-muted'>
				<p className='mb-3'>{description}</p>
			</div>
		</div>
	);
}

export default AboutTheAuthor;
