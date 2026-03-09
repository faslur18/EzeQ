"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import Header from "@/components/layout/Header"
import { RootState } from "@/store/store"
import { logout, updateUser } from "@/store/authSlice"
import Icon from "@/components/ui/icon"
import Modal from "@/components/ui/modal"
import { useGetProfileQuery, useUpdateProfileMutation } from "@/store/services/authApi"
import BackButton from "@/components/ui/BackButton"
import AuthGuard from "@/components/auth/AuthGuard"

function ProfileContent() {
    const router = useRouter()
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user)

    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isEditing, setIsEditing] = useState(false)

    const { data: profile, isLoading, refetch } = useGetProfileQuery()
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

    useEffect(() => {
        if (profile) {
            setName(profile.name)
            setEmail(profile.email)
        }
    }, [profile])

    const handleSignOut = () => {
        dispatch(logout())
        router.push("/auth/login")
    }

    const handleSave = async () => {
        try {
            const { user: updatedUser } = await updateProfile({ name, email, password: password || undefined }).unwrap()
            dispatch(updateUser(updatedUser))
            setIsEditing(false)
            setPassword("")
            refetch()
        } catch (error) {
            console.error("Failed to update profile", error)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-none border-4 border-t-black border-r-transparent animate-spin mb-4"></div>
                    <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Loading Profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white bg-nothing-grid font-sans text-slate-900">
            <Header user={user} onSignOut={() => setIsSignOutModalOpen(true)} />

            <div className="max-w-4xl mx-auto px-4 lg:px-8 pt-8 pb-12">
                <div className="mb-8 flex flex-col gap-6">
                    <BackButton label="Back" />
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
                            {profile?.role === 'SALON_ADMIN' ? 'Salon Admin Profile' : 'Your Profile'}
                        </h2>
                        <p className="text-lg text-slate-500 font-medium font-sans">
                            Manage your personal details and account settings.
                        </p>
                    </div>
                </div>

                <div className="border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 bg-slate-100 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
                                <span className="text-4xl font-black text-slate-400 uppercase tracking-tighter">
                                    {profile?.name ? profile.name.charAt(0) : profile?.email?.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-1">{profile?.name}</h3>
                                <div className="inline-flex items-center gap-1 bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-widest">
                                    <Icon name="verified_user" size="sm" />
                                    {profile?.role === 'SALON_ADMIN' ? 'Admin' : 'Customer'}
                                </div>
                            </div>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="border-2 border-black bg-white px-6 py-3 font-bold text-sm tracking-tight hover:bg-slate-50 transition-all flex items-center gap-2 active:translate-x-px active:translate-y-px"
                            >
                                <Icon name="edit" size="sm" />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border-2 border-black px-4 py-3 bg-white focus:outline-hidden focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-bold text-slate-900"
                                    placeholder="Your Name"
                                />
                            ) : (
                                <p className="font-bold text-slate-900 text-lg border-2 border-transparent px-4 py-3 bg-slate-50">{profile?.name || '-'}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border-2 border-black px-4 py-3 bg-white focus:outline-hidden focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-bold text-slate-900"
                                    placeholder="your@email.com"
                                />
                            ) : (
                                <p className="font-bold text-slate-900 text-lg border-2 border-transparent px-4 py-3 bg-slate-50">{profile?.email || '-'}</p>
                            )}
                        </div>

                        {isEditing && (
                            <div className="space-y-2 pt-4 border-t-2 border-slate-100">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Change Password</label>
                                <p className="text-xs text-slate-400 font-medium mb-2">Leave blank if you don't want to change it.</p>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border-2 border-black px-4 py-3 bg-white focus:outline-hidden focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-bold text-slate-900"
                                    placeholder="New password"
                                />
                            </div>
                        )}

                        {isEditing && (
                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={handleSave}
                                    disabled={isUpdating}
                                    className="flex-1 bg-black text-white px-6 py-4 font-black uppercase tracking-widest hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black"
                                >
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false)
                                        setName(profile?.name || "")
                                        setEmail(profile?.email || "")
                                        setPassword("")
                                    }}
                                    disabled={isUpdating}
                                    className="px-6 py-4 font-black uppercase tracking-widest bg-white border-2 border-black text-black hover:bg-slate-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isSignOutModalOpen}
                onClose={() => setIsSignOutModalOpen(false)}
                icon="logout"
                iconBg="bg-red-100"
                iconColor="text-destructive"
                title="Sign Out"
                description="Are you sure you want to sign out?"
                primaryActionText="Yes, Sign Out"
                primaryActionOnClick={handleSignOut}
                primaryActionClassName="bg-destructive hover:bg-destructive/90 text-white border-destructive rounded-sm"
                secondaryActionText="Cancel"
                secondaryActionOnClick={() => setIsSignOutModalOpen(false)}
            />
        </div>
    )
}

export default function ProfilePage() {
    return (
        <AuthGuard allowedRoles={["CUSTOMER", "SALON_ADMIN", "SUPER_ADMIN"]}>
            <ProfileContent />
        </AuthGuard>
    )
}
