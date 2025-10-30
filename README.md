# Práctica de gRPC - Operaciones CRUD

Esta es una aplicación práctica que demuestra cómo implementar operaciones CRUD usando gRPC con Protocol Buffers en Next.js.

## Características

- **Servidor gRPC** con implementación completa de operaciones CRUD
- **Protocol Buffers** para definir el contrato de la API
- **Cliente gRPC** para comunicarse con el servidor
- **API Routes** que exponen el servidor gRPC como REST API
- **Base de datos en memoria** para simplificar la práctica

## Estructura del Proyecto

\`\`\`
├── proto/
│   └── tasks.proto          # Definición de Protocol Buffers
├── lib/
│   ├── grpc-server.ts       # Servidor gRPC con lógica CRUD
│   └── grpc-client.ts       # Cliente gRPC
├── app/
│   └── api/tasks/           # API Routes que usan el cliente gRPC
└── scripts/
    └── start-grpc-server.ts # Script para iniciar el servidor
\`\`\`

## Cómo Usar

### 1. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Iniciar el Servidor gRPC

En una terminal, ejecuta:

\`\`\`bash
npm run grpc:server
\`\`\`

Esto iniciará el servidor gRPC en el puerto 50051.

### 3. Iniciar la Aplicación Next.js

En otra terminal, ejecuta:

\`\`\`bash
npm run dev
\`\`\`

### 4. Probar con Thunder Client

Usa Thunder Client (o cualquier cliente HTTP) para probar los siguientes endpoints:

#### CREATE - Crear una tarea
\`\`\`
POST http://localhost:3000/api/tasks
Content-Type: application/json

{
  "title": "Mi primera tarea",
  "description": "Aprender gRPC"
}
\`\`\`

#### READ - Obtener todas las tareas
\`\`\`
GET http://localhost:3000/api/tasks
\`\`\`

#### READ - Obtener una tarea específica
\`\`\`
GET http://localhost:3000/api/tasks/1
\`\`\`

#### UPDATE - Actualizar una tarea
\`\`\`
PUT http://localhost:3000/api/tasks/1
Content-Type: application/json

{
  "title": "Tarea actualizada",
  "description": "Descripción actualizada",
  "completed": true
}
\`\`\`

#### DELETE - Eliminar una tarea
\`\`\`
DELETE http://localhost:3000/api/tasks/1
\`\`\`

## Tecnologías Utilizadas

- **gRPC**: Framework de comunicación RPC
- **Protocol Buffers**: Serialización de datos
- **Next.js 16**: Framework de React con API Routes
- **TypeScript**: Tipado estático
- **@grpc/grpc-js**: Implementación de gRPC para Node.js

## Conceptos Aprendidos

1. **Definición de servicios** con Protocol Buffers (.proto)
2. **Implementación de servidor gRPC** en Node.js
3. **Cliente gRPC** para realizar llamadas RPC
4. **Integración de gRPC** con Next.js API Routes
5. **Operaciones CRUD** completas con gRPC
6. **Comunicación entre procesos** (servidor gRPC separado)

## Arquitectura

\`\`\`
Thunder Client → Next.js API Routes → Cliente gRPC → Servidor gRPC → Base de datos en memoria
\`\`\`

El flujo de datos es:
1. Thunder Client hace una petición HTTP a las API Routes de Next.js
2. Las API Routes usan el cliente gRPC para comunicarse con el servidor gRPC
3. El servidor gRPC procesa la petición y responde
4. La respuesta se convierte a JSON y se envía de vuelta a Thunder Client
