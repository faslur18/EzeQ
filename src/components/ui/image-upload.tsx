"use client"

import { useState, useRef } from "react"
import Icon from "@/components/ui/icon"

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    label?: string
    className?: string
    aspectRatio?: "square" | "landscape"
}

export default function ImageUpload({
    value,
    onChange,
    label = "Upload Image",
    className = "",
    aspectRatio = "square",
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [error, setError] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    const aspectClass = aspectRatio === "landscape" ? "aspect-video" : "aspect-square"

    const handleFile = async (file: File) => {
        setError("")
        setUploading(true)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Upload failed")
            }

            const { url } = await res.json()
            onChange(url)
        } catch (err: any) {
            setError(err.message || "Upload failed")
        } finally {
            setUploading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleFile(file)
    }

    const handleRemove = () => {
        onChange("")
        if (inputRef.current) inputRef.current.value = ""
    }

    return (
        <div className={className}>
            {label && (
                <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>
            )}

            {value ? (
                /* ── Preview ── */
                <div className={`relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 ${aspectClass}`}>
                    <img
                        src={value}
                        alt="Uploaded"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 hover:bg-white transition-colors"
                        >
                            <Icon name="edit" size="md" />
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-red-600 hover:bg-white transition-colors"
                        >
                            <Icon name="delete" size="md" />
                        </button>
                    </div>
                </div>
            ) : (
                /* ── Drop Zone ── */
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`cursor-pointer rounded-xl border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-2 p-6 ${aspectClass} ${dragOver
                            ? "border-primary bg-primary/5"
                            : "border-slate-300 bg-slate-50/50 hover:border-primary/50 hover:bg-slate-50"
                        }`}
                >
                    {uploading ? (
                        <>
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <p className="text-sm text-slate-500">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <Icon name="cloud_upload" size="lg" />
                            </div>
                            <p className="text-sm font-medium text-slate-600">
                                Click or drag to upload
                            </p>
                            <p className="text-xs text-slate-400">
                                JPG, PNG, WebP up to 5MB
                            </p>
                        </>
                    )}
                </div>
            )}

            {error && (
                <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleInputChange}
                className="hidden"
            />
        </div>
    )
}
