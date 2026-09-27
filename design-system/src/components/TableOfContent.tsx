import * as React from 'react';
import { cx } from '../cx';

export interface Heading {
	/** Nivel del encabezado: 2 es de primer orden en el índice. */
	depth: number;
	/** Ancla del encabezado, sin el `#`. */
	slug: string;
	/** Texto visible. */
	text: string;
}

export interface TableOfContentProps {
	/** Los encabezados del post, en el orden en que aparecen. */
	headings: Heading[];
	/** Hasta qué nivel anidar. Con 2, sólo se listan los `h2`. */
	maxLevel?: number;
	/** Rótulo del índice. */
	title?: string;
	className?: string;
}

interface TocNode extends Heading {
	subheadings: Heading[];
}

function buildToc(headings: Heading[], maxLevel: number): TocNode[] {
	const toc: TocNode[] = [];
	const parents = new Map<number, TocNode>();
	for (const h of headings ?? []) {
		const node: TocNode = { ...h, subheadings: [] };
		parents.set(node.depth, node);
		if (node.depth === 2) {
			toc.push(node);
		} else if (maxLevel > 2) {
			parents.get(node.depth - 1)?.subheadings.push(node);
		}
	}
	return toc;
}

/**
 * Índice del post, pegado al borde superior mientras se hace scroll. Anida un
 * nivel bajo cada `h2` cuando `maxLevel` lo permite.
 */
export function TableOfContent({
	headings,
	maxLevel = 3,
	title = 'En esta página',
	className,
}: TableOfContentProps) {
	const toc = buildToc(headings, maxLevel);
	return (
		<nav className={cx('toc sticky top-4 py-2 lg:-ml-3', className)}>
			<h3 className='eyebrow mb-1 px-3'>{title}</h3>
			<ul className='toc-list max-h-[calc(100vh-70px)] overflow-auto text-[.825rem] text-magi-muted'>
				{toc.map((heading) => (
					<li key={heading.slug}>
						<a
							className='block font-bold py-1.5 px-3 border-l border-transparent text-inherit leading-tight hover:text-magi-accent'
							href={`#${heading.slug}`}
						>
							{heading.text}
						</a>
						{heading.subheadings.length > 0 && (
							<ul>
								{heading.subheadings.map((sub) => (
									<li key={sub.slug}>
										<a
											className='block py-1.5 pl-6 pr-3 border-l border-transparent text-inherit leading-tight hover:text-magi-accent'
											href={`#${sub.slug}`}
										>
											{sub.text}
										</a>
									</li>
								))}
							</ul>
						)}
					</li>
				))}
			</ul>
		</nav>
	);
}

export default TableOfContent;
