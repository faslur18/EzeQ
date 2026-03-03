import Icon from "@/components/ui/icon"

interface DashboardHeaderProps {
    title: string
    subtitle?: string
    mobileName?: string
    children?: React.ReactNode
}

export default function DashboardHeader({ title, subtitle, mobileName, children }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 backdrop-blur-md md:static md:border-b-0 md:bg-transparent md:px-8">
            {/* Mobile Header */}
            <div className="flex items-center gap-4 md:hidden">
                <button className="text-slate-500 hover:text-slate-900">
                    <Icon name="menu" />
                </button>
                <span className="text-lg font-bold">{mobileName || title}</span>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex flex-col">
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>

            {/* Right-side Actions */}
            <div className="flex items-center gap-4">
                {children || (
                    <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 hover:bg-gray-50 hover:text-slate-900 border border-slate-200 shadow-sm">
                        <Icon name="notifications" />
                    </button>
                )}
            </div>
        </header>
    )
}
