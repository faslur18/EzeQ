import { api } from '../api';

export type Appointment = {
    id: string;
    customerId: string;
    salonId: string;
    serviceId: string;
    appointmentDate: string;
    startTime: string;
    status: string;
    createdAt?: string;
    // Joined fields from backend
    customer?: { name: string; email: string } | null;
    service?: { name: string; duration: number } | null;
    salon?: { name: string } | null;
};

type CreateAppointmentRequest = {
    salonId: string;
    serviceId: string;
    appointmentDate: string;
    startTime: string;
};

type UpdateAppointmentStatusRequest = { status: string };

export const appointmentsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAppointments: builder.query<Appointment[], void>({
            query: () => '/appointments',
            providesTags: ['Appointment'],
        }),
        getAppointmentById: builder.query<Appointment, string>({
            query: (id) => `/appointments/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Appointment', id }],
        }),
        createAppointment: builder.mutation<Appointment, CreateAppointmentRequest>({
            query: (body) => ({ url: '/appointments', method: 'POST', body }),
            invalidatesTags: ['Appointment'],
        }),
        updateAppointmentStatus: builder.mutation<Appointment, { id: string; body: UpdateAppointmentStatusRequest }>({
            query: ({ id, body }) => ({ url: `/appointments/${id}`, method: 'PATCH', body }),
            invalidatesTags: ['Appointment'],
        }),
        deleteAppointment: builder.mutation<void, string>({
            query: (id) => ({ url: `/appointments/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Appointment'],
        }),
    }),
});

export const {
    useGetAppointmentsQuery,
    useGetAppointmentByIdQuery,
    useCreateAppointmentMutation,
    useUpdateAppointmentStatusMutation,
    useDeleteAppointmentMutation,
} = appointmentsApi;
