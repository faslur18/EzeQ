import { cn } from "@/lib/utils"

interface IconProps {
    name: string
    size?: "sm" | "md" | "lg" | "xl"
    filled?: boolean
    className?: string
}

const sizeMap = {
    sm: "text-[16px]",
    md: "text-[20px]",
    lg: "text-[24px]",
    xl: "text-[32px]",
}

export default function Icon({ name, size = "lg", filled = false, className }: IconProps) {
    return (
        <span
            className={cn(
                "material-symbols-outlined",
                sizeMap[size],
                filled && "icon-filled",
                className
            )}
        >
            {name}
        </span>
    )
}
