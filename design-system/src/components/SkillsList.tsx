import * as React from 'react';
import { cx } from '../cx';
import { IconifyIcon } from './IconifyIcon';

export interface Skill {
	/** Nombre de la tecnología. */
	name: string;
	/** Qué se hizo con ella. */
	description: string;
	/** Id de Iconify, por ejemplo `simple-icons:rust`. */
	icon: string;
	/** Etiquetas de agrupación. */
	tags?: string[];
	/** Enlace a un post relacionado. Sin esto no aparece el pie. */
	postLink?: string;
}

export interface SkillsListProps {
	/** Las tecnologías a mostrar. */
	skills: Skill[];
	/** Texto del enlace al post. */
	articleLabel?: string;
	/**
	 * Reemplaza cómo se pinta el icono. Por defecto usa `IconifyIcon`, que
	 * resuelve el id contra Iconify.
	 */
	renderIcon?: (icon: string) => React.ReactNode;
	className?: string;
}

/**
 * Grilla de tecnologías. Cada tarjeta lleva borde superior de acento, marcas de
 * retícula, el resplandor de `glow-accent` en hover y entra animada alternando
 * el lado — las pares desde la izquierda, las impares desde la derecha.
 */
export function SkillsList({
	skills,
	articleLabel = 'Article',
	renderIcon,
	className,
}: SkillsListProps) {
	return (
		<div className={cx('grid grid-cols-12 gap-5', className)}>
			{skills.map((skill, index) => (
				<div
					key={skill.name}
					className='corner-mark glow-accent assemble col-span-12 sm:col-span-6 lg:col-span-4 border border-magi-line border-t-2 border-t-magi-accent bg-magi-surface p-5 hover:-translate-y-1'
					data-dir={index % 2 === 0 ? 'left' : 'right'}
				>
					<div className='flex items-center gap-2 mb-2'>
						{renderIcon ? renderIcon(skill.icon) : <IconifyIcon icon={skill.icon} />}
						<h3 className='font-semibold'>{skill.name}</h3>
					</div>
					<div className='text-magi-muted mb-4 min-h-[50px]'>
						<p>{skill.description}</p>
					</div>
					<div className='flex flex-wrap gap-2 mb-4'>
						{(skill.tags ?? []).map((tag) => (
							<span
								key={tag}
								className='border border-magi-line text-xs font-mono text-magi-support no-underline px-2 py-0.5 transition-all duration-300 hover:border-magi-support'
							>
								{tag}
							</span>
						))}
					</div>
					{skill.postLink && (
						<div className='flex justify-end'>
							<a
								className='underline text-magi-violet hover:text-magi-accent flex items-center gap-2'
								href={skill.postLink}
							>
								{articleLabel}
							</a>
						</div>
					)}
				</div>
			))}
		</div>
	);
}

export default SkillsList;
