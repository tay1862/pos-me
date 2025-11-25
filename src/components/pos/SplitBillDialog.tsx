"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { splitBill } from "@/lib/order-actions"
import { formatCurrency } from "@/lib/currency"
import { Scissors } from "lucide-react"

type OrderItem = {
    id: string
    quantity: number
    price: any
    product: {
        name: string
    }
}

type Order = {
    id: string
    items: OrderItem[]
}

export function SplitBillDialog({
    order,
    open,
    onOpenChange
}: {
    order: Order
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [isSplitting, setIsSplitting] = useState(false)

    const toggleItem = (itemId: string) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        )
    }

    const selectedTotal = order.items
        .filter(item => selectedItems.includes(item.id))
        .reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)

    const remainingTotal = order.items
        .filter(item => !selectedItems.includes(item.id))
        .reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)

    const handleSplit = async () => {
        if (selectedItems.length === 0) return

        setIsSplitting(true)
        try {
            await splitBill(order.id, selectedItems)
            onOpenChange(false)
            window.location.reload()
        } catch (error) {
            alert("Failed to split bill")
        } finally {
            setIsSplitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Scissors className="h-5 w-5" />
                        Split Bill
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Select items to split into a new bill
                    </p>

                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {order.items.map(item => (
                            <div
                                key={item.id}
                                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                                onClick={() => toggleItem(item.id)}
                            >
                                <Checkbox
                                    checked={selectedItems.includes(item.id)}
                                    onCheckedChange={() => toggleItem(item.id)}
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-sm">
                                        {item.quantity}x {item.product.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatCurrency(Number(item.price) * item.quantity)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>New Bill:</span>
                            <span className="font-bold text-primary">{formatCurrency(selectedTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Remaining:</span>
                            <span className="font-bold">{formatCurrency(remainingTotal)}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                            disabled={isSplitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleSplit}
                            disabled={selectedItems.length === 0 || isSplitting}
                        >
                            {isSplitting ? "Splitting..." : "Split Bill"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
