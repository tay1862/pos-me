"use client"

import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createEmployee, deleteEmployee } from "@/lib/actions"
import { Badge } from "@/components/ui/badge"

type Employee = {
    id: string
    name: string
    pin: string
    role: string
}

export function EmployeeManager({ employees }: { employees: Employee[] }) {
    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Employee Management</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Employee</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Employee</DialogTitle>
                        </DialogHeader>
                        <form
                            action={async (formData) => {
                                await createEmployee(formData)
                            }}
                            className="space-y-4"
                        >
                            <div className="grid gap-2">
                                <label htmlFor="name">Name</label>
                                <input id="name" name="name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="pin">PIN (Login Code)</label>
                                <input id="pin" name="pin" type="text" pattern="[0-9]*" inputMode="numeric" maxLength={6} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="role">Role</label>
                                <Select name="role" defaultValue="CASHIER" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="MANAGER">Manager</SelectItem>
                                        <SelectItem value="CASHIER">Cashier</SelectItem>
                                        <SelectItem value="KITCHEN">Kitchen Staff</SelectItem>
                                        <SelectItem value="BAR">Bar Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">Create Employee</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                {employees.map((employee) => (
                    <Card key={employee.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{employee.name}</CardTitle>
                            <Badge variant={employee.role === 'ADMIN' ? 'default' : 'secondary'}>{employee.role}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tight">****</div>
                            <p className="text-xs text-muted-foreground">PIN Hidden</p>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-4 w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => deleteEmployee(employee.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Remove
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
