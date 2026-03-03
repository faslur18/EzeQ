import Icon from "@/components/ui/icon"

interface StatsCardProps {
    icon: string
    iconBg: string
    iconColor: string
    label: string
    value: string | number
    badge?: {
        text: string
        color: string
    }
}

export default function StatsCard({ icon, iconBg, iconColor, label, value, badge }: StatsCardProps) {
    return (
        <div className="rounded-sm border-2 border-input bg-white p-5 hover:border-black transition-colors">
            <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-sm ${iconBg} ${iconColor}`}>
                    <Icon name={icon} />
                </div>
                {badge && (
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${badge.color}`}>
                        {badge.text}
                    </span>
                )}
            </div>
            <div className="mt-4">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
        </div>
    )
}
