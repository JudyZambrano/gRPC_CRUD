import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"

/**
 * Base de datos en memoria para almacenar las tareas
 * En producción, esto debería ser reemplazado por una base de datos real
 */
const tasksDB = new Map<number, any>()
let nextId = 1

// Cargar el archivo proto que define el servicio y los mensajes
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
 * Implementación de los métodos CRUD del servicio de tareas
 * Cada método recibe una llamada (call) con los datos de la petición
 * y un callback para enviar la respuesta
 */
const taskService = {
  /**
   * CREATE - Crear una nueva tarea
   * @param call - Contiene title y description en call.request
   * @param callback - Función para devolver la respuesta
   */
  CreateTask: (call: any, callback: any) => {
    const { title, description } = call.request

    // Validar que el título no esté vacío
    if (!title) {
      return callback(null, {
        task: null,
        error: "El título es requerido",
      })
    }

    // Crear la nueva tarea con un ID autoincrementado
    const task = {
      id: String(nextId++),
      title,
      description: description || "",
    }

    // Guardar en la base de datos en memoria
    tasksDB.set(Number(task.id), task)

    callback(null, { task, error: "" })
  },

  /**
   * READ - Obtener una tarea específica por su ID
   * @param call - Contiene el id en call.request
   * @param callback - Función para devolver la respuesta
   */
  GetTask: (call: any, callback: any) => {
    const { id } = call.request
    const task = tasksDB.get(Number(id))

    if (!task) {
      return callback(null, {
        task: null,
        error: "Tarea no encontrada",
      })
    }

    callback(null, { task, error: "" })
  },

  /**
   * READ - Listar todas las tareas existentes
   * @param call - Petición vacía
   * @param callback - Función para devolver la lista de tareas
   */
  ListTasks: (call: any, callback: any) => {
    const tasks = Array.from(tasksDB.values())
    callback(null, { tasks })
  },

  /**
   * UPDATE - Actualizar una tarea existente
   * @param call - Contiene id, title y description en call.request
   * @param callback - Función para devolver la tarea actualizada
   */
  UpdateTask: (call: any, callback: any) => {
    const { id, title, description } = call.request
    const task = tasksDB.get(Number(id))

    if (!task) {
      return callback(null, {
        task: null,
        error: "Tarea no encontrada",
      })
    }

    // Actualizar solo los campos proporcionados
    const updatedTask = {
      ...task,
      title: title || task.title,
      description: description !== undefined ? description : task.description,
    }

    tasksDB.set(Number(id), updatedTask)

    callback(null, { task: updatedTask, error: "" })
  },

  /**
   * DELETE - Eliminar una tarea por su ID
   * @param call - Contiene el id en call.request
   * @param callback - Función para devolver el resultado de la eliminación
   */
  DeleteTask: (call: any, callback: any) => {
    const { id } = call.request
    const existed = tasksDB.has(Number(id))

    if (!existed) {
      return callback(null, {
        success: false,
        message: "Tarea no encontrada",
      })
    }

    tasksDB.delete(Number(id))

    callback(null, {
      success: true,
      message: "Tarea eliminada exitosamente",
    })
  },
}

/**
 * Función para iniciar el servidor gRPC
 * @param port - Puerto en el que escuchará el servidor (por defecto 50051)
 * @returns Instancia del servidor gRPC
 */
export function startGrpcServer(port = 50051) {
  const server = new grpc.Server()

  // Registrar el servicio con sus implementaciones
  server.addService(tasksProto.TaskService.service, taskService)

  // Iniciar el servidor en el puerto especificado
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error("Error al iniciar el servidor gRPC:", error)
      return
    }
    console.log(`Servidor gRPC ejecutándose en el puerto ${port}`)
  })

  return server
}
