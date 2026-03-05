import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthUser = {
    id: string;
    name: string;
    email: string;
    role: string;
};

type AuthState = {
    token: string | null;
    user: AuthUser | null;
};

function loadAuthState(): AuthState {
    if (typeof window === 'undefined') {
        return { token: null, user: null };
    }
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    return {
        token,
        user: userStr ? JSON.parse(userStr) : null,
    };
}

const authSlice = createSlice({
    name: 'auth',
    initialState: loadAuthState(),
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string; user: AuthUser }>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
