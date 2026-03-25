import { useState, useEffect } from "react";
import {
  createCategoryAPI,
  updateCategoryAPI,
} from "../../../services/service_page/category";
import { useToast } from "../../../component/common/ToastContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultValue?: any;
}

const AdminCategoryModel: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultValue,
}) => {
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setName(defaultValue.name);
      setDescription(defaultValue.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [defaultValue, isOpen]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      showToast("Category name is required", "error");
      return;
    }

    try {
      setLoading(true);

      if (defaultValue) {
        await updateCategoryAPI(defaultValue.id, {
          name: name.trim(),
          description: description.trim(),
        });
        showToast("Category updated successfully", "success");
      } else {
        await createCategoryAPI({
          name: name.trim(),
          description: description.trim(),
        });
        showToast("Category created successfully", "success");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);

      // Display server error messages like "already exists"
      const message =
        error?.response?.data?.message || "Something went wrong";
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
            {defaultValue ? "Edit Category" : "Create Category"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Add a new category for your system
          </p>
        </div>

        {/* Category Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name (உள்ளாட்சி அமைப்பு) <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter category name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (விளக்கம்)
          </label>
          <textarea
            rows={3}
            placeholder="Enter category description"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            {loading ? "Saving..." : "Save Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryModel;