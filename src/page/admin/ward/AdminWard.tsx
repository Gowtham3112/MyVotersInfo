import { useState, useEffect } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import AdminWardModel from "./AdminWardModel";
import DeleteModal from "../../../component/common/DeleteModel";
import LoadingOverlay from "../../../component/others/LoadingOverlay";
import { useToast } from "../../../component/common/ToastContext";

import {
  getWardsAPI,
  deleteWardAPI,
} from "../../../services/service_page/ward";

import type { Ward } from "../../../types/ward";

const AdminWard = () => {
  const { showToast } = useToast();

  const [warsList, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Ward | undefined>();

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  // ---------------- FETCH WARDS ----------------
  const fetchWards = async () => {
    try {
      setLoading(true);

      const res = await getWardsAPI(page, limit, searchTerm, sortBy, order);

      setWards(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalRecords(res.pagination.total);
    } catch (error) {
      showToast("Failed to load wards", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, [page, searchTerm, limit, sortBy, order]);

  const handleSort = (field: string) => {
    setPage(1);

    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteWardAPI(deleteId);
      showToast("Ward deleted successfully", "success");
      setDeleteId(null);
      fetchWards();
    } catch {
      showToast("Failed to delete ward", "error");
    }
  };

  // Visible page numbers (max 5)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading && <LoadingOverlay />}

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-color)] flex items-center justify-center shadow-md">
                <MapPin size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Ward No (வார்டு எண்)
                </h1>
                <p className="text-slate-400 text-sm">
                  Manage and organise all registered ward numbers
                </p>
              </div>
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-[var(--primary-color)] via-slate-200 to-transparent" />
          </div>

          {/* Stats Bar */}
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-sm text-slate-600 shadow-sm">
              <MapPin size={13} className="text-[var(--primary-color)]" />
              <span>
                <strong className="text-slate-800">{totalRecords}</strong> total
                wards (வார்டு எண்ணிக்கை)
              </span>
            </div>
            {searchTerm && (
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm text-blue-600">
                <Search size={13} />
                <span>Results for "{searchTerm}"</span>
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
                placeholder="Search ward..."
                value={searchTerm}
                onChange={(e) => {
                  setPage(1);
                  setSearchTerm(e.target.value);
                }}
                className="w-full sm:w-72 pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent shadow-sm transition"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => {
                setEditData(undefined);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <Plus size={16} />
              Add Ward No
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[1000px] w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      S.No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      Category (உள்ளாட்சி அமைப்பு)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      <div
                        onClick={() => handleSort("partName")}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        Part No (பாகம் எண்)
                        {sortBy === "partName"
                          ? order === "asc"
                            ? "🔼"
                            : "🔽"
                          : " ⇅"}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      <div
                        onClick={() => handleSort("wardNo")}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        Ward No (வார்டு எண்)
                        {sortBy === "wardNo"
                          ? order === "asc"
                            ? "🔼"
                            : "🔽"
                          : " ⇅"}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80 hidden">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      Date Created
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
                  {warsList.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <MapPin size={24} className="text-slate-300" />
                          </div>
                          <p className="text-sm font-medium">No wards found</p>
                          <p className="text-xs text-slate-300">
                            Try adjusting your search or add a new ward
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {warsList.map((ward, index) => (
                    <tr
                      key={ward.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                          {(page - 1) * limit + index + 1}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {ward.category?.name ? (
                          <span className="inline-flex items-center text-xs font-medium bg-[var(--primary-color)]/10 text-[var(--primary-color)] rounded-full px-3 py-1">
                            {ward.category.name}
                          </span>
                        ) : (
                          <span className="text-slate-300 italic text-sm">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {ward.part?.name ? (
                          <span className="inline-flex items-center text-xs font-medium bg-slate-100 text-slate-600 rounded-full px-3 py-1">
                            {ward.part.name}
                          </span>
                        ) : (
                          <span className="text-slate-300 italic text-sm">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="font-semibold text-slate-800 text-sm">
                            {ward.wardNo}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600 hidden">
                        {ward.description || (
                          <span className="text-slate-300 italic">
                            No description
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center text-xs text-slate-500 bg-slate-100 rounded-full px-3 py-1">
                          {new Date(ward.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setEditData(ward);
                            setIsModalOpen(true);
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-all duration-150 hover:scale-110"
                        >
                          <Pencil size={14} />
                        </button>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setDeleteId(ward.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all duration-150 hover:scale-110"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              {/* Total + Rows per page */}
              <div className="flex items-center gap-4">
                <p className="text-xs text-slate-500">
                  <strong className="text-slate-700">{totalRecords}</strong>{" "}
                  total records
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Rows:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setPage(1);
                      setLimit(Number(e.target.value));
                    }}
                    className="border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Page Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={15} />
                </button>

                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-semibold transition ${
                      page === pageNumber
                        ? "bg-[var(--primary-color)] border-[var(--primary-color)] text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

          <AdminWardModel
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchWards}
            defaultValue={editData}
          />
        </div>
      </div>

      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default AdminWard;
