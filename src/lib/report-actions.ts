"use server"

import { prisma } from "@/lib/db"

export async function getSalesReport(startDate?: Date, endDate?: Date) {
    const where = {
        status: "COMPLETED" as const,
        ...(startDate && endDate ? {
            createdAt: {
                gte: startDate,
                lte: endDate
            }
        } : {})
    }

    const orders = await prisma.order.findMany({
        where,
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            category: true
                        }
                    }
                }
            },
            table: true,
            user: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
    const totalOrders = orders.length

    // Group by category
    const categoryStats: Record<string, { name: string, revenue: number, count: number }> = {}
    orders.forEach(order => {
        order.items.forEach((item: any) => {
            const catName = item.product.category.name
            if (!categoryStats[catName]) {
                categoryStats[catName] = { name: catName, revenue: 0, count: 0 }
            }
            categoryStats[catName].revenue += Number(item.price) * item.quantity
            categoryStats[catName].count += item.quantity
        })
    })

    // Top products
    const productStats: Record<string, { name: string, revenue: number, count: number }> = {}
    orders.forEach(order => {
        order.items.forEach((item: any) => {
            const prodName = item.product.name
            if (!productStats[prodName]) {
                productStats[prodName] = { name: prodName, revenue: 0, count: 0 }
            }
            productStats[prodName].revenue += Number(item.price) * item.quantity
            productStats[prodName].count += item.quantity
        })
    })

    const topProducts = Object.values(productStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)

    return {
        totalRevenue,
        totalOrders,
        categoryStats: Object.values(categoryStats),
        topProducts,
        orders
    }
}

export async function getTodayStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return await getSalesReport(today, tomorrow)
}
