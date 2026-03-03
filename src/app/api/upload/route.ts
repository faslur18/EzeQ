import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
                { status: 400 }
            )
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 5MB" },
                { status: 400 }
            )
        }

        // Ensure upload directory exists
        await mkdir(UPLOAD_DIR, { recursive: true })

        // Generate unique filename
        const ext = file.name.split(".").pop() || "jpg"
        const filename = `${randomUUID()}.${ext}`
        const filepath = path.join(UPLOAD_DIR, filename)

        // Write file to disk
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filepath, buffer)

        // Return the public URL
        const url = `/uploads/${filename}`
        return NextResponse.json({ url, filename })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}
