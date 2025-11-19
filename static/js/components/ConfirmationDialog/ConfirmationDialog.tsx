import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmationDialogProps {
  text: string;
  onCancel: () => void;
  onConfirm: () => void;
  isOpen: boolean;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  text,
  onCancel,
  onConfirm,
  isOpen,
  title = "Confirm Action",
  confirmText = "Okay",
  cancelText = "Cancel",
  variant = "default",
}) => {
  // Add keyboard handling
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel, onConfirm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && onCancel()}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="mx-4 w-full max-w-sm rounded-lg bg-bg dark:bg-bg p-4 shadow-lg"
            role="dialog"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description">
            <h2 id="dialog-title" className="mb-2 text-lg font-semibold text-text dark:text-text-dark">
              {title}
            </h2>
            <p id="dialog-description" className="text-text-light-dark dark:text-text-light mb-4 text-sm">
              {text}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={onCancel}
                className="text-text-light-dark dark:text-text-light hover:bg-grey-light dark:hover:bg-grey-dark rounded px-4 py-2 text-sm font-medium transition-colors">
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`rounded px-4 py-2 text-sm font-medium text-white transition-colors ${
                  variant === "danger"
                    ? "bg-red hover:bg-red/90"
                    : "hover:bg-action-dark bg-action"
                }`}
                autoFocus>
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;
