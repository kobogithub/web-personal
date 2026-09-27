import * as React from 'react';
import { ProjectList } from 'magi-ds';

export const Grilla = () => (
	<ProjectList
		projects={[
			{
				name: 'Knowledge CLI',
				description: 'CLI en Rust para desarrollo asistido por IA, con gestión de agentes y skills.',
				tags: ['Rust', 'CLI'],
				detailHref: '/projects/knowledge-cli/',
				postLink: '/publicar-no-es-distribuir/',
			},
			{
				name: 'Lakehouse medallion local',
				description: 'Airflow, MinIO y DuckDB: el medallion completo corriendo en una laptop.',
				tags: ['DuckDB', 'Airflow'],
				stargazers_count: 1240,
				html_url: 'https://github.com/kobogithub',
				demoLink: 'https://example.com',
			},
			{
				name: 'Extractor IA de granos',
				description: 'Procesa mensajes de WhatsApp de mesas de granos con NLP y visión por computadora.',
				tags: ['AI', 'FastAPI'],
			},
		]}
	/>
);

export const ProyectoInterno = () => (
	<ProjectList
		internalLabel='Proyecto interno'
		projects={[
			{
				name: 'Acelerador de Microsoft Fabric',
				description: 'Plantilla de arranque para separar el plano de control del de datos.',
				tags: ['Fabric', 'Arquitectura'],
			},
		]}
	/>
);

export const ConEstrellas = () => (
	<ProjectList
		projects={[
			{
				name: 'web-personal',
				description: 'Este sitio: Astro, i18n por idioma y despliegue a GitHub Pages.',
				tags: ['Astro', 'TypeScript'],
				stargazers_count: 87,
				html_url: 'https://github.com/kobogithub/web-personal',
				demoLink: 'https://kobouharriet.me',
			},
		]}
	/>
);
