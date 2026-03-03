import Link from "next/link"
import React from "react"

interface AuthHeaderProps {
    promptText: string
    buttonHref: string
    buttonText: string
}

export default function AuthHeader({ promptText, buttonHref, buttonText }: AuthHeaderProps) {
    return (
        <header className="w-full border-b border-[#ece7f3] bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="px-6 md:px-10 py-3 flex items-center justify-between max-w-[1440px] mx-auto w-full">
                <Link href="/" className="flex items-center gap-2 text-[#130e1b]">
                    <div className="flex items-center justify-center size-8 rounded bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-2xl">spa</span>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-tight">EzeQ</h2>
                </Link>
                
                <div className="flex items-center gap-3">
                    <span className="text-sm text-[#6b5c7c] hidden sm:inline">{promptText}</span>
                    <Link href={buttonHref}>
                        <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold transition-colors">
                            {buttonText}
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
