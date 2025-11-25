import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function main() {
    console.log('🌱 Seeding database...')

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { pin: '1234' },
        update: {},
        create: {
            name: 'Admin User',
            pin: '1234',
            role: 'ADMIN',
        },
    })
    console.log('✓ Created admin user (PIN: 1234)')

    // Create employees
    await prisma.user.createMany({
        data: [
            { name: 'John Cashier', pin: '1111', role: 'CASHIER' },
            { name: 'Jane Kitchen', pin: '2222', role: 'KITCHEN' },
            { name: 'Bob Bar', pin: '3333', role: 'BAR' },
        ],
        skipDuplicates: true,
    })
    console.log('✓ Created employees')

    // Create categories and products (prices in LAK)
    const drinks = await prisma.category.create({
        data: {
            name: 'Drinks',
            color: '#3b82f6',
            sortOrder: 1,
            products: {
                create: [
                    { name: 'Coffee', price: 15000, inStock: true }, // ~15,000 LAK
                    { name: 'Tea', price: 10000, inStock: true },
                    { name: 'Latte', price: 20000, inStock: true },
                    { name: 'Cappuccino', price: 18000, inStock: true },
                    { name: 'Orange Juice', price: 12000, inStock: true },
                ],
            },
        },
    })

    const food = await prisma.category.create({
        data: {
            name: 'Food',
            color: '#ef4444',
            sortOrder: 2,
            products: {
                create: [
                    { name: 'Sandwich', price: 35000, inStock: true },
                    { name: 'Burger', price: 50000, inStock: true },
                    { name: 'Pizza', price: 65000, inStock: true },
                    { name: 'Salad', price: 40000, inStock: true },
                    { name: 'Pasta', price: 55000, inStock: true },
                ],
            },
        },
    })

    const desserts = await prisma.category.create({
        data: {
            name: 'Desserts',
            color: '#ec4899',
            sortOrder: 3,
            products: {
                create: [
                    { name: 'Cake', price: 25000, inStock: true },
                    { name: 'Ice Cream', price: 20000, inStock: true },
                    { name: 'Brownie', price: 18000, inStock: true },
                ],
            },
        },
    })

    console.log('✓ Created categories and products (LAK prices)')

    // Create tables
    await prisma.table.createMany({
        data: [
            { name: 'T1', x: 50, y: 50, width: 100, height: 100, shape: 'square', status: 'AVAILABLE' },
            { name: 'T2', x: 200, y: 50, width: 100, height: 100, shape: 'square', status: 'AVAILABLE' },
            { name: 'T3', x: 350, y: 50, width: 100, height: 100, shape: 'circle', status: 'AVAILABLE' },
            { name: 'T4', x: 50, y: 200, width: 100, height: 100, shape: 'square', status: 'AVAILABLE' },
            { name: 'T5', x: 200, y: 200, width: 100, height: 100, shape: 'circle', status: 'AVAILABLE' },
            { name: 'T6', x: 350, y: 200, width: 100, height: 100, shape: 'square', status: 'AVAILABLE' },
        ],
    })
    console.log('✓ Created tables')

    console.log('🎉 Seeding completed successfully with LAK currency!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Seeding failed:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
