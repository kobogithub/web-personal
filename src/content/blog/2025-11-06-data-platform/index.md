---
title: "Arquitectura de Plataforma de Datos Moderna"
slug: "data-platform"
description: "Conceptos fundamentales de arquitectura para plataformas de ingeniería de datos modernas con Crossplane y GitOps"
tags: ["Data Engineering", "AWS", "Crossplane", "GitOps", "Kubernetes"]
pubDate: "Nov 06 2025"
coverImage: "./Untitled-2025-11-04-1715.png"
lang: "es"
alternate: "data-platform-en"
---

# Arquitectura de Plataforma de Datos Moderna

## Introducción

En el ecosistema actual de ingeniería de datos, la gestión de infraestructura se ha vuelto tan crítica como el procesamiento de los datos mismos. Las organizaciones enfrentan desafíos constantes al intentar mantener consistencia, seguridad y escalabilidad en sus plataformas de datos, especialmente cuando operan en entornos multi-equipo con diferentes niveles de experiencia en cloud computing.

Este artículo explora una arquitectura moderna de plataforma de datos que combina principios de **Infrastructure as Code (IaC)**, **GitOps** y **abstracción de complejidad** mediante **Crossplane** y **Kubernetes**. Analizaremos cómo esta arquitectura no solo simplifica el provisionamiento de recursos AWS para Data Lakes, sino que también establece un marco de trabajo que permite a los equipos de datos enfocarse en lo que realmente importa: transformar datos en valor para el negocio.

## ¿Qué es una Plataforma de Datos?

Una plataforma de datos moderna es mucho más que un conjunto de herramientas y servicios en la nube. Es una **capa de abstracción** que proporciona a los equipos de datos las capacidades necesarias para:

- **Ingerir** datos de múltiples fuentes de manera confiable
- **Transformar** y procesar datos a escala
- **Almacenar** datos de forma optimizada y económica
- **Gobernar** el acceso y calidad de los datos
- **Servir** datos a consumidores downstream (BI, ML, Analytics)

La clave está en proporcionar estas capacidades mediante **APIs simples y estandarizadas** que oculten la complejidad subyacente de la infraestructura cloud.

## Arquitectura Medallion: Bronze, Silver, Diamond

Una de las arquitecturas más efectivas para organizar un Data Lake es el modelo **Medallion**, que estructura los datos en capas progresivas de refinamiento:

### Capa Bronze - Datos Crudos

La capa Bronze almacena datos en su forma más cruda, tal como llegan desde las fuentes:

- **Propósito**: Preservar la verdad histórica completa
- **Características**:
  - Sin transformaciones (raw data)
  - Incluye todos los registros históricos
  - Implementa políticas de CDC mediante Hash Rows (MD5)
  - Snapshots para tablas transaccionales

**Ejemplo de extracción Bronze:**

```python
# Extracción desde Oracle SoftCereal
import hashlib

# Aplica Hash Row para detectar cambios
df['hash_row'] = df.apply(
    lambda row: hashlib.md5(str(row).encode()).hexdigest(),
    axis=1
)

# Guarda en S3 Bronze
df.write.parquet(
    "s3://dev-empresa-datalake-bronze/acopio/articulos/"
)
```

### Capa Silver - Datos Refinados

La capa Silver contiene datos limpiados y normalizados:

- **Propósito**: Datos confiables y consistentes
- **Transformaciones**:
  - Eliminación de duplicados
  - Normalización de tipos de datos
  - Renombramiento a convenciones estándar (snake_case)
  - Validación de calidad de datos
  - Manejo de valores nulos

**Ejemplo de transformación Silver:**

```python
# Lee de Bronze
df = spark.read.parquet("s3://bronze/acopio/articulos/")

# Limpieza
df = df.dropDuplicates(['id_articulo'])
df = df.withColumnRenamed('IdArticulo', 'id_articulo')
df = df.withColumn('precio', col('precio').cast('decimal(10,2)'))
df = df.filter(col('id_articulo').isNotNull())

# Guarda en Silver
df.write.parquet("s3://silver/acopio/articulos/")
```

### Capa Diamond - Datos Analíticos

La capa Diamond presenta datos optimizados para consumo analítico:

- **Propósito**: Analytics-ready datasets
- **Características**:
  - Datos consolidados de múltiples fuentes
  - Merge incremental (INSERT/UPDATE/DELETE)
  - Tablas maestras sincronizadas
  - Optimizado para consultas SQL
  - Vistas preconstruidas para BI

**Ejemplo de consolidación Diamond:**

```python
import awswrangler as wr

# Lee datos refinados de Silver
df_new = wr.athena.read_sql_query(
    "SELECT * FROM empresa_silver.acopio_articulos",
    database="empresa_silver"
)

# Lee tabla maestra en Diamond
df_master = wr.athena.read_sql_query(
    "SELECT * FROM empresa_diamond.articulos",
    database="empresa_diamond"
)

# MERGE incremental (detecta por hash_row)
# - INSERT: nuevos registros
# - UPDATE: registros modificados
# - DELETE: registros eliminados en origen

# Guarda consolidado
wr.s3.to_parquet(
    df=df_merged,
    path="s3://diamond/articulos/",
    dataset=True,
    mode="overwrite",
    database="empresa_diamond",
    table="articulos"
)
```

## Crossplane: Infrastructure as Code Declarativo

Crossplane transforma Kubernetes en una **plataforma de control universal** para gestionar infraestructura cloud mediante recursos nativos de Kubernetes. En lugar de escribir scripts imperativos o templates complejos, defines el estado deseado de tu infraestructura en archivos YAML simples.

### Componentes Clave de Crossplane

#### 1. XRDs (Composite Resource Definitions)

Los XRDs son como **contratos de API** que definen qué parámetros son necesarios para crear recursos:

```yaml
# XRD para almacenamiento de Data Lake
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xdatalakestorages.platform.lycsa.com
spec:
  group: platform.lycsa.com
  names:
    kind: XDatalakeStorage
    plural: xdatalakestorages
  versions:
    - name: v1alpha1
      schema:
        openAPIV3Schema:
          properties:
            spec:
              properties:
                empresa:
                  type: string
                entorno:
                  type: string
                  enum: [dev, prod]
                buckets:
                  type: array
                  items:
                    type: string
                    enum: [bronze, silver, diamond]
```

Este XRD permite a los usuarios solicitar buckets S3 sin conocer los detalles de AWS.

#### 2. Compositions

Las Compositions traducen las solicitudes de alto nivel en recursos AWS reales:

```yaml
# Composition para crear buckets S3
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: s3-buckets-aws
spec:
  compositeTypeRef:
    apiVersion: platform.lycsa.com/v1alpha1
    kind: XDatalakeStorage
  resources:
    - name: bronze-bucket
      base:
        apiVersion: s3.aws.upbound.io/v1beta1
        kind: Bucket
        spec:
          forProvider:
            region: us-east-1
      patches:
        - type: FromCompositeFieldPath
          fromFieldPath: spec.empresa
          toFieldPath: metadata.name
          transforms:
            - type: string
              string:
                fmt: "%s-datalake-bronze"
```

#### 3. Claims

Los Claims son las **solicitudes reales** de recursos que hacen los usuarios:

```yaml
# Solicitud de buckets para un Data Lake
apiVersion: platform.lycsa.com/v1alpha1
kind: DatalakeStorage
metadata:
  name: lartirigoyen-datalake
spec:
  empresa: lartirigoyen
  entorno: dev
  buckets:
    - bronze
    - silver
    - diamond
```

Al aplicar este claim (`kubectl apply -f`), Crossplane automáticamente:

1. Lee el XRD para validar los parámetros
2. Ejecuta la Composition para generar recursos AWS
3. Crea los 3 buckets S3 en AWS
4. Configura roles IAM con permisos apropiados
5. Aplica tags de gobernanza

## GitOps con ArgoCD

GitOps establece a **Git como la fuente única de verdad** para toda la infraestructura y configuración. ArgoCD automatiza la sincronización continua entre el repositorio Git y el cluster de Kubernetes.

### Flujo de Trabajo GitOps

```
┌──────────────────────────────────────────────────────────┐
│  1. DEVELOPER: Crea notebook en Git                      │
│     services/notebooks/empresa/acopio/general-bronze.ipynb│
└──────────────────────────────────────────────────────────┘
                          ▼
┌──────────────────────────────────────────────────────────┐
│  2. GITHUB ACTION: Genera claims automáticamente         │
│     claims/notebooks/dev/empresa-acopio-general-bronze.yaml│
└──────────────────────────────────────────────────────────┘
                          ▼
┌──────────────────────────────────────────────────────────┐
│  3. PULL REQUEST: Revisión de claims                     │
└──────────────────────────────────────────────────────────┘
                          ▼
┌──────────────────────────────────────────────────────────┐
│  4. MERGE TO DEV: Dispara despliegue                     │
└──────────────────────────────────────────────────────────┘
                          ▼
┌──────────────────────────────────────────────────────────┐
│  5. ARGOCD: Sincroniza claims desde Git                 │
│     - Lee claims/notebooks/dev/                          │
│     - Aplica al cluster Kubernetes                       │
└──────────────────────────────────────────────────────────┘
                          ▼
┌──────────────────────────────────────────────────────────┐
│  6. CROSSPLANE: Procesa claims                           │
│     - Ejecuta composition Glue Spark/Python Shell        │
│     - Crea recursos en AWS                               │
└──────────────────────────────────────────────────────────┘
                          ▼
┌──────────────────────────────────────────────────────────┐
│  7. AWS: Recursos creados                                │
│     - AWS Glue Job                                       │
│     - Rol IAM con permisos                               │
│     - CloudWatch Log Group                               │
│     - Script en S3                                       │
└──────────────────────────────────────────────────────────┘
```

### Configuración de ArgoCD Application

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: dev-datalake-notebooks
spec:
  source:
    repoURL: git@github.com:empresa/datalake.git
    targetRevision: dev
    path: claims/notebooks/dev/
  destination:
    server: https://kubernetes.default.svc
    namespace: crossplane-system
  syncPolicy:
    automated:
      prune: true # Elimina recursos no en Git
      selfHeal: true # Revierte cambios manuales
```

Con esta configuración, **cualquier cambio en Git se refleja automáticamente en AWS** sin intervención manual.

## CI/CD: Automatización de Claims

GitHub Actions automatiza la generación y validación de claims basándose en código (notebooks y funciones).

### Workflow: Generate Claims

Este workflow detecta archivos nuevos y genera claims automáticamente:

```yaml
name: Generate Claims

on:
  push:
    branches-ignore:
      - dev
      - prod
    paths:
      - "services/notebooks/**/*.ipynb"
      - "services/functions/**/*.py"

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Detectar archivos nuevos
        run: |
          # Identifica notebooks o funciones añadidas
          git diff --name-only --diff-filter=A HEAD^

      - name: Extraer metadata del path
        run: |
          # services/notebooks/empresa/producto/topic-layer.ipynb
          # → empresa=empresa, producto=producto, topic=topic, layer=layer

      - name: Generar claims
        run: |
          # Usar template correspondiente
          # Reemplazar placeholders con valores extraídos
          # Generar SHA del commit

      - name: Commit claims
        run: |
          git add claims/
          git commit -m "Auto-generate claims for new files"
          git push
```

### Workflow: Deploy Notebook Jobs

Este workflow valida y despliega jobs Glue cuando hay cambios en dev/prod:

```yaml
name: Deploy Notebook Jobs

on:
  push:
    branches:
      - dev
      - prod
    paths:
      - "claims/notebooks/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Validar YAML
        run: yamllint claims/notebooks/

      - name: Validar esquema contra XRD
        run: kubectl apply --dry-run=client -f claims/

      - name: Aplicar claims
        run: kubectl apply -f claims/notebooks/${{ github.ref_name }}/

      - name: Verificar despliegue
        run: kubectl wait --for=condition=Ready datalakejob --all
```

## Procesamiento ETL con AWS Glue

AWS Glue proporciona dos tipos de jobs para diferentes necesidades:

### Spark Jobs - Para Big Data

**Cuándo usar:**

- Datasets grandes (>100GB)
- Joins complejos entre tablas
- Agregaciones distribuidas
- Procesamiento paralelo de millones de registros

**Configuración:**

```yaml
apiVersion: platform.lycsa.com/v1alpha1
kind: DatalakeJob
metadata:
  name: empresa-acopio-consolidado-silver
spec:
  compositionSelector:
    matchLabels:
      platform.lycsa.com/job-type: "spark"
  empresa: empresa
  producto: acopio
  topic: consolidado
  layer: silver
  glueConfig:
    workerType: G.2X # 8 vCPU, 32GB RAM
    numberOfWorkers: 10 # Procesamiento paralelo
    timeout: 60 # minutos
    maxRetries: 2
```

**Código Spark:**

```python
from pyspark.context import SparkContext
from awsglue.context import GlueContext

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session

# Lee millones de registros en paralelo
df = spark.read.parquet("s3://bronze/acopio/comprobantes/")

# Transformaciones distribuidas
df_cleaned = (
    df.filter(col('fecha') >= '2024-01-01')
      .join(articulos, 'id_articulo')
      .groupBy('planta', 'mes')
      .agg(sum('cantidad').alias('total_cantidad'))
)

# Escribe particionado
df_cleaned.write.partitionBy('mes').parquet(
    "s3://silver/acopio/comprobantes_agg/"
)
```

### Python Shell Jobs - Para Tareas Ligeras

**Cuándo usar:**

- Archivos pequeños (<100MB)
- Llamadas a APIs externas
- Scripts de validación
- Tareas de mantenimiento
- Menor costo operativo (~$0.44/hora vs ~$0.96/hora)

**Configuración:**

```yaml
apiVersion: platform.lycsa.com/v1alpha1
kind: DatalakeJob
metadata:
  name: empresa-validador-calidad-bronze
spec:
  compositionSelector:
    matchLabels:
      platform.lycsa.com/job-type: "python-shell"
  empresa: empresa
  producto: validador
  topic: calidad
  layer: bronze
  glueConfig:
    maxCapacity: 0.0625 # 1/16 DPU
    timeout: 20
```

**Código Python Shell:**

```python
import pandas as pd
import awswrangler as wr
import requests

# Llamar API externa
response = requests.get('https://api.example.com/cotizaciones')
data = response.json()

# Procesar con pandas
df = pd.DataFrame(data)
df['fecha'] = pd.to_datetime(df['fecha'])
df = df[df['precio'] > 0]

# Guardar en S3
wr.s3.to_parquet(
    df=df,
    path='s3://bronze/cotizaciones/',
    dataset=True
)
```

## Serverless con AWS Lambda

Lambda Functions proporcionan procesamiento en tiempo real para eventos:

**Casos de uso:**

- Procesar archivos cuando llegan a S3
- Validar calidad de datos antes de mover entre capas
- Enviar notificaciones de jobs fallidos
- Transformaciones ligeras y rápidas

**Claim de Lambda:**

```yaml
apiVersion: platform.lycsa.com/v1alpha1
kind: DatalakeFunction
metadata:
  name: empresa-validador-csv-bronze
spec:
  empresa: empresa
  producto: validador
  topic: csv
  layer: bronze
  lambdaConfig:
    runtime: python3.11
    timeout: 300
    memorySize: 1024
    enableXRayTracing: true
  imageConfig:
    ecrRepository: "dev-empresa-datalake-validador-csv"
  environmentVariables:
    BUCKET_BRONZE: "dev-empresa-datalake-bronze"
    BUCKET_SILVER: "dev-empresa-datalake-silver"
```

**Código Lambda:**

```python
import json
import boto3
import pandas as pd
from io import StringIO

s3 = boto3.client('s3')

def lambda_handler(event, context):
    """
    Valida archivos CSV cuando llegan a S3 Bronze
    """
    # Obtener info del evento S3
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    # Leer archivo
    obj = s3.get_object(Bucket=bucket, Key=key)
    df = pd.read_csv(StringIO(obj['Body'].read().decode('utf-8')))

    # Validaciones
    validations = {
        'has_data': len(df) > 0,
        'no_nulls': df.isnull().sum().sum() == 0,
        'valid_dates': pd.to_datetime(df['fecha'], errors='coerce').notna().all()
    }

    # Si todas las validaciones pasan, mover a Silver
    if all(validations.values()):
        target_bucket = 'dev-empresa-datalake-silver'
        s3.copy_object(
            Bucket=target_bucket,
            Key=key,
            CopySource={'Bucket': bucket, 'Key': key}
        )
        return {
            'statusCode': 200,
            'body': json.dumps('Archivo validado y movido a Silver')
        }
    else:
        return {
            'statusCode': 400,
            'body': json.dumps(f'Validación fallida: {validations}')
        }
```

## Gobernanza y Seguridad

### Control de Acceso con IAM

La plataforma crea grupos IAM con permisos específicos para diferentes roles:

```yaml
apiVersion: platform.lycsa.com/v1alpha1
kind: DatalakeUsers
metadata:
  name: equipo-bi
spec:
  teamName: bi-team
  empresa: empresa
  producto: acopio
  permissions:
    athena:
      - StartQueryExecution
      - GetQueryResults
      - GetQueryExecution
    s3:
      - ListBucket
      - GetObject # Solo lectura
    glue:
      - GetDatabase
      - GetTable
      - GetPartitions
```

### Tags Automáticos

Todos los recursos incluyen tags para trazabilidad:

| Tag         | Descripción     | Ejemplo                 |
| ----------- | --------------- | ----------------------- |
| Environment | Ambiente        | dev, prod               |
| Company     | Empresa         | lartirigoyen            |
| Product     | Producto        | acopio                  |
| Layer       | Capa de datos   | bronze, silver, diamond |
| CreatedBy   | Sistema creador | platform-lycsa          |
| ManagedBy   | Gestor          | crossplane              |

### Nomenclatura Estandarizada

La plataforma aplica convenciones consistentes:

```
Buckets S3:
  {ambiente}-{empresa}-datalake-{capa}-{dígitos}-{región}
  dev-lartirigoyen-datalake-bronze-7664-us-east-1

Jobs Glue:
  {ambiente}-{empresa}-{producto}-{topic}-{capa}
  dev-lartirigoyen-acopio-general-bronze

Lambda Functions:
  {ambiente}-{empresa}-{producto}-{topic}-{capa}
  dev-lartirigoyen-validador-calidad-silver
```

## Beneficios de esta Arquitectura

### 1. Abstracción de Complejidad

Los equipos de datos no necesitan:

- Conocer detalles de AWS en profundidad
- Escribir CloudFormation o Terraform
- Configurar permisos IAM manualmente
- Gestionar secretos y credenciales

Solo necesitan definir **qué quieren** en YAML simple.

### 2. Estandarización y Gobernanza

- Nomenclatura consistente automática
- Tags obligatorios para todos los recursos
- Políticas de seguridad pre-validadas
- Control de versiones con Git
- Auditoría completa de cambios

### 3. Velocidad de Desarrollo

- Provisioning de infraestructura en minutos
- Claims generados automáticamente desde código
- Deployment sin intervención manual
- Rollback fácil a versiones anteriores

### 4. Multi-Ambiente

- Configuraciones específicas por ambiente
- Promoción controlada dev → prod
- Aislamiento completo entre ambientes
- Costos optimizados por ambiente

### 5. Observabilidad

- Logs centralizados en CloudWatch
- X-Ray tracing en producción
- Métricas de Kubernetes y AWS
- Visibilidad del estado vía ArgoCD

## Conclusión

Una plataforma de datos moderna no es solo un conjunto de tecnologías, sino una **filosofía de trabajo** que prioriza:

- **Simplicidad** sobre complejidad técnica
- **Declarativo** sobre imperativo
- **GitOps** sobre cambios manuales
- **Seguridad** por defecto
- **Developer Experience** como métrica clave

La combinación de **Crossplane**, **GitOps con ArgoCD**, y la **arquitectura Medallion** proporciona un framework robusto que permite a las organizaciones escalar sus capacidades de datos sin escalar la complejidad operativa.

Los equipos de datos pueden enfocarse en lo que realmente importa: **transformar datos en insights accionables**, mientras la plataforma se encarga de la infraestructura, seguridad y gobernanza.

Esta arquitectura no solo reduce el time-to-market para nuevos proyectos de datos, sino que también establece las bases para una cultura de ingeniería de datos más madura, donde la reproducibilidad, la calidad y la seguridad son ciudadanos de primera clase.

## Referencias

- [Crossplane Documentation](https://crossplane.io/docs/)
- [ArgoCD](https://argo-cd.readthedocs.io/)
- [AWS Glue](https://docs.aws.amazon.com/glue/)
- [Medallion Architecture](https://www.databricks.com/glossary/medallion-architecture)
- [GitOps Principles](https://opengitops.dev/)
