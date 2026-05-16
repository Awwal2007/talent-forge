import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ForgotPasswordRequest, LoginRequest, RegisterAdminRequest, RegisterRequest, ResetPasswordRequest, SetPasswordRequest, VerifyEmailRequest } from "../types";
import { authApi } from "../auth";

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginRequest) => authApi.login(data),

        onSuccess: (data) => {
            // Store JWT
            localStorage.setItem("token", data.token);

            // Optionally invalidate user queries
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
    });
};

//
// REGISTER
//
export const useRegister = () => {
    return useMutation({
        mutationFn: (data: RegisterRequest) => authApi.register(data),
    });
};

//
// REGISTER ADMIN
//
export const useRegisterAdmin = () => {
    return useMutation({
        mutationFn: (data: RegisterAdminRequest) =>
            authApi.registerAdmin(data),
    });
};

//
// VERIFY EMAIL
//
export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: (data: VerifyEmailRequest) =>
            authApi.verifyEmail(data),
    });
};

//
// FORGOT PASSWORD
//
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (email: string) =>
            authApi.forgotPassword(email),
    });
};

//
// SET PASSWORD (Authenticated User)
//
export const useSetPassword = () => {
    return useMutation({
        mutationFn: (data: SetPasswordRequest) =>
            authApi.setPassword(data),
    });
};

//
// RESET PASSWORD (With token)
//
export const useResetPassword = () => {
    return useMutation({
        mutationFn: ({ email, token, newPassword }: ResetPasswordRequest) =>
            authApi.resetPassword(email, token, newPassword),
    });
};

//
// LOGOUT
//
export const useLogout = () => {
    const queryClient = useQueryClient();

    return () => {
        localStorage.removeItem("token");
        queryClient.clear();
    };
};
