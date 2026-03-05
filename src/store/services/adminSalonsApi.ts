import { api } from '../api';

export type AdminSalon = {
    id: string;
    name: string;
    address: string;
    status: string;
    isActive: boolean;
    admin?: { name: string; email: string } | null;
};

export const adminSalonsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAdminSalons: builder.query<AdminSalon[], void>({
            query: () => '/admin/salons',
            providesTags: ['AdminSalon'],
        }),
        updateSalonStatus: builder.mutation<AdminSalon, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/admin/salons/${id}`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['AdminSalon'],
        }),
    }),
});

export const { useGetAdminSalonsQuery, useUpdateSalonStatusMutation } = adminSalonsApi;
