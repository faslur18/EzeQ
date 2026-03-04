import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    findAll(userId: string, userRole: string): Promise<{
        salons: {
            id: string;
            adminId: string;
            name: string;
            address: string;
            rating: number | null;
            isActive: boolean | null;
            status: string;
        } | null;
        services: {
            id: string;
            salonId: string;
            name: string;
            duration: number;
            price: number;
        } | null;
        appointments: {
            id: string;
            customerId: string;
            salonId: string;
            serviceId: string;
            appointmentDate: string;
            startTime: string;
            status: string;
            createdAt: Date;
        };
    }[] | {
        users: {
            id: string;
            name: string | null;
            email: string;
            password: string;
            role: string;
            createdAt: Date;
        } | null;
        services: {
            id: string;
            salonId: string;
            name: string;
            duration: number;
            price: number;
        } | null;
        appointments: {
            id: string;
            customerId: string;
            salonId: string;
            serviceId: string;
            appointmentDate: string;
            startTime: string;
            status: string;
            createdAt: Date;
        };
    }[]>;
    findOne(id: string, userId: string, userRole: string): Promise<{
        salons: {
            id: string;
            adminId: string;
            name: string;
            address: string;
            rating: number | null;
            isActive: boolean | null;
            status: string;
        } | null;
        services: {
            id: string;
            salonId: string;
            name: string;
            duration: number;
            price: number;
        } | null;
        appointments: {
            id: string;
            customerId: string;
            salonId: string;
            serviceId: string;
            appointmentDate: string;
            startTime: string;
            status: string;
            createdAt: Date;
        };
    }>;
    create(userId: string, dto: CreateAppointmentDto): Promise<{
        id: string;
        customerId: string;
        salonId: string;
        serviceId: string;
        appointmentDate: string;
        startTime: string;
        status: string;
        createdAt: Date;
    }>;
    updateStatus(id: string, userId: string, userRole: string, dto: UpdateAppointmentStatusDto): Promise<{
        id: string;
        customerId: string;
        salonId: string;
        serviceId: string;
        appointmentDate: string;
        startTime: string;
        status: string;
        createdAt: Date;
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
}
