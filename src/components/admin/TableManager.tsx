"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Move } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTable, deleteTable, updateTablePosition } from "@/lib/actions"
import { cn } from "@/lib/utils"

type Table = {
    id: string
    name: string
    x: number
    y: number
    width: number
    height: number
    shape: string
    status: string
}

export function TableManager({ tables: initialTables }: { tables: Table[] }) {
    const [tables, setTables] = useState(initialTables)
    const [draggingId, setDraggingId] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setTables(initialTables)
    }, [initialTables])

    const handleDragStart = (id: string, e: React.DragEvent) => {
        setDraggingId(id)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        if (!draggingId || !containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const x = Math.round(e.clientX - rect.left - 50) // Center offset
        const y = Math.round(e.clientY - rect.top - 50)

        // Optimistic update
        setTables(tables.map(t => t.id === draggingId ? { ...t, x, y } : t))

        await updateTablePosition(draggingId, x, y)
        setDraggingId(null)
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Table Management</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Table</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Table</DialogTitle>
                        </DialogHeader>
                        <form action={createTable} className="space-y-4">
                            <div className="grid gap-2">
                                <label htmlFor="name">Table Name/Number</label>
                                <input id="name" name="name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="shape">Shape</label>
                                <Select name="shape" defaultValue="square" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a shape" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="square">Square</SelectItem>
                                        <SelectItem value="circle">Circle</SelectItem>
                                        <SelectItem value="rectangle">Rectangle</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">Create Table</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div
                ref={containerRef}
                className="flex-1 border-2 border-dashed rounded-lg bg-gray-50/50 relative overflow-hidden min-h-[600px]"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {tables.map((table) => (
                    <div
                        key={table.id}
                        draggable
                        onDragStart={(e) => handleDragStart(table.id, e)}
                        style={{
                            left: table.x,
                            top: table.y,
                            width: table.width,
                            height: table.height,
                        }}
                        className={cn(
                            "absolute flex items-center justify-center border-2 cursor-move transition-shadow hover:shadow-lg bg-white",
                            table.shape === "circle" ? "rounded-full" : "rounded-lg",
                            draggingId === table.id ? "opacity-50" : "opacity-100"
                        )}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-bold">{table.name}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-500 hover:text-red-600"
                                onClick={(e) => {
                                    e.stopPropagation() // Prevent drag start
                                    deleteTable(table.id)
                                }}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                ))}
                {tables.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        Drag and drop area. Add a table to start.
                    </div>
                )}
            </div>
        </div>
    )
}
