"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getCategories() {
    return await prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
    })
}

export async function createCategory(formData: FormData) {
    const name = formData.get("name") as string
    const color = formData.get("color") as string

    await prisma.category.create({
        data: {
            name,
            color,
        },
    })

    revalidatePath("/admin/menu")
}

export async function deleteCategory(id: string) {
    await prisma.category.delete({
        where: { id },
    })
    revalidatePath("/admin/menu")
}

export async function getProducts() {
    return await prisma.product.findMany({
        include: { category: true },
        orderBy: { name: "asc" },
    })
}

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string
    const price = parseFloat(formData.get("price") as string)
    const categoryId = formData.get("categoryId") as string

    await prisma.product.create({
        data: {
            name,
            price,
            categoryId,
        },
    })

    revalidatePath("/admin/menu")
}

export async function getEmployees() {
    return await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    })
}

export async function createEmployee(formData: FormData) {
    const name = formData.get("name") as string
    const pin = formData.get("pin") as string
    const role = formData.get("role") as "ADMIN" | "MANAGER" | "CASHIER" | "KITCHEN" | "BAR"

    try {
        await prisma.user.create({
            data: {
                name,
                pin,
                role,
            },
        })
        revalidatePath("/admin/employees")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to create employee. PIN might be taken." }
    }
}

export async function deleteEmployee(id: string) {
    await prisma.user.delete({
        where: { id },
    })
    revalidatePath("/admin/employees")
}

export async function getTables() {
    return await prisma.table.findMany({
        orderBy: { name: "asc" },
    })
}

export async function createTable(formData: FormData) {
    const name = formData.get("name") as string
    const shape = formData.get("shape") as string
    const width = parseInt(formData.get("width") as string) || 100
    const height = parseInt(formData.get("height") as string) || 100
    const x = parseInt(formData.get("x") as string) || 0
    const y = parseInt(formData.get("y") as string) || 0

    await prisma.table.create({
        data: {
            name,
            shape,
            width,
            height,
            x,
            y,
        },
    })
    revalidatePath("/admin/tables")
}

export async function updateTablePosition(id: string, x: number, y: number) {
    await prisma.table.update({
        where: { id },
        data: { x, y },
    })
    revalidatePath("/admin/tables")
}

export async function deleteTable(id: string) {
    await prisma.table.delete({
        where: { id },
    })
    revalidatePath("/admin/tables")
}
