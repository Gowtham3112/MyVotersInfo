import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Select from "react-select";
import LoadingOverlay from "../../../component/others/LoadingOverlay";
import { useToast } from "../../../component/common/ToastContext";

import { getAllCategoriesAPI } from "../../../services/service_page/category";
import { getPartsByCategoryAPI } from "../../../services/service_page/part";
import { getWardsByCategoryAPI } from "../../../services/service_page/ward";
import { getAreasByFiltersAPI } from "../../../services/service_page/area";
import {
  createVoterAPI,
  updateVoterAPI,
} from "../../../services/service_page/voter";

import userImg from "../../../assets/user.jpg";

interface Props {
  onBack: () => void;
  editVoter?: any;
}

const AdminVoterForm = ({ onBack, editVoter }: Props) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<any>({
    category: "",
    partNo: "",
    wardNo: "",
    areaName: "",
    voterName: "",
    rollNo: "",
    gender: "",
    age: "",
    address: "",
    phone: "",
    aadharNumber: "",
    voterId: "",
    rationCardNumber: "",
    rentalHouse: "no",
    houseOwnerName: "",
    houseOwnerContact: "",
    occupation: "",
    govtScheme: "",
    party: "",
    photo: null,
  });

  const [errors, setErrors] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);

  const [partDisabled, setPartDisabled] = useState(true);
  const [wardDisabled, setWardDisabled] = useState(true);
  const [areaDisabled, setAreaDisabled] = useState(true);

  const parties = [
    { id: "DMK (திமுக)", name: "DMK (திமுக)" },
    { id: "AIADMK (அதிமுக)", name: "AIADMK (அதிமுக)" },
    { id: "BJP (பாஜக)", name: "BJP (பாஜக)" },
    { id: "INC (காங்கிரஸ்)", name: "INC (காங்கிரஸ்)" },
    { id: "NTK (நாம் தமிழர்)", name: "NTK (நாம் தமிழர்)" },
    { id: "PMK (பாமக)", name: "PMK (பாமக)" },
    { id: "TVK (தமிழக வெற்றிக் கழகம்)", name: "TVK (தமிழக வெற்றிக் கழகம்)" },
    { id: "DMDK (தேமுதிக)", name: "DMDK (தேமுதிக)" },
    { id: "MDMK (மதிமுக)", name: "MDMK (மதிமுக)" },
    {
      id: "AMMK (அம்மா மக்கள் முன்னேற்றக் கழகம்)",
      name: "AMMK (அம்மா மக்கள் முன்னேற்றக் கழகம்)",
    },
    {
      id: "VCK (விடுதலை சிறுத்தைகள் கட்சி)",
      name: "VCK (விடுதலை சிறுத்தைகள் கட்சி)",
    },
    {
      id: "CPI (இந்திய கம்யூனிஸ்ட் கட்சி)",
      name: "CPI (இந்திய கம்யூனிஸ்ட் கட்சி)",
    },
    {
      id: "CPI-M (மார்க்சிஸ்ட் கம்யூனிஸ்ட் கட்சி)",
      name: "CPI-M (மார்க்சிஸ்ட் கம்யூனிஸ்ட் கட்சி)",
    },
    {
      id: "IUML (இந்திய யூனியன் முஸ்லிம் லீக்)",
      name: "IUML (இந்திய யூனியன் முஸ்லிம் லீக்)",
    },
    { id: "Others (மற்றவை)", name: "Others (மற்றவை)" },
    {
      id: "Not Interested (ஆர்வம் இல்லை)",
      name: "Not Interested (ஆர்வம் இல்லை)",
    },
  ];

  const govtSchemes = [
    {
      id: "Kalaignar Magalir Urimai Thogai (கலைஞர் மகளிர் உரிமை தொகை)",
      name: "Kalaignar Magalir Urimai Thogai (கலைஞர் மகளிர் உரிமை தொகை)",
    },
    {
      id: "Pudhumai Penn Scheme (புதுமைப் பெண் திட்டம்)",
      name: "Pudhumai Penn Scheme (புதுமைப் பெண் திட்டம்)",
    },
    {
      id: "Chief Minister Breakfast Scheme (முதல்வர் காலை உணவு திட்டம்)",
      name: "Chief Minister Breakfast Scheme (முதல்வர் காலை உணவு திட்டம்)",
    },
    {
      id: "Free Bus Travel for Women (பெண்களுக்கு இலவச பேருந்து பயணம்)",
      name: "Free Bus Travel for Women (பெண்களுக்கு இலவச பேருந்து பயணம்)",
    },
    {
      id: "Kalaignar Health Insurance Scheme (கலைஞர் மருத்துவ காப்பீட்டு திட்டம்)",
      name: "Kalaignar Health Insurance Scheme (கலைஞர் மருத்துவ காப்பீட்டு திட்டம்)",
    },
    {
      id: "Old Age Pension Scheme (முதியோர் ஓய்வூதிய திட்டம்)",
      name: "Old Age Pension Scheme (முதியோர் ஓய்வூதிய திட்டம்)",
    },
    {
      id: "Widow Pension Scheme (விதவை ஓய்வூதிய திட்டம்)",
      name: "Widow Pension Scheme (விதவை ஓய்வூதிய திட்டம்)",
    },
    {
      id: "Differently Abled Pension Scheme (மாற்றுத்திறனாளி ஓய்வூதிய திட்டம்)",
      name: "Differently Abled Pension Scheme (மாற்றுத்திறனாளி ஓய்வூதிய திட்டம்)",
    },
    {
      id: "Marriage Assistance Scheme (திருமண உதவி திட்டம்)",
      name: "Marriage Assistance Scheme (திருமண உதவி திட்டம்)",
    },
    {
      id: "Free Laptop Scheme (இலவச மடிக்கணினி திட்டம்)",
      name: "Free Laptop Scheme (இலவச மடிக்கணினி திட்டம்)",
    },
    {
      id: "Green House Scheme (பசுமை வீட்டு திட்டம்)",
      name: "Green House Scheme (பசுமை வீட்டு திட்டம்)",
    },
    {
      id: "Free Rice Scheme (இலவச அரிசி திட்டம்)",
      name: "Free Rice Scheme (இலவச அரிசி திட்டம்)",
    },
    {
      id: "Free Sewing Machine Scheme (இலவச தையல் இயந்திரம் திட்டம்)",
      name: "Free Sewing Machine Scheme (இலவச தையல் இயந்திரம் திட்டம்)",
    },
    {
      id: "Free Goat Scheme (இலவச ஆடு வழங்கும் திட்டம்)",
      name: "Free Goat Scheme (இலவச ஆடு வழங்கும் திட்டம்)",
    },
    {
      id: "Free Cow Scheme (இலவச பசு வழங்கும் திட்டம்)",
      name: "Free Cow Scheme (இலவச பசு வழங்கும் திட்டம்)",
    },
    {
      id: "Chief Minister Solar Powered House Scheme (சூரிய மின்சாரம் வீட்டு திட்டம்)",
      name: "Chief Minister Solar Powered House Scheme (சூரிய மின்சாரம் வீட்டு திட்டம்)",
    },
    {
      id: "Free Bicycle Scheme (இலவச மிதிவண்டி திட்டம்)",
      name: "Free Bicycle Scheme (இலவச மிதிவண்டி திட்டம்)",
    },
    {
      id: "Free Electricity for Farmers (விவசாயிகளுக்கு இலவச மின்சாரம்)",
      name: "Free Electricity for Farmers (விவசாயிகளுக்கு இலவச மின்சாரம்)",
    },
    {
      id: "Housing Scheme (வீட்டு வசதி திட்டம்)",
      name: "Housing Scheme (வீட்டு வசதி திட்டம்)",
    },
    { id: "Others (மற்றவை)", name: "Others (மற்றவை)" },
    { id: "N/A (பொருந்தாது)", name: "N/A (பொருந்தாது)" },
  ];

  /* ---------------- CATEGORY LOAD ---------------- */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getAllCategoriesAPI();
        setCategories(res);
      } catch {
        showToast("Failed to load categories", "error");
      }
    };

    loadCategories();

    if (editVoter) {
      setFormData({
        category: String(editVoter.categoryId),
        partNo: String(editVoter.partId),
        wardNo: String(editVoter.wardId),
        areaName: String(editVoter.areaId),

        voterName: editVoter.voterName || "",
        rollNo: editVoter.rollNo || "",

        gender: editVoter.gender || "",
        age: editVoter.age || "",

        address: editVoter.address || "",
        phone: editVoter.phone || "",

        aadharNumber: editVoter.aadharNumber || "",
        voterId: editVoter.voterId || "",
        rationCardNumber: editVoter.rationCardNumber || "",

        rentalHouse: editVoter.rentalHouse || "no",
        houseOwnerName: editVoter.houseOwnerName || "",
        houseOwnerContact: editVoter.houseOwnerContact || "",

        occupation: editVoter.occupation || "",
        govtScheme: editVoter.govtScheme || "",
        party: editVoter.party || "",

        photo: editVoter.photo || null,
      });

      setPartDisabled(false);
      setWardDisabled(false);
      setAreaDisabled(false);

      loadParts(String(editVoter.categoryId));
      loadWards(String(editVoter.categoryId), String(editVoter.partId));
      loadAreas(
        String(editVoter.categoryId),
        String(editVoter.partId),
        String(editVoter.wardId),
      );
    }
  }, []);

  /* ---------------- API LOADERS ---------------- */

  const loadParts = async (categoryId: string) => {
    try {
      const res = await getPartsByCategoryAPI(Number(categoryId));
      setParts(res || []);
    } catch {
      showToast("Failed to load parts", "error");
    }
  };

  const loadWards = async (categoryId: string, partId: string) => {
    try {
      const res = await getWardsByCategoryAPI(
        Number(categoryId),
        Number(partId),
      );
      setWards(res || []);
    } catch {
      showToast("Failed to load wards", "error");
    }
  };

  const loadAreas = async (
    categoryId: string,
    partId: string,
    wardId: string,
  ) => {
    try {
      const res = await getAreasByFiltersAPI({
        categoryId: Number(categoryId),
        partId: Number(partId),
        wardId: Number(wardId),
      });
      setAreas(res || []);
    } catch {
      showToast("Failed to load areas", "error");
    }
  };

  /* ---------------- CHANGE HANDLER ---------------- */

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev: any) => ({ ...prev, [name]: files[0] }));
      if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: "" }));
      return;
    }

    setFormData((prev: any) => ({ ...prev, [name]: value }));

    if (name === "category") {
      setPartDisabled(!value);
      setWardDisabled(true);
      setAreaDisabled(true);
      setFormData((prev: any) => ({
        ...prev,
        category: value,
        partNo: "",
        wardNo: "",
        areaName: "",
      }));
      loadParts(value);
    }

    if (name === "partNo") {
      setWardDisabled(!value);
      setAreaDisabled(true);
      setFormData((prev: any) => ({
        ...prev,
        partNo: value,
        wardNo: "",
        areaName: "",
      }));
      if (formData.category) {
        loadWards(formData.category, value);
      }
    }

    if (name === "wardNo") {
      setAreaDisabled(!value);
      setFormData((prev: any) => ({
        ...prev,
        wardNo: value,
        areaName: "",
      }));
      if (formData.category && formData.partNo) {
        loadAreas(formData.category, formData.partNo, value);
      }
    }

    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  /* ---------------- REACT-SELECT HANDLERS ---------------- */

  const handleCategorySelect = (option: any) => {
    const value = option ? String(option.value) : "";
    setFormData((prev: any) => ({
      ...prev,
      category: value,
      partNo: "",
      wardNo: "",
      areaName: "",
    }));
    setPartDisabled(!value);
    setWardDisabled(true);
    setAreaDisabled(true);
    if (value) loadParts(value);
    if (errors.category) setErrors((prev: any) => ({ ...prev, category: "" }));
  };

  const handlePartSelect = (option: any) => {
    const value = option ? String(option.value) : "";
    setFormData((prev: any) => ({
      ...prev,
      partNo: value,
      wardNo: "",
      areaName: "",
    }));
    setWardDisabled(!value);
    setAreaDisabled(true);
    if (formData.category && value) loadWards(formData.category, value);
    if (errors.partNo) setErrors((prev: any) => ({ ...prev, partNo: "" }));
  };

  const handleWardSelect = (option: any) => {
    const value = option ? String(option.value) : "";
    setFormData((prev: any) => ({ ...prev, wardNo: value, areaName: "" }));
    setAreaDisabled(!value);
    if (formData.category && formData.partNo && value)
      loadAreas(formData.category, formData.partNo, value);
    if (errors.wardNo) setErrors((prev: any) => ({ ...prev, wardNo: "" }));
  };

  const handleAreaSelect = (option: any) => {
    const value = option ? String(option.value) : "";
    setFormData((prev: any) => ({ ...prev, areaName: value }));
    if (errors.areaName) setErrors((prev: any) => ({ ...prev, areaName: "" }));
  };

  /* ---------------- REACT-SELECT STYLES ---------------- */

  const rsStyles = (hasError?: boolean, isDisabled?: boolean) => ({
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "42px",
      fontSize: "14px",
      borderRadius: "8px",
      borderColor: hasError
        ? "#f87171"
        : state.isFocused
          ? "var(--primary-color)"
          : "#e5e7eb",
      backgroundColor: isDisabled ? "#f9fafb" : hasError ? "#fff5f5" : "#fff",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
      "&:hover": {
        borderColor: isDisabled ? "#e5e7eb" : hasError ? "#f87171" : "#d1d5db",
      },
      cursor: isDisabled ? "not-allowed" : "pointer",
      transition: "all 0.2s",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#9ca3af",
      fontSize: "14px",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: isDisabled ? "#9ca3af" : "#111827",
      fontSize: "14px",
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "10px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      border: "1px solid #e5e7eb",
      zIndex: 50,
    }),
    menuList: (base: any) => ({ ...base, padding: "6px", maxHeight: "220px" }),
    option: (base: any, state: any) => ({
      ...base,
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: state.isSelected
        ? "var(--primary-color)"
        : state.isFocused
          ? "rgba(99,102,241,0.08)"
          : "transparent",
      color: state.isSelected ? "#fff" : "#374151",
      padding: "8px 12px",
      cursor: "pointer",
    }),
    input: (base: any) => ({ ...base, fontSize: "14px" }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base: any, state: any) => ({
      ...base,
      color: isDisabled ? "#d1d5db" : "#6b7280",
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "none",
      transition: "transform 0.2s",
      padding: "0 10px",
    }),
    clearIndicator: (base: any) => ({
      ...base,
      color: "#9ca3af",
      padding: "0 6px",
      "&:hover": { color: "#6b7280" },
    }),
    noOptionsMessage: (base: any) => ({
      ...base,
      fontSize: "13px",
      color: "#9ca3af",
    }),
  });

  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    const newErrors: any = {};

    // Required checks
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.partNo) newErrors.partNo = "Part No is required";
    if (!formData.wardNo) newErrors.wardNo = "Ward No is required";
    if (!formData.areaName) newErrors.areaName = "Area Name is required";
    if (!formData.voterName) newErrors.voterName = "Voter Name is required";
    if (!formData.rollNo) newErrors.rollNo = "Roll No is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.aadharNumber)
      newErrors.aadharNumber = "Aadhar Number is required";
    if (!formData.voterId) newErrors.voterId = "Voter ID is required";
    if (!formData.rationCardNumber)
      newErrors.rationCardNumber = "Ration Card Number is required";
    if (!formData.occupation) newErrors.occupation = "Occupation is required";
    if (!formData.govtScheme)
      newErrors.govtScheme = "Government Scheme is required";
    if (!formData.party) newErrors.party = "Party is required";
    // if (!formData.photo) newErrors.photo = "Photo is required";

    // Age validation
    if (formData.age && Number(formData.age) < 18) {
      newErrors.age = "Age must be 18 or above";
    }

    // Phone validation (India 10 digits)
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Invalid Phone Number";
    }

    // Aadhar validation (12 digits)
    const cleanAadhar = formData.aadharNumber?.replace(/\s/g, "");
    if (cleanAadhar && !/^\d{12}$/.test(cleanAadhar)) {
      newErrors.aadharNumber = "Invalid Aadhar Number";
    }

    // Voter ID validation (Example: ABC1234567)
    if (formData.voterId && !/^[A-Z]{3}[0-9]{7}$/i.test(formData.voterId)) {
      newErrors.voterId = "Invalid Voter ID";
    }

    // Ration card validation (6–12 digits/letters)
    if (
      formData.rationCardNumber &&
      !/^[A-Za-z0-9]{6,12}$/.test(formData.rationCardNumber)
    ) {
      newErrors.rationCardNumber = "Invalid Ration Card Number";
    }

    // Rental house validation
    if (formData.rentalHouse === "yes") {
      if (!formData.houseOwnerName)
        newErrors.houseOwnerName = "House Owner Name is required";

      if (!formData.houseOwnerContact)
        newErrors.houseOwnerContact = "House Owner Contact is required";

      if (
        formData.houseOwnerContact &&
        !/^[6-9]\d{9}$/.test(formData.houseOwnerContact)
      ) {
        newErrors.houseOwnerContact = "Invalid Owner Phone Number";
      }
    }

    setErrors(newErrors);

    // Show first error in toast
    if (Object.keys(newErrors).length > 0) {
      showToast(Object.values(newErrors)[0] as string, "error");
      return false;
    }

    return true;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = new FormData();

      payload.append("category", formData.category);
      payload.append("partNo", formData.partNo);
      payload.append("wardNo", formData.wardNo);
      payload.append("areaName", formData.areaName);

      payload.append("voterName", formData.voterName);
      payload.append("rollNo", formData.rollNo);

      payload.append("gender", formData.gender);
      payload.append("age", formData.age);

      payload.append("address", formData.address);
      payload.append("phone", formData.phone);

      payload.append("aadharNumber", formData.aadharNumber);
      payload.append("voterId", formData.voterId);
      payload.append("rationCardNumber", formData.rationCardNumber);

      payload.append("rentalHouse", formData.rentalHouse);

      payload.append("houseOwnerName", formData.houseOwnerName);
      payload.append("houseOwnerContact", formData.houseOwnerContact);

      payload.append("occupation", formData.occupation);
      payload.append("govtScheme", formData.govtScheme);
      payload.append("party", formData.party);

      if (formData.photo) {
        payload.append("photo", formData.photo);
      } else {
        const response = await fetch(userImg);
        const blob = await response.blob();
        const file = new File([blob], "default-user.jpg", { type: blob.type });

        payload.append("photo", file);
      }

      if (editVoter) {
        await updateVoterAPI(editVoter.id, payload);
        showToast("Voter updated successfully", "success");
      } else {
        await createVoterAPI(payload);
        showToast("Voter created successfully", "success");
      }

      onBack();
    } catch (error) {
      console.error(error);
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SHARED FIELD STYLES ---------------- */

  const inputCls = (hasError?: boolean) =>
    `w-full px-4 py-2.5 text-sm bg-white border rounded-lg outline-none transition-all duration-200
     focus:ring-2 focus:ring-[var(--primary-color)]/30 focus:border-[var(--primary-color)]
     placeholder:text-gray-400
     ${hasError ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}`;

  const selectCls = (disabled?: boolean, hasError?: boolean) =>
    `w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-all duration-200 appearance-none bg-white
     focus:ring-2 focus:ring-[var(--primary-color)]/30 focus:border-[var(--primary-color)]
     ${disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100" : "cursor-pointer hover:border-gray-300"}
     ${hasError ? "border-red-400 bg-red-50" : "border-gray-200"}`;

  const labelCls =
    "block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5";

  const errorCls = "mt-1 text-xs text-red-500 flex items-center gap-1";

  /* ---------------- SECTION HEADER ---------------- */

  const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
      <span className="text-base">{icon}</span>
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
        {title}
      </h3>
    </div>
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="relative min-h-screen bg-gray-50/60">
      {loading && <LoadingOverlay />}

      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
            >
              <FaArrowLeft className="text-gray-500 text-xs" />
            </button>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                Voter Management
              </p>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">
                {editVoter ? "Update Voter" : "Add New Voter"}
              </h1>
            </div>
          </div>

          {/* Action buttons top */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-150"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 text-sm font-semibold text-white bg-[var(--primary-color)] rounded-lg hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm"
            >
              {editVoter ? "Update Voter" : "Save Voter"}
            </button>
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Location Details ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader title="Location Details" icon="📍" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={labelCls}>
                  Category (உள்ளாட்சி அமைப்பு)
                  <span className="text-red-400">*</span>
                </label>
                <Select
                  isClearable
                  isSearchable
                  placeholder="Search category..."
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                  value={
                    formData.category
                      ? {
                          value: formData.category,
                          label:
                            categories.find(
                              (c) => String(c.id) === String(formData.category),
                            )?.name || "",
                        }
                      : null
                  }
                  onChange={handleCategorySelect}
                  styles={rsStyles(!!errors.category, false)}
                />
                {errors.category && (
                  <p className={errorCls}>⚠ {errors.category}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>
                  Part No (பாகம் எண்)<span className="text-red-400">*</span>
                </label>
                <Select
                  isClearable
                  isSearchable
                  isDisabled={partDisabled}
                  placeholder="Search part..."
                  options={parts.map((p) => ({ value: p.id, label: p.name }))}
                  value={
                    formData.partNo
                      ? {
                          value: formData.partNo,
                          label:
                            parts.find(
                              (p) => String(p.id) === String(formData.partNo),
                            )?.name || "",
                        }
                      : null
                  }
                  onChange={handlePartSelect}
                  styles={rsStyles(!!errors.partNo, partDisabled)}
                />
                {errors.partNo && <p className={errorCls}>⚠ {errors.partNo}</p>}
              </div>

              <div>
                <label className={labelCls}>
                  Ward No (வார்டு எண்)<span className="text-red-400">*</span>
                </label>
                <Select
                  isClearable
                  isSearchable
                  isDisabled={wardDisabled}
                  placeholder="Search ward..."
                  options={wards.map((w) => ({ value: w.id, label: w.wardNo }))}
                  value={
                    formData.wardNo
                      ? {
                          value: formData.wardNo,
                          label:
                            wards.find(
                              (w) => String(w.id) === String(formData.wardNo),
                            )?.wardNo || "",
                        }
                      : null
                  }
                  onChange={handleWardSelect}
                  styles={rsStyles(!!errors.wardNo, wardDisabled)}
                />
                {errors.wardNo && <p className={errorCls}>⚠ {errors.wardNo}</p>}
              </div>

              <div>
                <label className={labelCls}>
                  Area (நகர்) <span className="text-red-400">*</span>
                </label>
                <Select
                  isClearable
                  isSearchable
                  isDisabled={areaDisabled}
                  placeholder="Search area..."
                  options={areas.map((a) => ({ value: a.id, label: a.name }))}
                  value={
                    formData.areaName
                      ? {
                          value: formData.areaName,
                          label:
                            areas.find(
                              (a) => String(a.id) === String(formData.areaName),
                            )?.name || "",
                        }
                      : null
                  }
                  onChange={handleAreaSelect}
                  styles={rsStyles(!!errors.areaName, areaDisabled)}
                />
                {errors.areaName && (
                  <p className={errorCls}>⚠ {errors.areaName}</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Personal Information ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader title="Personal Information" icon="👤" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>
                  Voter (வாக்காளர்)<span className="text-red-400">*</span>
                </label>
                <input
                  name="voterName"
                  value={formData.voterName}
                  onChange={handleChange}
                  placeholder="Full name"
                  className={inputCls(!!errors.voterName)}
                />
                {errors.voterName && (
                  <p className={errorCls}>⚠ {errors.voterName}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>
                  Roll No (வரிசை எண்)<span className="text-red-400">*</span>
                </label>
                <input
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleChange}
                  placeholder="Roll number"
                  className={inputCls(!!errors.rollNo)}
                />
                {errors.rollNo && <p className={errorCls}>⚠ {errors.rollNo}</p>}
              </div>

              <div>
                <label className={labelCls}>
                  Gender (பாலினம்)<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={selectCls(false, !!errors.gender)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male (ஆண்)">Male (ஆண்)</option>
                    <option value="Female (பெண்)">Female (பெண்)</option>
                    <option value="Other (மற்றவை)">Other (மற்றவை)</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    ▾
                  </span>
                </div>
                {errors.gender && <p className={errorCls}>⚠ {errors.gender}</p>}
              </div>

              <div>
                <label className={labelCls}>
                  Age (வயது)<span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className={inputCls(!!errors.age)}
                />
                {errors.age && <p className={errorCls}>⚠ {errors.age}</p>}
              </div>

              <div className="sm:col-span-2 lg:col-span-2">
                <label className={labelCls}>
                  Address (முகவரி)<span className="text-red-400">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  rows={2}
                  className={`${inputCls(!!errors.address)} resize-none`}
                />
                {errors.address && (
                  <p className={errorCls}>⚠ {errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Contact & Identity ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader title="Contact & Identity" icon="🪪" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={labelCls}>
                  Phone No(தொலைபேசி எண்)<span className="text-red-400">*</span>
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Mobile number"
                  className={inputCls(!!errors.phone)}
                />
                {errors.phone && <p className={errorCls}>⚠ {errors.phone}</p>}
              </div>

              <div>
                <label className={labelCls}>
                  Aadhar Number (ஆதார் எண்)
                  <span className="text-red-400">*</span>
                </label>
                <input
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  placeholder="XXXX XXXX XXXX"
                  className={inputCls(!!errors.aadharNumber)}
                />
                {errors.aadharNumber && (
                  <p className={errorCls}>⚠ {errors.aadharNumber}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>
                  Voter ID (வாக்காளர் எண்)
                  <span className="text-red-400">*</span>
                </label>
                <input
                  name="voterId"
                  value={formData.voterId}
                  onChange={handleChange}
                  placeholder="Voter ID"
                  className={inputCls(!!errors.voterId)}
                />
                {errors.voterId && (
                  <p className={errorCls}>⚠ {errors.voterId}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>
                  Ration Card (ரேஷன் கார்டு)
                  <span className="text-red-400">*</span>
                </label>
                <input
                  name="rationCardNumber"
                  value={formData.rationCardNumber}
                  onChange={handleChange}
                  placeholder="Ration card no."
                  className={inputCls(!!errors.rationCardNumber)}
                />
                {errors.rationCardNumber && (
                  <p className={errorCls}>⚠ {errors.rationCardNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Residence Details ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader title="Residence Details" icon="🏠" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>
                  Rental House? (வாடகை வீடு?)
                  <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-3 mt-1">
                  {["no", "yes"].map((val) => (
                    <label
                      key={val}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-all duration-150
                        ${
                          formData.rentalHouse === val
                            ? "border-[var(--primary-color)] bg-[var(--primary-color)]/5 text-[var(--primary-color)]"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                    >
                      <input
                        type="radio"
                        name="rentalHouse"
                        value={val}
                        checked={formData.rentalHouse === val}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span
                        className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all
                          ${formData.rentalHouse === val ? "border-[var(--primary-color)]" : "border-gray-300"}`}
                      >
                        {formData.rentalHouse === val && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-color)]" />
                        )}
                      </span>
                      {val === "yes" ? "Yes (ஆம்)" : "No (இல்லை)"}
                    </label>
                  ))}
                </div>
              </div>

              {formData.rentalHouse === "yes" && (
                <>
                  <div>
                    <label className={labelCls}>
                      House Owner Name (வீட்டின் உரிமையாளர் பெயர்)
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="houseOwnerName"
                      value={formData.houseOwnerName}
                      onChange={handleChange}
                      placeholder="Owner's name"
                      className={inputCls(!!errors.houseOwnerName)}
                    />
                    {errors.houseOwnerName && (
                      <p className={errorCls}>⚠ {errors.houseOwnerName}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>
                      House Owner Contact (வீட்டு உரிமையாளர் தொடர்பு)
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="houseOwnerContact"
                      value={formData.houseOwnerContact}
                      onChange={handleChange}
                      placeholder="Owner's phone"
                      className={inputCls(!!errors.houseOwnerContact)}
                    />
                    {errors.houseOwnerContact && (
                      <p className={errorCls}>⚠ {errors.houseOwnerContact}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Additional Information ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader title="Additional Information" icon="📋" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>
                  Occupation (தொழில்)<span className="text-red-400">*</span>
                </label>
                <input
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Occupation"
                  className={inputCls(!!errors.occupation)}
                />
                {errors.occupation && (
                  <p className={errorCls}>⚠ {errors.occupation}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>
                  Govt Scheme (அரசு திட்டம்)
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="govtScheme"
                    value={formData.govtScheme}
                    onChange={handleChange}
                    className={selectCls(false, !!errors.govtScheme)}
                  >
                    <option value="">Select Scheme</option>
                    {govtSchemes.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    ▾
                  </span>
                </div>
                {errors.govtScheme && (
                  <p className={errorCls}>⚠ {errors.govtScheme}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>
                  Party Affiliation (கட்சி சார்பு)
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="party"
                    value={formData.party}
                    onChange={handleChange}
                    className={selectCls(false, !!errors.party)}
                  >
                    <option value="">Select Party</option>
                    {parties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    ▾
                  </span>
                </div>
                {errors.party && <p className={errorCls}>⚠ {errors.party}</p>}
              </div>

              {/* Photo Upload */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelCls}>
                  Photo (புகைப்படம்)<span className="text-red-400">*</span>
                </label>

                <div className="flex items-center gap-6">
                  {/* Image Preview */}
                  {formData.photo && (
                    <img
                      src={
                        formData.photo
                          ? typeof formData.photo === "string"
                            ? formData.photo
                            : URL.createObjectURL(formData.photo)
                          : userImg
                      }
                      alt="preview"
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                  )}

                  <label className="cursor-pointer px-4 py-2 border rounded-lg bg-gray-50 hover:bg-gray-100">
                    Upload Photo
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {errors.photo && <p className={errorCls}>⚠ {errors.photo}</p>}
              </div>
            </div>
          </div>

          {/* ── Footer Buttons ── */}
          <div className="flex items-center justify-between py-2">
            <p className="text-xs text-gray-400">
              All fields marked <span className="text-red-400">*</span> are
              required
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--primary-color)] rounded-lg hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm"
              >
                {editVoter ? "Update Voter" : "Save Voter"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminVoterForm;
