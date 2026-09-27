import * as React from 'react';
import { cx } from '../cx';

export interface Project {
	/** Nombre del proyecto. */
	name: string;
	/** Resumen de una o dos líneas. Se recorta a dos con `line-clamp-2`. */
	description: string;
	/** Etiquetas de tecnología. */
	tags?: string[];
	/** Estrellas en GitHub. Sin esto no se muestra el contador. */
	stargazers_count?: number;
	/** Repositorio, detrás del contador de estrellas. */
	html_url?: string;
	/** Ficha interna del proyecto. Si está, el título lleva acá. */
	detailHref?: string;
	/** Demo pública. Sin esto se muestra el cartel de proyecto interno. */
	demoLink?: string;
	demoLinkRel?: string;
	/** Post relacionado. */
	postLink?: string;
}

export interface ProjectListProps {
	/** Los proyectos, en el orden en que se muestran. */
	projects: Project[];
	/** Texto del enlace a la ficha. */
	readMoreLabel?: string;
	/** Cartel para proyectos sin demo pública. */
	internalLabel?: string;
	/** Texto del enlace al post. */
	articleLabel?: string;
	className?: string;
}

function kFormatter(num: number): string {
	return Math.abs(num) > 999
		? `${Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1))}k`
		: `${Math.sign(num) * Math.abs(num)}`;
}

const ChevronRight = () => (
	<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
		<path d='m9 18 6-6-6-6' />
	</svg>
);

const ExternalLink = () => (
	<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
		<path d='M15 3h6v6' />
		<path d='M10 14 21 3' />
		<path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
	</svg>
);

const Lock = ({ size = 12 }: { size?: number }) => (
	<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
		<rect width='18' height='11' x='3' y='11' rx='2' ry='2' />
		<path d='M7 11V7a5 5 0 0 1 10 0v4' />
	</svg>
);

const GithubMark = () => (
	<svg width='12' height='12' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
		<path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
	</svg>
);

/**
 * Grilla de proyectos. Cada tarjeta abre con sus etiquetas y el contador de
 * estrellas, y cierra con los enlaces disponibles — post, ficha y demo — o con
 * el cartel de proyecto interno cuando no hay demo pública.
 */
export function ProjectList({
	projects,
	readMoreLabel = 'Leer más',
	internalLabel = 'Proyecto interno',
	articleLabel = 'Article',
	className,
}: ProjectListProps) {
	return (
		<div className={cx('grid grid-cols-12 gap-5', className)}>
			{projects.map((project, index) => (
				<div
					key={project.name}
					className='corner-mark glow-accent assemble col-span-12 sm:col-span-6 lg:col-span-4 border border-magi-line border-t-2 border-t-magi-accent bg-magi-surface p-5 hover:-translate-y-1'
					data-dir={index % 2 === 0 ? 'left' : 'right'}
				>
					<div className='flex justify-between items-center'>
						<div className='flex gap-2 flex-wrap'>
							{(project.tags ?? []).map((tag) => (
								<span
									key={tag}
									className='border border-magi-line text-xs font-mono text-magi-support no-underline px-2 py-0.5 transition-all duration-300 hover:border-magi-support'
								>
									{tag}
								</span>
							))}
						</div>
						{project.stargazers_count !== undefined && (
							<div className='shrink-0'>
								<a
									href={project.html_url}
									target='_blank'
									rel='noopener noreferrer'
									className='border border-magi-line text-xs font-mono text-magi-muted no-underline px-2 py-0.5 transition-all duration-300 hover:border-magi-accent hover:text-magi-accent flex items-center gap-1'
								>
									<GithubMark />
									{kFormatter(project.stargazers_count)} stars
								</a>
							</div>
						)}
					</div>
					<h3 className='font-semibold my-2'>
						{project.detailHref ? (
							<a className='underline hover:text-magi-accent' href={project.detailHref}>
								{project.name}
							</a>
						) : project.demoLink ? (
							<a
								className='underline hover:text-magi-accent'
								href={project.demoLink}
								target='_blank'
								rel={project.demoLinkRel}
							>
								{project.name}
							</a>
						) : (
							project.name
						)}
					</h3>
					<div className='line-clamp-2 text-magi-muted mb-4 min-h-[50px]'>
						<p>{project.description}</p>
					</div>
					<div className='flex justify-end items-center gap-3 flex-wrap'>
						{project.postLink && (
							<a
								className='underline text-magi-violet hover:text-magi-accent flex items-center gap-2'
								href={project.postLink}
							>
								{articleLabel}
							</a>
						)}
						{project.detailHref && (
							<a
								className='underline text-magi-violet hover:text-magi-accent flex items-center gap-2'
								href={project.detailHref}
							>
								{readMoreLabel}
								<ChevronRight />
							</a>
						)}
						{project.demoLink ? (
							<a
								className='underline text-magi-violet hover:text-magi-accent flex items-center gap-2'
								href={project.demoLink}
								target='_blank'
								rel={project.demoLinkRel}
							>
								Demo
								<ExternalLink />
							</a>
						) : (
							<span className='border border-magi-line text-xs font-mono text-magi-muted px-2 py-1 flex items-center gap-1.5'>
								<Lock />
								{internalLabel}
							</span>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

export default ProjectList;
