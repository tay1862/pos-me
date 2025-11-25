import { getTables } from "@/lib/actions"
import { TableManager } from "@/components/admin/TableManager"

export default async function TablesPage() {
    const tables = await getTables()

    return <TableManager tables={tables} />
}
