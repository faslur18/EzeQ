import { cn } from "@/lib/utils"

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
    loadingText?: string
    variant?: "solid" | "ghost" | "outline"
    size?: "sm" | "md" | "lg"
}

const variantStyles = {
    solid: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "bg-transparent text-primary hover:bg-slate-100 dark:hover:bg-slate-800",
    outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
}

const sizeStyles = {
    sm: "h-9 px-4 text-sm",
    md: "h-12 px-6 text-base",
    lg: "h-14 px-8 text-base",
}

export default function PrimaryButton({
    loading = false,
    loadingText,
    variant = "solid",
    size = "md",
    disabled,
    children,
    className,
    ...props
}: PrimaryButtonProps) {
    return (
        <button
            className={cn(
                "flex w-full items-center justify-center rounded-full font-bold transition-all active:scale-[0.98]",
                variantStyles[variant],
                sizeStyles[size],
                (disabled || loading) && "opacity-70 cursor-not-allowed active:scale-100",
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (loadingText || "Please wait...") : children}
        </button>
    )
}
