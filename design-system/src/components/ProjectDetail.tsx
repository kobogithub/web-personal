import * as React from 'react';
import { cx } from '../cx';

export type ProjectStatus =
	| 'activo'
	| 'active'
	| 'en-produccion'
	| 'in-production'
	| 'archivado'
	| 'archived'
	| (string & {});

export interface ProjectDetailProps {
	/** Título de la ficha. */
	title: string;
	/** Resumen de una línea, bajo el título. */
	summary: string;
	/** Rol que se ocupó en el proyecto. */
	role: string;
	/** Período, como texto ya formateado. */
	period: string;
	/** Estado. Define el color del chip; acepta las variantes en ambos idiomas. */
	status: ProjectStatus;
	/** Tecnologías usadas. */
	stack: string[];
	/** Repositorio. Sin esto se muestra el cartel de repo privado. */
	repoUrl?: string;
	/** Destino del enlace de vuelta al listado. */
	backHref?: string;
	backLabel?: string;
	roleLabel?: string;
	periodLabel?: string;
	stackLabel?: string;
	repoLabel?: string;
	privateLabel?: string;
	/** El cuerpo de la ficha, ya renderizado. */
	children?: React.ReactNode;
	className?: string;
}

const statusStyles: Record<string, string> = {
	activo: 'text-magi-support border-magi-support',
	active: 'text-magi-support border-magi-support',
	'en-produccion': 'text-magi-accent border-magi-accent',
	'in-production': 'text-magi-accent border-magi-accent',
	archivado: 'text-magi-muted border-magi-line',
	archived: 'text-magi-muted border-magi-line',
};

const statusLabels: Record<string, string> = {
	activo: 'Activo',
	active: 'Active',
	'en-produccion': 'En producción',
	'in-production': 'In production',
	archivado: 'Archivado',
	archived: 'Archived',
};

const ArrowLeft = () => (
	<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
		<path d='m12 19-7-7 7-7' />
		<path d='M19 12H5' />
	</svg>
);

const ExternalLink = () => (
	<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
		<path d='M15 3h6v6' />
		<path d='M10 14 21 3' />
		<path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
	</svg>
);

const Lock = () => (
	<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
		<rect width='18' height='11' x='3' y='11' rx='2' ry='2' />
		<path d='M7 11V7a5 5 0 0 1 10 0v4' />
	</svg>
);

/**
 * Ficha completa de un proyecto: cabecera enmarcada con el chip de estado, la
 * definición de rol y período, el stack en chips, el enlace al repositorio y
 * debajo el cuerpo largo en `prose`.
 */
export function ProjectDetail({
	title,
	summary,
	role,
	period,
	status,
	stack,
	repoUrl,
	backHref = '/projects/',
	backLabel = 'Volver a proyectos',
	roleLabel = 'Rol',
	periodLabel = 'Período',
	stackLabel = 'Stack',
	repoLabel = 'Ver repositorio',
	privateLabel = 'Repositorio privado',
	children,
	className,
}: ProjectDetailProps) {
	return (
		<div className={cx('container', className)}>
			<a
				href={backHref}
				className='eyebrow text-magi-muted hover:text-magi-accent transition-colors inline-flex items-center gap-2 mb-6'
			>
				<ArrowLeft />
				{backLabel}
			</a>

			<article>
				<header className='corner-mark border border-magi-line border-t-2 border-t-magi-accent bg-magi-surface p-5 sm:p-8 mb-10'>
					<div className='flex flex-wrap items-start justify-between gap-3 mb-3'>
						<h1 className='text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight m-0'>
							{title}
						</h1>
						<span
							className={cx(
								'border text-xs font-mono px-2 py-1 shrink-0',
								statusStyles[status] ?? 'text-magi-muted border-magi-line'
							)}
						>
							{statusLabels[status] ?? status}
						</span>
					</div>

					<p className='text-magi-muted text-lg mb-6'>{summary}</p>

					<dl className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mb-6'>
						<div>
							<dt className='eyebrow text-magi-muted mb-1'>{roleLabel}</dt>
							<dd className='font-mono m-0'>{role}</dd>
						</div>
						<div>
							<dt className='eyebrow text-magi-muted mb-1'>{periodLabel}</dt>
							<dd className='font-mono m-0'>{period}</dd>
						</div>
					</dl>

					<div>
						<div className='eyebrow text-magi-muted mb-2'>{stackLabel}</div>
						<div className='flex gap-2 flex-wrap'>
							{stack.map((item) => (
								<span
									key={item}
									className='border border-magi-line text-xs font-mono text-magi-support px-2 py-0.5'
								>
									{item}
								</span>
							))}
						</div>
					</div>

					{repoUrl ? (
						<a
							href={repoUrl}
							target='_blank'
							rel='noopener'
							className='corner-cut glow-accent inline-flex items-center gap-2 mt-6 border border-magi-accent text-magi-accent px-4 py-2 text-sm font-mono hover:bg-magi-accent hover:text-magi-accent-ink transition-colors no-underline'
						>
							{repoLabel}
							<ExternalLink />
						</a>
					) : (
						<span className='inline-flex items-center gap-1.5 mt-6 border border-magi-line text-xs font-mono text-magi-muted px-2 py-1'>
							<Lock />
							{privateLabel}
						</span>
					)}
				</header>

				<div className='prose dark:prose-invert prose-h2:font-display prose-h2:uppercase prose-h2:tracking-tight prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-img:rounded-none max-w-none pb-16'>
					{children}
				</div>
			</article>
		</div>
	);
}

export default ProjectDetail;
