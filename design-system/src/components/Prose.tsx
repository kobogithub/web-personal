import * as React from 'react';
import { cx } from '../cx';

export interface ProseProps {
	/** El contenido largo — típicamente el HTML de un post. */
	children?: React.ReactNode;
	className?: string;
}

/**
 * Envoltorio tipográfico para contenido largo. Aplica la escala de títulos del
 * panel y se adapta al tema oscuro con `dark:prose-invert`.
 */
export function Prose({ children, className }: ProseProps) {
	return (
		<div
			className={cx(
				'prose dark:prose-invert',
				'prose-h1:font-[900] prose-h1:my-4 prose-h1:text-2xl sm:prose-h1:text-[2rem]/[1.3]',
				'prose-h2:mt-6 prose-h2:mb-3 prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:font-extrabold',
				'prose-h3:mt-5 prose-h3:mb-2 prose-h3:text-xl sm:prose-h3:text-2xl',
				'prose-h4:mt-3 prose-h4:mb-0 prose-img:rounded-xl prose-h3:target:pt-20',
				className
			)}
		>
			{children}
		</div>
	);
}

export default Prose;
