import * as React from 'react';
import { Prose } from 'magi-ds';

export const Articulo = () => (
	<Prose>
		<h2>Dos planos que se mueven a distinta velocidad</h2>
		<p>
			El plano de control cambia cuando alguien decide cambiarlo. El plano de datos cambia todo
			el tiempo, solo porque llegan filas nuevas. Tratarlos como si fueran uno es la raíz de
			buena parte de los incidentes de una plataforma.
		</p>
		<h3>Qué se rompe cuando se confunden</h3>
		<p>
			Un despliegue que toca los dos planos a la vez deja la puerta abierta a que el esquema
			avance sin que avance el permiso que lo protege. La consecuencia no se ve el día del
			deploy: se ve el día que alguien consulta.
		</p>
		<ul>
			<li>El esquema viaja con el código; los datos, no.</li>
			<li>Una migración hacia atrás no existe — solo hay otra migración hacia adelante.</li>
			<li>La calidad es una compuerta de promoción, no un informe.</li>
		</ul>
		<blockquote>
			<p>Los datos solo suben: RAW → STAGING → INTERMEDIATE → MARTS, nunca al revés.</p>
		</blockquote>
	</Prose>
);

export const ConCodigo = () => (
	<Prose>
		<h2>El campo que fija la versión</h2>
		<p>
			El id de un post lo fija el campo <code>slug</code> del frontmatter, no el nombre de la
			carpeta. El glob loader de Astro lee uno y reporta el otro:
		</p>
		<pre>
			<code>{`---
slug: fabric-dos-planos
pubDate: 2026-09-03
tags: [fabric, arquitectura]
---`}</code>
		</pre>
		<p>
			Cambiar la carpeta no cambia la URL. Cambiar el <code>slug</code> sí, y rompe todos los
			enlaces que ya salieron.
		</p>
	</Prose>
);
