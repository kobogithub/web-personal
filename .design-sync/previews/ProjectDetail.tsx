import * as React from 'react';
import { ProjectDetail } from 'magi-ds';

export const Activo = () => (
	<ProjectDetail
		title='Knowledge CLI'
		summary='CLI en Rust para desarrollo asistido por IA, con gestión de agentes y skills.'
		role='Autor y mantenedor'
		period='2026 — presente'
		status='activo'
		stack={['Rust', 'MCP', 'Tokio', 'SQLite']}
		repoUrl='https://github.com/kobogithub'
	>
		<h2>Por qué existe</h2>
		<p>
			Cada repo terminaba con su propia colección de instrucciones sueltas. La CLI las unifica en
			un formato que el agente puede cargar, y que una persona puede leer.
		</p>
		<h3>Qué resuelve</h3>
		<p>
			Un solo lugar donde viven los agentes, las skills y la configuración, con precedencia
			explícita entre lo global y lo del repositorio.
		</p>
	</ProjectDetail>
);

export const EnProduccion = () => (
	<ProjectDetail
		title='Lakehouse medallion local'
		summary='Airflow, MinIO y DuckDB corriendo el medallion completo en una laptop.'
		role='Arquitecto de datos'
		period='2026'
		status='en-produccion'
		stack={['DuckDB', 'Airflow', 'MinIO', 'dbt']}
		repoUrl='https://github.com/kobogithub'
	>
		<h2>El punto</h2>
		<p>No hace falta una nube para probar una arquitectura medallion de punta a punta.</p>
	</ProjectDetail>
);

export const ArchivadoYPrivado = () => (
	<ProjectDetail
		title='Acelerador de Microsoft Fabric'
		summary='Plantilla de arranque que separa el plano de control del plano de datos.'
		role='Líder técnico'
		period='2025 — 2026'
		status='archivado'
		stack={['Fabric', 'PySpark', 'Terraform']}
	>
		<h2>Qué quedó</h2>
		<p>El patrón sobrevivió al proyecto: los dos planos se despliegan por separado.</p>
	</ProjectDetail>
);
