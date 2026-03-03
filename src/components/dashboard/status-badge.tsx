const statusStyles: Record<string, string> = {
    CONFIRMED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-700",
    COMPLETED: "bg-blue-100 text-blue-700",
}

interface StatusBadgeProps {
    status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const style = statusStyles[status] || "bg-slate-100 text-slate-700"
    return (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>
            {status}
        </span>
    )
}
