import { type NextRequest, NextResponse } from "next/server"
import { grpcClient } from "@/lib/grpc-client"

/**
 * GET /api/tasks/[id]
 * Endpoint para obtener una tarea específica por su ID
 * @param params - Contiene el ID de la tarea en la URL
 * @returns JSON con la tarea solicitada o mensaje de error
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const response = await grpcClient.getTask(id)

    // Verificar si la tarea existe
    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: 404 })
    }

    return NextResponse.json({ task: response.task })
  } catch (error) {
    console.error("Error al obtener tarea:", error)
    return NextResponse.json({ error: "Error al obtener la tarea" }, { status: 500 })
  }
}

/**
 * PUT /api/tasks/[id]
 * Endpoint para actualizar una tarea existente
 * @param params - Contiene el ID de la tarea en la URL
 * @param request - Debe contener { title: string, description: string } en el body
 * @returns JSON con la tarea actualizada o mensaje de error
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { title, description } = await request.json()
    const response = await grpcClient.updateTask(id, title, description)

    // Verificar si la tarea existe
    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: 404 })
    }

    return NextResponse.json({ task: response.task })
  } catch (error) {
    console.error("Error al actualizar tarea:", error)
    return NextResponse.json({ error: "Error al actualizar la tarea" }, { status: 500 })
  }
}

/**
 * DELETE /api/tasks/[id]
 * Endpoint para eliminar una tarea por su ID
 * @param params - Contiene el ID de la tarea en la URL
 * @returns JSON con mensaje de éxito o error
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const response = await grpcClient.deleteTask(id)

    // Verificar si la eliminación fue exitosa
    if (!response.success) {
      return NextResponse.json({ error: response.message }, { status: 404 })
    }

    return NextResponse.json({ message: response.message })
  } catch (error) {
    console.error("Error al eliminar tarea:", error)
    return NextResponse.json({ error: "Error al eliminar la tarea" }, { status: 500 })
  }
}
