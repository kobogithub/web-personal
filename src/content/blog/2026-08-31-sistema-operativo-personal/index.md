---
title: "El sistema escribe el 90 %, yo el 10 %"
slug: "sistema-operativo-personal"
seoTitle: "Un sistema operativo personal: temas, capacidad y agentes"
description: "Mis dos sistemas de seguimiento anteriores murieron por la misma razón. El tercero funciona porque las reglas dejaron de estar escritas en un documento y pasaron a ser comandos."
tags: ["Productivity", "CLI", "Python", "Agents", "Claude Code"]
pubDate: "Aug 31 2026"
coverImage: "./cover.png"
lang: "es"
alternate: "sistema-operativo-personal-en"
---

# El sistema escribe el 90 %, yo el 10 %

## La tesis

Un sistema de seguimiento personal no muere por falta de funcionalidad. Muere el
día que te exige escribir algo que ya sabías.

Lo comprobé dos veces. La primera fue una carpeta de `status-logs/` en el vault
del equipo: tres líneas por frente, todos los días. Duró unas semanas. La segunda
fue un conector de calendario que nunca llegó a tener credenciales estables y se
apagó solo. Ninguno de los dos falló por un bug. Fallaron porque el trabajo de
mantenerlos vivo era mío, y ese trabajo compite todos los días contra el trabajo
de verdad.

El tercer intento —`kobo`— arrancó de una premisa distinta: **el sistema escribe
el 90 %, yo el 10 %**. Todo lo que exija que yo redacte algo a diario está
condenado, así que no se diseña. Lo que el sistema puede derivar de fuentes que
ya existen —el calendario, el correo, el gestor de tareas, las notas de las
reuniones— lo deriva. Lo que necesita mi criterio me lo pregunta, y solo eso.

Este post es sobre lo que aprendí construyéndolo. La herramienta es mía y es
privada; las ideas no.

## El diagnóstico: una regla escrita no es una regla

Antes de escribir una línea hice un análisis cuantitativo de cómo trabajaba en
realidad: 221 sesiones de agente sobre 31 repositorios en 42 días, ~1.958
prompts, 21.601 llamadas a herramientas. La conclusión no fue "necesito otra
herramienta". Fue que convivían tres ciclos de trabajo distintos y cuatro
memorias separadas, y que ninguno sabía de la existencia del otro.

Pero el dato que más me marcó fue otro, y es embarazoso: yo tenía escrita, hacía
meses, una regla de capacidad —no más de 22 horas semanales de carga declarada—.
Cuando la medí, tenía **33 horas declaradas y ni un solo frente en espera**.

La regla existía. Estaba en un documento, bien redactada, y yo la había escrito.
No servía para nada, porque cumplirla exigía abrir un YAML y hacer la cuenta a
mano. Y hacer la cuenta a mano es exactamente lo que la regla del 90/10 dice que
se muere.

> Una regla que no tiene un verbo asociado no es una regla. Es una intención.

Esa es, para mí, la lección transferible del proyecto entero: **la diferencia
entre una política y un sistema es que el sistema no te deja violarla por
distracción**.

## La unidad de trabajo estaba mal elegida

El segundo error de diseño era más viejo: yo organizaba *reuniones* y *tareas*.

Las dos son unidades pésimas. Una tarea no tiene horizonte —no sabés si esto vive
tres días o siete meses—. Una reunión no tiene contenido: es un evento en un
calendario que no te dice de qué frente es parte. Con esas dos unidades podés
tener la agenda perfectamente ordenada y no saber contestar la única pregunta que
importa: *¿de qué me estoy haciendo cargo, y cuánto pesa?*

La unidad correcta resultó ser el **tema**: un frente vivo, con horizonte propio,
que declara cuánto ocupa por semana.

```
TEMA ──┬── cadencia ──────────→ touchpoint ──→ briefing previo a la reunión
       ├── carga_h_semana ────→ capacidad (entra o no entra)
       ├── contrapartes ──────→ quién me debe qué
       └── stakeholders ──────→ a quién le reporto esto
```

Todo lo demás cuelga de ahí. Una reunión sin tema es una reunión que no sé por
qué estoy teniendo. Una tarea sin tema es trabajo que nadie va a leer como
avance. Y —esto es lo importante— si cada tema declara su carga, la suma es una
cantidad, y una cantidad se puede comparar contra un tope.

## Regla hecha comando

El presupuesto es de 40 h semanales repartidas en buckets con topes duros. Las
22 horas de la regla son los dos primeros: lo que efectivamente se puede
comprometer.

```text
$ kobo capacidad

Presupuesto semanal
───────────────────
  touchpoints      10 h   ████████
  foco             12 h   ██████████
  reactivo          8 h   ███████
  slots_abiertos    6 h   █████
  cierre            4 h   ███
  total            40 h

Carga declarada vs tope
───────────────────────
  Temas activos    19 h / 22 h (86% del tope)
  Margen           3 h para un tema nuevo

Detalle
───────
  4 h   meses      estrategia   Estrategia de gobernanza de datos   ████
  4 h   meses      delivery     Migración de plataforma analítica   ████
  4 h   semanas    delivery     Unificación de tenants              ████
  4 h   continuo   interno      Mentoring del equipo                ████
  3 h   semanas    comercial    Propuesta de analítica embebida     ███
```

> Las salidas de este post son reales —salen del programa— pero corren contra un
> estado sintético: los temas son inventados y no hay ni un dato de trabajo real
> adentro.

La regla dice: *"acepto un tema nuevo cuando puedo nombrar cuál pasa a espera"*.
Hecha comando, se ve así:

```bash
kobo nuevo "Migración de plataforma" --tipo delivery --horizonte semanas \
     --cadencia semanal --carga 3 --porque "kickoff pedido para septiembre"
```

Lo interesante no es lo que hace cuando hay lugar. Es lo que hace cuando no lo
hay:

```text
  No entra: 19 h asignadas + 4 h = 23 h, y el tope son 22 h.
  La regla es nombrar cuál sale, no meter un poco más.

  Candidatos (los que menos piden atención hoy)
    estrategia-de-gobernanza-de-datos   4 h   Estrategia de gobernanza de datos
    mentoring-del-equipo                4 h   Mentoring del equipo
    propuesta-de-analitica-embebida     3 h   Propuesta de analítica embebida
    migracion-de-plataforma-analitica   4 h   Migración de plataforma analítica
    unificacion-de-tenants              4 h   Unificación de tenants

  Sacá uno (o varios):  --saca <slug> --saca <otro> [--revisar-saca +30d]
  O asumí el exceso:    --igual  (kobo te lo va a seguir diciendo)
```

**La cuenta ocurre antes de escribir**: no creó nada, y termina con código de
salida 1. Listó los candidatos a salir y esperó. Podés resolver las dos cosas en
un paso (`--saca <tema>`) o asumir el exceso explícitamente (`--igual`), y en ese
caso queda escrito que lo asumiste.

Ese bloque de arriba es, para mí, el proyecto entero en doce líneas: una regla
que dejó de estar en un documento y se volvió algo que me dice que no.

El mismo criterio gobierna el resto del ciclo de vida:

```bash
kobo espera <tema> --revisar +30d --porque "el cliente frenó hasta octubre"
kobo cerrar <tema> --porque "entregado y aceptado"
```

`espera` **exige la fecha** en la que se vuelve a decidir. Sin esa fecha el tema
no está en espera: está abandonado, y "abandonado" es un estado que ningún
sistema debería dejarte escribir sin decir su nombre. `cerrar` enumera lo que
queda abierto —quién te debe algo, qué tareas siguen vivas— y frena hasta que lo
mires.

Las tres dejan asiento en el historial de la ficha, que es lo que contesta *"¿por
qué esto quedó así?"* tres meses después. Ese registro es casi todo el valor del
sistema y no me cuesta nada, porque es un subproducto de haber usado el comando.

## La asimetría, en la práctica

El 90 % que escribe el sistema no es magia: es leer fuentes que ya existen y
llegar a una propuesta.

- El **briefing** previo a un touchpoint se genera solo, y trae adentro la
  columna *¿contestó?* de cada contraparte declarada y el correo del tema
  posterior al último status. Yo llego a la reunión con eso, no lo armo.
- El **parte de horas** se deriva del calendario, no de mi memoria.
- El **reporte por persona** cruza los temas con sus stakeholders y arma de una
  sola vez todo lo que alguien espera de mí. Antes eso lo hacía de memoria, cada
  vez.

Mi 10 % son los status —tres líneas— y las decisiones: qué entra, qué sale, qué
se cierra.

Hay una cuarta regla que apuntala todo esto: **nada se escribe afuera sin
confirmación**. El gestor de horas, el de tareas y el correo son sistemas de
terceros, y un error ahí lo ve otra persona. El sistema propone; los envíos salen
como borrador. La autonomía es para leer y para calcular, no para hablar en mi
nombre.

## La reunión es el instrumento más caro

Hay una tercera regla que salió del mismo diagnóstico: mi problema nunca fue que
faltaran reuniones, era que sobraban. Así que el default es **no**, y hay que
justificar por qué un mensaje no alcanza.

Eso también es un comando, y casi siempre contesta lo mismo:

```text
$ kobo reunion migracion-de-plataforma-analitica

Migración de plataforma analítica · ¿reunion?
─────────────────────────────────────────────
  NO hace falta reunion
  Por que: no hay bloqueo ni decision pendiente que justifique una reunion
  → kobo brief migracion-de-plataforma-analitica y seguir por escrito
```

Falta un dato que alguien tiene: mensaje. Un solo pedido pendiente, aunque esté
vencido: mensaje. El tema ya tiene un touchpoint semanal: llevalo ahí. Solo tres
situaciones habilitan una reunión nueva — dos o más contrapartes trabadas en el
mismo frente (sincronización), un tema que derivó más de dos cadencias sin
touchpoint (reencuadre), o una decisión que requiere a varios.

Cuando *sí* corresponde, no te deja poner "coordinar" como objetivo:

```text
$ kobo reunion migracion-de-plataforma-analitica

  SI amerita reunion  (sincronizacion)
  Por que: 2 contrapartes con pedidos pendientes sobre el mismo tema

  Objetivo     desbloquear los pedidos cruzados y fijar fechas
  Duracion     45 min (si no entra en 30, son dos reuniones distintas)
  Titulo       Delivery - Migración de plataforma analítica - Sincronizacion
  Asistentes   Referente de infraestructura, Arquitecto de la contraparte

  Agenda
     · Referente de infraestructura: la ventana de corte (pendiente hace 34d)
     · Arquitecto de la contraparte: el inventario de jobs (pendiente hace 27d)
     · Fecha comprometida para cada pendiente

  Si la hacés recurrente consume del bucket touchpoints (10 h/semana).
```

La última línea es la que más me cambió la conducta. Una reunión recurrente no es
un evento en el calendario: es una hipoteca contra un bucket de 10 horas. Verlo
escrito en el momento de crearla, y no tres meses después cuando la agenda ya no
entra, es toda la diferencia.

## Los agentes, y la falla que más me enseñó

Cuatro procesos programados corren esto sin que nadie los llame: refresco de
caché cada 4 h, generación de briefings y alarma a las 9:00 de días hábiles, y un
vigía de CI cada 30 minutos.

La regla que los ordena es una sola:

> **El silencio tiene que ser tan visible como el error.**

Un agente que falla es un problema. Uno que se cuelga es peor: no devuelve código
de salida, no escribe log, y el planificador lo considera vivo. El sistema
aparenta funcionar mientras hace días que no mira nada.

No es hipótesis. El 20 de agosto descubrí que el agente de briefings **no había
disparado nunca** —con todo en verde—. Antes de eso, probando la alarma, el
gestor de secretos sin terminal interactiva giró 52 segundos sin quejarse hasta
que lo maté a mano.

De ahí salieron dos decisiones que hoy me parecen no negociables para cualquier
cosa automática:

1. **Cada corrida deja marca**, aunque no haya hecho nada. Un registro de
   corridas es lo que convierte "no pasó nada" en dos estados distinguibles:
   *corrió y no había nada* vs. *no corrió*. El chequeo de salud lee ese
   registro, no el estado del planificador.
2. **Idempotencia como precondición de la autonomía.** El parte de horas
   descuenta lo que ya está cargado: correrlo dos veces sobre la misma ventana no
   duplica nada. Esa propiedad no es una prolijidad de implementación —es
   literalmente lo que permite que la carga la haga un agente y no yo mirando la
   lista—.

También aprendieron a callarse. Los agentes que interpelan sobre compromisos con
terceros no corren fines de semana ni feriados: un compromiso sigue existiendo el
lunes. El vigía de CI sí corre siempre, porque un build en rojo solo importa
mientras estás tocando ese código.

## Dos puertas para la misma cosa

Lo último que cambió el uso no fue una funcionalidad, fue el acceso. El sistema
tiene dos entradas y las dos funcionan desde cualquier directorio:

- el **CLI**, para la terminal;
- una **skill del agente**, para que cuando esté trabajando en cualquiera de los
  31 repos y pregunte "¿qué tengo hoy?", el agente sepa dónde mirar sin que se lo
  explique.

Cuando el estado vive en un solo lugar y hay dos puertas hacia él, deja de haber
un "momento de usar el sistema". Es la diferencia entre una herramienta que
visitás y una que está.

## Lo que me llevo

Nada de esto es sobre Python, ni sobre agentes, ni sobre una CLI. Lo que
funcionó, en orden de importancia:

1. **Elegir bien la unidad.** Si tu unidad no declara cuánto pesa, tu sistema no
   puede decirte que no.
2. **Convertir cada regla en un verbo.** Si para cumplirla hay que acordarse,
   ya falló.
3. **Diseñar para la asimetría.** Preguntate qué parte de lo que escribís es
   derivable de algo que ya existe. Casi siempre es más de lo que parece.
4. **Hacer visible el silencio.** Un sistema automático que no puede distinguir
   "todo bien" de "no corrí" te está mintiendo, y lo va a hacer justo cuando
   dependas de él.

El sistema tiene 99 commits y unos 180 tests, y ninguno prueba dibujos: prueban
que las cuentas y las reglas se cumplan. Sigue siendo mío, sigue siendo
imperfecto, y por primera vez sobrevivió a un mes sin que yo tuviera que
acordarme de él.

Que era, exactamente, el punto.
