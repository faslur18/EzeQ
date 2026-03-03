"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AuthHeader from "@/components/auth/AuthHeader"
import FormField from "@/components/ui/form-field"
import PrimaryButton from "@/components/ui/primary-button"
import Icon from "@/components/ui/icon"

export default function RegisterPage() {
    const router = useRouter()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("CUSTOMER")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `${firstName} ${lastName}`.trim(),
                    email,
                    password,
                    role
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Registration failed")
            }

            router.push("/auth/login?registered=true")
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white bg-nothing-grid selection:bg-primary/20 selection:text-primary font-sans antialiased text-slate-900">
            <AuthHeader
                promptText="Already have an account?"
                buttonHref="/auth/login"
                buttonText="Log In"
            />

            <div className="flex flex-1 justify-center py-10 px-4 md:px-6">
                <div className="flex w-full max-w-[1000px] flex-col md:flex-row gap-12">

                    {/* Left Column: Hero Text & Image */}
                    <div className="flex flex-1 flex-col justify-center gap-6">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-slate-900">
                                Join <span className="text-primary">EzeQ</span>
                            </h1>
                            <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                                Create an account to book your next appointment or manage your salon business with ease. Join thousands of happy customers today.
                            </p>
                        </div>
                        <div className="mt-4 hidden md:block w-full h-64 rounded-2xl overflow-hidden relative shadow-lg">
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10 flex items-end p-6">
                                <p className="text-white font-medium">Trusted by over 500+ top salons.</p>
                            </div>
                            <img alt="Modern bright salon interior with chairs" className="h-full w-full object-cover" src="https://naomisheadmasters.com/wp-content/uploads/2023/10/Top-10-Salons-In-India.jpg" />
                        </div>
                    </div>

                    {/* Right Column: Registration Form */}
                    <div className="flex flex-1 flex-col">
                        <div className="bg-white rounded-none border-2 border-input overflow-hidden h-full flex flex-col justify-center">

                            {/* Role Selection */}
                            <div className="p-6 md:p-8 border-b-2 border-input bg-transparent">
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">I want to...</p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <RoleCard
                                        icon="calendar_month"
                                        label="Book a Service"
                                        value="CUSTOMER"
                                        selected={role === "CUSTOMER"}
                                        onSelect={() => setRole("CUSTOMER")}
                                    />
                                    <RoleCard
                                        icon="storefront"
                                        label="List my Salon"
                                        value="SALON_ADMIN"
                                        selected={role === "SALON_ADMIN"}
                                        onSelect={() => setRole("SALON_ADMIN")}
                                    />
                                </div>
                            </div>

                            {/* Form Fields */}
                            <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-5">
                                {error && (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 font-medium">
                                        {error}
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-5">
                                    <FormField
                                        label="First Name"
                                        placeholder="Jane"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        containerClassName="flex-1"
                                        required
                                    />
                                    <FormField
                                        label="Last Name"
                                        placeholder="Doe"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        containerClassName="flex-1"
                                        required
                                    />
                                </div>

                                <FormField
                                    label="Email Address"
                                    placeholder="jane.doe@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    leadingIcon="mail"
                                    required
                                />

                                <FormField
                                    label="Password"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    trailingIcon="visibility_off"
                                    required
                                />

                                <div className="flex items-start gap-3 mt-2">
                                    <div className="relative flex h-5 w-5 items-center justify-center mt-0.5">
                                        <input
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-slate-50 transition-all checked:border-primary checked:bg-primary hover:border-primary focus:ring-primary/20"
                                            id="terms"
                                            type="checkbox"
                                            required
                                        />
                                        <Icon
                                            name="check"
                                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 !text-[14px] text-white opacity-0 transition-opacity peer-checked:opacity-100"
                                        />
                                    </div>
                                    <label className="text-sm text-slate-500 cursor-pointer select-none leading-tight" htmlFor="terms">
                                        I agree to the <Link className="text-primary hover:underline" href="#">Terms of Service</Link> and <Link className="text-primary hover:underline" href="#">Privacy Policy</Link>.
                                    </label>
                                </div>

                                <div className="mt-4">
                                    <PrimaryButton type="submit" loading={loading} loadingText="Creating Account...">
                                        Create Account
                                    </PrimaryButton>
                                </div>

                                <p className="text-center text-sm text-slate-500 mt-2">
                                    Already have an account? <Link className="font-bold text-primary hover:underline ml-1" href="/auth/login">Log in</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-8 py-8 text-center text-sm text-slate-400 border-t border-slate-200">
                <p>© 2024 EzeQ Inc. All rights reserved.</p>
            </footer>
        </div>
    )
}

/* ── Role Selection Card (local to this page) ── */
function RoleCard({ icon, label, value, selected, onSelect }: {
    icon: string
    label: string
    value: string
    selected: boolean
    onSelect: () => void
}) {
    return (
        <label className={`group relative flex cursor-pointer flex-1 flex-col items-center justify-center gap-2 rounded-sm border-2 p-4 text-center transition-all ${selected ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90' : 'border-input bg-transparent hover:border-black hover:bg-slate-50'}`}>
            <input className="peer sr-only" name="role" type="radio" value={value} checked={selected} onChange={onSelect} />
            <div className={`absolute right-3 top-3 text-primary transition-opacity ${selected ? 'opacity-100' : 'opacity-0'}`}>
                <Icon name="check_circle" size="md" />
            </div>
            <Icon name={icon} size="xl" className={selected ? "text-primary-foreground" : "text-slate-400 group-hover:text-black"} />
            <span className={`text-sm font-bold ${selected ? 'text-primary-foreground' : 'text-slate-500 group-hover:text-black'}`}>{label}</span>
        </label>
    )
}
