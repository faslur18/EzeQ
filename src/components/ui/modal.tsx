"use client"

import { useEffect } from "react"
import Icon from "@/components/ui/icon"
import PrimaryButton from "@/components/ui/primary-button"
import { cn } from "@/lib/utils"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    icon?: string
    iconBg?: string
    iconColor?: string
    title: string
    description?: React.ReactNode
    children?: React.ReactNode
    primaryActionText?: string
    primaryActionOnClick?: () => void
    primaryActionClassName?: string
    secondaryActionText?: string
    secondaryActionOnClick?: () => void
    maxWidthClass?: string
    hideCloseButton?: boolean
}

export default function Modal({
    isOpen,
    onClose,
    icon,
    iconBg = "bg-primary/10",
    iconColor = "text-primary",
    title,
    description,
    children,
    primaryActionText,
    primaryActionOnClick,
    primaryActionClassName,
    secondaryActionText,
    secondaryActionOnClick,
    maxWidthClass = "max-w-sm",
    hideCloseButton = false
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Backdrop click handler */}
            <div className="absolute inset-0" onClick={onClose} />

            <div className={cn("relative w-full rounded-none border-2 border-black bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200", maxWidthClass)}>
                {!hideCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-slate-400 hover:text-black transition-colors"
                        aria-label="Close"
                    >
                        <Icon name="close" size="sm" />
                    </button>
                )}

                {(icon || title || description) && (
                    <div className="mb-6 flex flex-col items-center text-center">
                        {icon && (
                            <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-full", iconBg, iconColor)}>
                                <Icon name={icon} size="lg" />
                            </div>
                        )}
                        {title && <h2 className="mb-2 text-xl font-bold text-slate-900">{title}</h2>}
                        {description && (
                            <p className="text-sm text-slate-500 text-balance">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                {children && <div className="mb-6">{children}</div>}

                {(primaryActionText || secondaryActionText) && (
                    <div className="flex flex-col gap-3">
                        {primaryActionText && (
                            <PrimaryButton
                                variant="solid"
                                className={cn("rounded-sm", primaryActionClassName)}
                                onClick={primaryActionOnClick}
                            >
                                {primaryActionText}
                            </PrimaryButton>
                        )}
                        {secondaryActionText && (
                            <PrimaryButton
                                variant="outline"
                                onClick={secondaryActionOnClick || onClose}
                                className="rounded-sm border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                            >
                                {secondaryActionText}
                            </PrimaryButton>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
