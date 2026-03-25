import { useState, useEffect } from "react";
import Select from "react-select";
import { useToast } from "../../../component/common/ToastContext";
import {
  createAreaAPI,
  updateAreaAPI,
} from "../../../services/service_page/area";
import { getAllCategoriesAPI } from "../../../services/service_page/category";
import { getPartsByCategoryAPI } from "../../../services/service_page/part";
import { getWardsByCategoryAPI } from "../../../services/service_page/ward";
import type { Area } from "../../../types/area";
import type { Category } from "../../../types/category";
import type { Part } from "../../../types/part";
import type { Ward } from "../../../types/ward";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultValue?: Area;
}

const AdminAreaModel: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultValue,
}) => {
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [partId, setPartId] = useState("");
  const [wardId, setWardId] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedPart, setSelectedPart] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);

  // ---------------- LOAD CATEGORIES ----------------
  const loadCategories = async () => {
    try {
      const cats = await getAllCategoriesAPI();
      setCategories(cats || []);
    } catch {
      showToast("Failed to load categories", "error");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ---------------- LOAD PARTS BASED ON CATEGORY ----------------
  const loadPartsByCategory = async (catId: string) => {
    if (!catId) return setParts([]);
    try {
      const ps = await getPartsByCategoryAPI(Number(catId));
      setParts(ps || []);
    } catch {
      showToast("Failed to load parts for this category", "error");
    }
  };

  // ---------------- LOAD WARDS BASED ON CATEGORY + PART ----------------
  const loadWards = async (categoryId: string, partId: string) => {
    if (!categoryId || !partId) {
      setWards([]);
      setWardId("");
      setSelectedWard(null);
      return;
    }
    try {
      const allWards = await getWardsByCategoryAPI(
        Number(categoryId),
        Number(partId),
      );
      setWards(allWards);
    } catch {
      showToast("Failed to load wards", "error");
    }
  };

  useEffect(() => {
    if (categoryId && partId) loadWards(categoryId, partId);
  }, [categoryId, partId]);

  // ---------------- EDIT MODE ----------------
  useEffect(() => {
    if (!isOpen) return;

    if (defaultValue) {
      setName(defaultValue.name);
      setDescription(defaultValue.description || "");
      setCategoryId(String(defaultValue.categoryId));
      setPartId(String(defaultValue.partId));
      setWardId(String(defaultValue.wardId));

      setSelectedPart({
        label: defaultValue.part?.name,
        value: defaultValue.partId,
      });
      setSelectedWard({
        label: defaultValue.ward?.wardNo,
        value: defaultValue.wardId,
      });

      // load parts for default category
      loadPartsByCategory(String(defaultValue.categoryId));
    } else {
      setName("");
      setDescription("");
      setCategoryId("");
      setPartId("");
      setWardId("");
      setSelectedPart(null);
      setSelectedWard(null);
      setParts([]);
      setWards([]);
    }
  }, [defaultValue, isOpen]);

  // ---------------- CATEGORY CHANGE ----------------
  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setPartId("");
    setWardId("");
    setSelectedPart(null);
    setSelectedWard(null);
    setWards([]);
    loadPartsByCategory(value);
  };

  // ---------------- PART OPTIONS ----------------
  const partOptions = parts.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  // ---------------- WARD OPTIONS ----------------
  const wardOptions = wards.map((w) => ({ label: w.wardNo, value: w.id }));

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!categoryId) return showToast("Category is required", "error");
    if (!partId) return showToast("Part No is required", "error");
    if (!wardId) return showToast("Ward is required", "error");
    if (!name) return showToast("Area Name is required", "error");

    try {
      if (defaultValue) {
        await updateAreaAPI(defaultValue.id, {
          name,
          description,
          categoryId: Number(categoryId),
          partId: Number(partId),
          wardId: Number(wardId),
        });
        showToast("Area updated successfully", "success");
      } else {
        await createAreaAPI({
          name,
          description,
          categoryId: Number(categoryId),
          partId: Number(partId),
          wardId: Number(wardId),
        });
        showToast("Area created successfully", "success");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("already exists")) {
        showToast(error.response.data.message, "error");
      } else {
        showToast("Failed to save area", "error");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-3">
      <div className="bg-white w-full sm:w-[450px] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-5 sm:p-6">
        {/* Header */}
        <div className="border-b pb-3 mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {defaultValue ? "Edit Area" : "Create Area"}
          </h2>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category (உள்ளாட்சி அமைப்பு)<span className="text-red-700">*</span>
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
              categoryId ? "Select part..." : "Select category first"
            }
            isDisabled={!categoryId}
          />
        </div>

        {/* Ward */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ward No(வார்டு எண்)<span className="text-red-700">*</span>
          </label>
          <Select
            options={wardOptions}
            value={selectedWard}
            onChange={(option: any) => {
              setSelectedWard(option);
              setWardId(option.value);
            }}
            placeholder={
              partId ? "Select ward..." : "Select category & part first"
            }
            isDisabled={!partId || wardOptions.length === 0}
          />
        </div>

        {/* Area Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area (நகர்)<span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

export default AdminAreaModel;
