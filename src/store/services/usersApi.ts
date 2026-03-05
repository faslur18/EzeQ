import { api } from '../api';

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
};

export const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => '/users',
            providesTags: ['User'],
        }),
        getUserById: builder.query<User, string>({
            query: (id) => `/users/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'User', id }],
        }),
        updateUserRole: builder.mutation<User, { id: string; role: string }>({
            query: ({ id, role }) => ({
                url: `/users/${id}`,
                method: 'PATCH',
                body: { role },
            }),
            invalidatesTags: ['User'],
        }),
        deleteUser: builder.mutation<void, string>({
            query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserRoleMutation,
    useDeleteUserMutation,
} = usersApi;
