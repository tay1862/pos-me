# POS System - Complete Restaurant Management Solution

A comprehensive, mobile-first Point of Sale system built with Next.js, featuring Back Office, POS Terminal, and Kitchen Display System. **All prices in LAK (Lao Kip)**.

## Features

### 🎛️ Back Office (`/admin`)
- **Dashboard**: Real-time overview of sales, active tables, and staff
- **Menu Management**: Create and manage categories, products, and modifiers
- **Employee Management**: Add staff with roles and PIN-based access
- **Table Management**: Drag-and-drop floor plan editor

### 🛒 POS Terminal (`/pos`)
- **PIN Login**: Secure employee authentication
- **Table Selection**: Visual floor plan with table status
- **Order Interface**: Category-based menu with shopping cart
- **Order Management**: Send to kitchen or process payments
- **Mobile Optimized**: Touch-friendly controls for phones and tablets

### 👨‍🍳 Kitchen Display System (`/kds`)
- **Order Queue**: Real-time incoming orders
- **Status Management**: Update order items (Pending → Cooking → Ready → Served)
- **Filtering**: View all orders or filter by status
- **Urgent Alerts**: Visual indicators for delayed orders

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Tailwind CSS + Shadcn UI
- **Currency**: LAK (Lao Kip) with proper formatting

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database URL
# DATABASE_URL="postgresql://user:password@localhost:5432/pos_db"

# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed sample data (optional)
npx ts-node prisma/seed.ts
```

### 3. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### 4. Default Credentials

- **Admin PIN**: `1234`
- **Cashier PIN**: `1111`
- **Kitchen PIN**: `2222`
- **Bar PIN**: `3333`

## Sample Data

The seed script creates:
- 4 employees with different roles
- 3 categories (Drinks, Food, Desserts)
- 13 products with LAK prices (15,000 - 65,000 LAK)
- 6 tables (T1-T6)

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

### Quick Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Environment Variables

Required for production:
```
DATABASE_URL="postgresql://user:password@host:port/database"
NODE_ENV="production"
```

## Mobile Support

The entire system is optimized for mobile devices:
- Touch-friendly controls (44x44px minimum)
- Responsive layouts (mobile → tablet → desktop)
- Hamburger menu for admin panel
- Optimized spacing and typography

## Project Structure

```
src/
├── app/              # Next.js pages
│   ├── admin/        # Back office
│   ├── pos/          # POS terminal
│   └── kds/          # Kitchen display
├── components/       # React components
├── lib/
│   ├── actions.ts    # Server actions
│   ├── currency.ts   # LAK formatting
│   └── db.ts         # Prisma client
└── prisma/
    ├── schema.prisma # Database schema
    └── seed.ts       # Sample data
```

## Currency Format

All prices are displayed in LAK (Lao Kip):
- Format: `₭ 15,000` (no decimals)
- Utility: `formatCurrency(amount)`
- Example: `formatCurrency(15000)` → `₭ 15,000`

## Features Checklist

✅ Full CRUD for all entities  
✅ PIN-based authentication  
✅ Drag-and-drop table management  
✅ Complete order flow (POS → Kitchen)  
✅ Real-time order status updates  
✅ Mobile-first responsive design  
✅ Touch-friendly controls  
✅ LAK currency formatting  
✅ Production-ready build  

## Future Enhancements

- [ ] Split bill functionality
- [ ] Move table feature
- [ ] Inventory tracking
- [ ] Advanced analytics
- [ ] Receipt printing
- [ ] Payment gateway integration
- [ ] WebSocket for real-time updates

## Support

For issues or questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Review application logs
3. Check browser console for errors

## License

MIT
