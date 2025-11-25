import { Sidebar } from "@/components/admin/Sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                {children}
            </main>
        </div>
    )
}
