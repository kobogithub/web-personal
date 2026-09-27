import * as React from 'react';
import { cx } from '../cx';
import { FormattedDate } from './FormattedDate';

export interface PostItemProps {
	/** Título del post. */
	title: string;
	/** Destino del título. */
	href: string;
	/** Fecha de publicación. */
	pubDate: Date;
	/** Etiquetas. Cada una se renderiza como chip enlazable. */
	tags?: string[];
	/** Construye el destino de cada etiqueta. Sin esto, los chips no enlazan. */
	tagHref?: (tag: string) => string;
	className?: string;
}

/**
 * Una fila del índice del blog: fecha a la izquierda, título al centro y los
 * chips de etiquetas a la derecha. Lleva `assemble` para entrar animado cuando
 * el listado aparece en pantalla.
 */
export function PostItem({ title, href, pubDate, tags = [], tagHref, className }: PostItemProps) {
	return (
		<div
			className={cx(
				'assemble flex flex-col sm:flex-row gap-2 sm:items-center border-b border-magi-line py-2 mb-1 capitalize',
				className
			)}
			data-dir='up'
		>
			<div className='text-magi-muted text-sm w-24 shrink-0 font-mono'>
				<FormattedDate date={pubDate} />
			</div>
			<h3 className='font-medium grow'>
				<a href={href} className='hover:text-magi-accent transition-colors'>
					{title}
				</a>
			</h3>
			<div className='flex gap-2 shrink-0'>
				{tags.map((tag) => (
					<a
						key={tag}
						className='border border-magi-line text-xs font-mono text-magi-support no-underline px-2 py-0.5 transition-all duration-300 hover:border-magi-support'
						href={tagHref ? tagHref(tag) : undefined}
					>
						{tag}
					</a>
				))}
			</div>
		</div>
	);
}

export default PostItem;
