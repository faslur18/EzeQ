import { api } from '../api';

export type Salon = {
    id: string;
    adminId: string;
    name: string;
    address: string;
    description?: string | null;
    contactPhone?: string | null;
    contactEmail?: string | null;
    profileImage?: string | null;
    coverImage?: string | null;
    rating: number;
    isActive: boolean;
    status: string;
    createdAt?: string;
};

type CreateSalonRequest = {
    name: string;
    address: string;
    description?: string | null;
    contactPhone?: string | null;
    contactEmail?: string | null;
    profileImage?: string | null;
    coverImage?: string | null;
};
type UpdateSalonRequest = {
    name?: string;
    address?: string;
    description?: string | null;
    contactPhone?: string | null;
    contactEmail?: string | null;
    profileImage?: string | null;
    coverImage?: string | null;
};

export const salonsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSalons: builder.query<Salon[], void>({
            query: () => '/salons',
            providesTags: ['Salon'],
        }),
        getSalonById: builder.query<Salon, string>({
            query: (id) => `/salons/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Salon', id }],
        }),
        getMySalon: builder.query<Salon, void>({
            query: () => '/salons/my/salon',
            providesTags: ['Salon'],
        }),
        createSalon: builder.mutation<Salon, CreateSalonRequest>({
            query: (body) => ({ url: '/salons', method: 'POST', body }),
            invalidatesTags: ['Salon'],
        }),
        updateSalon: builder.mutation<Salon, { id: string; body: UpdateSalonRequest }>({
            query: ({ id, body }) => ({ url: `/salons/${id}`, method: 'PATCH', body }),
            invalidatesTags: ['Salon'],
        }),
        deleteSalon: builder.mutation<void, string>({
            query: (id) => ({ url: `/salons/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Salon'],
        }),
    }),
});

export const {
    useGetSalonsQuery,
    useGetSalonByIdQuery,
    useGetMySalonQuery,
    useCreateSalonMutation,
    useUpdateSalonMutation,
    useDeleteSalonMutation,
} = salonsApi;
