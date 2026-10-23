---
title: "El modelo no fue lo que hizo la diferencia"
slug: "no-fue-el-modelo"
seoTitle: "Text-to-SQL con y sin capa semántica: Bedrock, Athena y Glue Data Catalog sobre datos de un acopio"
description: "La misma pregunta de negocio a tres agentes de Claude sobre la misma base. El que más sabe de SQL falla cinco de cinco; el más chico, con una capa semántica, acierta las cinco y cuesta cien veces menos."
tags: ["AWS", "Amazon Bedrock", "Athena", "Glue", "Text-to-SQL", "Semantic Layer", "Data Governance", "Python"]
pubDate: "Oct 23 2026"
coverImage: "./cover.png"
lang: "es"
alternate: "no-fue-el-modelo-en"
---

# El modelo no fue lo que hizo la diferencia

## La tesis

Text-to-SQL se demuestra casi siempre con la misma base: una tabla `customers`,
una tabla `orders`, una columna `total_amount`. Con esos nombres cualquier modelo
acierta, y la demo termina probando algo que no es lo que el cliente necesita
saber.

La base de un acopio de granos no se ve así. Se ve así: `liq_cab.tip_op`,
`liq_det.cod_gra`, `kg_brt`, `kg_mer`, `imp_ret`. Es lo que deja un crawler de
Glue encima de un ERP: columnas de seis letras, códigos de dos, y todo el
significado en la cabeza de alguien del área comercial.

Para la Jornada AWS + Taligent del 21 de octubre armé una demo que contesta una
sola pregunta: con esa base, ¿qué hace que el modelo acierte? Lo que quería
mostrar —y lo que terminaron mostrando los números— es que no es el modelo.

## La trampa está en el dato, no en el SQL

Los datos son sintéticos, generados con semilla fija: cabecera y detalle de
liquidaciones, productores, provincias con su zona comercial y el tipo de cambio
diario. Cinco tablas. Y tres preguntas que cualquier gerente comercial hace un
lunes:

| id | Pregunta | Qué hay que saber para acertar |
|---|---|---|
| q1 | ¿Cuántas toneladas netas de soja originamos en la campaña 2024/25? | Que soja es `SJ`. Que neto es bruto menos merma. Que originación son solo las liquidaciones `LP`. Que las anuladas no cuentan. Que la campaña 2024/25 va de abril de 2025 a marzo de 2026. |
| q2 | ¿Importe neto liquidado en dólares, por zona, en el tercer trimestre de 2026? | Que neto descuenta retenciones y gastos. Que hay liquidaciones en pesos y en dólares. Que se convierte con el tipo de cambio del día. |
| q3 | ¿Los cinco productores que más maíz nos vendieron en la campaña 2024/25? | Lo mismo que q1, en ranking. |

Nada de la tercera columna se deduce del esquema. `tip_op` puede valer
cualquier cosa, y "campaña" es una convención del negocio, no del calendario.

Esto escribió el modelo para q1 viendo solo nombres de tablas y columnas:

```sql
SELECT SUM(ld.kg_mer) / 1000.0 AS toneladas_netas
FROM liq_det ld
INNER JOIN liq_cab lc ON ld.nro_liq = lc.nro_liq
WHERE lc.fec_liq >= DATE '2024-07-01'
    AND lc.fec_liq < DATE '2025-07-01'
    AND ld.cod_gra LIKE '%SOJ%'
    AND lc.est NOT IN ('ANULADO', 'CANCELADO')
```

Es SQL válido y corre en Athena sin un error. Y está mal en el `SELECT` y en
cada línea del `WHERE`: suma la merma en vez de los kilos netos, inventa el
código del grano y los del estado, y pone la campaña de julio a junio. Devolvió
`NULL`, que es el mejor resultado posible: el error se ve.

En q2 el mismo modelo devolvió tres cifras prolijas, una por zona. Eran solo las
liquidaciones en pesos: filtró `cod_mon = 'ARS'` y dejó afuera todas las de
dólares. Ese número va a una slide y nadie lo discute. **El error peligroso no es
la consulta que falla; es la que corre.**

## Tres agentes, la misma pregunta

La demo es un chat local que manda la misma pregunta a tres agentes de Claude en
Bedrock, en paralelo, contra los mismos datos en Athena:

| Agente | Qué ve | Quién escribe el SQL |
|---|---|---|
| Sin capa | Nombres de tablas, columnas y tipos | El modelo |
| Con catálogo | Además, las descripciones de Glue Data Catalog y un glosario de negocio | El modelo |
| Con capa semántica | Solo métricas y dimensiones, con su significado | El código; el modelo elige |

Los dos primeros tienen una herramienta `ejecutar_sql` y pueden explorar la base
antes de contestar. El tercero no ve ninguna tabla.

Cada respuesta se compara con un SQL de referencia y queda marcada como correcta
o no. Medido con q3, cinco corridas por agente:

| | Sin capa | Sin capa + skill de SQL | Con catálogo | Capa semántica |
|---|---|---|---|---|
| Modelo | Opus 5.5 | Opus 5.5 | Opus 5.5 | Haiku 5.5 |
| Correctas | 0 de 5 | 0 de 5 | 5 de 5 | 5 de 5 |
| Costo de las cinco | US$ 0,38 | US$ 0,52 | US$ 0,17 | US$ 0,003 |

Hay tres lecturas en esa tabla.

**El modelo más grande, sin contexto, falla las cinco.** No cuatro de cinco: las
cinco. No le falta capacidad, le falta información que no está en ningún lado
de la base.

**La skill de SQL no arregla nada y cuesta más.** Es un bloque de buenas
prácticas genéricas que se suma al prompt:

```text
- Antes de filtrar por un código, tipo o estado, mirá sus valores.
- Antes de sumar una columna numérica, mirá su distribución y confirmá su unidad.
- No sumes valores en distintas monedas o unidades sin convertirlos antes.
```

Con eso el agente explora más: descubre que `tip_op` tiene `LP`, `LS` y `AJ`.
Lo que no descubre es que solo `LP` es originación, porque eso no está en los
datos. Explorar no reemplaza saber, y cada consulta de exploración son tokens.
La skill enseña *cómo* consultar; lo que faltaba era *qué significa* el dato.

**El agente con capa semántica usa el modelo más chico y cuesta más de cien
veces menos que el que falla.** No tiene nada que explorar.

## Catálogo y capa semántica no son lo mismo

El agente con catálogo acierta porque lee, en la descripción de Glue, que
`tip_op = 'LP'` es la liquidación primaria, y en el glosario que la campaña
2024/25 empieza el 1 de abril de 2025. Pero sigue escribiendo el SQL. Cada
corrida es una interpretación nueva del glosario; que coincidan es una
probabilidad, no una garantía.

La capa semántica escribe la definición una sola vez, en SQL:

```yaml
- id: toneladas_originadas
  descripcion: "Toneladas netas compradas a productores (originación)..."
  expresion: "ROUND(SUM(d.kg_brt - d.kg_mer) / 1000.0, 1)"
  filtros: ["c.tip_op = 'LP'"]
```

El agente no escribe SQL. Tiene una herramienta, `consultar_metrica`, cuyos
parámetros son listas cerradas armadas desde ese YAML: qué métrica, por qué
dimensión, qué grano, qué período. El código arma la consulta con la regla
general (nunca las anuladas), los joins y los filtros de la métrica. Sumar una
métrica al YAML la vuelve elegible sin tocar el prompt.

Lo más importante de la capa no es lo que calcula, es lo que se niega a
calcular. El prompt del agente dice:

```text
Si la pregunta pide algo que la capa no define, no lo aproximes con otra
métrica: respondé sin filas, diciendo qué falta definir.
```

Y el código, si recibe una elección que no existe, levanta `FueraDeLaCapa` con
el motivo en vez de completar lo que falta. Por eso la demo tiene una cuarta
pregunta, margen bruto, que la capa no define a propósito. Un agente que
escribe SQL puede inventarse una fórmula; el de la capa contesta qué falta
definir. En
producción, ese "no sé" vale más que cualquier número plausible.

## La métrica que se define en vivo

El cierre de la demo era definir una métrica delante del público: preguntar el
precio promedio pagado por tonelada de soja, por zona; ver que la capa responde
que no está definida; pegar la definición en `catalogo.yaml`, guardar —el chat
recarga la capa solo— y repetir la pregunta.

El archivo que trae esa definición tiene, todavía, esta línea:

```yaml
# PENDIENTE DE CONFIRMAR (Kevin): solo LP (no AJ), neto de retenciones y gastos, en dólares.
```

¿El precio promedio incluye los ajustes de precio? ¿Es neto de retenciones? ¿En
dólares de qué día? Son tres decisiones de negocio, y ninguna la puede tomar el
modelo. Si la toma, el número va a ser coherente, va a correr, y va a ser la
opinión de un modelo presentada como un dato.

## Una sola fuente

Todo sale de un archivo, `catalogo.yaml`: tablas, columnas con su comentario,
glosario, capa semántica y las preguntas con su SQL de referencia. Terraform lo
lee para crear las tablas en Glue con sus descripciones, así que lo que el
agente con catálogo lee es exactamente lo que vería un analista en la consola de
AWS. La demo lo lee para armar los prompts y la capa. No hay una segunda copia
de ninguna definición que pueda quedar vieja.

La infraestructura es chica a propósito: un bucket S3 privado y cifrado con los
Parquet, la base y las tablas de Glue, un workgroup de Athena que corta
cualquier consulta que escanee más de 1 GB, y una policy IAM mínima para quien
corre la demo.

## Lo que la demo no prueba

Conviene ser explícito:

- **Son datos sintéticos, cinco tablas.** Un ERP real tiene cientos, y el
  glosario completo no entra en un prompt. Que el agente con catálogo acierte
  cinco de cinco acá no dice nada sobre cómo le va con 400 tablas; la capa
  semántica escala mejor justamente porque no le pasa el esquema al modelo.
- **Cinco corridas no es estadística.** Es suficiente para mostrar que "acertó
  una vez" no significa "es confiable", que era el punto.
- **Opus sin capa a veces acierta q1.** Por eso la pregunta para mostrar el
  error en vivo es q3.
- **Los costos son estimados**, a precio de lista, y cubren solo el modelo, no
  el escaneo de Athena.

## Lo que me llevo

1. **Una consulta que corre no es una consulta correcta.** El error que importa
   es el plausible: un total por zona que deja afuera la mitad de las monedas.
2. **Lo que falta es semántica, no capacidad.** Ni un modelo más grande ni una
   skill de SQL resuelven que nadie escribió qué es una campaña.
3. **El catálogo no lo escribe la IA.** Sale del gobierno de datos: dueños,
   definiciones, reglas. La demo de Text-to-SQL resultó ser una demo de
   gobierno de datos.
4. **Cerrar el espacio de respuestas es más barato y más confiable.** El modelo
   más chico, eligiendo de una lista, le ganó al más grande escribiendo libre.
5. **Un agente que puede decir "eso no está definido" es una funcionalidad, no
   una falla.**

Text-to-SQL no es un problema de modelos. Es el problema de siempre —que nadie
dejó escrito qué significa "tonelada neta"— con una forma nueva y mucho más
rápida de hacerse visible.
