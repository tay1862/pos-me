"use client"

import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'

// Initialize Pusher (in production, use environment variables)
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || 'demo-key', {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap1',
})

export function useRealtimeOrders() {
    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        const channel = pusher.subscribe('orders')

        channel.bind('new-order', (data: any) => {
            setOrders(prev => [data, ...prev])
        })

        channel.bind('order-updated', (data: any) => {
            setOrders(prev => prev.map(order =>
                order.id === data.id ? data : order
            ))
        })

        channel.bind('order-completed', (data: any) => {
            setOrders(prev => prev.filter(order => order.id !== data.id))
        })

        return () => {
            channel.unbind_all()
            channel.unsubscribe()
        }
    }, [])

    return orders
}

export function useRealtimeKitchen() {
    const [updates, setUpdates] = useState<any>(null)

    useEffect(() => {
        const channel = pusher.subscribe('kitchen')

        channel.bind('item-status-changed', (data: any) => {
            setUpdates(data)
            // Trigger re-fetch or update local state
        })

        return () => {
            channel.unbind_all()
            channel.unsubscribe()
        }
    }, [])

    return updates
}

// Server-side trigger function (use in Server Actions)
export async function triggerRealtimeUpdate(event: string, data: any) {
    // In production, use Pusher server SDK
    // This is a placeholder for the server-side implementation

    if (typeof window === 'undefined') {
        // Server-side only
        try {
            await fetch('/api/pusher/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event, data })
            })
        } catch (error) {
            console.error('Failed to trigger realtime update:', error)
        }
    }
}
