import Icon from "@/components/ui/icon"
import { cn } from "@/lib/utils"

interface ServiceCardProps {
    id: string
    name: string
    duration: number
    price: number
    isSelected: boolean
    onSelect: (id: string) => void
}

export default function ServiceCard({ id, name, duration, price, isSelected, onSelect }: ServiceCardProps) {
    return (
        <div
            onClick={() => onSelect(id)}
            className={cn(
                "group cursor-pointer border-2 p-4 transition-all flex items-center justify-between",
                isSelected
                    ? "border-black bg-slate-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "border-input bg-white hover:border-slate-300"
            )}
        >
            <div className="flex items-center gap-4">
                <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-sm transition-colors",
                    isSelected ? "bg-black text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                )}>
                    {isSelected ? (
                        <Icon name="check_circle" size="md" />
                    ) : (
                        <Icon name="content_cut" size="md" />
                    )}
                </div>
                <div>
                    <h4 className="font-bold text-slate-900">{name}</h4>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Icon name="schedule" size="sm" />
                        {duration} mins
                    </p>
                </div>
            </div>
            <div className="text-right">
                <div className="text-lg font-black text-slate-900">${price}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Price</div>
            </div>
        </div>
    )
}
