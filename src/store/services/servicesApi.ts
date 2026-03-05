import { api } from '../api';

export type SalonService = {
    id: string;
    salonId: string;
    name: string;
    duration: number;
    price: number;
};

type CreateServiceRequest = { name: string; duration: number; price: number };
type UpdateServiceRequest = { name?: string; duration?: number; price?: number };

export const servicesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getServices: builder.query<SalonService[], string>({
            query: (salonId) => `/salons/${salonId}/services`,
            providesTags: ['Service'],
        }),
        getServiceById: builder.query<SalonService, { salonId: string; id: string }>({
            query: ({ salonId, id }) => `/salons/${salonId}/services/${id}`,
            providesTags: (_result, _err, { id }) => [{ type: 'Service', id }],
        }),
        createService: builder.mutation<SalonService, { salonId: string; body: CreateServiceRequest }>({
            query: ({ salonId, body }) => ({
                url: `/salons/${salonId}/services`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Service'],
        }),
        updateService: builder.mutation<SalonService, { salonId: string; id: string; body: UpdateServiceRequest }>({
            query: ({ salonId, id, body }) => ({
                url: `/salons/${salonId}/services/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Service'],
        }),
        deleteService: builder.mutation<void, { salonId: string; id: string }>({
            query: ({ salonId, id }) => ({
                url: `/salons/${salonId}/services/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Service'],
        }),
    }),
});

export const {
    useGetServicesQuery,
    useGetServiceByIdQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} = servicesApi;
