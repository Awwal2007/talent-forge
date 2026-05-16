import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Lock, Eye, EyeOff, ArrowLeft, Mail } from "lucide-react";
import { useResetPassword } from "@/api/hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

interface ResetPasswordPageProps {
    onBackToLogin: () => void;
    onSuccess?: () => void;
}

export function ResetPasswordPage({ onBackToLogin, onSuccess }: ResetPasswordPageProps) {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const emailParam = searchParams.get("email") || "";

    const [email, setEmail] = useState(emailParam);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const isEmailFromUrl = !!emailParam;

    const { mutate: resetPassword, isPending } = useResetPassword();

    useEffect(() => {
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [emailParam]);


    useEffect(() => {
        if (!token) {
            setError("Invalid or missing password reset token. Please request a new link.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Invalid or missing password reset token. Please request a new link.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        resetPassword(
            {
                email,
                token,
                newPassword: password,
            },
            {
                onSuccess: () => {
                    toast.success("Password has been reset successfully. Please log in.");
                    onSuccess?.();
                },
                onError: (err: any) => {
                    setError(err.message || "Failed to reset password. The link might have expired.");
                },
            },
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-teal-200/30 to-green-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <button
                            onClick={onBackToLogin}
                            className="absolute top-8 left-8 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Set New Password
                        </h1>
                        <p className="text-gray-600">Enter your new password below</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email (Always show to ensure user verifies what email they are resetting) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    readOnly={isEmailFromUrl}
                                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                        isEmailFromUrl ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your new password"
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending || !token}
                            className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg hover:shadow-lg hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                        >
                            {isPending ? "Resetting Password..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
