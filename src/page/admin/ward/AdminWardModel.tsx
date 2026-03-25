import { useState, useEffect } from "react";
import Select from "react-select";

import {
  createWardAPI,
  updateWardAPI,
} from "../../../services/service_page/ward";

import { getAllCategoriesAPI } from "../../../services/service_page/category";
import { getPartsByCategoryAPI } from "../../../services/service_page/part";

import { useToast } from "../../../component/common/ToastContext";

import type { Category } from "../../../types/category";
import type { Part } from "../../../types/part";
import type { Ward } from "../../../types/ward";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultValue?: Ward;
}

const AdminWardModel: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultValue,
}) => {
  const { showToast } = useToast();

  const [wardNo, setWardNo] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [partId, setPartId] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [parts, setParts] = useState<Part[]>([]);

  const [selectedPart, setSelectedPart] = useState<any>(null);

  // ---------------- LOAD DATA ----------------

  const loadCategories = async () => {
    try {
      const res = await getAllCategoriesAPI();
      setCategories(res || []);
    } catch {
      showToast("Failed to load categories", "error");
    }
  };

  const loadPartsByCategory = async (catId: string) => {
    if (!catId) return setParts([]);
    try {
      const res = await getPartsByCategoryAPI(Number(catId));
      setParts(res || []);
    } catch {
      showToast("Failed to load parts for this category", "error");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ---------------- EDIT DATA ----------------

  useEffect(() => {
    if (!isOpen) return;

    if (defaultValue) {
      setWardNo(defaultValue.wardNo);
      setDescription(defaultValue.description || "");
      setCategoryId(String(defaultValue.categoryId));
      setPartId(String(defaultValue.partId));

      setSelectedPart({
        label: defaultValue.part?.name,
        value: defaultValue.partId,
      });

      // load parts for the default category
      loadPartsByCategory(String(defaultValue.categoryId));
    } else {
      setWardNo("");
      setDescription("");
      setCategoryId("");
      setPartId("");
      setSelectedPart(null);
      setParts([]);
    }
  }, [defaultValue, isOpen]);

  // ---------------- CATEGORY CHANGE ----------------

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);

    // reset part
    setPartId("");
    setSelectedPart(null);

    // load parts by selected category
    loadPartsByCategory(value);
  };

  // ---------------- FILTER PARTS BY CATEGORY ----------------
  const partOptions = parts.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  // ---------------- SUBMIT ----------------

  const handleSubmit = async () => {
    if (!categoryId) {
      showToast("Category is required", "error");
      return;
    }

    if (!partId) {
      showToast("Part No is required", "error");
      return;
    }

    if (!wardNo) {
      showToast("Ward No is required", "error");
      return;
    }

    try {
      if (defaultValue) {
        await updateWardAPI(defaultValue.id, {
          wardNo,
          description,
          categoryId: Number(categoryId),
          partId: Number(partId),
        });

        showToast("Ward updated successfully", "success");
      } else {
        await createWardAPI({
          wardNo,
          description,
          categoryId: Number(categoryId),
          partId: Number(partId),
        });

        showToast("Ward created successfully", "success");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to save ward";
      showToast(message, "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-3">
      <div className="bg-white w-full sm:w-[420px] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-5 sm:p-6">
        {/* Header */}
        <div className="border-b pb-3 mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {defaultValue ? "Edit Ward" : "Create Ward"}
          </h2>
        </div>

        {/* Category */}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category (உள்ளாட்சி அமைப்பு) <span className="text-red-700">*</span>
          </label>

          <select
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Part */}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Part No (பாகம் எண்)<span className="text-red-700">*</span>
          </label>

          <Select
            options={partOptions}
            value={selectedPart}
            onChange={(option: any) => {
              setSelectedPart(option);
              setPartId(option.value);
            }}
            placeholder={
              categoryId ? "Search part no..." : "Select category first"
            }
            isDisabled={!categoryId}
          />
        </div>

        {/* Ward No */}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ward No (வார்டு எண்)<span className="text-red-700">*</span>
          </label>

          <input
            type="text"
            value={wardNo}
            onChange={(e) => setWardNo(e.target.value)}
            placeholder="Enter ward number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Description */}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (விளக்கம்)
          </label>

          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-[var(--primary-color)] text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminWardModel;