import { getEmployees } from "@/lib/actions"
import { EmployeeManager } from "@/components/admin/EmployeeManager"

export default async function EmployeesPage() {
    const employees = await getEmployees()

    return <EmployeeManager employees={employees} />
}
