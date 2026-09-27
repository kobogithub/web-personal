import * as React from 'react';
import { SkillsList } from 'magi-ds';

// Los iconos reales los resuelve Iconify contra su API. En la tarjeta se pinta
// un cuadrado de acento en su lugar, para que el preview no dependa de la red.
const marca = () => (
	<span className='inline-block w-5 h-5 shrink-0 bg-magi-accent' aria-hidden='true' />
);

export const Grilla = () => (
	<SkillsList
		renderIcon={marca}
		skills={[
			{
				name: 'Rust',
				description: 'Herramientas CLI de alto rendimiento para desarrollo asistido por IA.',
				icon: 'simple-icons:rust',
				tags: ['Systems', 'CLI'],
			},
			{
				name: 'Snowflake',
				description: 'Warehouse y catálogo con Horizon: enmascarado, linaje y calidad como compuerta.',
				icon: 'simple-icons:snowflake',
				tags: ['Data', 'Cloud'],
			},
			{
				name: 'LangGraph',
				description: 'Orquestación de sistemas multi-agente con estado y puntos de control.',
				icon: 'simple-icons:langchain',
				tags: ['AI'],
				postLink: '/un-solo-interprete/',
			},
		]}
	/>
);

export const ConEnlaceAPost = () => (
	<SkillsList
		renderIcon={marca}
		skills={[
			{
				name: 'DuckDB',
				description: 'Motor analítico embebido: el lakehouse medallion entra en una laptop.',
				icon: 'simple-icons:duckdb',
				tags: ['Data', 'Analytics'],
				postLink: '/lakehouse-en-la-laptop/',
			},
		]}
	/>
);
