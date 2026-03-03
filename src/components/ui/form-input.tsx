import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import Icon from "./icon"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    leadingIcon?: string
    trailingIcon?: string
    onTrailingIconClick?: () => void
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ leadingIcon, trailingIcon, onTrailingIconClick, className, ...props }, ref) => {
        return (
            <div className="relative w-full">
                {leadingIcon && (
                    <Icon
                        name={leadingIcon}
                        size="md"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                )}
                <input
                    ref={ref}
                    className={cn(
                        "h-12 w-full rounded-sm border-2 border-input bg-transparent text-base placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all",
                        leadingIcon ? "pl-11 pr-4" : trailingIcon ? "pl-4 pr-11" : "px-4",
                        className
                    )}
                    {...props}
                />
                {trailingIcon && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        onClick={onTrailingIconClick}
                        tabIndex={-1}
                    >
                        <Icon name={trailingIcon} size="md" />
                    </button>
                )}
            </div>
        )
    }
)

FormInput.displayName = "FormInput"
export default FormInput
