"use client"

import { useEffect, useState } from "react"
import { getAllSalonsForAdmin, updateSalonStatus } from "@/app/actions/admin"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function SuperAdminSalons() {
    const [salons, setSalons] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchSalons = async () => {
        setLoading(true)
        const data = await getAllSalonsForAdmin()
        setSalons(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchSalons()
    }, [])

    const handleStatusChange = async (id: string, status: "APPROVED" | "REJECTED") => {
        await updateSalonStatus(id, status)
        fetchSalons() // Refresh list
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Salon Approvals</h1>

            <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-neutral-50">
                        <TableRow>
                            <TableHead>Salon Name</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Admin</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8">Loading salons...</TableCell></TableRow>
                        ) : salons.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8">No salons found.</TableCell></TableRow>
                        ) : salons.map((salon) => (
                            <TableRow key={salon.id}>
                                <TableCell className="font-medium">{salon.name}</TableCell>
                                <TableCell>{salon.address}</TableCell>
                                <TableCell>{salon?.admin?.name || salon?.admin?.email}</TableCell>
                                <TableCell>
                                    <Badge variant={salon.status === "APPROVED" ? "default" : salon.status === "PENDING" ? "secondary" : "destructive"}>
                                        {salon.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    {salon.status === "PENDING" && (
                                        <>
                                            <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleStatusChange(salon.id, "APPROVED")}>Approve</Button>
                                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleStatusChange(salon.id, "REJECTED")}>Reject</Button>
                                        </>
                                    )}
                                    {salon.status === "APPROVED" && (
                                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleStatusChange(salon.id, "REJECTED")}>Revoke Approval</Button>
                                    )}
                                    {salon.status === "REJECTED" && (
                                        <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleStatusChange(salon.id, "APPROVED")}>Approve</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
