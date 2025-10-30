import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"

// Cargar la definición del protocolo desde el archivo .proto
const PROTO_PATH = path.join(process.cwd(), "proto", "tasks.proto")
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const tasksProto = grpc.loadPackageDefinition(packageDefinition).tasks as any

/**
 * Cliente gRPC para conectarse al servidor de tareas
 * Se conecta a localhost:50051 sin credenciales (modo inseguro para desarrollo)
 */
const client = new tasksProto.TaskService("localhost:50051", grpc.credentials.createInsecure())

/**
 * Objeto con funciones helper para realizar llamadas al servidor gRPC
 * Cada función devuelve una Promise para facilitar el uso con async/await
 */
export const grpcClient = {
  /**
   * Crear una nueva tarea
   * @param title - Título de la tarea
   * @param description - Descripción de la tarea
   * @returns Promise con la respuesta del servidor
   */
  createTask: (title: string, description: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      client.CreateTask({ title, description }, (error: any, response: any) => {
        if (error) reject(error)
        else resolve(response)
      })
    })
  },

  /**
   * Obtener una tarea por su ID
   * @param id - ID de la tarea a obtener
   * @returns Promise con la tarea solicitada
   */
  getTask: (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      client.GetTask({ id }, (error: any, response: any) => {
        if (error) reject(error)
        else resolve(response)
      })
    })
  },

  /**
   * Listar todas las tareas
   * @returns Promise con el array de todas las tareas
   */
  listTasks: (): Promise<any> => {
    return new Promise((resolve, reject) => {
      client.ListTasks({}, (error: any, response: any) => {
        if (error) reject(error)
        else resolve(response)
      })
    })
  },

  /**
   * Actualizar una tarea existente
   * @param id - ID de la tarea a actualizar
   * @param title - Nuevo título
   * @param description - Nueva descripción
   * @returns Promise con la tarea actualizada
   */
  updateTask: (id: string, title: string, description: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      client.UpdateTask({ id, title, description }, (error: any, response: any) => {
        if (error) reject(error)
        else resolve(response)
      })
    })
  },

  /**
   * Eliminar una tarea por su ID
   * @param id - ID de la tarea a eliminar
   * @returns Promise con el resultado de la eliminación
   */
  deleteTask: (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      client.DeleteTask({ id }, (error: any, response: any) => {
        if (error) reject(error)
        else resolve(response)
      })
    })
  },
}
