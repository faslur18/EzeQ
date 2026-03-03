import { cn } from "@/lib/utils"
import FormInput from "./form-input"

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    leadingIcon?: string
    trailingIcon?: string
    onTrailingIconClick?: () => void
    containerClassName?: string
}

export default function FormField({
    label,
    leadingIcon,
    trailingIcon,
    onTrailingIconClick,
    containerClassName,
    ...inputProps
}: FormFieldProps) {
    return (
        <label className={cn("flex flex-col gap-2", containerClassName)}>
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <FormInput
                leadingIcon={leadingIcon}
                trailingIcon={trailingIcon}
                onTrailingIconClick={onTrailingIconClick}
                {...inputProps}
            />
        </label>
    )
}
