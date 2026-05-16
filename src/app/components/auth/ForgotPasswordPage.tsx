import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Mail, ArrowLeft } from "lucide-react";
import { useForgotPassword } from "@/api/hooks/useAuth";

interface ForgotPasswordPageProps {
    onBackToLogin: () => void;
}

export function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const { mutate: forgotPassword, isPending } = useForgotPassword();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        forgotPassword(
            email,
            {
                onSuccess: () => {
                    setIsSuccess(true);
                },
                onError: (err: any) => {
                    setError(err.message || "Failed to send reset link");
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
                            Reset Password
                        </h1>
                        <p className="text-gray-600">Enter your email to receive a reset link</p>
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

                    {/* Form / Success State */}
                    {isSuccess ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl mb-6">
                                <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Check your inbox</h3>
                                <p className="text-green-700">
                                    We've sent a password reset link to <br />
                                    <span className="font-medium text-green-900">{email}</span>
                                </p>
                            </div>
                            <button
                                onClick={onBackToLogin}
                                className="text-teal-600 hover:text-teal-700 font-medium"
                            >
                                Back to sign in
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg hover:shadow-lg hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                                {isPending ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
