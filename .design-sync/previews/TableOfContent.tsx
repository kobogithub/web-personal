import * as React from 'react';
import { TableOfContent } from 'magi-ds';

const headings = [
	{ depth: 2, slug: 'el-problema', text: 'El problema' },
	{ depth: 3, slug: 'que-se-rompe', text: 'Qué se rompe' },
	{ depth: 3, slug: 'por-que-no-se-ve', text: 'Por qué no se ve el día del deploy' },
	{ depth: 2, slug: 'los-dos-planos', text: 'Los dos planos' },
	{ depth: 3, slug: 'control', text: 'Plano de control' },
	{ depth: 3, slug: 'datos', text: 'Plano de datos' },
	{ depth: 2, slug: 'como-separarlos', text: 'Cómo separarlos' },
];

export const ConAnidado = () => <TableOfContent headings={headings} maxLevel={3} />;

export const SoloNivelDos = () => (
	<TableOfContent headings={headings} maxLevel={2} title='En esta página' />
);

export const EnIngles = () => (
	<TableOfContent
		title='On this page'
		headings={[
			{ depth: 2, slug: 'the-problem', text: 'The problem' },
			{ depth: 2, slug: 'two-planes', text: 'Two planes' },
			{ depth: 2, slug: 'how-to-split', text: 'How to split them' },
		]}
	/>
);
