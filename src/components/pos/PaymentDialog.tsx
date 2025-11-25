"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/currency"
import { Banknote, CreditCard, Smartphone, QrCode } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PaymentMethod = "CASH" | "CARD" | "QR" | "MOBILE"

type PaymentDialogProps = {
    amount: number
    open: boolean
    onOpenChange: (open: boolean) => void
    onPaymentComplete: (method: PaymentMethod, reference?: string) => void
}

export function PaymentDialog({
    amount,
    open,
    onOpenChange,
    onPaymentComplete
}: PaymentDialogProps) {
    const [cashReceived, setCashReceived] = useState<string>("")
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("CASH")

    const change = cashReceived ? parseFloat(cashReceived) - amount : 0

    const handleCashPayment = () => {
        if (parseFloat(cashReceived) >= amount) {
            onPaymentComplete("CASH")
            onOpenChange(false)
        }
    }

    const handleCardPayment = () => {
        // In production, integrate with payment gateway
        // Example: Stripe, PayPal, local payment providers
        alert("Card payment integration - connect to payment gateway")
        onPaymentComplete("CARD", "CARD-" + Date.now())
        onOpenChange(false)
    }

    const handleQRPayment = () => {
        // In production, generate QR code for payment
        // Example: PromptPay, BCEL One, etc.
        alert("QR payment integration - generate QR code")
        onPaymentComplete("QR", "QR-" + Date.now())
        onOpenChange(false)
    }

    const handleMobilePayment = () => {
        // In production, integrate with mobile payment
        // Example: BCEL One, LDB Mobile Banking, etc.
        alert("Mobile payment integration - connect to mobile banking API")
        onPaymentComplete("MOBILE", "MOBILE-" + Date.now())
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Payment</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Amount Display */}
                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(amount)}</p>
                    </div>

                    {/* Payment Methods */}
                    <Tabs defaultValue="cash" onValueChange={(v) => setSelectedMethod(v as PaymentMethod)}>
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="CASH">
                                <Banknote className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="CARD">
                                <CreditCard className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="QR">
                                <QrCode className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="MOBILE">
                                <Smartphone className="h-4 w-4" />
                            </TabsTrigger>
                        </TabsList>

                        {/* Cash Payment */}
                        <TabsContent value="CASH" className="space-y-4">
                            <div className="space-y-2">
                                <Label>Cash Received</Label>
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={cashReceived}
                                    onChange={(e) => setCashReceived(e.target.value)}
                                    className="text-lg"
                                />
                            </div>
                            {cashReceived && (
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <div className="flex justify-between text-sm">
                                        <span>Change:</span>
                                        <span className={`font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(change)}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <Button
                                className="w-full"
                                onClick={handleCashPayment}
                                disabled={!cashReceived || parseFloat(cashReceived) < amount}
                            >
                                Complete Cash Payment
                            </Button>
                        </TabsContent>

                        {/* Card Payment */}
                        <TabsContent value="CARD" className="space-y-4">
                            <div className="text-center py-8">
                                <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                                <p className="text-sm text-gray-600 mb-4">
                                    Insert or tap card on terminal
                                </p>
                                <p className="text-xs text-gray-500">
                                    Integration with payment gateway required
                                </p>
                            </div>
                            <Button className="w-full" onClick={handleCardPayment}>
                                Process Card Payment
                            </Button>
                        </TabsContent>

                        {/* QR Payment */}
                        <TabsContent value="QR" className="space-y-4">
                            <div className="text-center py-8">
                                <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                                <p className="text-sm text-gray-600 mb-4">
                                    Scan QR code to pay
                                </p>
                                <p className="text-xs text-gray-500">
                                    PromptPay / BCEL One integration required
                                </p>
                            </div>
                            <Button className="w-full" onClick={handleQRPayment}>
                                Generate QR Code
                            </Button>
                        </TabsContent>

                        {/* Mobile Payment */}
                        <TabsContent value="MOBILE" className="space-y-4">
                            <div className="text-center py-8">
                                <Smartphone className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                                <p className="text-sm text-gray-600 mb-4">
                                    Pay via mobile banking
                                </p>
                                <p className="text-xs text-gray-500">
                                    BCEL One / LDB Mobile integration required
                                </p>
                            </div>
                            <Button className="w-full" onClick={handleMobilePayment}>
                                Process Mobile Payment
                            </Button>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}
