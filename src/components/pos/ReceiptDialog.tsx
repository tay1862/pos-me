"use client"

import { formatCurrency } from "@/lib/currency"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Printer } from "lucide-react"

type ReceiptItem = {
    name: string
    quantity: number
    price: number
}

type ReceiptProps = {
    orderNumber: string
    items: ReceiptItem[]
    total: number
    tableName?: string
    date?: Date
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ReceiptDialog({
    orderNumber,
    items,
    total,
    tableName,
    date = new Date(),
    open,
    onOpenChange
}: ReceiptProps) {

    const handlePrint = () => {
        window.print()
    }

    const handleDownloadPDF = () => {
        // In a real app, use a library like jsPDF or react-pdf
        alert("PDF download feature - integrate with jsPDF or similar library")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Receipt Preview</DialogTitle>
                </DialogHeader>

                {/* Receipt Content */}
                <div id="receipt-content" className="space-y-4 p-4 bg-white">
                    {/* Header */}
                    <div className="text-center border-b pb-3">
                        <h2 className="text-xl font-bold">ຮ້ານອາຫານ</h2>
                        <p className="text-sm text-gray-600">Restaurant POS System</p>
                        <p className="text-xs text-gray-500">Tel: 020-XXXX-XXXX</p>
                    </div>

                    {/* Order Info */}
                    <div className="space-y-1 text-sm border-b pb-3">
                        <div className="flex justify-between">
                            <span>Order #:</span>
                            <span className="font-mono">{orderNumber}</span>
                        </div>
                        {tableName && (
                            <div className="flex justify-between">
                                <span>Table:</span>
                                <span>{tableName}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Date:</span>
                            <span>{date.toLocaleDateString('lo-LA')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Time:</span>
                            <span>{date.toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 border-b pb-3">
                        <div className="flex justify-between text-sm font-semibold">
                            <span>Item</span>
                            <span>Amount</span>
                        </div>
                        {items.map((item, index) => (
                            <div key={index} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>{item.name}</span>
                                    <span>{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                                <div className="text-xs text-gray-500 pl-2">
                                    {item.quantity} x {formatCurrency(item.price)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-lg font-bold">
                            <span>TOTAL:</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-xs text-gray-500 border-t pt-3">
                        <p>ຂອບໃຈທີ່ໃຊ້ບໍລິການ</p>
                        <p>Thank you for your visit!</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={handlePrint}
                    >
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                </div>

                {/* Print Styles */}
                <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #receipt-content,
            #receipt-content * {
              visibility: visible;
            }
            #receipt-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 80mm;
              font-size: 12px;
            }
          }
        `}</style>
            </DialogContent>
        </Dialog>
    )
}
