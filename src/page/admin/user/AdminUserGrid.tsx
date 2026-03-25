import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Search, UserCog, Users, ShieldAlert } from "lucide-react";
import { useToast } from "../../../component/common/ToastContext";
import LoadingOverlay from "../../../component/others/LoadingOverlay";
import AdminUserForm from "./AdminUserForm";
import {
  deleteUserAPI,
  getAllUsersAPI,
} from "../../../services/service_page/admin";
import type { AdminUser } from "../../../types/admin";
// import bgAdmin from "../../../assets/bgAdmin1.png";

const AdminUserGrid = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsersAPI();
      setUsers(data);
    } catch (error) {
      showToast("Failed to load users.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBackFromForm = () => {
    setShowUserForm(false);
    setEditUser(null);
    fetchUsers();
  };

  const handleEdit = (user: AdminUser) => {
    setEditUser(user);
    setShowUserForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      await deleteUserAPI(deleteId);
      showToast("User deleted successfully.", "success");
      fetchUsers();
    } catch (error) {
      showToast("Failed to delete user.", "error");
    } finally {
      setDeleteId(null);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showUserForm) {
    return <AdminUserForm onBack={handleBackFromForm} editUser={editUser} />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      {/* <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${bgAdmin})` }}
      /> */}

      <div className="relative z-10">
        {loading && <LoadingOverlay />}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert size={22} className="text-red-500" />
              </div>
              <h2 className="text-base font-bold text-slate-800 mb-1">
                Delete User?
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition active:scale-95"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2 rounded-xl text-sm font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-color)] flex items-center justify-center shadow-md">
                <UserCog size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Users
                </h1>
                <p className="text-slate-400 text-sm">
                  Manage and organise all registered users
                </p>
              </div>
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-[var(--primary-color)] via-slate-200 to-transparent" />
          </div>

          {/* Stats Bar */}
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-sm text-slate-600 shadow-sm">
              <Users size={13} className="text-[var(--primary-color)]" />
              <span>
                <strong className="text-slate-800">{users.length}</strong> total users
              </span>
            </div>
            {searchTerm && (
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm text-blue-600">
                <Search size={13} />
                <span>
                  <strong>{filteredUsers.length}</strong> results for "{searchTerm}"
                </span>
              </div>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent shadow-sm transition"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => {
                setEditUser(null);
                setShowUserForm(true);
              }}
              className="inline-flex items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <Plus size={16} />
              Add User
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      S.No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      UUID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-white/80">
                      Edit
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-white/80">
                      Delete
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <UserCog size={24} className="text-slate-300" />
                          </div>
                          <p className="text-sm font-medium">No users found</p>
                          <p className="text-xs text-slate-300">
                            Try adjusting your search or add a new user
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                          {index + 1}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        <span className="hidden lg:inline bg-slate-100 px-2 py-1 rounded-lg">
                          {user.id}
                        </span>
                        <span className="lg:hidden bg-slate-100 px-2 py-1 rounded-lg">
                          {user.id.substring(0, 8)}…
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="font-semibold text-slate-800 text-sm">
                            {user.firstName} {user.lastName || ""}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center text-xs font-semibold rounded-full px-3 py-1 ${
                            user.isActive
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              user.isActive ? "bg-emerald-500" : "bg-red-400"
                            }`}
                          />
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            if (user.role !== "ADMIN") handleEdit(user);
                          }}
                          disabled={user.role === "ADMIN"}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 ${
                            user.role === "ADMIN"
                              ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                              : "bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 hover:scale-110"
                          }`}
                        >
                          <Pencil size={14} />
                        </button>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            if (user.role !== "ADMIN") setDeleteId(user.id);
                          }}
                          disabled={user.role === "ADMIN"}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 ${
                            user.role === "ADMIN"
                              ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                              : "bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 hover:scale-110"
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            {filteredUsers.length > 0 && (
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredUsers.length === 0 && (
              <div className="flex flex-col items-center gap-3 text-slate-400 py-16">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <UserCog size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-medium">No users found</p>
              </div>
            )}

            {filteredUsers.map((user, index) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[var(--primary-color)]/10 flex items-center justify-center">
                      <UserCog size={16} className="text-[var(--primary-color)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {user.firstName} {user.lastName || ""}
                      </p>
                      <p className="text-xs text-slate-400">#{index + 1}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (user.role !== "ADMIN") handleEdit(user);
                      }}
                      disabled={user.role === "ADMIN"}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                        user.role === "ADMIN"
                          ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                          : "bg-blue-50 text-blue-500 hover:bg-blue-100"
                      }`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (user.role !== "ADMIN") setDeleteId(user.id);
                      }}
                      disabled={user.role === "ADMIN"}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                        user.role === "ADMIN"
                          ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                          : "bg-red-50 text-red-400 hover:bg-red-100"
                      }`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-500 mb-2">{user.email}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span
                    className={`inline-flex items-center text-xs font-semibold rounded-full px-3 py-1 ${
                      user.isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        user.isActive ? "bg-emerald-500" : "bg-red-400"
                      }`}
                    />
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    {user.id.substring(0, 10)}…
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminUserGrid;