import { client } from "./client";
import { ApiResponse, LoginRequest, RegisterAdminRequest, RegisterRequest, SetPasswordRequest, VerifyEmailRequest } from "./types";

export const authApi = {
    login: async (data: LoginRequest) => {
        const res = await client.post<ApiResponse<{ message: string }>>(
            "/Account/login",
            data,
        );
        return res.data;
    },
    register: async (data: RegisterRequest) => {
        const res = await client.post<ApiResponse<{ message: string }>>(
            "/Account/register",
            data,
        );
        // console.log(res)
        return res.data;
    },
    registerAdmin: async (data: RegisterAdminRequest) => {
        const res = await client.post<ApiResponse<{ message: string }>>(
            "/Account/register-admin",
            data,
        );
        return res.data;
    },
    verifyEmail: async (data: VerifyEmailRequest) => {
        const res = await client.post<ApiResponse<{ message: string }>>(
            "/Account/verify-email",
            data,
        );
        return res.data;
    },
    forgotPassword: async (email: string) => {
        const res = await client.post<ApiResponse<{ message: string }>>(
            `/Account/forgot-password?email=${email}`,
        );
        return res.data;
    },
    setPassword: async (data: SetPasswordRequest) => {
        const res = await client.post<ApiResponse<{ message: string }>>(
            "/Account/set-password",
            data,
        );
        return res.data;
    },
    resetPassword: async (email: string, token: string, newPassword: string) => {
        const res = await client.post<ApiResponse<{ message: string }>>(
            `/Account/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`,
            {},
        );
        return res.data;
    },
}
