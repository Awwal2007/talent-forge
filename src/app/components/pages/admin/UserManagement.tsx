import { useState } from "react";
import {
    UserPlus,
    Shield,
    Edit,
    Trash2,
    Ban,
    CheckCircle,
    Search,
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { useRegisterAdmin } from "@/api/hooks/useAuth";
import { toast } from "sonner";
import { useGetRole, useGetUser } from "@/api/hooks/useRole";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string | null;
    roles: string[];
    emailConfirmed: boolean;
    dateCreated: string;
    isActive: boolean;
}

export function UserManagement() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const { mutate: registerAdmin, isPending } = useRegisterAdmin();
    const { data: roleOptions = [] } = useGetRole();
    const { data: users = [] } = useGetUser();

    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
    });

    const handleCreateUser = () => {
        registerAdmin(
            {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                roleName: newUser.role,
            },
            {
                onSuccess: () => {
                    setShowCreateModal(false);
                    setNewUser({ firstName: "", lastName: "", email: "", role: "" });
                    toast.success("User created successfully");
                },
                onError: (err: any) => {
                    toast.error(err?.message || "Failed to create user");
                },
            }
        );
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "Recruiter": return "bg-teal-100 text-teal-700 border-teal-300";
            case "Applicant": return "bg-emerald-100 text-emerald-700 border-emerald-300";
            case "Administrator": return "bg-amber-100 text-amber-700 border-amber-300";
            default: return "bg-gray-100 text-gray-600 border-gray-300";
        }
    };

    const filteredUsers = users.filter((user: User) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const matchesSearch =
            fullName.includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole =
            roleFilter === "all" || user.roles.includes(roleFilter);
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && user.isActive) ||
            (statusFilter === "inactive" && !user.isActive);
        return matchesSearch && matchesRole && matchesStatus;
    });

    const stats = {
        total: users.length,
        administrators: users.filter((u: User) => u.roles.includes("Administrator")).length,
        recruiters: users.filter((u: User) => u.roles.includes("Recruiter")).length,
        applicants: users.filter((u: User) => u.roles.includes("Applicant")).length,
        active: users.filter((u: User) => u.isActive).length,
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">User Management</h1>
                    <p className="text-gray-600">Manage all users on the platform</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2"
                >
                    <UserPlus className="w-5 h-5" />
                    Create New User
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Total Users</div>
                    <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="text-sm text-amber-600 mb-1">Admins</div>
                    <div className="text-2xl font-semibold text-amber-700">{stats.administrators}</div>
                </div>
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                    <div className="text-sm text-teal-600 mb-1">Recruiters</div>
                    <div className="text-2xl font-semibold text-teal-700">{stats.recruiters}</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <div className="text-sm text-emerald-600 mb-1">Applicants</div>
                    <div className="text-2xl font-semibold text-emerald-700">{stats.applicants}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-green-600 mb-1">Active</div>
                    <div className="text-2xl font-semibold text-green-700">{stats.active}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">All Roles</option>
                        {roleOptions.map((role: string) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Email Confirmed</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user: User) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.length > 0 ? user.roles.map((role) => (
                                                <Badge key={role} className={`${getRoleBadgeColor(role)} border`}>
                                                    {role === "Administrator" && <Shield className="w-3 h-3 mr-1" />}
                                                    {role}
                                                </Badge>
                                            )) : (
                                                <span className="text-xs text-gray-400">No role</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={user.emailConfirmed
                                            ? "bg-green-100 text-green-700 border-0"
                                            : "bg-gray-100 text-gray-500 border-0"
                                        }>
                                            {user.emailConfirmed ? "Confirmed" : "Pending"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={user.isActive
                                            ? "bg-green-100 text-green-700 border-0"
                                            : "bg-red-100 text-red-700 border-0"
                                        }>
                                            {user.isActive
                                                ? <><CheckCircle className="w-3 h-3 mr-1" />Active</>
                                                : <><Ban className="w-3 h-3 mr-1" />Inactive</>
                                            }
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.dateCreated).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Edit user"
                                            >
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button
                                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                                title="Delete user"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No users found matching your filters.
                        </div>
                    )}
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-full sm:max-w-md w-full mx-4">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create New User</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={newUser.firstName}
                                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={newUser.lastName}
                                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="john@example.com"
                                />
                                <p className="text-xs text-gray-500 mt-1">A temporary password will be sent to this email</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="">Select a role</option>
                                    {roleOptions
                                        .filter((r: string) => r !== "Administrator")
                                        .map((role: string) => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCreateUser}
                                disabled={isPending || !newUser.role || !newUser.email}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Creating..." : "Create User"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setNewUser({ firstName: "", lastName: "", email: "", role: "" });
                                }}
                                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
