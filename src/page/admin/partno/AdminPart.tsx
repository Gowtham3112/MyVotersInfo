import { useState, useEffect } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  Search,
  Cog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import AdminPartModel from "./AdminPartModel";
import DeleteModal from "../../../component/common/DeleteModel";
import LoadingOverlay from "../../../component/others/LoadingOverlay";
import { useToast } from "../../../component/common/ToastContext";

import {
  getPartsAPI,
  deletePartAPI,
} from "../../../services/service_page/part";

import type { Part } from "../../../types/part";

const AdminPart = () => {
  const { showToast } = useToast();

  const [partsList, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Part | undefined>();

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  // ---------------- FETCH PARTS ----------------
  const fetchParts = async () => {
    try {
      setLoading(true);

      const res = await getPartsAPI(page, limit, searchTerm, sortBy, order);

      setParts(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalRecords(res.pagination.total);
    } catch (error) {
      showToast("Failed to load parts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, [page, searchTerm, limit, sortBy, order]);

  const handleSortByPartNo = () => {
    setPage(1); // reset page

    if (sortBy === "name") {
      // toggle order
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      // first time click
      setSortBy("name");
      setOrder("asc");
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deletePartAPI(deleteId);
      showToast("Part deleted successfully", "success");
      setDeleteId(null);
      fetchParts();
    } catch {
      showToast("Failed to delete part", "error");
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
                <Cog size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Part No (பாகம் எண்)
                </h1>
                <p className="text-slate-400 text-sm">
                  Manage and organise all registered part numbers
                </p>
              </div>
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-[var(--primary-color)] via-slate-200 to-transparent" />
          </div>

          {/* Stats Bar */}
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-sm text-slate-600 shadow-sm">
              <Cog size={13} className="text-[var(--primary-color)]" />
              <span>
                <strong className="text-slate-800">{totalRecords}</strong> total
                parts (பாகம் எண் எண்ணிக்கை)
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
                placeholder="Search part..."
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
              Add Part No
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[900px] w-full">
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
                        onClick={handleSortByPartNo}
                        className="flex items-center gap-1 cursor-pointer select-none"
                      >
                        Part No (பாகம் எண்)
                        {/* ICON */}
                        {sortBy === "name"
                          ? order === "asc"
                            ? "🔼"
                            : "🔽"
                          : " ⇅"}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                      Description (விளக்கம்)
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
                  {partsList.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <Cog size={24} className="text-slate-300" />
                          </div>
                          <p className="text-sm font-medium">No parts found</p>
                          <p className="text-xs text-slate-300">
                            Try adjusting your search or add a new part
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {partsList.map((part, index) => (
                    <tr
                      key={part.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                          {(page - 1) * limit + index + 1}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {part.category?.name ? (
                          <span className="inline-flex items-center text-xs font-medium bg-[var(--primary-color)]/10 text-[var(--primary-color)] rounded-full px-3 py-1">
                            {part.category.name}
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
                            {part.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {part.description || (
                          <span className="text-slate-300 italic">
                            No description
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center text-xs text-slate-500 bg-slate-100 rounded-full px-3 py-1">
                          {new Date(part.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setEditData(part);
                            setIsModalOpen(true);
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-all duration-150 hover:scale-110"
                        >
                          <Pencil size={14} />
                        </button>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setDeleteId(part.id)}
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

          {/* Part Form */}
          <AdminPartModel
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchParts}
            defaultValue={editData}
          />
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default AdminPart;
