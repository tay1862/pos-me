import { getCategories, getProducts } from "@/lib/actions"
import { MenuManager } from "@/components/admin/MenuManager"

export default async function MenuPage() {
    const categories = await getCategories()
    const products = await getProducts()

    return <MenuManager categories={categories} products={products} />
}
