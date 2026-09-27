import * as React from 'react';
import { PostsByYear } from 'magi-ds';

export const IndiceDelBlog = () => (
	<PostsByYear
		tagHref={(t) => `/tags/${t}/`}
		posts={[
			{
				title: 'Ni el owner puede leer esa columna',
				href: '/ni-el-owner-puede-leer/',
				pubDate: new Date('2026-09-05T00:00:00Z'),
				tags: ['snowflake'],
			},
			{
				title: 'Dos planos que se mueven a distinta velocidad',
				href: '/fabric-dos-planos/',
				pubDate: new Date('2026-09-03T00:00:00Z'),
				tags: ['fabric'],
			},
			{
				title: 'Un solo intérprete',
				href: '/un-solo-interprete/',
				pubDate: new Date('2025-11-14T00:00:00Z'),
				tags: ['nix'],
			},
			{
				title: 'Sistema operativo personal',
				href: '/sistema-operativo-personal/',
				pubDate: new Date('2025-03-02T00:00:00Z'),
				tags: ['metodo'],
			},
		]}
	/>
);

export const UnSoloAnio = () => (
	<PostsByYear
		posts={[
			{
				title: 'Airflow contra Oracle',
				href: '/airflow-to-oracle/',
				pubDate: new Date('2024-06-18T00:00:00Z'),
				tags: ['airflow', 'oracle'],
			},
			{
				title: 'Python y oracledb',
				href: '/python-oracledb/',
				pubDate: new Date('2024-02-11T00:00:00Z'),
				tags: ['python'],
			},
		]}
		tagHref={(t) => `/tags/${t}/`}
	/>
);
