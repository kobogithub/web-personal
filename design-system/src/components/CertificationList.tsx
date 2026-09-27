import * as React from 'react';
import { cx } from '../cx';

export interface Certification {
	/** Nombre de la certificación. */
	name: string;
	/** Quién la emite. */
	issuer: string;
	/** Fecha, como texto ya formateado. */
	date: string;
	/** Enlace de verificación. Sin esto no se muestra el enlace. */
	verifyUrl?: string;
	/** Insignia, a la derecha de la tarjeta. */
	badgeUrl?: string;
	badgeAlt?: string;
}

export interface CertificationListProps {
	/** Las certificaciones, en el orden en que se muestran. */
	certifications: Certification[];
	/** Texto del enlace de verificación. */
	verifyLabel?: string;
	className?: string;
}

/**
 * Listado de certificaciones en tarjetas con marcas de retícula (`corner-mark`)
 * que se encienden al pasar el mouse. Cada tarjeta lleva nombre, emisor, fecha,
 * un enlace de verificación opcional y la insignia.
 */
export function CertificationList({
	certifications,
	verifyLabel = 'Verificar',
	className,
}: CertificationListProps) {
	return (
		<div className={cx('space-y-6', className)}>
			{certifications.map((cert) => (
				<div
					key={cert.name}
					className='corner-mark assemble border border-magi-line p-6 hover:border-magi-accent transition-colors'
					data-dir='up'
				>
					<div className='flex items-start justify-between'>
						<div className='flex-1'>
							<h3 className='text-xl font-semibold text-magi-ink mb-2'>{cert.name}</h3>
							<p className='text-base text-magi-muted mb-1'>{cert.issuer}</p>
							<p className='text-sm text-magi-muted font-mono mb-4'>{cert.date}</p>
							{cert.verifyUrl && (
								<a
									href={cert.verifyUrl}
									target='_blank'
									rel='noopener noreferrer'
									className='inline-flex items-center text-magi-violet hover:text-magi-accent font-medium'
								>
									{verifyLabel}
									<svg
										className='w-4 h-4 ml-1'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
										/>
									</svg>
								</a>
							)}
						</div>
						{cert.badgeUrl && (
							<div className='ml-4 flex-shrink-0'>
								<img
									src={cert.badgeUrl}
									alt={cert.badgeAlt}
									className='w-24 h-24 object-contain'
								/>
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

export default CertificationList;
