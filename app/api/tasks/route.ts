import { type NextRequest, NextResponse } from "next/server"
import { grpcClient } from "@/lib/grpc-client"

/**
 * GET /api/tasks
 * Endpoint para listar todas las tareas
 * @returns JSON con array de tareas o mensaje de error
 */
export async function GET() {
  try {
    const response = await grpcClient.listTasks()
    return NextResponse.json({ tasks: response.tasks })
  } catch (error) {
    console.error("Error al listar tareas:", error)
    return NextResponse.json({ error: "Error al obtener las tareas" }, { status: 500 })
  }
}

/**
 * POST /api/tasks
 * Endpoint para crear una nueva tarea
 * @param request - Debe contener { title: string, description: string } en el body
 * @returns JSON con la tarea creada o mensaje de error
 */
export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json()
    const response = await grpcClient.createTask(title, description)

    // Validar si hubo error en la respuesta del servidor gRPC
    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: 400 })
    }

    return NextResponse.json({ task: response.task }, { status: 201 })
  } catch (error) {
    console.error("Error al crear tarea:", error)
    return NextResponse.json({ error: "Error al crear la tarea" }, { status: 500 })
  }
}
