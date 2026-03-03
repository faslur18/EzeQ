import Icon from "@/components/ui/icon"

interface EmptyStateProps {
    icon: string
    title: string
    description?: string
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <Icon name={icon} size="xl" />
            </div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            {description && (
                <p className="text-xs text-slate-400 mt-1">{description}</p>
            )}
        </div>
    )
}
