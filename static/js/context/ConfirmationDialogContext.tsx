import React, { createContext, useCallback, useContext, useState } from "react";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog.tsx";

interface ConfirmationDialogOptions {
  title?: string;
  text: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
}

interface ConfirmationDialogContextType {
  showConfirmation: (options: ConfirmationDialogOptions) => Promise<boolean>;
}

const ConfirmationDialogContext = createContext<ConfirmationDialogContextType | undefined>(
  undefined,
);

export const ConfirmationDialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<ConfirmationDialogOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const showConfirmation = useCallback((options: ConfirmationDialogOptions) => {
    setDialogConfig(options);
    setDialogOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolveRef(() => resolve);
    });
  }, []);

  const handleClose = useCallback(
    (confirmed: boolean) => {
      setDialogOpen(false);
      resolveRef?.(confirmed);
      setResolveRef(null);
    },
    [resolveRef],
  );

  return (
    <ConfirmationDialogContext.Provider value={{ showConfirmation }}>
      {children}
      {dialogConfig && (
        <ConfirmationDialog
          isOpen={dialogOpen}
          onCancel={() => handleClose(false)}
          onConfirm={() => handleClose(true)}
          {...dialogConfig}
        />
      )}
    </ConfirmationDialogContext.Provider>
  );
};

export const useConfirmationDialog = () => {
  const context = useContext(ConfirmationDialogContext);
  if (!context) {
    throw new Error("useConfirmationDialog must be used within a ConfirmationDialogProvider");
  }
  return context;
};
