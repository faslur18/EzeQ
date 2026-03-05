"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { RootState } from "@/store/store"
import AuthHeader from "@/components/auth/AuthHeader"
import FormField from "@/components/ui/form-field"
import PrimaryButton from "@/components/ui/primary-button"
import Icon from "@/components/ui/icon"
import { useLoginMutation } from "@/store/services/authApi"
import { setCredentials } from "@/store/authSlice"
import GuestGuard from "@/components/auth/GuestGuard"

function LoginContent() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [login] = useLoginMutation()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const result = await login({ email, password }).unwrap()

            dispatch(setCredentials({
                token: result.access_token,
                user: result.user,
            }))

            const role = result.user.role
            if (role === "SUPER_ADMIN") {
                router.push("/superadmin/dashboard")
            } else if (role === "SALON_ADMIN") {
                router.push("/admin/dashboard")
            } else {
                router.push("/dashboard")
            }
        } catch (err: any) {
            setError(err?.data?.message || "Invalid email or password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="font-sans bg-white bg-nothing-grid min-h-screen flex flex-col selection:bg-primary/20">
            <AuthHeader
                promptText="New to EzeQ?"
                buttonHref="/auth/register"
                buttonText="Sign Up"
            />

            {/* Main Content */}
            <main className="flex-1 w-full flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-[1200px] bg-white rounded-none border-2 border-input overflow-hidden min-h-[600px] flex flex-col md:flex-row">

                    {/* Left Side: Form */}
                    <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-16">
                        <div className="w-full max-w-[400px] mx-auto">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-[#130e1b] mb-2">Welcome Back</h1>
                                <p className="text-[#6b5c7c]">Please enter your details to sign into your account.</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 font-medium">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <FormField
                                    label="Email Address"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    leadingIcon="mail"
                                    required
                                />

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">Password</span>
                                        <Link className="text-xs font-medium text-primary hover:text-primary/80" href="#">Forgot Password?</Link>
                                    </div>
                                    <FormField
                                        label=""
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        leadingIcon="lock"
                                        containerClassName="!gap-0"
                                        required
                                    />
                                </div>

                                <div className="pt-2">
                                    <PrimaryButton type="submit" loading={loading} loadingText="Logging in...">
                                        Log In
                                    </PrimaryButton>
                                </div>
                            </form>

                            <p className="mt-8 text-center text-sm text-[#6b5c7c]">
                                Don&apos;t have an account?
                                <Link className="font-bold text-primary hover:underline ml-1" href="/auth/register">Sign up for free</Link>
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Image */}
                    <div className="hidden md:block w-1/2 relative bg-gray-100">
                        <img alt="Modern salon interior" className="absolute inset-0 w-full h-full object-cover" src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop" />
                        <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent mix-blend-multiply opacity-60"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-10">
                            <div className="backdrop-blur-sm bg-black/60 p-6 border-2 border-white/20">
                                <div className="flex gap-1 mb-3 text-primary">
                                    <Icon name="star" size="sm" filled />
                                    <Icon name="star" size="sm" filled />
                                    <Icon name="star" size="sm" filled />
                                    <Icon name="star" size="sm" filled />
                                    <Icon name="star" size="sm" filled />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-white">&quot;The best booking experience ever.&quot;</h3>
                                <p className="text-white/90 font-light">Join over 2,000 salons managing their business with EzeQ. Seamless, easy, and stark.</p>
                                <div className="mt-4 flex items-center gap-3">
                                    <div>
                                        <p className="text-sm font-bold text-white">Sarah Jenkins</p>
                                        <p className="text-xs opacity-80 text-white">Owner of Glow Studio</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function LoginPage() {
    return (
        <GuestGuard>
            <LoginContent />
        </GuestGuard>
    )
}

