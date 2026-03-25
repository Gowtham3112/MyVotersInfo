import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useToast } from "../../../component/common/ToastContext";
import LoadingOverlay from "../../../component/others/LoadingOverlay";

import {
  createUserAPI,
  updateUserAPI,
} from "../../../services/service_page/admin";

import type { AdminUser } from "../../../types/admin";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface Props {
  onBack: () => void;
  editUser?: AdminUser | null;
}

const AdminUserForm = ({ onBack, editUser }: Props) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    isActive: true,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Prefill edit mode
  useEffect(() => {
    if (editUser) {
      setFormData({
        firstName: editUser.firstName,
        lastName: editUser.lastName || "",
        email: editUser.email,
        isActive: editUser.isActive,
        password: "",
        confirmPassword: "",
      });
    }
  }, [editUser]);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Required";

    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email";

    // Validate passwords only for create or if user wants to change password
    if (!editUser || formData.password || formData.confirmPassword) {
      if (!formData.password) newErrors.password = "Required";
      if (!formData.confirmPassword) newErrors.confirmPassword = "Required";
      if (
        formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
      ) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const createPayload: any & { password?: string } = {
      firstName: formData.firstName,
      lastName: formData.lastName || "",
      email: formData.email,
      password: formData.password,
    };

    const updatePayload: any & { password?: string } = {
      isActive: formData.isActive,
      ...(formData.password ? { password: formData.password } : {}),
    };

    try {
      setLoading(true);

      if (editUser) {
        const res = await updateUserAPI(editUser.id, updatePayload);
        showToast(res?.message || "User updated successfully!", "success");
      } else {
        const res = await createUserAPI(createPayload);
        showToast(
          res?.message || "User created and mail sent successfully!",
          "success",
        );
      }

      setTimeout(() => onBack(), 500);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Something went wrong.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && <LoadingOverlay />}

      <div className="w-full max-w-6xl">
        <div className="p-3">
          <div className="text-center mb-10 flex gap-3">
            <button className="p-2 rounded-full" onClick={onBack}>
              <FaArrowLeft className="text-gray-700" />
            </button>

            <h1 className="font-bold text-3xl text-[var(--primary-color)]">
              {editUser ? "Update User" : "Create User"}
            </h1>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  readOnly={!!editUser}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl ${
                    !!editUser ? "bg-gray-100" : ""
                  }`}
                />

                {errors.firstName && (
                  <p className="text-red-600 text-xs">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  readOnly={!!editUser}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl ${
                    !!editUser ? "bg-gray-100" : ""
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly={!!editUser}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl ${
                    !!editUser ? "bg-gray-100" : ""
                  }`}
                />

                {errors.email && (
                  <p className="text-red-600 text-xs">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-semibold mb-2">
                  Password{" "}
                  {editUser ? "" : <span className="text-red-500">*</span>}
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={editUser ? "Leave blank to keep unchanged" : ""}
                  className="w-full p-3 border rounded-xl pr-10"
                />

                <button
                  type="button"
                  className="absolute right-3 bottom-4 text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

                {errors.password && (
                  <p className="text-red-600 text-xs">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-sm font-semibold mb-2">
                  Confirm Password{" "}
                  {editUser ? "" : <span className="text-red-500">*</span>}
                </label>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={editUser ? "Leave blank to keep unchanged" : ""}
                  className="w-full p-3 border rounded-xl pr-10"
                />

                <button
                  type="button"
                  className="absolute right-3 bottom-4 text-gray-500"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {editUser && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Status
                  </label>
                  <select
                    name="isActive"
                    value={formData.isActive ? "true" : "false"}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 rounded-xl border border-gray-400"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[var(--primary-color)] text-white"
              >
                {editUser ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUserForm;
