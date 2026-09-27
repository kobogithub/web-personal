import * as React from 'react';
import { PostItem } from 'magi-ds';

const tagHref = (t: string) => `/tags/${t}/`;

export const Listado = () => (
	<div>
		<PostItem
			title='Ni el owner puede leer esa columna'
			href='/ni-el-owner-puede-leer/'
			pubDate={new Date('2026-09-05T00:00:00Z')}
			tags={['snowflake', 'gobierno']}
			tagHref={tagHref}
		/>
		<PostItem
			title='Dos planos que se mueven a distinta velocidad'
			href='/fabric-dos-planos/'
			pubDate={new Date('2026-09-03T00:00:00Z')}
			tags={['fabric', 'arquitectura']}
			tagHref={tagHref}
		/>
		<PostItem
			title='Publicaste 0.10.0. Tus usuarios instalaron 0.9.0.'
			href='/publicar-no-es-distribuir/'
			pubDate={new Date('2026-09-03T00:00:00Z')}
			tags={['distribucion']}
			tagHref={tagHref}
		/>
	</div>
);

export const SinEtiquetas = () => (
	<PostItem
		title='Un solo intérprete'
		href='/un-solo-interprete/'
		pubDate={new Date('2025-11-14T00:00:00Z')}
	/>
);
