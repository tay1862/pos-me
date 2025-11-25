"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Minus, Plus, Trash2, ArrowLeft, CreditCard, Send, ArrowRightLeft, Scissors } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createOrder, getOrdersByTable } from "@/lib/order-actions"
import { formatCurrency, formatAmount } from "@/lib/currency"
import { MoveTableDialog } from "@/components/pos/MoveTableDialog"
import { SplitBillDialog } from "@/components/pos/SplitBillDialog"
import { useEffect } from "react"

type Product = {
    id: string
    name: string
    price: any
    categoryId: string
    image: string | null
}

type Category = {
    id: string
    name: string
    color: string | null
}

type CartItem = {
    id: string // unique id for cart item (product id + modifiers)
    productId: string
    name: string
    price: number
    quantity: number
}

export function OrderInterface({
    categories,
    products,
    tableId,
    tables,
    existingOrders
}: {
    categories: Category[],
    products: Product[],
    tableId: string,
    tables?: any[],
    existingOrders?: any[]
}) {
    const router = useRouter()
    const [cart, setCart] = useState<CartItem[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || "")
    const [showMoveDialog, setShowMoveDialog] = useState(false)
    const [showSplitDialog, setShowSplitDialog] = useState(false)
    const [currentOrder, setCurrentOrder] = useState<any>(null)

    // Load existing order if any
    useEffect(() => {
        if (existingOrders && existingOrders.length > 0) {
            setCurrentOrder(existingOrders[0])
        }
    }, [existingOrders])

    const filteredProducts = useMemo(() =>
        products.filter(p => p.categoryId === selectedCategory),
        [products, selectedCategory])

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.productId === product.id)
            if (existing) {
                return prev.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, {
                id: Math.random().toString(36).substr(2, 9),
                productId: product.id,
                name: product.name,
                price: Number(product.price),
                quantity: 1
            }]
        })
    }

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === itemId) {
                const newQty = item.quantity + delta
                return newQty > 0 ? { ...item, quantity: newQty } : item
            }
            return item
        }))
    }

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(item => item.id !== itemId))
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const sendToKitchen = async () => {
        if (cart.length === 0) return

        await createOrder(tableId, cart)
        setCart([])
        alert("Order sent to kitchen!")
    }

    const handlePayment = async () => {
        if (cart.length === 0) return

        // In a real app, this would open a payment dialog
        const confirmed = confirm(`Process payment of ${formatCurrency(total)}?`)
        if (confirmed) {
            await createOrder(tableId, cart)
            setCart([])
            router.push("/pos/tables")
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen w-full bg-gray-100 overflow-hidden">
            {/* Left Side: Menu */}
            <div className="flex-1 flex flex-col h-full">
                {/* Header */}
                <div className="h-14 lg:h-16 bg-white border-b flex items-center px-3 lg:px-4 justify-between shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-xs lg:text-sm">
                        <ArrowLeft className="mr-1 lg:mr-2 h-4 w-4 lg:h-5 lg:w-5" /> Back
                    </Button>
                    <h2 className="font-bold text-sm lg:text-lg">Table {tableId}</h2>
                    <div className="w-16 lg:w-24" />
                </div>

                {/* Categories */}
                <div className="h-12 lg:h-14 bg-white border-b flex items-center px-2 overflow-x-auto gap-1 lg:gap-2 shrink-0">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                                selectedCategory === cat.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <ScrollArea className="flex-1 p-2 lg:p-4">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-4">
                        {filteredProducts.map(product => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="aspect-square bg-white rounded-lg lg:rounded-xl p-2 lg:p-4 shadow-sm border hover:border-primary hover:shadow-md transition-all active:scale-95 flex flex-col items-center justify-center text-center gap-1 lg:gap-2"
                            >
                                <div className="h-8 w-8 lg:h-12 lg:w-12 rounded-full bg-gray-100 flex items-center justify-center text-base lg:text-xl font-bold text-gray-400">
                                    {product.name.charAt(0)}
                                </div>
                                <span className="font-medium text-xs lg:text-sm line-clamp-2">{product.name}</span>
                                <span className="text-xs lg:text-sm text-primary font-bold">{formatCurrency(product.price)}</span>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Right Side: Cart - Fixed bottom on mobile, sidebar on desktop */}
            <div className="lg:w-96 bg-white border-t lg:border-l lg:border-t-0 flex flex-col max-h-[40vh] lg:max-h-screen lg:h-full shadow-xl z-10">
                <div className="h-12 lg:h-16 border-b flex items-center px-3 lg:px-6 bg-gray-50 shrink-0">
                    <h2 className="font-bold text-sm lg:text-lg">Current Order</h2>
                </div>

                <ScrollArea className="flex-1 p-2 lg:p-4">
                    <div className="space-y-2 lg:space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-start justify-between gap-2 p-2 rounded-lg hover:bg-gray-50">
                                <div className="flex-1">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-gray-500">{formatCurrency(item.price)}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="p-1 hover:bg-white rounded-md transition-colors"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="p-1 hover:bg-white rounded-md transition-colors"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {cart.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
                                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-2xl">🛒</span>
                                </div>
                                <p>Cart is empty</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-6 bg-gray-50 border-t space-y-4">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="space-y-2">
                        {currentOrder && (
                            <div className="flex gap-2">
                                <Button
                                    className="flex-1 h-10 text-sm"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowMoveDialog(true)}
                                >
                                    <ArrowRightLeft className="mr-2 h-4 w-4" /> Move Table
                                </Button>
                                <Button
                                    className="flex-1 h-10 text-sm"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowSplitDialog(true)}
                                >
                                    <Scissors className="mr-2 h-4 w-4" /> Split Bill
                                </Button>
                            </div>
                        )}
                        <Button
                            className="w-full h-12 text-lg"
                            variant="outline"
                            size="lg"
                            disabled={cart.length === 0}
                            onClick={sendToKitchen}
                        >
                            <Send className="mr-2 h-5 w-5" /> Send to Kitchen
                        </Button>
                        <Button
                            className="w-full h-12 text-lg"
                            size="lg"
                            disabled={cart.length === 0}
                            onClick={handlePayment}
                        >
                            <CreditCard className="mr-2 h-5 w-5" /> Charge {formatCurrency(total)}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            {currentOrder && tables && (
                <>
                    <MoveTableDialog
                        order={currentOrder}
                        tables={tables}
                        open={showMoveDialog}
                        onOpenChange={setShowMoveDialog}
                    />
                    <SplitBillDialog
                        order={currentOrder}
                        open={showSplitDialog}
                        onOpenChange={setShowSplitDialog}
                    />
                </>
            )}
        </div>
    )
}
