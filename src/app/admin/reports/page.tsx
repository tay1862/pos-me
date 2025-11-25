import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTodayStats } from "@/lib/report-actions"
import { formatCurrency } from "@/lib/currency"
import { DollarSign, ShoppingBag, TrendingUp, Package } from "lucide-react"

export default async function ReportsPage() {
    const stats = await getTodayStats()

    return (
        <div className="space-y-4 lg:space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Reports & Analytics</h2>

            {/* Summary Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.topProducts.reduce((sum, p) => sum + p.count, 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Products */}
            <div className="grid gap-3 lg:gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.topProducts.map((product, index) => (
                                <div key={product.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <div className="font-medium">{product.name}</div>
                                            <div className="text-sm text-gray-500">{product.count} sold</div>
                                        </div>
                                    </div>
                                    <div className="font-bold">{formatCurrency(product.revenue)}</div>
                                </div>
                            ))}
                            {stats.topProducts.length === 0 && (
                                <p className="text-center text-gray-500 py-4">No sales data yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.categoryStats.map((category) => (
                                <div key={category.name} className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{category.name}</div>
                                        <div className="text-sm text-gray-500">{category.count} items</div>
                                    </div>
                                    <div className="font-bold">{formatCurrency(category.revenue)}</div>
                                </div>
                            ))}
                            {stats.categoryStats.length === 0 && (
                                <p className="text-center text-gray-500 py-4">No sales data yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[600px]">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="p-3 text-left font-medium">Order #</th>
                                    <th className="p-3 text-left font-medium">Table</th>
                                    <th className="p-3 text-left font-medium">Items</th>
                                    <th className="p-3 text-left font-medium">Total</th>
                                    <th className="p-3 text-left font-medium">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.orders.slice(0, 10).map((order: any) => (
                                    <tr key={order.id} className="border-b">
                                        <td className="p-3">#{order.orderNumber || order.id.slice(0, 8)}</td>
                                        <td className="p-3">{order.table?.name || "Takeout"}</td>
                                        <td className="p-3">{order.items.length} items</td>
                                        <td className="p-3 font-medium">{formatCurrency(order.totalAmount)}</td>
                                        <td className="p-3 text-gray-500">
                                            {new Date(order.createdAt).toLocaleTimeString('lo-LA', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {stats.orders.length === 0 && (
                            <p className="text-center text-gray-500 py-8">No orders yet</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
