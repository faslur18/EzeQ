"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Icon from "@/components/ui/icon"

interface CustomCalendarProps {
    selected: Date | undefined
    onSelect: (date: Date | undefined) => void
    disabled?: (date: Date) => boolean
    className?: string
}

export function CustomCalendar({ selected, onSelect, disabled, className }: CustomCalendarProps) {
    const [viewDate, setViewDate] = React.useState(selected || new Date())

    const month = viewDate.getMonth()
    const year = viewDate.getFullYear()

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

    const monthName = viewDate.toLocaleString("default", { month: "long" })

    const handlePrevMonth = () => {
        setViewDate(new Date(year, month - 1, 1))
    }

    const handleNextMonth = () => {
        setViewDate(new Date(year, month + 1, 1))
    }

    const isToday = (d: number) => {
        const today = new Date()
        return d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    }

    const isSelected = (d: number) => {
        return selected && d === selected.getDate() && month === selected.getMonth() && year === selected.getFullYear()
    }

    const isDisabled = (d: number) => {
        if (!disabled) return false
        return disabled(new Date(year, month, d))
    }

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    return (
        <div className={cn("w-full bg-white max-w-xl mx-auto", className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                    {monthName} <span className="text-slate-300 ml-1">{year}</span>
                </h4>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevMonth}
                        className="h-8 w-8 border-2 border-black flex items-center justify-center hover:bg-slate-50 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                        <Icon name="chevron_left" size="sm" />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="h-8 w-8 border-2 border-black flex items-center justify-center hover:bg-slate-50 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                        <Icon name="chevron_right" size="sm" />
                    </button>
                </div>
            </div>

            {/* Weekdays Row */}
            <div className="grid grid-cols-7 mb-1">
                {weekDays.map((day) => (
                    <div key={day} className="text-center py-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 border-t-2 border-l-2 border-black">
                {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} className="h-12 border-r-2 border-b-2 border-black bg-slate-50/50" />
                ))}
                {days.map((d) => {
                    const disabled = isDisabled(d)
                    const selected = isSelected(d)
                    const today = isToday(d)

                    return (
                        <button
                            key={d}
                            disabled={disabled}
                            onClick={() => onSelect(new Date(year, month, d))}
                            className={cn(
                                "h-12 border-r-2 border-b-2 border-black flex flex-col items-center justify-center transition-all relative group",
                                disabled
                                    ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                                    : "bg-white hover:bg-slate-50 text-slate-900",
                                selected && "bg-black text-white z-10 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] translate-x-[-1px] translate-y-[-1px]"
                            )}
                        >
                            {today && !selected && (
                                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                            )}
                            <span className={cn(
                                "text-sm font-black transition-colors",
                                selected ? "text-white group-hover:text-black" : "text-slate-900",
                                disabled && "text-slate-300",
                                !selected && !disabled && "group-hover:text-black"
                            )}>
                                {d}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
