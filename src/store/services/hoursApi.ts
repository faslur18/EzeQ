import { api } from '../api';

export type OperatingHour = {
    id: string;
    salonId: string;
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
};

type SetHoursRequest = {
    hours: { dayOfWeek: number; openTime: string; closeTime: string }[];
};

type UpdateHourRequest = { openTime?: string; closeTime?: string };

export const hoursApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getHours: builder.query<OperatingHour[], string>({
            query: (salonId) => `/salons/${salonId}/hours`,
            providesTags: ['Hour'],
        }),
        setHours: builder.mutation<OperatingHour[], { salonId: string; body: SetHoursRequest }>({
            query: ({ salonId, body }) => ({
                url: `/salons/${salonId}/hours`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Hour'],
        }),
        updateHour: builder.mutation<OperatingHour, { salonId: string; id: string; body: UpdateHourRequest }>({
            query: ({ salonId, id, body }) => ({
                url: `/salons/${salonId}/hours/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Hour'],
        }),
        deleteHour: builder.mutation<void, { salonId: string; id: string }>({
            query: ({ salonId, id }) => ({
                url: `/salons/${salonId}/hours/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Hour'],
        }),
    }),
});

export const {
    useGetHoursQuery,
    useSetHoursMutation,
    useUpdateHourMutation,
    useDeleteHourMutation,
} = hoursApi;
