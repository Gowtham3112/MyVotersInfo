import { LogOut } from "lucide-react";
import { createPortal } from "react-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4 sm:px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <LogOut className="h-4 w-4 text-red-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Logout confirmation
            </h2>
            <p className="text-xs text-gray-500">
              This will end your current session
            </p>
          </div>
        </div>

        <div className="mb-5 border-t border-gray-100 pt-3">
          <p className="text-sm text-gray-500 leading-relaxed">
            Are you sure you want to log out? Any unsaved changes will be lost.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95 sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 active:scale-95 sm:w-auto"
          >
            Yes, log out
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default LogoutModal;
