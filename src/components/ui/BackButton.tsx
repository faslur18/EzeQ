"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Icon from "@/components/ui/icon"

interface BackButtonProps {
    className?: string
    label?: string
}

export default function BackButton({ className, label }: BackButtonProps) {
    const router = useRouter()

    return (
        <button
            onClick={() => router.back()}
            className={cn(
                "group flex items-center gap-3 transition-all active:translate-x-[2px] active:translate-y-[2px]",
                className
            )}
        >
            <div className="h-10 w-10 border-2 border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-slate-50 transition-colors">
                <Icon name="arrow_back" size="sm" className="text-black" />
            </div>
            {label && (
                <span className="font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-black transition-colors">
                    {label}
                </span>
            )}
        </button>
    )
}
