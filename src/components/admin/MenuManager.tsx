"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createCategory, deleteCategory, createProduct } from "@/lib/actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/currency"

type Category = {
    id: string
    name: string
    color: string | null
    _count: { products: number }
}

type Product = {
    id: string
    name: string
    price: any
    category: { name: string }
}

export function MenuManager({ categories, products }: { categories: Category[], products: Product[] }) {
    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Menu Management</h2>
            </div>

            <Tabs defaultValue="categories" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="modifiers">Modifiers</TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="space-y-4">
                    <div className="flex justify-end">
                        <form action={createCategory} className="flex gap-2">
                            <input name="name" placeholder="New Category" className="border rounded px-2 py-1" required />
                            <input name="color" type="color" defaultValue="#e2e8f0" className="h-9 w-9 p-0 border rounded" />
                            <Button type="submit" size="sm"><Plus className="mr-2 h-4 w-4" /> Add Category</Button>
                        </form>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                        {categories.map((category) => (
                            <Card key={category.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color || "#e2e8f0" }} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{category._count.products}</div>
                                    <p className="text-xs text-muted-foreground">Products</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-2 text-red-500 hover:text-red-600"
                                        onClick={() => deleteCategory(category.id)}
                                    >
                                        Delete
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="products" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Product</DialogTitle>
                                </DialogHeader>
                                <form action={createProduct} className="space-y-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="name">Name</label>
                                        <input id="name" name="name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="price">Price</label>
                                        <input id="price" name="price" type="number" step="0.01" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="category">Category</label>
                                        <Select name="categoryId" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((c) => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit" className="w-full">Create Product</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="rounded-md border bg-white overflow-x-auto">
                        <table className="w-full text-sm min-w-[500px]">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="p-4 text-left font-medium">Name</th>
                                    <th className="p-4 text-left font-medium">Category</th>
                                    <th className="p-4 text-left font-medium">Price</th>
                                    <th className="p-4 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b">
                                        <td className="p-4">{product.name}</td>
                                        <td className="p-4">{product.category.name}</td>
                                        <td className="p-4">{formatCurrency(product.price)}</td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center text-muted-foreground">No products found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
