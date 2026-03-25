import { createPortal } from "react-dom";
import { ShieldAlert } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
        
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={22} className="text-red-500" />
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-slate-800 mb-1">
          Delete Item?
        </h2>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-6">
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition active:scale-95"
          >
            Yes, Delete
          </button>

          <button
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2 rounded-xl text-sm font-semibold transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default DeleteModal;