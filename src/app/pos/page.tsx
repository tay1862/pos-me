"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Delete } from "lucide-react"

export default function PosLoginPage() {
    const [pin, setPin] = useState("")
    const router = useRouter()
    const [error, setError] = useState("")

    const handleNumberClick = (num: string) => {
        if (pin.length < 4) {
            setPin(prev => prev + num)
            setError("")
        }
    }

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1))
        setError("")
    }

    const handleLogin = async () => {
        // In a real app, verify PIN with server
        // For demo, we'll accept '1234'
        if (pin === "1234") {
            router.push("/pos/tables")
        } else {
            setError("Invalid PIN")
            setPin("")
        }
    }

    return (
        <div className="flex h-full items-center justify-center bg-gray-900 text-white p-4">
            <div className="w-full max-w-md">
                <div className="mb-6 lg:mb-8 text-center">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">POS Login</h1>
                    <p className="text-sm lg:text-base text-gray-400">Enter your PIN to continue</p>
                </div>

                <div className="mb-6 lg:mb-8 flex justify-center gap-3 lg:gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-3 w-3 lg:h-4 lg:w-4 rounded-full ${i < pin.length ? "bg-primary" : "bg-gray-700"
                                }`}
                        />
                    ))}
                </div>

                {error && (
                    <div className="mb-4 text-center text-red-500 font-medium text-sm lg:text-base">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-3 gap-3 lg:gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <Button
                            key={num}
                            variant="outline"
                            className="h-16 lg:h-20 text-xl lg:text-2xl font-bold bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white active:scale-95 transition-transform"
                            onClick={() => handleNumberClick(num.toString())}
                        >
                            {num}
                        </Button>
                    ))}
                    <div />
                    <Button
                        variant="outline"
                        className="h-16 lg:h-20 text-xl lg:text-2xl font-bold bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white active:scale-95 transition-transform"
                        onClick={() => handleNumberClick("0")}
                    >
                        0
                    </Button>
                    <Button
                        variant="outline"
                        className="h-16 lg:h-20 text-xl lg:text-2xl font-bold bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white active:scale-95 transition-transform"
                        onClick={handleDelete}
                    >
                        <Delete className="h-6 w-6 lg:h-8 lg:w-8" />
                    </Button>
                </div>

                <Button
                    className="mt-6 lg:mt-8 w-full h-12 lg:h-14 text-base lg:text-lg active:scale-95 transition-transform"
                    onClick={handleLogin}
                    disabled={pin.length !== 4}
                >
                    Login
                </Button>
            </div>
        </div>
    )
}
