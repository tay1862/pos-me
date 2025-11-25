"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/currency"
import { Banknote, ArrowRightLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PaymentMethod = "CASH" | "TRANSFER"

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
            setCashReceived("")
        }
    }

    const handleTransferPayment = () => {
        onPaymentComplete("TRANSFER", "TRANSFER-" + Date.now())
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>ຊຳລະເງິນ / Payment</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Amount Display */}
                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600">ຍອດລວມ / Total Amount</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(amount)}</p>
                    </div>

                    {/* Payment Methods */}
                    <Tabs defaultValue="CASH" onValueChange={(v) => setSelectedMethod(v as PaymentMethod)}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="CASH">
                                <Banknote className="h-4 w-4 mr-2" />
                                ເງິນສົດ / Cash
                            </TabsTrigger>
                            <TabsTrigger value="TRANSFER">
                                <ArrowRightLeft className="h-4 w-4 mr-2" />
                                ໂອນເງິນ / Transfer
                            </TabsTrigger>
                        </TabsList>

                        {/* Cash Payment */}
                        <TabsContent value="CASH" className="space-y-4">
                            <div className="space-y-2">
                                <Label>ຮັບເງິນ / Cash Received</Label>
                                <Input
                                    type="number"
                                    placeholder="ໃສ່ຈຳນວນເງິນ / Enter amount"
                                    value={cashReceived}
                                    onChange={(e) => setCashReceived(e.target.value)}
                                    className="text-lg"
                                    autoFocus
                                />
                            </div>
                            {cashReceived && (
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <div className="flex justify-between text-sm">
                                        <span>ເງິນທອນ / Change:</span>
                                        <span className={`font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(change)}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <Button
                                className="w-full h-12 text-lg"
                                onClick={handleCashPayment}
                                disabled={!cashReceived || parseFloat(cashReceived) < amount}
                            >
                                ຊຳລະດ້ວຍເງິນສົດ / Pay Cash
                            </Button>
                        </TabsContent>

                        {/* Transfer Payment */}
                        <TabsContent value="TRANSFER" className="space-y-4">
                            <div className="text-center py-8">
                                <ArrowRightLeft className="h-16 w-16 mx-auto mb-4 text-primary" />
                                <p className="text-lg font-medium mb-2">
                                    ໂອນເງິນ / Bank Transfer
                                </p>
                                <p className="text-sm text-gray-600 mb-4">
                                    ຍອດທີ່ຕ້ອງຊຳລະ: {formatCurrency(amount)}
                                </p>
                                <div className="bg-gray-100 p-4 rounded-lg text-left space-y-2">
                                    <p className="text-sm"><strong>ທະນາຄານ:</strong> BCEL</p>
                                    <p className="text-sm"><strong>ເລກບັນຊີ:</strong> XXXX-XXXX-XXXX</p>
                                    <p className="text-sm"><strong>ຊື່ບັນຊີ:</strong> ຮ້ານອາຫານ</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-4">
                                    ກະລຸນາກົດຢືນຢັນເມື່ອໂອນເງິນສຳເລັດແລ້ວ
                                </p>
                            </div>
                            <Button
                                className="w-full h-12 text-lg"
                                onClick={handleTransferPayment}
                            >
                                ຢືນຢັນການໂອນເງິນ / Confirm Transfer
                            </Button>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}
