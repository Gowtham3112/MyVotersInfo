import { useState, useEffect } from "react";

import {
  createPartAPI,
  updatePartAPI,
} from "../../../services/service_page/part";

import { getAllCategoriesAPI } from "../../../services/service_page/category";

import { useToast } from "../../../component/common/ToastContext";

import type { Category } from "../../../types/category";
import type { Part } from "../../../types/part";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultValue?: Part;
}

const AdminPartModel: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultValue,
}) => {
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------------- LOAD CATEGORIES ----------------
  const loadCategories = async () => {
    try {
      const res = await getAllCategoriesAPI();
      setCategories(res || []);
    } catch (error) {
      console.error("Failed to load categories");
      showToast("Failed to load categories", "error");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ---------------- EDIT / RESET FORM ----------------
  useEffect(() => {
    if (isOpen) {
      if (defaultValue) {
        setName(defaultValue.name);
        setDescription(defaultValue.description || "");
        setCategoryId(String(defaultValue.categoryId));
      } else {
        setName("");
        setDescription("");
        setCategoryId("");
      }
    }
  }, [defaultValue, isOpen]);

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!categoryId) {
      showToast("Category is required", "error");
      return;
    }

    if (!name.trim()) {
      showToast("Part No is required", "error");
      return;
    }

    try {
      setLoading(true);

      if (defaultValue) {
        await updatePartAPI(defaultValue.id, {
          name: name.trim(),
          description: description.trim(),
          categoryId: Number(categoryId),
        });
        showToast("Part updated successfully", "success");
      } else {
        await createPartAPI({
          name: name.trim(),
          description: description.trim(),
          categoryId: Number(categoryId),
        });
        showToast("Part created successfully", "success");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to save part", error);
      const message = error?.response?.data?.message || "Something went wrong";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-3">
      <div className="bg-white w-full sm:w-[420px] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-5 sm:p-6">
        {/* Header */}
        <div className="border-b pb-3 mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {defaultValue ? "Edit Part No" : "Create Part No"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Add a new part no for your system
          </p>
        </div>

        {/* Category Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category (உள்ளாட்சி அமைப்பு) <span className="text-red-700">*</span>
          </label>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          >
            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Part No */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Part No (பாகம் எண்)<span className="text-red-700">*</span>
          </label>

          <input
            type="text"
            placeholder="Enter part no"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (விளக்கம்)
          </label>

          <textarea
            rows={3}
            placeholder="Enter part description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[var(--primary-color)] text-white hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Part No"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPartModel;
