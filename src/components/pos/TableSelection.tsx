"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { LogOut, RefreshCw } from "lucide-react"

type Table = {
    id: string
    name: string
    x: number
    y: number
    width: number
    height: number
    shape: string
    status: "AVAILABLE" | "OCCUPIED" | "RESERVED"
}

export function TableSelection({ tables }: { tables: Table[] }) {
    const router = useRouter()

    const handleTableClick = (tableId: string) => {
        router.push(`/pos/order/${tableId}`)
    }

    return (
        <div className="flex h-screen flex-col bg-gray-50">
            <header className="flex h-14 lg:h-16 items-center justify-between border-b bg-white px-3 lg:px-6 shadow-sm">
                <h1 className="text-lg lg:text-xl font-bold text-gray-800">Select Table</h1>
                <div className="flex gap-2 lg:gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-xs lg:text-sm">
                        <div className="h-3 w-3 rounded-full bg-green-500" /> <span className="text-gray-600">Available</span>
                        <div className="h-3 w-3 rounded-full bg-red-500" /> <span className="text-gray-600">Occupied</span>
                    </div>
                    <Button variant="outline" size="icon" className="h-9 w-9 lg:h-10 lg:w-10">
                        <RefreshCw className="h-4 w-4 lg:h-5 lg:w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 lg:h-10 lg:w-10" onClick={() => router.push("/pos")}>
                        <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-3 lg:p-8">
                <div className="relative mx-auto h-[500px] lg:h-[600px] w-full max-w-5xl rounded-xl border bg-white shadow-sm">
                    {tables.map((table) => (
                        <button
                            key={table.id}
                            onClick={() => handleTableClick(table.id)}
                            style={{
                                left: table.x,
                                top: table.y,
                                width: table.width,
                                height: table.height,
                            }}
                            className={cn(
                                "absolute flex items-center justify-center border-2 transition-all hover:scale-105 hover:shadow-md",
                                table.shape === "circle" ? "rounded-full" : "rounded-lg",
                                table.status === "OCCUPIED"
                                    ? "bg-red-100 border-red-500 text-red-700"
                                    : "bg-green-100 border-green-500 text-green-700"
                            )}
                        >
                            <span className="font-bold">{table.name}</span>
                        </button>
                    ))}
                    {tables.length === 0 && (
                        <div className="flex h-full items-center justify-center text-gray-400">
                            No tables configured. Please go to Admin &gt; Tables.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
