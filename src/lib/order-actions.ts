"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createOrder(tableId: string, items: any[]) {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const order = await prisma.order.create({
        data: {
            tableId,
            totalAmount: total,
            status: "OPEN",
            items: {
                create: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    status: "PENDING",
                }))
            }
        },
        include: {
            items: true,
            table: true,
        }
    })

    // Update table status
    await prisma.table.update({
        where: { id: tableId },
        data: { status: "OCCUPIED" }
    })

    revalidatePath("/pos")
    revalidatePath("/kds")
    return order
}

export async function getActiveOrders() {
    return await prisma.order.findMany({
        where: {
            status: "OPEN"
        },
        include: {
            items: {
                include: {
                    product: true
                }
            },
            table: true,
        },
        orderBy: {
            createdAt: "asc"
        }
    })
}

export async function updateOrderItemStatus(itemId: string, status: "PENDING" | "COOKING" | "READY" | "SERVED") {
    await prisma.orderItem.update({
        where: { id: itemId },
        data: { status }
    })
    revalidatePath("/kds")
}

export async function completeOrder(orderId: string) {
    const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: "COMPLETED" },
        include: { table: true }
    })

    // Free up the table
    if (order.tableId) {
        await prisma.table.update({
            where: { id: order.tableId },
            data: { status: "AVAILABLE" }
        })
    }

    revalidatePath("/pos")
    revalidatePath("/kds")
}

export async function moveOrderToTable(orderId: string, newTableId: string) {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { table: true }
    })

    if (!order) throw new Error("Order not found")

    // Free up old table
    if (order.tableId) {
        await prisma.table.update({
            where: { id: order.tableId },
            data: { status: "AVAILABLE" }
        })
    }

    // Update order to new table
    await prisma.order.update({
        where: { id: orderId },
        data: { tableId: newTableId }
    })

    // Mark new table as occupied
    await prisma.table.update({
        where: { id: newTableId },
        data: { status: "OCCUPIED" }
    })

    revalidatePath("/pos")
    revalidatePath("/pos/tables")
}

export async function splitBill(orderId: string, itemIds: string[], newTableId?: string) {
    const originalOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true }
    })

    if (!originalOrder) throw new Error("Order not found")

    // Calculate new totals
    const splitItems = originalOrder.items.filter((item: any) => itemIds.includes(item.id))
    const splitTotal = splitItems.reduce((sum: number, item: any) => sum + (Number(item.price) * item.quantity), 0)
    const remainingTotal = Number(originalOrder.totalAmount) - splitTotal

    // Create new order with split items
    const newOrder = await prisma.order.create({
        data: {
            tableId: newTableId || originalOrder.tableId,
            status: "OPEN",
            totalAmount: splitTotal,
            items: {
                create: splitItems.map((item: any) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    notes: item.notes,
                    status: item.status,
                    modifiers: item.modifiers
                }))
            }
        }
    })

    // Remove split items from original order
    await prisma.orderItem.deleteMany({
        where: {
            id: { in: itemIds }
        }
    })

    // Update original order total
    await prisma.order.update({
        where: { id: orderId },
        data: { totalAmount: remainingTotal }
    })

    revalidatePath("/pos")
    return newOrder
}

export async function getOrdersByTable(tableId: string) {
    return await prisma.order.findMany({
        where: {
            tableId,
            status: "OPEN"
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    })
}
