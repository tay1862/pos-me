import { getActiveOrders } from "@/lib/order-actions"
import { KitchenDisplay } from "@/components/kds/KitchenDisplay"

export default async function KdsPage() {
    const orders = await getActiveOrders()

    return <KitchenDisplay orders={orders as any} />
}
