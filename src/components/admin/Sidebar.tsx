"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, UtensilsCrossed, Users, Grid, Settings, LogOut, Menu, X, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/admin/employees", label: "Employees", icon: Users },
    { href: "/admin/tables", label: "Tables", icon: Grid },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
]

function NavLinks({ pathname, onNavigate }: { pathname: string, onNavigate?: () => void }) {
    return (
        <>
            {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                            isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                )
            })}
        </>
    )
}

export function Sidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <>
            {/* Mobile Header */}
            <div className="flex h-16 items-center justify-between border-b bg-gray-900 px-4 text-white lg:hidden">
                <h1 className="text-lg font-bold">POS Admin</h1>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 bg-gray-900 border-gray-800 p-0">
                        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
                            <h1 className="text-xl font-bold text-white">POS Admin</h1>
                        </div>
                        <nav className="flex-1 space-y-1 p-4">
                            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
                        </nav>
                        <div className="border-t border-gray-800 p-4">
                            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex h-screen w-64 flex-col border-r bg-gray-900 text-white">
                <div className="flex h-16 items-center justify-center border-b border-gray-800">
                    <h1 className="text-xl font-bold">POS Admin</h1>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                    <NavLinks pathname={pathname} />
                </nav>
                <div className="border-t border-gray-800 p-4">
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </div>
        </>
    )
}
