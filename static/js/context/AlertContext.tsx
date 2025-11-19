import React, { createContext, useCallback, useContext, useState } from "react";
import Alert from "../components/Alert/Alert.tsx";

interface AlertOptions {
  title?: string;
  text: string;
  confirmText?: string;
  onClose?: () => void;
  variant?: "error" | "info";
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => Promise<void>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<(() => void) | null>(null);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertConfig(options);
    setAlertOpen(true);
    return new Promise<void>((resolve) => {
      setResolveRef(() => resolve);
    });
  }, []);

  const handleClose = useCallback(() => {
    setAlertOpen(false);
    resolveRef?.();
    setResolveRef(null);
  }, [resolveRef]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertConfig && <Alert isOpen={alertOpen} onClose={handleClose} {...alertConfig} />}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
