import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, ShoppingCart, ChefHat } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">POS System</h1>
          <p className="text-xl text-gray-400">Complete Restaurant Management Solution</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/admin">
            <Card className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4 mx-auto">
                  <LayoutDashboard className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-center text-white">Admin Panel</CardTitle>
                <CardDescription className="text-center text-gray-400">
                  Manage menu, employees, tables, and view reports
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/pos">
            <Card className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-500/10 mb-4 mx-auto">
                  <ShoppingCart className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-center text-white">POS Terminal</CardTitle>
                <CardDescription className="text-center text-gray-400">
                  Take orders, manage tables, and process payments
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/kds">
            <Card className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500/10 mb-4 mx-auto">
                  <ChefHat className="h-8 w-8 text-orange-500" />
                </div>
                <CardTitle className="text-center text-white">Kitchen Display</CardTitle>
                <CardDescription className="text-center text-gray-400">
                  View and manage incoming orders in real-time
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>Default PIN for demo: <span className="font-mono bg-gray-800 px-2 py-1 rounded">1234</span></p>
          <p>Visit <span className="font-mono bg-gray-800 px-2 py-1 rounded">/admin</span> to configure your system</p>
        </div>
      </div>
    </div>
  )
}
