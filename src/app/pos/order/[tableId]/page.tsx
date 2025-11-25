import { getCategories, getProducts, getTables } from "@/lib/actions"
import { getOrdersByTable } from "@/lib/order-actions"
import { OrderInterface } from "@/components/pos/OrderInterface"

export default async function OrderPage({ params }: { params: Promise<{ tableId: string }> }) {
    const { tableId } = await params
    const categories = await getCategories()
    const products = await getProducts()
    const tables = await getTables()
    const existingOrders = await getOrdersByTable(tableId)

    return <OrderInterface
        categories={categories}
        products={products}
        tableId={tableId}
        tables={tables}
        existingOrders={existingOrders}
    />
}
