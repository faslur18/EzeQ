import { api } from '../api';

type LoginRequest = { email: string; password: string };
type LoginResponse = {
    access_token: string;
    user: { id: string; name: string; email: string; role: string };
};

type RegisterRequest = { name: string; email: string; password: string; role?: string };
type RegisterResponse = { message: string };

type UserProfile = { id: string; name: string; email: string; role: string; createdAt: string };

type UpdateProfileRequest = { name?: string; email?: string; password?: string };
type UpdateProfileResponse = { message: string; user: UserProfile };

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
        }),
        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
        }),
        getProfile: builder.query<UserProfile, void>({
            query: () => '/auth/profile',
            providesTags: ['Profile'],
        }),
        updateProfile: builder.mutation<UpdateProfileResponse, UpdateProfileRequest>({
            query: (body) => ({ url: '/auth/profile', method: 'PUT', body }),
            invalidatesTags: ['Profile'],
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGetProfileQuery, useUpdateProfileMutation } = authApi;
