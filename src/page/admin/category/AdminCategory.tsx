import { useState, useEffect } from "react";
import { Pencil, Plus, Trash2, Search, Tag, LayoutGrid } from "lucide-react";
import AdminCategoryModel from "./AdminCategoryModel";
import DeleteModal from "../../../component/common/DeleteModel";
import { useToast } from "../../../component/common/ToastContext";

import {
  getAllCategoriesAPI,
  deleteCategoryAPI,
} from "../../../services/service_page/category";

import type { Category } from "../../../types/category";
import LoadingOverlay from "../../../component/others/LoadingOverlay";

const AdminCategory = () => {
  const { showToast } = useToast();

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editData, setEditData] = useState<Category | undefined>();
  const [loading, setLoading] = useState(false);

  // fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategoriesAPI();
      setCategoryList(data);
    } catch (error) {
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categoryList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCategoryAPI(deleteId);
      showToast("Category deleted successfully!", "success");
      setDeleteId(null);
      fetchCategories();
    } catch (error) {
      showToast("Failed to delete category!", "error");
    }
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
                <LayoutGrid size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Categories (உள்ளாட்சி அமைப்புகள்)
                </h1>
                <p className="text-slate-400 text-sm">
                  Manage and organise all registered categories
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-4 h-px bg-gradient-to-r from-[var(--primary-color)] via-slate-200 to-transparent" />
          </div>

          {/* Stats Bar */}
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-sm text-slate-600 shadow-sm">
              <Tag size={13} className="text-[var(--primary-color)]" />
              <span>
                <strong className="text-slate-800">{categoryList.length}</strong>{" "}
                total categories (உள்ளாட்சி அமைப்பு எண்ணிகை)
              </span>
            </div>
            {searchTerm && (
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm text-blue-600">
                <Search size={13} />
                <span>
                  <strong>{filteredCategories.length}</strong> results for "
                  {searchTerm}"
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
                placeholder="Search category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              Add Category
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                    S.No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                    Category (உள்ளாட்சி அமைப்பு)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                    Description (விளக்கம்)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80">
                    Date
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
                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                          <Tag size={24} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-medium">No categories found</p>
                        <p className="text-xs text-slate-300">
                          Try adjusting your search or add a new category
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {filteredCategories.map((org, index) => (
                  <tr
                    key={org.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                        {index + 1}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-slate-800 text-sm">
                          {org.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 w-[30%]">
                      <span className="text-sm text-slate-500 leading-relaxed">
                        {org.description || (
                          <span className="text-slate-300 italic">
                            No description
                          </span>
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center text-xs text-slate-500 bg-slate-100 rounded-full px-3 py-1">
                        {new Date(org.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setEditData(org);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-all duration-150 hover:scale-110"
                      >
                        <Pencil size={14} />
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setDeleteId(org.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all duration-150 hover:scale-110"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Table Footer */}
            {filteredCategories.length > 0 && (
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
                Showing {filteredCategories.length} of {categoryList.length} categories
              </div>
            )}
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-3">
            {filteredCategories.length === 0 && (
              <div className="flex flex-col items-center gap-3 text-slate-400 py-16">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Tag size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-medium">No categories found</p>
              </div>
            )}

            {filteredCategories.map((org, index) => (
              <div
                key={org.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[var(--primary-color)]/10 flex items-center justify-center">
                      <Tag size={16} className="text-[var(--primary-color)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {org.name}
                      </p>
                      <p className="text-xs text-slate-400">#{index + 1}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditData(org);
                        setIsModalOpen(true);
                      }}
                      className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(org.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {org.description && (
                  <p className="text-sm text-slate-500 leading-relaxed mb-3 pl-0.5">
                    {org.description}
                  </p>
                )}

                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-400">Created:</span>
                  <span className="text-xs font-medium text-slate-500">
                    {new Date(org.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdminCategoryModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCategories}
        defaultValue={editData}
      />

      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default AdminCategory;