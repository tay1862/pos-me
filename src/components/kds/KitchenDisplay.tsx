"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateOrderItemStatus } from "@/lib/order-actions"
import { Clock, ChefHat, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

type OrderItem = {
    id: string
    quantity: number
    status: string
    product: {
        name: string
    }
}

type Order = {
    id: string
    orderNumber: number
    createdAt: Date
    table: {
        name: string
    } | null
    items: OrderItem[]
}

export function KitchenDisplay({ orders }: { orders: Order[] }) {
    const [filter, setFilter] = useState<"ALL" | "PENDING" | "COOKING">("ALL")

    const filteredOrders = orders.filter(order => {
        if (filter === "ALL") return true
        return order.items.some(item => item.status === filter)
    })

    const handleStatusChange = async (itemId: string, newStatus: "PENDING" | "COOKING" | "READY" | "SERVED") => {
        await updateOrderItemStatus(itemId, newStatus)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-300"
            case "COOKING": return "bg-blue-100 text-blue-800 border-blue-300"
            case "READY": return "bg-green-100 text-green-800 border-green-300"
            case "SERVED": return "bg-gray-100 text-gray-800 border-gray-300"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    const getElapsedTime = (createdAt: Date) => {
        const now = new Date()
        const diff = Math.floor((now.getTime() - new Date(createdAt).getTime()) / 60000)
        return diff
    }

    return (
        <div className="flex h-screen flex-col bg-gray-900 text-white">
            <header className="flex h-14 lg:h-16 items-center justify-between border-b border-gray-800 bg-gray-950 px-3 lg:px-6">
                <div className="flex items-center gap-2 lg:gap-3">
                    <ChefHat className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                    <h1 className="text-lg lg:text-xl font-bold">Kitchen Display</h1>
                </div>
                <div className="flex gap-1 lg:gap-2">
                    <Button
                        variant={filter === "ALL" ? "default" : "outline"}
                        onClick={() => setFilter("ALL")}
                        size="sm"
                        className="text-xs lg:text-sm px-2 lg:px-3"
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "PENDING" ? "default" : "outline"}
                        onClick={() => setFilter("PENDING")}
                        size="sm"
                        className="text-xs lg:text-sm px-2 lg:px-3"
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filter === "COOKING" ? "default" : "outline"}
                        onClick={() => setFilter("COOKING")}
                        size="sm"
                        className="text-xs lg:text-sm px-2 lg:px-3"
                    >
                        Cooking
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-3 lg:p-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4">
                    {filteredOrders.map((order) => {
                        const elapsed = getElapsedTime(order.createdAt)
                        const isUrgent = elapsed > 15

                        return (
                            <Card key={order.id} className={cn(
                                "bg-gray-800 border-gray-700",
                                isUrgent && "border-red-500 border-2"
                            )}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-white">Order #{order.orderNumber}</CardTitle>
                                            <p className="text-sm text-gray-400">{order.table?.name || "Takeout"}</p>
                                        </div>
                                        <div className={cn(
                                            "flex items-center gap-1 text-sm",
                                            isUrgent ? "text-red-400" : "text-gray-400"
                                        )}>
                                            <Clock className="h-4 w-4" />
                                            <span>{elapsed}m</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="space-y-2 rounded-lg bg-gray-900 p-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className="font-medium text-white">{item.quantity}x {item.product.name}</span>
                                                </div>
                                                <Badge className={getStatusColor(item.status)}>
                                                    {item.status}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-2">
                                                {item.status === "PENDING" && (
                                                    <Button
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => handleStatusChange(item.id, "COOKING")}
                                                    >
                                                        Start Cooking
                                                    </Button>
                                                )}
                                                {item.status === "COOKING" && (
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleStatusChange(item.id, "READY")}
                                                    >
                                                        <CheckCircle2 className="mr-1 h-4 w-4" /> Mark Ready
                                                    </Button>
                                                )}
                                                {item.status === "READY" && (
                                                    <div className="flex-1 text-center text-sm text-green-400 font-medium py-2">
                                                        Ready for Pickup
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )
                    })}
                    {filteredOrders.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                            <ChefHat className="h-16 w-16 mb-4" />
                            <p className="text-lg">No orders to display</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
