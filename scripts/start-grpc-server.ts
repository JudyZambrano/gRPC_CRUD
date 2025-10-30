import { startGrpcServer } from "../lib/grpc-server"

/**
 * Script para iniciar el servidor gRPC
 * Este servidor debe estar ejecutándose para que la aplicación funcione correctamente
 *
 * Uso: npm run grpc:server
 *
 * El servidor escuchará en el puerto 50051 y manejará todas las operaciones CRUD
 * de tareas a través de gRPC
 */

console.log("Iniciando servidor gRPC...")
startGrpcServer(50051)
console.log("Servidor gRPC iniciado en el puerto 50051")
console.log("Presiona Ctrl+C para detener el servidor")

// Mantener el proceso vivo y manejar la señal de interrupción
process.on("SIGINT", () => {
  console.log("\nDeteniendo servidor gRPC...")
  process.exit(0)
})
