import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AlertProps {
  text: string;
  onClose: () => void;
  isOpen: boolean;
  title?: string;
  confirmText?: string;
  variant?: "error" | "info";
}

const Alert: React.FC<AlertProps> = ({
  text,
  onClose,
  isOpen,
  title,
  confirmText = "Okay",
  variant = "info",
}) => {
  // Add keyboard handling
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Enter" || e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const getVariantStyles = () => {
    switch (variant) {
      case "error":
        return "bg-red";
      default:
        return "bg-action";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="mx-4 w-full max-w-sm rounded-lg bg-white dark:bg-gray-800 p-4 shadow-lg"
            role="alert"
            aria-labelledby="alert-title"
            aria-describedby="alert-description">
            {title && (
              <h2 id="alert-title" className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            <p id="alert-description" className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              {text}
            </p>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className={`${getVariantStyles()} rounded px-4 py-2 text-sm font-medium text-white`}
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

export default Alert;
