import * as React from 'react';
import { Icon } from '@iconify/react';

export interface IconifyIconProps {
	/** Id de Iconify, por ejemplo `simple-icons:rust`. */
	icon: string;
	className?: string;
}

/**
 * Icono de Iconify. Resuelve el set por id, así que sirve para los cientos de
 * iconos de tecnología que lista `SkillsList` sin importarlos uno por uno.
 */
export function IconifyIcon({ icon, className = 'w-6 h-6' }: IconifyIconProps) {
	return <Icon icon={icon} className={className} />;
}

export default IconifyIcon;
