---
title: 'Airflow To Oracle'
slug: 'airflow-to-oracle'
description: 'Modelo de conexion de Airflow a Oracle 11'
tags: ["Airflow","Docker","Oracle"]
pubDate: 'Nov 08 2024'
coverImage: './airflow-to-oracle.png'
---

# Airflow To Oracle

## Intro
En el mundo de la orquestación de datos, Apache Airflow se ha convertido en una herramienta fundamental para la automatización y programación de flujos de trabajo. Sin embargo, cuando nos enfrentamos a la necesidad de integrar sistemas heredados o versiones anteriores de bases de datos empresariales, podemos encontrar desafíos técnicos significativos.
Uno de estos desafíos comunes es la conexión con Oracle Database 11, una versión que, aunque más antigua, sigue siendo ampliamente utilizada en muchas organizaciones debido a su robustez y estabilidad. Si bien Airflow proporciona providers para conectarse a diferentes bases de datos, incluyendo Oracle, la conexión a Oracle 11 presenta una particularidad: requiere la instalación del Oracle Instant Client con sus archivos de sistema específicos.
Este requisito técnico puede convertirse en un obstáculo, especialmente cuando trabajamos en entornos containerizados donde necesitamos asegurar que todas las dependencias estén correctamente configuradas y sean consistentes en todos los despliegues.
En esta guía, abordaremos paso a paso cómo superar este desafío mediante:

- La creación de una imagen personalizada de Airflow que incluya el Oracle Instant Client
- La configuración adecuada de las librerías y dependencias necesarias
- La instalación y configuración del provider de Oracle para Airflow
- El establecimiento de una conexión funcional y robusta con Oracle 11

Esta solución no solo nos permitirá conectar Airflow con Oracle 11 de manera efectiva, sino que también nos asegurará una configuración reproducible y mantenible en el tiempo.

## Diagrama de conexión
Presentamos el modelo de conexión para [Airflow](https://airflow.apache.org/docs/) a Oracle 11, por medio del Provider Oracle que utiliza la libreria [python-oracledb](https://python-oracledb.readthedocs.io/en/latest/index.html#).
![PythonOracleDB](./python-oracledb.png)
