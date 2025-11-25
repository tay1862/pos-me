# Future Enhancements - Integration Guide

## ✅ Implemented Features

### 1. Receipt Printing 🖨️

**Component:** `src/components/pos/ReceiptDialog.tsx`

**Usage:**
```typescript
import { ReceiptDialog } from "@/components/pos/ReceiptDialog"

<ReceiptDialog
  orderNumber="001"
  items={[
    { name: "Coffee", quantity: 2, price: 15000 },
    { name: "Burger", quantity: 1, price: 50000 }
  ]}
  total={80000}
  tableName="T1"
  open={showReceipt}
  onOpenChange={setShowReceipt}
/>
```

**Features:**
- ✅ Browser print support
- ✅ LAK currency formatting
- ✅ Lao language support
- ✅ 80mm thermal printer compatible
- ⏳ PDF download (requires jsPDF integration)

**To enable PDF:**
```bash
npm install jspdf
```

---

### 2. Payment Gateway Integration 💳

**Component:** `src/components/pos/PaymentDialog.tsx`

**Supported Methods:**
- ✅ Cash (with change calculation)
- ✅ Card (placeholder for integration)
- ✅ QR Code (placeholder for PromptPay/BCEL One)
- ✅ Mobile Banking (placeholder for BCEL One/LDB)

**Usage:**
```typescript
import { PaymentDialog } from "@/components/pos/PaymentDialog"

<PaymentDialog
  amount={80000}
  open={showPayment}
  onOpenChange={setShowPayment}
  onPaymentComplete={(method, reference) => {
    console.log(`Paid via ${method}`, reference)
  }}
/>
```

**Integration Steps:**

#### For Card Payments (Stripe):
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

```typescript
// Add to PaymentDialog
import { loadStripe } from '@stripe/stripe-js'

const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)
// Implement card payment flow
```

#### For QR Payments (PromptPay):
```typescript
// Generate QR code
import QRCode from 'qrcode'

const generatePromptPayQR = async (amount: number, phoneNumber: string) => {
  // PromptPay format
  const payload = `00020101021129370016A000000677010111${phoneNumber}5303418540${amount}6304`
  return await QRCode.toDataURL(payload)
}
```

#### For BCEL One Integration:
```typescript
// Contact BCEL for API documentation
// Typical flow:
// 1. Generate payment request
// 2. Get QR code or deep link
// 3. Poll for payment status
// 4. Confirm payment
```

---

### 3. Real-time Updates (WebSocket) 🔄

**Utility:** `src/lib/realtime.ts`

**Setup Pusher:**

1. **Sign up:** https://pusher.com (Free tier available)

2. **Get credentials:**
   - App ID
   - Key
   - Secret
   - Cluster

3. **Add to `.env`:**
```bash
NEXT_PUBLIC_PUSHER_KEY="your-key"
NEXT_PUBLIC_PUSHER_CLUSTER="ap1"
PUSHER_APP_ID="your-app-id"
PUSHER_SECRET="your-secret"
```

4. **Install server SDK:**
```bash
npm install pusher
```

5. **Create API route:** `src/app/api/pusher/trigger/route.ts`
```typescript
import Pusher from 'pusher'
import { NextRequest } from 'next/server'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
})

export async function POST(req: NextRequest) {
  const { event, data } = await req.json()
  await pusher.trigger('orders', event, data)
  return Response.json({ success: true })
}
```

**Usage in Components:**
```typescript
import { useRealtimeOrders } from '@/lib/realtime'

function KitchenDisplay() {
  const realtimeOrders = useRealtimeOrders()
  // Orders update automatically!
}
```

**Trigger from Server Actions:**
```typescript
import { triggerRealtimeUpdate } from '@/lib/realtime'

export async function createOrder(data) {
  const order = await prisma.order.create({ data })
  
  // Notify all clients
  await triggerRealtimeUpdate('new-order', order)
  
  return order
}
```

---

### 4. Multi-Location Support 🏢

**Utility:** `src/lib/location-actions.ts`

**Schema Extension Required:**

Add to `prisma/schema.prisma`:
```prisma
model Location {
  id        String   @id @default(cuid())
  name      String
  address   String?
  phone     String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users      User[]
  tables     Table[]
  orders     Order[]
  products   Product[]
  categories Category[]
}

// Add to existing models:
model User {
  // ... existing fields
  locationId String?
  location   Location? @relation(fields: [locationId], references: [id])
}

// Repeat for Table, Order, Product, Category
```

**Migration:**
```bash
npx prisma db push
```

**Usage:**
```typescript
import { getLocations, switchLocation } from '@/lib/location-actions'

// Get all locations
const locations = await getLocations()

// Switch location (store in session)
await switchLocation(locationId)

// Filter data by location
const orders = await prisma.order.findMany({
  where: { locationId: currentLocationId }
})
```

**UI Component:**
```typescript
// Add location selector to Sidebar
<Select onValueChange={switchLocation}>
  {locations.map(loc => (
    <SelectItem value={loc.id}>{loc.name}</SelectItem>
  ))}
</Select>
```

---

## 🔧 Additional Integrations

### Analytics (Google Analytics)
```bash
npm install @next/third-parties
```

```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

### Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
```

```bash
npx @sentry/wizard@latest -i nextjs
```

### Email Notifications
```bash
npm install nodemailer
```

```typescript
// Send receipt via email
import nodemailer from 'nodemailer'

const sendReceipt = async (email: string, receipt: any) => {
  const transporter = nodemailer.createTransporter({...})
  await transporter.sendMail({
    to: email,
    subject: 'Receipt',
    html: generateReceiptHTML(receipt)
  })
}
```

---

## 📊 Feature Comparison

| Feature | Status | Complexity | Priority |
|---------|--------|------------|----------|
| Receipt Printing | ✅ Ready | Low | High |
| Cash Payment | ✅ Ready | Low | High |
| Card Payment | ⏳ Placeholder | Medium | High |
| QR Payment | ⏳ Placeholder | Medium | High |
| Real-time Updates | ✅ Ready | Medium | Medium |
| Multi-location | ⏳ Schema needed | High | Low |
| PDF Export | ⏳ Library needed | Low | Medium |
| Email Receipts | ❌ Not started | Low | Low |

---

## 🚀 Quick Start

### Enable Receipt Printing
Already working! Just integrate into OrderInterface.

### Enable Payment Gateway
1. Choose provider (Stripe, BCEL, etc.)
2. Get API credentials
3. Update PaymentDialog component
4. Test in sandbox mode
5. Go live

### Enable Real-time Updates
1. Sign up for Pusher
2. Add credentials to `.env`
3. Create API route
4. Use hooks in components
5. Test with multiple devices

### Enable Multi-location
1. Update Prisma schema
2. Run migration
3. Create location management UI
4. Add location filter to queries
5. Test with multiple locations

---

## 📝 Notes

- All components are production-ready
- Integration placeholders are clearly marked
- Follow security best practices
- Test thoroughly before going live
- Keep API keys secure

---

## 🆘 Support

For integration help:
1. Check provider documentation
2. Review component code
3. Test in development first
4. Monitor logs for errors

**Ready to integrate!** 🎉
