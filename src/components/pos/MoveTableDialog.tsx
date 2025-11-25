"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { moveOrderToTable } from "@/lib/order-actions"
import { ArrowRight } from "lucide-react"

type Table = {
    id: string
    name: string
    status: string
}

type Order = {
    id: string
    table: { name: string } | null
}

export function MoveTableDialog({
    order,
    tables,
    open,
    onOpenChange
}: {
    order: Order
    tables: Table[]
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [selectedTableId, setSelectedTableId] = useState<string>("")
    const [isMoving, setIsMoving] = useState(false)

    const availableTables = tables.filter(t => t.status === "AVAILABLE")

    const handleMove = async () => {
        if (!selectedTableId) return

        setIsMoving(true)
        try {
            await moveOrderToTable(order.id, selectedTableId)
            onOpenChange(false)
            window.location.href = "/pos/tables"
        } catch (error) {
            alert("Failed to move table")
        } finally {
            setIsMoving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Move to Another Table</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="font-medium">Current: {order.table?.name || "No table"}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span className="font-medium">New table</span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select New Table</label>
                        <Select value={selectedTableId} onValueChange={setSelectedTableId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a table" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTables.map(table => (
                                    <SelectItem key={table.id} value={table.id}>
                                        {table.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                            disabled={isMoving}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleMove}
                            disabled={!selectedTableId || isMoving}
                        >
                            {isMoving ? "Moving..." : "Move Table"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
