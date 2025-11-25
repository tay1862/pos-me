import { getTables } from "@/lib/actions"
import { TableSelection } from "@/components/pos/TableSelection"

export default async function PosTablesPage() {
    const tables = await getTables()

    return <TableSelection tables={tables as any} />
}
