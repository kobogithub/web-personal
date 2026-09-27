import * as React from 'react';
import { PostItem, type PostItemProps } from './PostItem';

export type PostsByYearEntry = Omit<PostItemProps, 'tagHref' | 'className'>;

export interface PostsByYearProps {
	/** Los posts a listar. Se agrupan y ordenan solos, de más nuevo a más viejo. */
	posts: PostsByYearEntry[];
	/** Construye el destino de cada etiqueta. */
	tagHref?: (tag: string) => string;
	className?: string;
}

function groupByYear(posts: PostsByYearEntry[]) {
	const grouped = new Map<number, PostsByYearEntry[]>();
	for (const post of posts) {
		const year = post.pubDate.getFullYear();
		const bucket = grouped.get(year);
		if (bucket) bucket.push(post);
		else grouped.set(year, [post]);
	}
	return [...grouped.entries()]
		.sort(([a], [b]) => b - a)
		.map(([year, yearPosts]) => ({
			year,
			posts: [...yearPosts].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()),
		}));
}

/**
 * Índice del blog agrupado por año: un encabezado por año y debajo sus
 * `PostItem`, del más nuevo al más viejo. El agrupado y el orden los resuelve
 * el componente — se le pasa la lista plana.
 */
export function PostsByYear({ posts, tagHref, className }: PostsByYearProps) {
	return (
		<div className={className}>
			{groupByYear(posts).map(({ year, posts: yearPosts }) => (
				<div key={year} className='mb-8'>
					<h2 className='text-2xl font-display font-bold text-magi-ink border-b border-magi-line pb-1 mb-4'>
						{year}
					</h2>
					<div>
						{yearPosts.map((post) => (
							<PostItem key={post.href} {...post} tagHref={tagHref} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}

export default PostsByYear;
