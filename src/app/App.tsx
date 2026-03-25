import { useState, useEffect, type ReactNode } from "react";
import {
    Routes,
    Route,
    Navigate,
    useNavigate,
    useLocation,
} from "react-router-dom";
import { LandingPage } from "./components/landing/LandingPage";
import { JobsPage } from "./components/landing/JobsPage";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { RecruiterSidebar } from "./components/Sidebar";
import { ApplicantSidebar } from "./components/ApplicantSidebar";
import { AdminSidebar } from "./components/AdminSidebar";
import { Header } from "./components/Header";
import { Overview } from "./components/pages/Overview";
import { JobPostings } from "./components/pages/JobPostings";
import { Candidates } from "./components/pages/Candidates";
import { Interviews } from "./components/pages/Interviews";
import { AIScreening } from "./components/pages/AIScreening";
import { Profile } from "./components/pages/Profile";
import { ApplicantOverview } from "./components/pages/applicant/ApplicantOverview";
import { BrowseJobs } from "./components/pages/applicant/BrowseJobs";
import { MyApplications } from "./components/pages/applicant/MyApplications";
import { MyInterviews } from "./components/pages/applicant/MyInterviews";
import { TrackApplication } from "./components/pages/applicant/TrackApplication";
import { AdminOverview } from "./components/pages/admin/AdminOverview";
import { UserManagement } from "./components/pages/admin/UserManagement";
import { JobManagement } from "./components/pages/admin/JobManagement";
import { PlatformMetrics } from "./components/pages/admin/PlatformMetrics";
import { AdminSettings } from "./components/pages/admin/AdminSettings";
// Supabase usage disabled — import commented out.
// import { supabase } from "../utils/supabase-client";
import { toast, Toaster } from "sonner";

export type EmployerPage =
    | "overview"
    | "job-postings"
    | "candidates"
    | "interviews"
    | "ai-screening"
    | "inbox"
    | "profile";

export type ApplicantPage =
    | "overview"
    | "browse-jobs"
    | "my-applications"
    | "my-interviews"
    | "track-application";

export type AdminPage =
    | "overview"
    | "user-management"
    | "job-management"
    | "platform-metrics"
    | "settings";

export default function App() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Supabase auth disabled — skip session check and auth subscription.
        setLoading(false);
    }, []);

    const handleLogin = async (_email: string, _password: string) => {
        throw new Error("Supabase auth is disabled in this build.");
    };

    const handleRegister = async (
        _email: string,
        _password: string,
        _name: string,
        _company: string,
        _role: "recruiter" | "applicant" | "Administrator",
    ) => {
        throw new Error("Supabase auth is disabled in this build.");
    };

    const handleLogout = async () => {
        // Supabase sign-out disabled — perform local logout.
        setUser(null);
        navigate("/");
        toast.success("Logged out successfully");
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Protected Dashboard Route Wrapper
    const RecruiterLayout = ({ children }: { children: ReactNode }) => {
        const pathParts = location.pathname.split("/");
        const pageFromUrl = (pathParts[2] || "overview") as EmployerPage;
        const [isSidebarOpen, setIsSidebarOpen] = useState(false);

        return (
            <div className="flex flex-col md:flex-row h-screen bg-gray-50">
                <RecruiterSidebar
                    currentPage={pageFromUrl}
                    onPageChange={(page) => {
                        navigate(`/recruiter/${page}`);
                        setIsSidebarOpen(false);
                    }}
                    onLogout={handleLogout}
                    user={user}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <div className="flex-1 flex flex-col overflow-hidden w-full">
                    <Header
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onToggleSidebar={() => setIsSidebarOpen((s) => !s)}
                    />
                    <main className="flex-1 overflow-y-auto">
                        <div className="w-full max-w-full mx-auto px-4 sm:px-8 py-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        );
    };

    const ApplicantLayout = ({ children }: { children: ReactNode }) => {
        const pathParts = location.pathname.split("/");
        const pageFromUrl = (pathParts[2] || "overview") as ApplicantPage;
        const [isSidebarOpen, setIsSidebarOpen] = useState(false);

        return (
            <div className="flex flex-col md:flex-row h-screen bg-gray-50">
                <ApplicantSidebar
                    currentPage={pageFromUrl}
                    onPageChange={(page) => {
                        navigate(`/applicant/${page}`);
                        setIsSidebarOpen(false);
                    }}
                    onLogout={handleLogout}
                    user={user}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <div className="flex-1 flex flex-col overflow-hidden w-full">
                    <Header
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onToggleSidebar={() => setIsSidebarOpen((s) => !s)}
                    />
                    <main className="flex-1 overflow-y-auto">
                        <div className="w-full max-w-full mx-auto px-4 sm:px-8 py-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        );
    };

    const AdminLayout = ({ children }: { children: ReactNode }) => {
        const pathParts = location.pathname.split("/");
        const pageFromUrl = (pathParts[2] || "overview") as AdminPage;
        const [isSidebarOpen, setIsSidebarOpen] = useState(false);

        return (
            <div className="flex flex-col md:flex-row h-screen bg-gray-50">
                <AdminSidebar
                    currentPage={pageFromUrl}
                    onPageChange={(page) => {
                        navigate(`/admin/${page}`);
                        setIsSidebarOpen(false);
                    }}
                    onLogout={handleLogout}
                    user={user}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <div className="flex-1 flex flex-col overflow-hidden w-full">
                    <Header
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onToggleSidebar={() => setIsSidebarOpen((s) => !s)}
                    />
                    <main className="flex-1 overflow-y-auto">
                        <div className="w-full max-w-full mx-auto px-4 sm:px-8 py-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        );
    };

    return (
        <>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={
                        <LandingPage
                            onEnterApp={() => navigate("/register")}
                            onLogin={() => navigate("/login")}
                            onRegister={() => navigate("/register")}
                            onViewJobs={() => navigate("/jobs")}
                        />
                    }
                />
                <Route
                    path="/jobs"
                    element={
                        <JobsPage
                            onLogin={() => navigate("/login")}
                            onRegister={() => navigate("/register")}
                            onBackToHome={() => navigate("/")}
                        />
                    }
                />
                <Route
                    path="/login"
                    element={
                        user ? (
                            <Navigate
                                to={
                                    user?.user_metadata?.role === "applicant"
                                        ? "/applicant/overview"
                                        : user?.user_metadata?.role === "Administrator"
                                            ? "/admin/overview"
                                            : "/recruiter/overview"
                                }
                                replace
                            />
                        ) : (
                            <LoginPage
                                // onLogin={handleLogin}
                                onBackToLanding={() => navigate("/")}
                                onSwitchToRegister={() => navigate("/register")}
                                onSuccess={(role) => {
                                    if (role === "admin") {
                                        navigate("/admin/overview");
                                        return;
                                    }
                                    if (role === "applicant") {
                                        navigate("/applicant/overview");
                                        return;
                                    }
                                    navigate("/recruiter/overview");
                                }}
                                setUser={setUser}
                            />
                        )
                    }
                />
                <Route
                    path="/register"
                    element={
                        user ? (
                            <Navigate
                                to={
                                    user?.user_metadata?.role === "applicant"
                                        ? "/applicant/overview"
                                        : user?.user_metadata?.role === "Adminstrator"
                                            ? "/admin/overview"
                                            : "/recruiter/overview"
                                }
                                replace
                            />
                        ) : (
                            <RegisterPage
                                onRegister={handleRegister}
                                onBackToLanding={() => navigate("/")}
                                onSwitchToLogin={() => navigate("/login")}
                                onSuccess={() => navigate("/login")}
                            />
                        )
                    }
                />

                {/* Protected Recruiter Routes */}
                <Route
                    path="/recruiter"
                    element={
                        user ? (
                            <Navigate to="/recruiter/overview" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/recruiter/overview"
                    element={
                        user &&
                            user?.user_metadata?.role !== "applicant" &&
                            user?.user_metadata?.role !== "Administrator" ? (
                            <RecruiterLayout>
                                <Overview />
                            </RecruiterLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/recruiter/job-postings"
                    element={
                        user &&
                            user?.user_metadata?.role !== "applicant" &&
                            user?.user_metadata?.role !== "Administrator" ? (
                            <RecruiterLayout>
                                <JobPostings />
                            </RecruiterLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/recruiter/candidates"
                    element={
                        user &&
                            user?.user_metadata?.role !== "applicant" &&
                            user?.user_metadata?.role !== "Administrator" ? (
                            <RecruiterLayout>
                                <Candidates searchQuery={searchQuery} />
                            </RecruiterLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/recruiter/interviews"
                    element={
                        user &&
                            user?.user_metadata?.role !== "applicant" &&
                            user?.user_metadata?.role !== "Administrator" ? (
                            <RecruiterLayout>
                                <Interviews />
                            </RecruiterLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/recruiter/ai-screening"
                    element={
                        user &&
                            user?.user_metadata?.role !== "applicant" &&
                            user?.user_metadata?.role !== "Administrator" ? (
                            <RecruiterLayout>
                                <AIScreening />
                            </RecruiterLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route
                    path="/recruiter/profile"
                    element={
                        user &&
                            user?.user_metadata?.role !== "applicant" &&
                            user?.user_metadata?.role !== "Administrator" ? (
                            <RecruiterLayout>
                                <Profile user={user} />
                            </RecruiterLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Protected Applicant Routes */}
                <Route
                    path="/applicant"
                    element={
                        user?.user_metadata?.role === "applicant" ? (
                            <Navigate to="/applicant/overview" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/applicant/overview"
                    element={
                        user?.user_metadata?.role === "applicant" ? (
                            <ApplicantLayout>
                                <ApplicantOverview />
                            </ApplicantLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/applicant/browse-jobs"
                    element={
                        user?.user_metadata?.role === "applicant" ? (
                            <ApplicantLayout>
                                <BrowseJobs />
                            </ApplicantLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/applicant/my-applications"
                    element={
                        user?.user_metadata?.role === "applicant" ? (
                            <ApplicantLayout>
                                <MyApplications />
                            </ApplicantLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/applicant/my-interviews"
                    element={
                        user?.user_metadata?.role === "applicant" ? (
                            <ApplicantLayout>
                                <MyInterviews />
                            </ApplicantLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/applicant/track-application"
                    element={
                        user?.user_metadata?.role === "applicant" ? (
                            <ApplicantLayout>
                                <TrackApplication />
                            </ApplicantLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Protected Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        user?.user_metadata?.role === "Administrator" ? (
                            <Navigate to="/admin/overview" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/admin/overview"
                    element={
                        user?.user_metadata?.role === "Administrator" ? (
                            <AdminLayout>
                                <AdminOverview />
                            </AdminLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/admin/user-management"
                    element={
                        user?.user_metadata?.role === "Administrator" ? (
                            <AdminLayout>
                                <UserManagement />
                            </AdminLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/admin/job-management"
                    element={
                        user?.user_metadata?.role === "Administrator" ? (
                            <AdminLayout>
                                <JobManagement />
                            </AdminLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/admin/platform-metrics"
                    element={
                        user?.user_metadata?.role === "Administrator" ? (
                            <AdminLayout>
                                <PlatformMetrics />
                            </AdminLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/admin/settings"
                    element={
                        user?.user_metadata?.role === "Administrator" ? (
                            <AdminLayout>
                                <AdminSettings />
                            </AdminLayout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-right" />
        </>
    );
}


