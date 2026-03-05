"use client"

import React, { useState } from 'react'
import AuthGuard from '@/components/auth/AuthGuard'
import AdminSidebar from '@/components/layout/admin-sidebar'
import DashboardHeader from '@/components/layout/dashboard-header'
import Icon from '@/components/ui/icon'
import { Card, CardContent } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import Modal from '@/components/ui/modal'
import FormInput from '@/components/ui/form-input'
import PrimaryButton from '@/components/ui/primary-button'
import { useGetMySalonQuery } from '@/store/services/salonsApi'
import {
    useGetServicesQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
    SalonService
} from '@/store/services/servicesApi'

function SalonServicesContent() {
    const { data: adminSalon, isLoading: salonLoading } = useGetMySalonQuery();
    const salonId = adminSalon?.id || "";

    const { data: services, isLoading: servicesLoading } = useGetServicesQuery(salonId, {
        skip: !salonId
    });

    const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
    const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<SalonService | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        duration: "30",
        price: "0"
    });

    const resetForm = () => {
        setFormData({ name: "", duration: "30", price: "0" });
        setSelectedService(null);
    };

    const handleAddClick = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const handleEditClick = (service: SalonService) => {
        setSelectedService(service);
        setFormData({
            name: service.name,
            duration: service.duration.toString(),
            price: service.price.toString()
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (service: SalonService) => {
        setSelectedService(service);
        setIsDeleteModalOpen(true);
    };

    const handleCreate = async () => {
        if (!salonId) return;
        try {
            await createService({
                salonId,
                body: {
                    name: formData.name,
                    duration: parseInt(formData.duration),
                    price: parseFloat(formData.price)
                }
            }).unwrap();
            setIsAddModalOpen(false);
            resetForm();
        } catch (err) {
            console.error("Failed to create service:", err);
        }
    };

    const handleUpdate = async () => {
        if (!salonId || !selectedService) return;
        try {
            await updateService({
                salonId,
                id: selectedService.id,
                body: {
                    name: formData.name,
                    duration: parseInt(formData.duration),
                    price: parseFloat(formData.price)
                }
            }).unwrap();
            setIsEditModalOpen(false);
            resetForm();
        } catch (err) {
            console.error("Failed to update service:", err);
        }
    };

    const handleDelete = async () => {
        if (!salonId || !selectedService) return;
        try {
            await deleteService({
                salonId,
                id: selectedService.id
            }).unwrap();
            setIsDeleteModalOpen(false);
            resetForm();
        } catch (err) {
            console.error("Failed to delete service:", err);
        }
    };

    if (salonLoading || servicesLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="animate-pulse text-lg font-bold text-slate-900">Loading services...</div>
            </div>
        )
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white">
            <AdminSidebar salonName={adminSalon?.name || "Salon"} activePath="/admin/salon-services" />

            <main className="flex flex-1 pt-4 pb-0 flex-col overflow-y-auto overflow-x-hidden bg-slate-50">
                <DashboardHeader
                    title="Salon Services"
                    subtitle="Manage the services your salon offers to customers."
                    mobileName={adminSalon?.name}
                />

                <div className="flex flex-col gap-8 p-4 md:p-8 max-w-5xl mx-auto w-full">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Active Services</h3>
                        <button
                            onClick={handleAddClick}
                            className="bg-black hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-lg"
                        >
                            <Icon name="add" size="sm" />
                            Add New Service
                        </button>
                    </div>

                    <Card className="p-0 overflow-hidden border-2 border-input shadow-none">
                        <CardContent className="p-0">
                            {!services || services.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="bg-slate-50 p-6 rounded-full mb-4 border-2 border-dashed border-slate-200 text-slate-300">
                                        <Icon name="content_cut" size="xl" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900">No services yet</h4>
                                    <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">
                                        Start adding the treatments and services your salon provides.
                                    </p>
                                    <button
                                        onClick={handleAddClick}
                                        className="text-primary font-bold hover:underline"
                                    >
                                        Add your first service
                                    </button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead className="font-bold py-4 pl-6 text-slate-900">Service Name</TableHead>
                                            <TableHead className="font-bold py-4 text-slate-900">Duration</TableHead>
                                            <TableHead className="font-bold py-4 text-slate-900">Price</TableHead>
                                            <TableHead className="font-bold py-4 pr-6 text-right text-slate-900">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {services.map((service) => (
                                            <TableRow key={service.id} className="hover:bg-slate-50/50">
                                                <TableCell className="font-bold pl-6 text-slate-700">{service.name}</TableCell>
                                                <TableCell className="text-slate-500 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Icon name="schedule" size="sm" className="opacity-50" />
                                                        {service.duration} mins
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-900 font-black">
                                                    ${service.price.toFixed(2)}
                                                </TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(service)}
                                                            className="h-9 w-9 flex items-center justify-center rounded-sm bg-slate-100 text-slate-600 hover:bg-black hover:text-white transition-all shadow-sm"
                                                            title="Edit"
                                                        >
                                                            <Icon name="edit" size="sm" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(service)}
                                                            className="h-9 w-9 flex items-center justify-center rounded-sm bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                            title="Delete"
                                                        >
                                                            <Icon name="delete" size="sm" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Add Service Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Service"
                icon="add_circle"
                maxWidthClass="max-w-md"
                primaryActionText={isCreating ? "Adding..." : "Create Service"}
                primaryActionOnClick={handleCreate}
                secondaryActionText="Cancel"
            >
                <div className="flex flex-col gap-4 py-2">
                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase text-slate-500 ml-1">Service Name</label>
                        <FormInput
                            placeholder="e.g. Haircut & Styling"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-slate-500 ml-1">Duration (mins)</label>
                            <FormInput
                                type="number"
                                placeholder="30"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-slate-500 ml-1">Price ($)</label>
                            <FormInput
                                type="number"
                                placeholder="45.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Edit Service Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Service"
                icon="edit"
                maxWidthClass="max-w-md"
                primaryActionText={isUpdating ? "Saving..." : "Save Changes"}
                primaryActionOnClick={handleUpdate}
                secondaryActionText="Cancel"
            >
                <div className="flex flex-col gap-4 py-2">
                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase text-slate-500 ml-1">Service Name</label>
                        <FormInput
                            placeholder="e.g. Haircut & Styling"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-slate-500 ml-1">Duration (mins)</label>
                            <FormInput
                                type="number"
                                placeholder="30"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-slate-500 ml-1">Price ($)</label>
                            <FormInput
                                type="number"
                                placeholder="45.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Service"
                description={<>Are you sure you want to remove <strong>{selectedService?.name}</strong>? This action cannot be undone.</>}
                icon="delete"
                iconBg="bg-rose-50"
                iconColor="text-rose-500"
                primaryActionText={isDeleting ? "Deleting..." : "Delete Service"}
                primaryActionOnClick={handleDelete}
                primaryActionClassName="bg-rose-500 hover:bg-rose-600 border-rose-500"
                secondaryActionText="Keep Service"
            />
        </div>
    )
}

export default function SalonServicesPage() {
    return (
        <AuthGuard allowedRoles={["SALON_ADMIN"]}>
            <SalonServicesContent />
        </AuthGuard>
    )
}